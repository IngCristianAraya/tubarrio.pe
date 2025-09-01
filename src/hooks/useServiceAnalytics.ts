import { useCallback, useEffect, useState } from 'react';
import { Service } from '@/types/service';

// Tipos para analytics
interface ServiceVisit {
  serviceId: string;
  timestamp: number;
  category?: string;
}

interface ServiceStats {
  serviceId: string;
  visits: number;
  lastVisit: number;
  category?: string;
}

interface PopularService {
  serviceId: string;
  visits: number;
  score: number; // Score basado en visitas recientes y frecuencia
}

const ANALYTICS_KEYS = {
  SERVICE_VISITS: 'service_visits',
  POPULAR_SERVICES: 'popular_services',
  LAST_CLEANUP: 'analytics_last_cleanup'
};

const ANALYTICS_CONFIG = {
  MAX_VISITS_STORED: 500, // Reducido de 1000 a 500
  CLEANUP_INTERVAL: 3 * 24 * 60 * 60 * 1000, // Reducido a 3 días
  RECENT_VISIT_WEIGHT: 1.5, // Reducido peso de visitas recientes
  PRELOAD_COUNT: 8, // Reducido de 10 a 8 servicios a precargar
  MIN_TIME_BETWEEN_UPDATES: 30000 // 30 segundos entre actualizaciones de populares
};

