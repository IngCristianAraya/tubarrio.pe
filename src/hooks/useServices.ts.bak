import useSWR from 'swr';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useService } from './useService';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit as firestoreLimit,
  startAfter, 
  DocumentSnapshot, 
  QueryDocumentSnapshot,
  getDoc,
  doc,
  DocumentData,
  QueryConstraint,
  Firestore,
  Query,
  QueryDocumentSnapshot as FirestoreQueryDocumentSnapshot,
  Timestamp,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { Service as BaseService } from '@/types/service';

// Extender la interfaz Service para incluir propiedades adicionales
export type Service = BaseService & {
  phone?: string;
  whatsapp?: string;
  address?: string;
  active?: boolean;
  createdAt?: any;
  updatedAt?: any;
  featured?: boolean;
};

export type ExtendedService = Service;
import { fallbackServices, filterFallbackServices, getFallbackServiceById } from '../lib/firebase/fallback';

// Funciones de caché
const getFeaturedServicesFromCache = (): Service[] => {
  if (typeof window === 'undefined') return [];
  const cached = localStorage.getItem('featuredServices');
  if (!cached) return [];
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    // Verificar si la caché es reciente (menos de 1 hora)
    if (Date.now() - timestamp < 60 * 60 * 1000) {
      return data;
    }
  } catch (error) {
    console.error('Error al analizar caché de servicios destacados:', error);
  }
  
  return [];
};

const setFeaturedServicesCache = (services: Service[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('featuredServices', JSON.stringify({
      data: services,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error al guardar en caché los servicios destacados:', error);
  }
};

const getAllServicesFromCache = (): Service[] => {
  if (typeof window === 'undefined') return [];
  const cached = localStorage.getItem('allServices');
  if (!cached) return [];
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    // Verificar si la caché es reciente (menos de 5 minutos)
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  } catch (error) {
    console.error('Error al analizar caché de todos los servicios:', error);
  }
  
  return [];
};

const setAllServicesCache = (services: Service[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('allServices', JSON.stringify({
      data: services,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error al guardar en caché todos los servicios:', error);
  }
};

const loadPersistentCache = (): Service[] => {
  return getAllServicesFromCache();
};

// Logger simple para desarrollo
const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  },
  error: console.error,
  info: console.log,
  warn: console.warn
};

// Tipos para el hook
interface UseServicesOptions {
  category?: string;
  barrio?: string;
  userId?: string;
  featured?: boolean;
  pageSize?: number;
  limit?: number;
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
const getCacheKey = (options: UseServicesOptions): string => {
  return JSON.stringify({
    category: options.category,
    barrio: options.barrio,
    userId: options.userId,
    featured: options.featured,
    pageSize: options.pageSize,
    limit: options.limit,
    search: options.search
  });
};

// Cache para almacenar resultados temporalmente
const servicesCache = new Map<string, { data: Service[]; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos (aumentado desde 5)

// Cache para consultas individuales por ID
const serviceByIdCache = new Map<string, { data: Service | null; timestamp: number }>();
const SERVICE_CACHE_TTL = 30 * 60 * 1000; // 30 minutos para cache de servicios individuales

// Fetcher optimizado con caché
const servicesFetcher = async ([, options]: [string, UseServicesOptions]): Promise<Service[]> => {
  // Obtener la instancia de Firestore
  const firestore = db.instance;
  if (!firestore) {
    logger.error('Firestore no está inicializado');
    return [];
  }
  
  const { category, barrio, userId, featured, pageSize = 12, search } = options;
  const cacheKey = getCacheKey(options);
  const now = Date.now();
  
  // Verificar caché
  const cachedServices = servicesCache.get(cacheKey);
  if (cachedServices && (now - cachedServices.timestamp < CACHE_TTL)) {
    logger.debug('Usando servicios desde caché');
    return cachedServices.data;
  }
  
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
    
    // Construir la consulta base
    const servicesRef = collection(firestore, 'services');
    const queryConstraints: QueryConstraint[] = [
      ...constraints,
      orderBy('createdAt', 'desc')
    ];
    
    // Aplicar límite de página o límite de opciones, lo que sea mayor
    const finalLimit = pageSize || options.limit || 12;
    queryConstraints.push(firestoreLimit(finalLimit));
    
    // Crear la consulta final
    const q = query(servicesRef, ...queryConstraints);
    
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
          timestamp: Date.now() 
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
  const cacheKey = getCacheKey(options);
  
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
    // Verificar si tenemos datos en caché
    const cacheKey = getCacheKey(options);
    const cached = servicesCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
  // Actualizar la caché
  if (services.length > 0) {
    servicesCache.set(cacheKey, {
      data: services,
      timestamp: Date.now()
    });
  }
  
  return {
    services,
    loading: isValidating,
    error,
    mutate
  };
};

// Hook para servicios destacados (optimizado)
export const useFeaturedServices = (): ServicesResult => {
  const options = {
    featured: true,
    limit: 10 // Limitar a 10 servicios destacados
  };
  
  const result = useServices(options);
  const cacheKey = getCacheKey(options);
  
  // Actualizar caché cuando se obtengan nuevos datos
  useEffect(() => {
    if (result.services.length > 0) {
      servicesCache.set(cacheKey, { data: result.services, timestamp: Date.now() });
    }
  }, [result.services, cacheKey]);
  
  return result;
};

// Hook para servicios del usuario (optimizado)
export const useUserServices = (userId?: string): ServicesResult => {
  return useServices({
    userId,
    enabled: !!userId
  });
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
      q = query(q, orderBy('createdAt', 'desc'), firestoreLimit(pageSize));
      
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
        q = query(q, startAfter(lastDoc), firestoreLimit(pageSize));
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