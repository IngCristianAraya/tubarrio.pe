import useSWR from 'swr';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useService } from './useService';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  getDoc,
  doc,
  DocumentSnapshot,
  Firestore
} from 'firebase/firestore';
import { db, initializeFirebase } from '@/lib/firebase/config';
import { Service } from '@/types/service';
import { fallbackServices, filterFallbackServices, getFallbackServiceById } from '../lib/firebase/fallback';

// Tipos para el hook
interface UseServicesOptions {
  category?: string;
  barrio?: string;
  userId?: string;
  featured?: boolean;
  pageSize?: number;
  enabled?: boolean;
  search?: string;
}

interface PaginatedResult {
  services: Service[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  loading: boolean;
  error: any;
}

interface ServicesResult {
  services: Service[];
  loading: boolean;
  error: any;
  mutate: () => void;
}

// Cache keys para SWR
const getCacheKey = (options: UseServicesOptions) => {
  const { category, barrio, userId, featured, pageSize, search } = options;
  return ['services', { category, barrio, userId, featured, pageSize, search }];
};

// Fetcher optimizado para diferentes tipos de consultas
const servicesFetcher = async ([_, options]: [string, UseServicesOptions]): Promise<Service[]> => {
  const { category, barrio, userId, featured, pageSize = 12 } = options;
  
  console.log('🔍 servicesFetcher ejecutándose:', { db: !!db, options });
  
  // Si Firebase no está disponible, usar datos de respaldo
  if (!db) {
    console.warn('🔄 Firebase no disponible, usando datos de respaldo');
    return filterFallbackServices({
      category,
      barrio,
      search: options.search,
      featured,
      limit: pageSize
    });
  }
  
  console.log('✅ Firebase disponible, intentando consulta...');

  try {

  // Construir query optimizada
  let q = query(collection(db, 'services'));
  
  // Filtros del servidor (NO del cliente)
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  
  if (category && category !== 'Todas' && category !== 'Todos') {
    q = query(q, where('category', '==', category));
  }
  
  if (barrio) {
    q = query(q, where('barrio', '==', barrio));
  }
  
  // Solo servicios activos
  q = query(q, where('active', '==', true));
  
  // Ordenamiento y límite
  if (featured) {
    q = query(q, orderBy('rating', 'desc'), limit(6)); // Solo 6 servicios destacados
  } else {
    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));
  }
  
    console.log(`🔥 Firebase Query: ${featured ? 'featured' : 'regular'} - Filtros:`, {
      category: category || 'none',
      barrio: barrio || 'none', 
      userId: userId || 'none',
      limit: featured ? 6 : pageSize
    });
    
    const snapshot = await getDocs(q);
    
    console.log(`✅ Firebase lecturas: ${snapshot.docs.length}`);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Servicio sin nombre',
        description: data.description || 'Sin descripción',
        category: data.category || 'Sin categoría',
        image: data.image || '/images/placeholder-service.jpg',
        rating: data.rating || 0,
        location: data.location || 'Ubicación no especificada',
        contactUrl: data.contactUrl || '',
        detailsUrl: data.detailsUrl || '',
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as Service;
    });
    
  } catch (error: any) {
    console.error('❌ Error al conectar con Firebase:', error.message);
    
    // Usar datos de respaldo en caso de error
    console.warn('🔄 Error en Firebase, usando datos de respaldo:', error.message);
    return filterFallbackServices({
      category,
      barrio,
      search: options.search,
      featured,
      limit: pageSize
    });
  }
};

// Hook principal para servicios
export const useServices = (options: UseServicesOptions = {}): ServicesResult => {
  const { enabled = true } = options;
  
  const { data, error, mutate, isValidating } = useSWR<Service[]>(
    enabled ? ['services', options] : null,
    servicesFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minuto de duplicación
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onSuccess: (data: Service[]) => {
        console.log(`📊 SWR Cache actualizado: ${data?.length || 0} servicios`);
      }
    }
  );
  
  return {
    services: data || [],
    loading: isValidating,
    error,
    mutate
  };
};

// Hook para servicios destacados (optimizado)
export const useFeaturedServices = (): ServicesResult => {
  return useServices({ featured: true });
};

// Hook para servicios del usuario (optimizado)
export const useUserServices = (userId?: string): ServicesResult => {
  return useServices({ userId, enabled: !!userId });
};