export const useServiceAnalytics = () => {
  const isClient = typeof window !== 'undefined';
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  // Función para limpiar datos antiguos
  const cleanupOldData = useCallback(() => {
    if (!isClient) return;

    try {
      const lastCleanup = localStorage.getItem(ANALYTICS_KEYS.LAST_CLEANUP);
      const now = Date.now();
      
      if (!lastCleanup || (now - parseInt(lastCleanup)) > ANALYTICS_CONFIG.CLEANUP_INTERVAL) {
        const visits = getStoredVisits();
        const cutoffTime = now - (30 * 24 * 60 * 60 * 1000); // 30 días
        
        const recentVisits = visits.filter(visit => visit.timestamp > cutoffTime);
        
        localStorage.setItem(ANALYTICS_KEYS.SERVICE_VISITS, JSON.stringify(recentVisits));
        localStorage.setItem(ANALYTICS_KEYS.LAST_CLEANUP, now.toString());
        
        console.log(`🧹 Analytics cleanup: ${visits.length - recentVisits.length} visitas antiguas eliminadas`);
      }
    } catch (error) {
      console.warn('Error en cleanup de analytics:', error);
    }
  }, [isClient]);

  // Función para obtener visitas almacenadas
  const getStoredVisits = useCallback((): ServiceVisit[] => {
    if (!isClient) return [];

    try {
      const stored = localStorage.getItem(ANALYTICS_KEYS.SERVICE_VISITS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error leyendo visitas almacenadas:', error);
      return [];
    }
  }, [isClient]);

  // Función para calcular servicios populares
  const calculatePopularServices = useCallback((): PopularService[] => {
    const visits = getStoredVisits();
    const now = Date.now();
    const serviceStats = new Map<string, ServiceStats>();

    // Agrupar visitas por servicio
    visits.forEach(visit => {
      const existing = serviceStats.get(visit.serviceId) || {
        serviceId: visit.serviceId,
        visits: 0,
        lastVisit: 0,
        category: visit.category
      };

      existing.visits++;
      existing.lastVisit = Math.max(existing.lastVisit, visit.timestamp);
      serviceStats.set(visit.serviceId, existing);
    });

    // Calcular score basado en frecuencia y recencia
    const popularServices: PopularService[] = Array.from(serviceStats.values()).map(stats => {
      const daysSinceLastVisit = (now - stats.lastVisit) / (24 * 60 * 60 * 1000);
      const recencyFactor = Math.max(0, 1 - (daysSinceLastVisit / 30)); // Factor de recencia (0-1)
      const frequencyScore = stats.visits;
      
      // Score combinado: frecuencia + bonus por recencia
      const score = frequencyScore + (frequencyScore * recencyFactor * ANALYTICS_CONFIG.RECENT_VISIT_WEIGHT);
      
      return {
        serviceId: stats.serviceId,
        visits: stats.visits,
        score
      };
    });

    // Ordenar por score descendente
    return popularServices.sort((a, b) => b.score - a.score);
  }, [getStoredVisits]);

  // Función optimizada para actualizar servicios populares
  const updatePopularServices = useCallback(() => {
    if (!isClient) return;

    const now = Date.now();
    // Evitar actualizaciones demasiado frecuentes
    if (now - lastUpdate < ANALYTICS_CONFIG.MIN_TIME_BETWEEN_UPDATES) {
      return;
    }

    setLastUpdate(now);
    
    try {
      const popularServices = calculatePopularServices();
      const topServices = popularServices.slice(0, ANALYTICS_CONFIG.PRELOAD_COUNT);
      
      localStorage.setItem(ANALYTICS_KEYS.POPULAR_SERVICES, JSON.stringify(topServices));
    } catch (error) {
      console.warn('Error actualizando servicios populares:', error);
    }
  }, [isClient, calculatePopularServices, lastUpdate]);

  // trackServiceVisit optimizado
  const trackServiceVisit = useCallback((serviceId: string, category?: string) => {
    if (!isClient || !serviceId) return;

    try {
      const visits = getStoredVisits();
      const newVisit: ServiceVisit = {
        serviceId,
        timestamp: Date.now(),
        category
      };

      visits.push(newVisit);

      // Mantener solo las últimas visitas
      if (visits.length > ANALYTICS_CONFIG.MAX_VISITS_STORED) {
        visits.splice(0, visits.length - ANALYTICS_CONFIG.MAX_VISITS_STORED);
      }

      localStorage.setItem(ANALYTICS_KEYS.SERVICE_VISITS, JSON.stringify(visits));
      
      // Actualizar servicios populares (con throttling)
      setTimeout(updatePopularServices, 1000); // Delay de 1 segundo
      
      console.log(`📊 Visita registrada: ${serviceId}`);
    } catch (error) {
      console.warn('Error registrando visita:', error);
    }
  }, [isClient, getStoredVisits, updatePopularServices]);

  // Función para obtener servicios populares
  const getPopularServices = useCallback((): PopularService[] => {
    if (!isClient) return [];

    try {
      const stored = localStorage.getItem(ANALYTICS_KEYS.POPULAR_SERVICES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error leyendo servicios populares:', error);
      return [];
    }
  }, [isClient]);

  // Función para obtener IDs de servicios a precargar
  const getServicesToPreload = useCallback((): string[] => {
    const popularServices = getPopularServices();
    return popularServices.map(service => service.serviceId);
  }, [getPopularServices]);

  // Función para obtener estadísticas de analytics
  const getAnalyticsStats = useCallback(() => {
    const visits = getStoredVisits();
    const popularServices = getPopularServices();
    const now = Date.now();
    
    // Visitas en las últimas 24 horas
    const recentVisits = visits.filter(visit => 
      (now - visit.timestamp) < (24 * 60 * 60 * 1000)
    );

    // Categorías más visitadas
    const categoryStats = new Map<string, number>();
    visits.forEach(visit => {
      if (visit.category) {
        categoryStats.set(visit.category, (categoryStats.get(visit.category) || 0) + 1);
      }
    });

    const topCategories = Array.from(categoryStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalVisits: visits.length,
      recentVisits: recentVisits.length,
      popularServices: popularServices.slice(0, 5),
      topCategories,
      servicesToPreload: getServicesToPreload()
    };
  }, [getStoredVisits, getPopularServices, getServicesToPreload]);

  // Limpiar datos antiguos al inicializar
  useEffect(() => {
    if (isClient) {
      cleanupOldData();
    }
  }, [isClient, cleanupOldData]);

  return {
    trackServiceVisit,
    getPopularServices,
    getServicesToPreload,
    getAnalyticsStats,
    calculatePopularServices,
    updatePopularServices,
    cleanupOldData
  };
};

export default useServiceAnalytics;