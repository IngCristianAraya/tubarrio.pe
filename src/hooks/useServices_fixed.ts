import useSWR from 'swr';
import { useState, useCallback, useMemo, useEffect } from 'react';
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
  const { category, barrio, userId, featured, pageSize = 10, search } = options;
  
  // Si Firebase no está disponible, usar datos de respaldo
  if (!db) {
    console.warn('🔄 Firebase no disponible, usando datos de respaldo');
    return filterFallbackServices({ category, barrio, search, limit: pageSize });
  }
  
  try {
    let q = collection(db, 'services');
    
    // Aplicar filtros
    if (category) q = query(q, where('category', '==', category));
    if (barrio) q = query(q, where('barrio', '==', barrio));
    if (userId) q = query(q, where('userId', '==', userId));
    if (featured) q = query(q, where('featured', '==', true));
    
    // Búsqueda por texto (si se proporciona)
    if (search) {
      q = query(
        q,
        where('searchKeywords', 'array-contains-any', search.toLowerCase().split(' '))
      );
    }
    
    // Ordenar y limitar
    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));
    
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
      search,
      limit: pageSize
    }).map(service => ({
      ...service,
      id: service.id || '',
      name: service.name || 'Servicio sin nombre',
      description: service.description || 'Sin descripción',
      category: service.category || 'Sin categoría',
      image: service.image || '/images/placeholder-service.jpg',
      rating: service.rating || 0,
      location: service.location || 'Ubicación no especificada',
      contactUrl: service.contactUrl || '',
      detailsUrl: service.detailsUrl || '',
      createdAt: service.createdAt || new Date(),
      updatedAt: service.updatedAt || new Date()
    })) as Service[];
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
  const { category, barrio, userId, search, pageSize = 10 } = options;
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Cargar más servicios
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Si no hay base de datos, usar datos de respaldo
      if (!db) {
        console.warn('🔄 Firebase no disponible, usando datos de respaldo');
        const fallbackData = filterFallbackServices({
          category,
          barrio,
          search,
          limit: pageSize,
          offset: allServices.length
        });
        
        setAllServices(prev => [...prev, ...fallbackData]);
        setHasMore(fallbackData.length === pageSize);
        setLoading(false);
        return;
      }
      
      // Construir consulta
      let q = collection(db, 'services');
      
      // Aplicar filtros
      if (category) q = query(q, where('category', '==', category));
      if (barrio) q = query(q, where('barrio', '==', barrio));
      if (userId) q = query(q, where('userId', '==', userId));
      
      // Búsqueda por texto (si se proporciona)
      if (search) {
        q = query(
          q,
          where('searchKeywords', 'array-contains-any', search.toLowerCase().split(' '))
        );
      }
      
      // Ordenar
      q = query(q, orderBy('createdAt', 'desc'));
      
      // Paginación
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      // Limitar resultados
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
        }).map(service => ({
          ...service,
          id: service.id || '',
          name: service.name || 'Servicio sin nombre',
          description: service.description || 'Sin descripción',
          category: service.category || 'Sin categoría',
          image: service.image || '/images/placeholder-service.jpg',
          rating: service.rating || 0,
          location: service.location || 'Ubicación no especificada',
          contactUrl: service.contactUrl || '',
          detailsUrl: service.detailsUrl || '',
          createdAt: service.createdAt || new Date(),
          updatedAt: service.updatedAt || new Date()
        }));
        
        console.log('📦 Fallback data loaded after Firebase error:', { count: fallbackData.length, data: fallbackData.slice(0, 2) });
        setAllServices(prev => [...prev, ...fallbackData]);
        setHasMore(fallbackData.length === pageSize);
        setError(null);
      } catch (fallbackErr) {
        console.error('Error también con datos de respaldo:', fallbackErr);
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastDoc, pageSize, category, barrio, userId, search, allServices]);
  
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
  
  // Efecto principal para cargar datos (solo en el cliente)
  useEffect(() => {
    if (!isClient) {
      console.log('⏸️ Esperando inicialización del cliente...');
      return;
    }
    
    // Resetear paginación cuando cambian los filtros
    resetPagination();
    
    // Cargar primera página
    const loadInitialData = async () => {
      if (loading) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Si no hay base de datos, usar datos de respaldo
        if (!db) {
          console.warn('🔄 Firebase no disponible, usando datos de respaldo');
          const fallbackData = filterFallbackServices({
            category,
            barrio,
            search,
            limit: pageSize
          });
          
          setAllServices(fallbackData);
          setHasMore(fallbackData.length === pageSize);
          setLoading(false);
          return;
        }
        
        // Construir consulta inicial
        let q = collection(db, 'services');
        
        // Aplicar filtros
        if (category) q = query(q, where('category', '==', category));
        if (barrio) q = query(q, where('barrio', '==', barrio));
        if (userId) q = query(q, where('userId', '==', userId));
        
        // Búsqueda por texto (si se proporciona)
        if (search) {
          q = query(
            q,
            where('searchKeywords', 'array-contains-any', search.toLowerCase().split(' '))
          );
        }
        
        // Ordenar y limitar
        q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));
        
        console.log('🔥 Cargando primera página desde Firebase');
        
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
            limit: pageSize
          }).map(service => ({
            ...service,
            id: service.id || '',
            name: service.name || 'Servicio sin nombre',
            description: service.description || 'Sin descripción',
            category: service.category || 'Sin categoría',
            image: service.image || '/images/placeholder-service.jpg',
            rating: service.rating || 0,
            location: service.location || 'Ubicación no especificada',
            contactUrl: service.contactUrl || '',
            detailsUrl: service.detailsUrl || '',
            createdAt: service.createdAt || new Date(),
            updatedAt: service.updatedAt || new Date()
          }));
          
          setAllServices(fallbackData);
          setHasMore(fallbackData.length === pageSize);
          setError(null);
        } catch (fallbackErr) {
          console.error('Error también con datos de respaldo:', fallbackErr);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
    
  }, [isClient, category, barrio, userId, search, pageSize, resetPagination]);
  
  return {
    services: allServices,
    hasMore,
    loadMore,
    loading,
    error
  };
};