// Hook para servicios por categoría (optimizado)
export const useServicesByCategory = (category?: string): ServicesResult => {
  return useServices({ category, enabled: !!category });
};

// Hook para paginación con startAfter
export const useServicesPaginated = (options: UseServicesOptions = {}): PaginatedResult => {
  const { category, barrio, userId, search, pageSize = 12 } = options;
  
  // Inicializar vacío para cargar datos reales desde Firebase
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<any>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  console.log('📊 useServicesPaginated state:', { 
    servicesCount: allServices.length, 
    loading, 
    hasMore, 
    initialized, 
    isClient,
    hasDb: !!db
  });
  
  console.log('🔧 useServicesPaginated initialized with:', { category, barrio, userId, search, pageSize, allServicesLength: allServices.length, isClient });

  const loadMore = useCallback(async () => {
    console.log('🚀 loadMore called with:', { loading, hasMore, allServicesLength: allServices.length });
    if (loading || !hasMore) {
      console.log('⏹️ loadMore early return:', { loading, hasMore });
      return;
    }
    
    setLoading(true);
    setError(null);
    console.log('⚡ Starting loadMore process...');
    
    // Si Firebase no está disponible, usar datos de respaldo
    if (!db) {
      console.log('🔥 Firebase not available, using fallback data');
      console.warn('🔄 Firebase no disponible, usando datos de respaldo para paginación');
      try {
        const fallbackData = filterFallbackServices({
          category,
          barrio,
          search,
          limit: pageSize,
          offset: allServices.length
        });
        
        console.log('📦 Fallback data loaded:', { count: fallbackData.length, data: fallbackData.slice(0, 2) });
        setAllServices(prev => [...prev, ...fallbackData]);
        setHasMore(fallbackData.length === pageSize);
      } catch (err) {
        console.error('Error con datos de respaldo:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
      return;
    }
    
    try {
      // Construir query con startAfter para paginación real
      let q = query(collection(db, 'services'));
      
      // Filtros del servidor
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }
      
      if (category && category !== 'Todas' && category !== 'Todos') {
        q = query(q, where('category', '==', category));
      }
      
      if (barrio) {
        q = query(q, where('barrio', '==', barrio));
      }
      
      q = query(q, where('active', '==', true));
      q = query(q, orderBy('createdAt', 'desc'));
      
      // Paginación real con startAfter
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      q = query(q, limit(pageSize));
      
      console.log(`🔥 Paginación Firebase - Página ${lastDoc ? 'siguiente' : 'primera'}`);
      
      const snapshot = await getDocs(q);
      const newServices = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Servicio sin nombre',
          description: data.description || 'Sin descripción',
          category: data.category || 'Sin categoría',
          image: data.image || '/images/placeholder-service.jpg',
          rating: data.rating || 0,
          location: data.location || 'Ubicación no especificada',
          contactUrl: data.contactUrl || '',
          detailsUrl: data.detailsUrl || '',
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        } as Service;
      });
      
      console.log(`✅ Cargados ${newServices.length} servicios adicionales`);
      
      setAllServices(prev => [...prev, ...newServices]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
      
    } catch (err) {
      console.error('Error cargando más servicios:', err);
      console.warn('🔄 Error en Firebase, usando datos de respaldo');
      
      try {
        const fallbackData = filterFallbackServices({
          category,
          barrio,
          search,
          limit: pageSize,
          offset: allServices.length
        });
        
        console.log('📦 Fallback data loaded after Firebase error:', { count: fallbackData.length, data: fallbackData.slice(0, 2) });
        setAllServices(prev => [...prev, ...fallbackData]);
        setHasMore(fallbackData.length === pageSize);
        setError(null); // Limpiar error ya que tenemos datos de fallback
      } catch (fallbackErr) {
        console.error('Error también con datos de respaldo:', fallbackErr);
        setError(err); // Mantener el error original de Firebase
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastDoc, pageSize, category, barrio, userId, search]);
  

  
  // Reset function for filter changes
  const resetPagination = useCallback(() => {
    setAllServices([]);
    setLastDoc(null);
    setHasMore(true);
    setError(null);
  }, []);
  
  // Efecto para detectar cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      console.log('⏸️ Esperando inicialización del cliente...');
      return;
    }
    
    console.log('🔄 useServicesPaginated useEffect triggered (cliente)');
    setInitialized(true);
    
    // Resetear estado
    setAllServices([]);
    setLastDoc(null);
    setHasMore(true);
    setError(null);
    
    // Cargar primera página inmediatamente
    console.log('🔥 Loading first page of services');
    
    const loadInitialData = async () => {
      // Asegurar que Firebase esté inicializado
      console.log('🔥 Inicializando Firebase explícitamente...');
      initializeFirebase();
      
      if (!db) {
        console.log('🔥 Firebase not available, using fallback data');
        console.warn('🔄 Firebase no disponible, usando datos de respaldo para paginación');
        try {
          const fallbackData = filterFallbackServices({
            category,
            barrio,
            search,
            limit: pageSize,
            offset: 0
          });
          
          console.log('📦 Fallback data loaded:', { count: fallbackData.length, data: fallbackData.slice(0, 2) });
          setAllServices(fallbackData);
          setHasMore(fallbackData.length === pageSize);
        } catch (err) {
          console.error('Error con datos de respaldo:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        // Construir query inicial
        let q = query(collection(db, 'services'));
        
        // Filtros del servidor
        if (userId) {
          q = query(q, where('userId', '==', userId));
        }
        
        if (category && category !== 'Todas' && category !== 'Todos') {
          q = query(q, where('category', '==', category));
        }
        
        if (barrio) {
          q = query(q, where('barrio', '==', barrio));
        }
        
        q = query(q, where('active', '==', true));
        q = query(q, orderBy('createdAt', 'desc'));
        q = query(q, limit(pageSize));
        
        console.log(`🔥 Cargando primera página desde Firebase`);
        
        const snapshot = await getDocs(q);
        const newServices = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Servicio sin nombre',
          description: data.description || 'Sin descripción',
          category: data.category || 'Sin categoría',
          image: data.image || '/images/placeholder-service.jpg',
          rating: data.rating || 0,
          location: data.location || 'Ubicación no especificada',
          contactUrl: data.contactUrl || '',
          detailsUrl: data.detailsUrl || '',
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        } as Service;
      });
        
        console.log(`✅ Cargados ${newServices.length} servicios iniciales`);
        
        setAllServices(newServices);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === pageSize);
        
      } catch (err) {
        console.error('Error cargando servicios iniciales:', err);
        console.warn('🔄 Error en Firebase, usando datos de respaldo');
        
        try {
          const fallbackData = filterFallbackServices({
            category,
            barrio,
            search,
            limit: pageSize,
            offset: 0
          });
          
          console.log('📦 Fallback data loaded after Firebase error:', { count: fallbackData.length, data: fallbackData.slice(0, 2) });
          setAllServices(fallbackData);
          setHasMore(fallbackData.length === pageSize);
          setError(null); // Limpiar error ya que tenemos datos de fallback
        } catch (fallbackErr) {
          console.error('Error también con datos de respaldo:', fallbackErr);
          setError(err); // Mantener el error original de Firebase
        }
      } finally {
        setLoading(false);
      }
    }
  });

  // Verificar si estamos mostrando datos de respaldo
  const isUsingFallback = (error?.code === 'not-found' && allServices.length > 0) || 
                         (error && allServices.length > 0);
  
  // Configuración de reintentos
  const retryConfig = {
    shouldRetryOnError: false,
    onErrorRetry: (err: any, key: string, config: any, revalidate: any, { retryCount = 0 }: { retryCount?: number } = {}) => {
      // No reintentar si el error es 404 o si ya hemos reintentado 3 veces
      if (err?.code === 'not-found' || (retryCount && retryCount >= 3)) return;
      
      // Reintentar después de un retraso exponencial (1s, 2s, 4s)
      const timeout = Math.min(1000 * 2 ** (retryCount || 0), 10000);
      console.log(`🔄 Reintentando en ${timeout}ms... (${(retryCount || 0) + 1}/3)`);
      
      setTimeout(() => revalidate({ retryCount: (retryCount || 0) + 1 }), timeout);
    }
  };
  
  return {
    services: allServices,
    hasMore,
    loadMore,
    loading,
    error: error || null
  };
};

// Alias para compatibilidad
export const useServiceById = useService;

// Utilidad para precargar servicios
export const preloadServices = (options: UseServicesOptions) => {
  // Esta función se puede usar para precargar datos
  // Se implementará con SWR preload
};