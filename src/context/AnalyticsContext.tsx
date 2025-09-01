'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { db } from '../lib/firebase/config';
import { useAuth } from './AuthContext';

// Función para obtener funciones de Firebase dinámicamente
const getFirestoreFunctions = async () => {
  if (!db) {
    return null;
  }
  
  try {
    const firestore = await import('firebase/firestore');
    return {
      collection: firestore.collection,
      addDoc: firestore.addDoc,
      query: firestore.query,
      where: firestore.where,
      getDocs: firestore.getDocs,
      orderBy: firestore.orderBy,
      limit: firestore.limit
    };
  } catch (error) {
    console.warn('Firebase/firestore no disponible:', error);
    return null;
  }
};

interface AnalyticsEvent {
  id?: string;
  type: 'page_view' | 'service_click' | 'contact_click' | 'whatsapp_click' | 'phone_click';
  serviceId?: string;
  serviceName?: string;
  page?: string;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
}

interface AnalyticsMetrics {
  totalPageViews: number;
  totalServiceClicks: number;
  totalContactClicks: number;
  topServices: Array<{ serviceId: string; serviceName: string; clicks: number }>;
  dailyViews: Array<{ date: string; views: number }>;
  contactMethods: {
    whatsapp: number;
    phone: number;
  };
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  metrics: AnalyticsMetrics;
  isLoading: boolean;
}

type AnalyticsAction = 
  | { type: 'ADD_EVENT'; payload: AnalyticsEvent }
  | { type: 'SET_METRICS'; payload: AnalyticsMetrics }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AnalyticsState = {
  events: [],
  metrics: {
    totalPageViews: 0,
    totalServiceClicks: 0,
    totalContactClicks: 0,
    topServices: [],
    dailyViews: [],
    contactMethods: {
      whatsapp: 0,
      phone: 0
    }
  },
  isLoading: false
};

function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload]
      };
    case 'SET_METRICS':
      return {
        ...state,
        metrics: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}

interface AnalyticsContextType {
  state: AnalyticsState;
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => Promise<void>;
  getMetrics: (days?: number) => Promise<void>;
  trackPageView: (page: string) => Promise<void>;
  trackServiceClick: (serviceId: string, serviceName: string) => Promise<void>;
  trackContactClick: (method: 'whatsapp' | 'phone', serviceId?: string) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);
  const { user, isAdmin } = useAuth();

  const trackEvent = useCallback(async (event: Omit<AnalyticsEvent, 'timestamp'>) => {
    try {
      const fullEvent: AnalyticsEvent = {
        ...event,
        timestamp: new Date(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        referrer: typeof window !== 'undefined' ? document.referrer : ''
      };

      // Get Firebase functions dynamically
      const firestore = await getFirestoreFunctions();
      if (!db || !firestore) {
        console.warn('Firebase not available, skipping analytics tracking');
        return;
      }

      // Guardar en Firestore
      await firestore.addDoc(firestore.collection(db, 'analytics'), fullEvent);
      
      // Actualizar estado local
      dispatch({ type: 'ADD_EVENT', payload: fullEvent });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  const trackPageView = useCallback(async (page: string) => {
    await trackEvent({
      type: 'page_view',
      page
    });
  }, [trackEvent]);

  const trackServiceClick = useCallback(async (serviceId: string, serviceName: string) => {
    await trackEvent({
      type: 'service_click',
      serviceId,
      serviceName
    });
  }, [trackEvent]);

  const trackContactClick = useCallback(async (method: 'whatsapp' | 'phone', serviceId?: string) => {
    await trackEvent({
      type: method === 'whatsapp' ? 'whatsapp_click' : 'phone_click',
      serviceId
    });
  }, [trackEvent]);

  const getMetrics = useCallback(async (days: number = 30) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Verificar si el usuario es administrador
      if (!user || !isAdmin) {
        console.warn('⚠️ Analytics: Solo administradores pueden acceder a las métricas');
        dispatch({ type: 'SET_METRICS', payload: initialState.metrics });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      // Get Firebase functions dynamically
      const firestore = await getFirestoreFunctions();
      if (!db || !firestore) {
        console.warn('Firebase not available, using empty metrics');
        dispatch({ type: 'SET_METRICS', payload: initialState.metrics });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const analyticsRef = firestore.collection(db, 'analytics');
      const q = firestore.query(
        analyticsRef,
        firestore.where('timestamp', '>=', startDate),
        firestore.orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await firestore.getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as AnalyticsEvent[];

      // Calcular métricas
      const metrics: AnalyticsMetrics = {
        totalPageViews: events.filter(e => e.type === 'page_view').length,
        totalServiceClicks: events.filter(e => e.type === 'service_click').length,
        totalContactClicks: events.filter(e => e.type === 'whatsapp_click' || e.type === 'phone_click').length,
        topServices: calculateTopServices(events),
        dailyViews: calculateDailyViews(events, days),
        contactMethods: {
          whatsapp: events.filter(e => e.type === 'whatsapp_click').length,
          phone: events.filter(e => e.type === 'phone_click').length
        }
      };

      dispatch({ type: 'SET_METRICS', payload: metrics });
    } catch (error: any) {
      console.error('Error getting metrics:', error);
      
      // Si es un error de permisos, mostrar mensaje específico
      if (error.code === 'permission-denied') {
        console.warn('⚠️ Analytics: Acceso denegado a colección analytics. Solo administradores pueden ver métricas.');
      }
      
      // En caso de error, usar métricas vacías
      dispatch({ type: 'SET_METRICS', payload: initialState.metrics });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, isAdmin]);

  const calculateTopServices = (events: AnalyticsEvent[]) => {
    const serviceClicks = events.filter(e => e.type === 'service_click' && e.serviceId);
    const clickCounts = serviceClicks.reduce((acc, event) => {
      const key = event.serviceId!;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(clickCounts)
      .map(([serviceId, clicks]) => {
        const event = serviceClicks.find(e => e.serviceId === serviceId);
        return {
          serviceId,
          serviceName: event?.serviceName || 'Servicio desconocido',
          clicks
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  };

  const calculateDailyViews = (events: AnalyticsEvent[], days: number) => {
    const pageViews = events.filter(e => e.type === 'page_view');
    const dailyData: Record<string, number> = {};

    // Inicializar todos los días con 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = 0;
    }

    // Contar vistas por día
    pageViews.forEach(event => {
      const dateStr = event.timestamp.toISOString().split('T')[0];
      if (dailyData.hasOwnProperty(dateStr)) {
        dailyData[dateStr]++;
      }
    });

    return Object.entries(dailyData)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // TEMPORALMENTE DESHABILITADO: Cargar métricas al inicializar (solo una vez)
  // Este useEffect estaba causando lecturas automáticas de Firestore al cargar la app
  // useEffect(() => {
  //   let isMounted = true;
  //   
  //   const loadInitialMetrics = async () => {
  //     if (isMounted) {
  //       await getMetrics();
  //     }
  //   };
  //   
  //   loadInitialMetrics();
  //   
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []); // Sin dependencias para ejecutar solo una vez

  const value: AnalyticsContextType = useMemo(() => ({
    state,
    trackEvent,
    getMetrics,
    trackPageView,
    trackServiceClick,
    trackContactClick
  }), [state, trackEvent, getMetrics, trackPageView, trackServiceClick, trackContactClick]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

export type { AnalyticsEvent, AnalyticsMetrics };