// Hook para un servicio individual (optimizado)
export const useService = (serviceId?: string): { service: Service | null; loading: boolean; error: any } => {
  const fetcher = useCallback(async ([_, id]: [string, string]): Promise<Service | null> => {
    if (!id) {
      console.error('❌ ID de servicio no proporcionado');
      throw new Error('ID de servicio no proporcionado');
    }
    
    // Si Firebase no está disponible, usar datos de respaldo
    if (!db) {
      console.warn(`🔄 Firebase no disponible, buscando servicio ${id} en datos de respaldo`);
      const fallbackService = getFallbackServiceById(id);
      if (!fallbackService) {
        throw { code: 'not-found', message: 'Servicio no encontrado en datos de respaldo' };
      }
      return fallbackService;
    }
    
    try {
      console.log(`🔍 Buscando servicio con ID: ${id}`);
      
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.warn(`⚠️ Servicio ${id} no encontrado en Firestore, buscando en respaldo`);
        const fallbackService = getFallbackServiceById(id);
        if (!fallbackService) {
          throw { code: 'not-found', message: 'Servicio no encontrado' };
        }
        return fallbackService;
      }
      
      const data = docSnap.data();
      if (!data) {
        console.error(`❌ Datos del servicio ${id} están vacíos`);
        throw { code: 'no-data', message: 'Datos del servicio no disponibles' };
      }
      
      console.log(`✅ Servicio cargado: ${data.name || 'Sin nombre'} (ID: ${id})`);
      
      return {
        id: docSnap.id,
        name: data.name || 'Servicio sin nombre',
        description: data.description || 'Sin descripción disponible',
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
      
    } catch (error: any) {
      console.error(`❌ Error al cargar servicio ${serviceId}:`, error.message);
      const fallbackService = getFallbackServiceById(serviceId || '');
      if (!fallbackService) {
        throw { code: 'not-found', message: 'Servicio no encontrado en datos de respaldo' };
      }
      return fallbackService;
    }
  }, []);

  const { data: service, error, isValidating } = useSWR<Service | null>(
    serviceId ? ['service', serviceId] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onErrorRetry: (err: any, key, config, revalidate, { retryCount = 0 }) => {
        // No reintentar si el error es 404
        if (err?.code === 'not-found') return;
        
        // Solo reintentar hasta 3 veces
        if (retryCount >= 3) return;
        
        // Reintentar después de 5 segundos
        setTimeout(() => revalidate({ retryCount }), 5000);
      }
    }
  );
  
  return {
    service: service || null,
    loading: isValidating,
    error
  };
};

// Utilidad para invalidar cache específico
export const invalidateServicesCache = (options?: UseServicesOptions) => {
  // Esta función se puede usar para invalidar cache específico
  // Se implementará cuando se integre con SWR mutate global
};

// Alias para compatibilidad
export const useServiceById = useService;

// Utilidad para precargar servicios
export const preloadServices = (options: UseServicesOptions) => {
  // Esta función se puede usar para precargar datos
  // Se implementará con SWR preload
};
