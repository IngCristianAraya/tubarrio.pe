import useSWR from 'swr';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useService } from './useService';
import { useServiceCache } from './useServiceCache';
import { Service } from '@/context/ServicesContext';
import { fallbackServices, filterFallbackServices, getFallbackServiceById } from '@/lib/fallback';
import { getDataSource, getCountry } from '@/lib/featureFlags';

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
  // Helper to generate a slug from a category name (handles accents)
  const slugify = (name?: string) => {
    if (!name) return '';
    return name
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Alias map for category slugs to handle legacy inconsistencies
  const CATEGORY_ALIAS: Record<string, string[]> = {
    'restaurantes-y-menus': ['restaurantes-y-menus', 'restaurantes-y-mens'],
    'comida-rapida': ['comida-rapida', 'comida-rpida'],
    'lavanderias': ['lavanderias', 'lavanderas'],
    'peluquerias': ['peluquerias', 'peluqueras']
  };
  const getCategoryAliases = (slug: string) => CATEGORY_ALIAS[slug] || [slug];

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
  
  // Si el origen de datos es Supabase, consultar directamente desde Supabase
  if (getDataSource() === 'supabase') {
    const { getSupabaseClient } = await import('@/lib/supabase/client');
    const supabase = await getSupabaseClient();
    console.log('[useServices] 📡 Leyendo servicios desde Supabase');
    let queryBuilder = supabase
      .from('services')
      .select('*')
      .eq('active', true);

    const country = getCountry();
    if (country) {
      queryBuilder = queryBuilder.eq('country', country);
    }

    if (featured) {
      queryBuilder = queryBuilder.eq('featured', true);
    }
    if (category && category !== 'Todas' && category !== 'Todos') {
      queryBuilder = queryBuilder.eq('categorySlug', category);
    }
    if (barrio) {
      queryBuilder = queryBuilder.eq('barrio', barrio);
    }
    if (userId) {
      queryBuilder = queryBuilder.eq('userId', userId);
    }
    if (search && search.trim() !== '') {
      // Búsqueda básica por nombre/descripción
      const term = `%${search.trim()}%`;
      queryBuilder = queryBuilder.or(`name.ilike.${term},description.ilike.${term}`);
    }

    const { data, error } = await queryBuilder
      .order('createdAt', { ascending: false })
      .limit(pageSize);
    if (error) {
      console.error('[useServices] ❌ Error leyendo Supabase:', error);
      throw error;
    }
    const services = (data || []).map((row: any) => ({
      id: row.id?.toString?.() || row.uid,
      name: row.name || 'Servicio sin nombre',
      description: row.description || 'Sin descripción',
      category: row.category || 'Sin categoría',
      categorySlug: row.categorySlug || row.category_slug || '',
      image: row.image || '/images/placeholder-service.jpg',
      rating: row.rating || 0,
      location: row.location || row.address || 'Ubicación no especificada',
      contactUrl: row.contactUrl || row.contact_url || '',
      detailsUrl: row.detailsUrl || row.details_url || '',
      featured: row.featured || false,
      active: row.active !== false,
      createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      ...row,
    })) as Service[];

    try {
      if (services.length > 0) {
        setAllServicesCache(services);
        if (featured) {
          const featuredData = services.filter(s => s.featured === true);
          if (featuredData.length > 0) {
            setFeaturedServicesCache(featuredData);
          }
        }
      }
    } catch {}

    return services;
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
      // Interpret `category` option as a slug, include aliases when available
      const aliases = getCategoryAliases(category);
      if (aliases.length > 1) {
        constraints.push(where('categorySlug', 'in', aliases));
      } else {
        constraints.push(where('categorySlug', '==', category));
      }
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
      
      // Debug log para verificar los tags
      console.log(`🔍 useServices - Service ${data.name}:`, {
        id: doc.id,
        hasTag: !!data.tag,
        hasTags: !!data.tags,
        tagValue: data.tag,
        tagsValue: data.tags,
        tagType: typeof data.tag,
        tagsType: typeof data.tags
      });
      
      return {
        id: doc.id,
        name: data.name || 'Servicio sin nombre',
        description: data.description || 'Sin descripción',
        category: data.category || 'Sin categoría',
        categorySlug: data.categorySlug || slugify(data.category) || '',
        image: data.image || '/images/placeholder-service.jpg',
        rating: data.rating || 0,
        location: data.location || 'Ubicación no especificada',
        contactUrl: data.contactUrl || '',
        detailsUrl: data.detailsUrl || '',
        tags: data.tag || [],
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
          service.description?.toLowerCase().includes(search.toLowerCase()) ||
          service.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())))
        )
      : services;
    
    // Deduplicar por id para evitar servicios repetidos
    const uniqueById = (list: Service[]) => {
      const seen = new Set<string>();
      const result: Service[] = [];
      for (const item of list) {
        const key = String(item.id);
        if (!seen.has(key)) {
          seen.add(key);
          result.push(item);
        }
      }
      return result;
    };
    const deduped = uniqueById(filteredServices);
      
    // Aplicar paginación
    const paginatedServices = pageSize 
      ? deduped.slice(0, pageSize)
      : deduped;
      
    // Actualizar cachés
    try {
      // Actualizar caché de servicios completos si no hay búsqueda
      if (deduped.length > 0 && (!search || search.trim() === '')) {
        setAllServicesCache(deduped);
        
        // Actualizar caché de servicios destacados si corresponde
        if (featured || deduped.some(s => s.featured)) {
          const featuredServices = deduped.filter(s => s.featured);
          if (featuredServices.length > 0) {
            setFeaturedServicesCache(featuredServices);
          }
        }
      }
      
      // Actualizar caché de servicios individuales
      deduped.forEach(service => {
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
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Reset function for filter changes
  const resetPagination = useCallback(() => {
    setAllServices([]);
    setOffset(0);
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
      // Si el origen de datos es Supabase, usar paginación por rango
      if (getDataSource() === 'supabase') {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = await getSupabaseClient();
        let qb = supabase
          .from('services')
          .select('*')
          .eq('active', true);

        const country = getCountry();
        if (country) qb = qb.eq('country', country);
        if (userId) qb = qb.eq('userId', userId);
        if (category && category !== 'Todas' && category !== 'Todos') qb = qb.eq('categorySlug', category);
        if (barrio) qb = qb.eq('barrio', barrio);
        if (search && search.trim() !== '') {
          const term = `%${search.trim()}%`;
          qb = qb.or(`name.ilike.${term},description.ilike.${term}`);
        }

        const { data, error } = await qb
          .order('createdAt', { ascending: false })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;

        const newServices = (data || []).map((row: any) => ({
          id: row.id?.toString?.() || row.uid,
          name: row.name || 'Servicio sin nombre',
          description: row.description || 'Sin descripción',
          category: row.category || 'Sin categoría',
          categorySlug: row.categorySlug || row.category_slug || '',
          image: row.image || '/images/placeholder-service.jpg',
          rating: row.rating || 0,
          location: row.location || row.address || 'Ubicación no especificada',
          contactUrl: row.contactUrl || row.contact_url || '',
          detailsUrl: row.detailsUrl || row.details_url || '',
          featured: row.featured || false,
          active: row.active !== false,
          createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
          updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
          ...row,
        })) as Service[];

        // Deduplicar por id en carga inicial
        const uniqueById = (list: Service[]) => {
          const seen = new Set<string>();
          const result: Service[] = [];
          for (const item of list) {
            const key = String(item.id);
            if (!seen.has(key)) {
              seen.add(key);
              result.push(item);
            }
          }
          return result;
        };
        setAllServices(uniqueById(newServices));
        setHasMore(newServices.length === pageSize);
        setOffset((prev) => prev + newServices.length);
        setInitialized(true);
      } else {
        // Fallback: datos locales cuando el origen no es Supabase
        const fallbackData = filterFallbackServices({
          category,
          barrio,
          search,
          limit: pageSize,
          offset: 0,
        });
        setAllServices(fallbackData);
        setHasMore(fallbackData.length === pageSize);
        setOffset(fallbackData.length);
        setInitialized(true);
      }

    } catch (err) {
      console.error('Error cargando servicios:', err);
      setError(err);
      
      // Usar datos de respaldo en caso de error
      const fallbackData = filterFallbackServices({
        category,
        barrio,
        search,
        limit: pageSize,
        offset: 0,
      });
      
      setAllServices(fallbackData);
      setHasMore(fallbackData.length === pageSize);
    } finally {
      setLoading(false);
    }
  }, [category, barrio, userId, search, pageSize, isClient, initialized]);
  
  // Cargar más datos
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    
    try {
      if (getDataSource() === 'supabase') {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = await getSupabaseClient();
        let qb = supabase
          .from('services')
          .select('*')
          .eq('active', true);

        const country = getCountry();
        if (country) qb = qb.eq('country', country);
        if (userId) qb = qb.eq('userId', userId);
        if (category && category !== 'Todas' && category !== 'Todos') qb = qb.eq('categorySlug', category);
        if (barrio) qb = qb.eq('barrio', barrio);
        if (search && search.trim() !== '') {
          const term = `%${search.trim()}%`;
          qb = qb.or(`name.ilike.${term},description.ilike.${term}`);
        }

        const { data, error } = await qb
          .order('createdAt', { ascending: false })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;

        const newServices = (data || []).map((row: any) => ({
          id: row.id?.toString?.() || row.uid,
          name: row.name || 'Servicio sin nombre',
          description: row.description || 'Sin descripción',
          category: row.category || 'Sin categoría',
          categorySlug: row.categorySlug || row.category_slug || '',
          image: row.image || '/images/placeholder-service.jpg',
          rating: row.rating || 0,
          location: row.location || row.address || 'Ubicación no especificada',
          contactUrl: row.contactUrl || row.contact_url || '',
          detailsUrl: row.detailsUrl || row.details_url || '',
          featured: row.featured || false,
          active: row.active !== false,
          createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
          updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
          ...row,
        })) as Service[];

      // Deduplicar al anexar nuevas páginas
      const uniqueByIdAppend = (list: Service[]) => {
        const seen = new Set<string>();
        const result: Service[] = [];
        for (const item of list) {
          const key = String(item.id);
          if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
          }
        }
        return result;
      };
      setAllServices(prev => uniqueByIdAppend([...prev, ...newServices]));
      setHasMore(newServices.length === pageSize);
      setOffset((prev) => prev + newServices.length);
      } else {
        // Fallback: datos locales con paginación por offset
        const newServices = filterFallbackServices({
          category,
          barrio,
          search,
          limit: pageSize,
          offset,
        });
        setAllServices(prev => [...prev, ...newServices]);
        setHasMore(newServices.length === pageSize);
        setOffset((prev) => prev + newServices.length);
      }
      
    } catch (err) {
      console.error('Error cargando más servicios:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [category, barrio, userId, search, pageSize, hasMore, loading, offset]);
  
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