import useSWR from 'swr';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useService } from './useService';
import { useServiceCache } from './useServiceCache';
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
import { db } from '@/lib/firebase/config';
import { Service } from '@/context/ServicesContext';
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
  onSuccess?: (data: Service[]) => void;
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

// Cache para almacenar resultados temporalmente
const servicesCache = new Map<string, { data: Service[]; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos (aumentado desde 5)

// Cache para consultas individuales por ID
const serviceByIdCache = new Map<string, { data: Service | null; timestamp: number }>();
const SERVICE_CACHE_TTL = 30 * 60 * 1000; // 30 minutos para cache de servicios individuales

// Fetcher optimizado con caché
const servicesFetcher = async ([_, options]: [string, UseServicesOptions]): Promise<Service[]> => {
  const { category, barrio, userId, featured, pageSize = 12, search } = options;
  const cacheKey = JSON.stringify({ category, barrio, userId, featured, pageSize, search });
  const now = Date.now();
  
  // Inicializar el hook de caché
  const { 
    getAllServicesFromCache, 
    setAllServicesCache,
    loadPersistentCache,
    setFeaturedServicesCache,
    getFeaturedServicesFromCache
  } = useServiceCache();
  
  // Verificar caché primero
  
  // 1. Verificar caché primero
  try {
    // Si es una consulta de servicios destacados, verificar primero ese caché
    if (featured) {
      const featuredCache = getFeaturedServicesFromCache();
      if (featuredCache && featuredCache.length > 0) {
        console.log('🌟 [FEATURED CACHE] Usando caché de servicios destacados');
        return featuredCache;
      }
    }
    
    // Intentar obtener del caché persistente
    const persistentCache = loadPersistentCache();
    if (persistentCache && persistentCache.length > 0) {
      console.log('📦 [PERSISTENT CACHE] Usando datos de caché persistente');
      
      // Si es una consulta de servicios destacados, actualizar el caché específico
      if (featured) {
        const featuredServices = persistentCache.filter(service => service.featured === true);
        if (featuredServices.length > 0) {
          setFeaturedServicesCache(featuredServices);
        }
      }
      
      return persistentCache;
    }
    
    // Si no hay caché persistente, intentar con el caché normal
    const cachedServices = getAllServicesFromCache();
    if (cachedServices && cachedServices.length > 0) {
      console.log('📦 [CACHE HIT] Usando datos de caché para:', cacheKey);
      
      // Si es una consulta de servicios destacados, actualizar el caché específico
      if (featured) {
        const featuredServices = cachedServices.filter(service => service.featured === true);
        if (featuredServices.length > 0) {
          setFeaturedServicesCache(featuredServices);
        }
      }
      
      return cachedServices;
    }
  } catch (error) {
    console.warn('⚠️ Error al acceder al caché:', error);
    // Continuar con la carga normal en caso de error
  }
  
  // Si Firebase no está disponible, usar datos de respaldo
  if (!db) {
    console.warn('🔄 Firebase no disponible, usando datos de respaldo');
    const fallbackData = filterFallbackServices({
      category,
      barrio,
      search,
      featured,
      limit: pageSize
    });
    
    // Guardar en caché para futuras solicitudes
    try {
      if (fallbackData.length > 0) {
        // Guardar en caché persistente
        setAllServicesCache(fallbackData);
        
        // Si es una consulta de destacados, actualizar ese caché específico
        if (featured) {
          const featuredData = fallbackData.filter(service => service.featured === true);
          if (featuredData.length > 0) {
            setFeaturedServicesCache(featuredData);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error guardando datos de respaldo en caché:', error);
    }
    
    return fallbackData;
  }
  
  console.log('🔍 Ejecutando consulta a Firebase...');

  try {
    // Construir consulta optimizada con solo los filtros necesarios
    const constraints = [];
    
    // Filtros del lado del servidor (solo los estrictamente necesarios)
    if (userId) {
      constraints.push(where('userId', '==', userId));
    }
    
    // Otros filtros según sea necesario
    if (category && category !== 'Todas' && category !== 'Todos') {
      constraints.push(where('category', '==', category));
    }
    
    if (barrio) {
      constraints.push(where('barrio', '==', barrio));
    }
    
    // Solo servicios activos
    constraints.push(where('active', '==', true));
    
    // Si es una consulta de destacados, agregar filtro
    if (featured) {
      constraints.push(where('featured', '==', true));
    }
    
    // Construir la consulta
    let q = query(collection(db, 'services'), ...constraints, orderBy('createdAt', 'desc'));
    
    // Aplicar paginación si es necesario
    if (pageSize) {
      q = query(q, limit(pageSize));
    }
    
    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);
    const services = querySnapshot.docs.map(doc => {
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
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        featured: data.featured || false,
        active: data.active !== false // Default to true if not specified
      } as Service;
    });
    
    // Si hay búsqueda, aplicar filtros adicionales
    const filteredServices = search && search.trim() !== ''
      ? services.filter(service => 
          (service.name?.toLowerCase().includes(search.toLowerCase()) ||
          service.description?.toLowerCase().includes(search.toLowerCase()))
        )
      : services;
      
    // Aplicar paginación
    const paginatedServices = pageSize 
      ? filteredServices.slice(0, pageSize)
      : filteredServices;
      
    // Actualizar cachés
    try {
      // Actualizar caché de servicios completos si no hay búsqueda
      if (filteredServices.length > 0 && (!search || search.trim() === '')) {
        setAllServicesCache(filteredServices);
        
        // Actualizar caché de servicios destacados si corresponde
        if (featured || filteredServices.some(s => s.featured)) {
          const featuredServices = filteredServices.filter(s => s.featured);
          if (featuredServices.length > 0) {
            setFeaturedServicesCache(featuredServices);
          }
        }
      }
      
      // Actualizar caché de servicios individuales
      filteredServices.forEach(service => {
        serviceByIdCache.set(service.id, { 
          data: service, 
          timestamp: now 
        });
      });
      
    } catch (cacheError) {
      console.warn('⚠️ Error actualizando caché:', cacheError);
      // No lanzar el error, solo registrar
    }
    
    return paginatedServices;
  } catch (error: any) {
    console.error('❌ Error al conectar con Firebase:', error.message);
    
    // Usar datos de respaldo en caso de error
    console.warn('🔄 Error en Firebase, usando datos de respaldo:', error.message);
    return filterFallbackServices({
      category,
      barrio,
      search: options?.search,
      featured,
      limit: options?.pageSize
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
      revalidateOnReconnect: false, // Deshabilitar revalidación en reconexión
      revalidateIfStale: false,     // No revalidar si los datos están desactualizados
      dedupingInterval: 300000,     // 5 minutos de duplicación (aumentado desde 1 minuto)
      errorRetryCount: 2,           // Reducir reintentos
      errorRetryInterval: 10000,    // 10 segundos entre reintentos
      onSuccess: (data: Service[]) => {
        console.log(`📊 [SWR] Cache actualizado: ${data?.length || 0} servicios`);
      },
      onError: (err) => {
        console.error('[SWR Error]', err);
      }
    }
  );
  
  // Usar caché para servicios individuales si es posible
  const cachedServices = useMemo(() => {
    if (!data) return [];
    
    return data.map(service => {
      const cached = serviceByIdCache.get(service.id);
      if (cached && (Date.now() - cached.timestamp < SERVICE_CACHE_TTL)) {
        return cached.data || service;
      }
      return service;
    });
  }, [data]);
  
  return {
    services: cachedServices,
    loading: isValidating,
    error,
    mutate
  };
};

// Hook para servicios destacados (optimizado)
export const useFeaturedServices = (): ServicesResult => {
  // Usar un caché más largo para servicios destacados (30 minutos)
  const cacheKey = 'featured_services';
  const now = Date.now();
  
  // Verificar caché primero
  const cached = servicesCache.get(cacheKey);
  if (cached && (now - cached.timestamp < 30 * 60 * 1000)) {
    console.log('📦 [CACHE HIT] Usando caché de servicios destacados');
    return {
      services: cached.data,
      loading: false,
      error: null,
      mutate: () => {}
    };
  }
  
  const result = useServices({ 
    featured: true
  });
  
  // Actualizar caché cuando se obtengan nuevos datos
  useEffect(() => {
    if (result.services.length > 0) {
      servicesCache.set(cacheKey, { data: result.services, timestamp: now });
    }
  }, [result.services]);
  
  return result;
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
  const { category, barrio, userId, pageSize = 12, search } = options;
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Reset function for filter changes
  const resetPagination = useCallback(() => {
    setAllServices([]);
    setLastDoc(null);
    setHasMore(true);
    setError(null);
    setInitialized(false);
  }, [category, barrio, search, userId]);

  // Efecto para resetear cuando cambian los filtros
  useEffect(() => {
    resetPagination();
  }, [category, barrio, search, userId, resetPagination]);

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    if (!isClient) return;
    
    if (initialized) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Verificar si Firebase está inicializado
      if (!db) {
        throw new Error('Firebase no está inicializado');
      }
      
      let q = query(collection(db, 'services'));
      
      // Aplicar filtros
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
      q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));
      
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
      
      setAllServices(newServices);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
      setInitialized(true);
      
    } catch (err) {
      console.error('Error cargando servicios:', err);
      setError(err);
      
      // Usar datos de respaldo en caso de error
      const fallbackData = filterFallbackServices({
        category,
        barrio,
        search,
        limit: pageSize
      });
      
      setAllServices(fallbackData);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category, barrio, userId, search, pageSize, isClient, initialized]);
  
  // Cargar más datos
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastDoc) return;
    
    setLoading(true);
    
    try {
      // Verificar si Firebase está inicializado
      if (!db) {
        throw new Error('Firebase no está inicializado');
      }
      
      let q = query(collection(db, 'services'));
      
      // Aplicar filtros
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
      
      // Paginación
      if (lastDoc) {
        q = query(q, startAfter(lastDoc), limit(pageSize));
      }
      
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
      
      setAllServices(prev => [...prev, ...newServices]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
      
    } catch (err) {
      console.error('Error cargando más servicios:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [category, barrio, userId, search, pageSize, hasMore, loading, lastDoc]);
  
  // Efecto para manejar el estado del cliente
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Cargar datos iniciales cuando el componente se monta o cambian las dependencias
  useEffect(() => {
    if (isClient && !initialized) {
      loadInitialData();
    }
  }, [isClient, initialized, loadInitialData]);
  
  // Verificar si estamos mostrando datos de respaldo
  const isUsingFallback = (error?.code === 'not-found' && allServices.length > 0) || 
                         (error && allServices.length > 0);
  
  if (isUsingFallback) {
    console.warn('⚠️ Usando datos de respaldo debido a un error:', error?.message);
  }
  
  return {
    services: allServices,
    hasMore,
    loadMore,
    loading,
    error: isUsingFallback ? null : error
  };
};

// Alias para compatibilidad
export const useServiceById = useService;
// Utilidad para precargar servicios
export const preloadServices = (options: UseServicesOptions) => {
  // Esta función se puede usar para precargar datos
  // Se implementará con SWR preload
};