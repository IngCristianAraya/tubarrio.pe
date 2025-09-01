'use client';

import { useState, useEffect, useCallback } from 'react';
import { Service } from '@/context/ServicesContext';

interface CacheData {
  data: Service[];
  timestamp: number;
  version: string;
}

interface SingleServiceCache {
  [serviceId: string]: {
    data: Service;
    timestamp: number;
  };
}

const CACHE_VERSION = '1.0.0';
// Cache MUY conservador
const CACHE_EXPIRY = {
  FEATURED: 24 * 60 * 60 * 1000, // 24 horas
  ALL_SERVICES: 48 * 60 * 60 * 1000, // 48 horas
  SINGLE_SERVICE: 7 * 24 * 60 * 60 * 1000, // 7 días
};

const CACHE_KEYS = {
  FEATURED_SERVICES: 'tubarrio_featured_services',
  ALL_SERVICES: 'tubarrio_all_services',
  SINGLE_SERVICES: 'tubarrio_single_services',
  LAST_FETCH_TIME: 'tubarrio_last_fetch_time',
};

// NUEVO: Cache persistente entre sesiones
const PERSISTENT_CACHE_KEYS = {
  CORE_SERVICES: 'tubarrio_core_services_v2'
};

export const useServiceCache = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Función optimizada para verificar cache
  const isCacheValid = useCallback((timestamp: number, expiryTime: number): boolean => {
    // Agregar margen de 5 minutos para evitar recargas innecesarias
    return Date.now() - timestamp < (expiryTime - 300000);
  }, []);

  // Función para limpiar cache expirado
  const cleanExpiredCache = useCallback(() => {
    if (!isClient) return;

    try {
      const keys = Object.values(CACHE_KEYS);
      keys.forEach(key => {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const data = JSON.parse(cached);
            if (data.timestamp && !isCacheValid(data.timestamp, CACHE_EXPIRY.ALL_SERVICES)) {
              localStorage.removeItem(key);
              console.log(`🧹 Cache expirado eliminado: ${key}`);
            }
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Error limpiando cache:', error);
    }
  }, [isClient, isCacheValid]);

  // NUEVA FUNCIÓN: Cargar datos iniciales desde cache persistente
  const loadPersistentCache = useCallback((): Service[] | null => {
    if (!isClient) return null;

    try {
      const cached = localStorage.getItem(PERSISTENT_CACHE_KEYS.CORE_SERVICES);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);
      
      // Cache persistente nunca expira completamente
      // pero verificamos versión
      if (cacheData.version !== CACHE_VERSION) {
        localStorage.removeItem(PERSISTENT_CACHE_KEYS.CORE_SERVICES);
        return null;
      }

      console.log('📦 Usando cache persistente de servicios');
      return cacheData.data;
    } catch (error) {
      console.warn('Error leyendo cache persistente:', error);
      return null;
    }
  }, [isClient]);

  // NUEVA FUNCIÓN: Guardar datos en cache persistente
  const saveToPersistentCache = useCallback((services: Service[]) => {
    if (!isClient) return;

    try {
      const cacheData: CacheData = {
        data: services,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      localStorage.setItem(PERSISTENT_CACHE_KEYS.CORE_SERVICES, JSON.stringify(cacheData));
      console.log(`💾 Servicios guardados en cache persistente (${services.length} servicios)`);
    } catch (error) {
      console.warn('Error guardando cache persistente:', error);
    }
  }, [isClient]);

  // Servicios destacados
  const getFeaturedServicesFromCache = useCallback((): Service[] | null => {
    if (!isClient) return null;

    try {
      const cached = localStorage.getItem(CACHE_KEYS.FEATURED_SERVICES);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);
      
      if (cacheData.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEYS.FEATURED_SERVICES);
        return null;
      }

      if (isCacheValid(cacheData.timestamp, CACHE_EXPIRY.FEATURED)) {
        console.log('📦 Usando servicios destacados desde cache localStorage');
        return cacheData.data;
      }

      localStorage.removeItem(CACHE_KEYS.FEATURED_SERVICES);
      return null;
    } catch (error) {
      console.warn('Error leyendo cache de servicios destacados:', error);
      return null;
    }
  }, [isClient, isCacheValid]);

  const setFeaturedServicesCache = useCallback((services: Service[]) => {
    if (!isClient) return;

    try {
      const cacheData: CacheData = {
        data: services,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      localStorage.setItem(CACHE_KEYS.FEATURED_SERVICES, JSON.stringify(cacheData));
      console.log(`💾 Servicios destacados guardados en cache (${services.length} servicios)`);
    } catch (error) {
      console.warn('Error guardando cache de servicios destacados:', error);
    }
  }, [isClient]);

  // Todos los servicios
  const getAllServicesFromCache = useCallback((): Service[] | null => {
    if (!isClient) return null;

    try {
      const cached = localStorage.getItem(CACHE_KEYS.ALL_SERVICES);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);
      
      if (cacheData.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEYS.ALL_SERVICES);
        return null;
      }

      if (isCacheValid(cacheData.timestamp, CACHE_EXPIRY.ALL_SERVICES)) {
        console.log('📦 Usando todos los servicios desde cache localStorage');
        return cacheData.data;
      }

      localStorage.removeItem(CACHE_KEYS.ALL_SERVICES);
      return null;
    } catch (error) {
      console.warn('Error leyendo cache de todos los servicios:', error);
      return null;
    }
  }, [isClient, isCacheValid]);

  // MODIFICAR setAllServicesCache para guardar también en persistente
  const setAllServicesCache = useCallback((services: Service[]) => {
    if (!isClient) return;

    try {
      const cacheData: CacheData = {
        data: services,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      localStorage.setItem(CACHE_KEYS.ALL_SERVICES, JSON.stringify(cacheData));
      
      // GUARDAR TAMBIÉN EN CACHE PERSISTENTE
      saveToPersistentCache(services);
      
      console.log(`💾 Todos los servicios guardados en cache (${services.length} servicios)`);
    } catch (error) {
      console.warn('Error guardando cache de todos los servicios:', error);
    }
  }, [isClient, saveToPersistentCache]);

  // Servicios individuales
  const getSingleServiceFromCache = useCallback((serviceId: string): Service | null => {
    if (!isClient) return null;

    try {
      const cached = localStorage.getItem(CACHE_KEYS.SINGLE_SERVICES);
      if (!cached) return null;

      const cacheData: SingleServiceCache = JSON.parse(cached);
      const serviceCache = cacheData[serviceId];
      
      if (!serviceCache) return null;

      if (isCacheValid(serviceCache.timestamp, CACHE_EXPIRY.SINGLE_SERVICE)) {
        console.log(`📦 Usando servicio ${serviceId} desde cache localStorage`);
        return serviceCache.data;
      }

      // Eliminar solo este servicio del cache
      delete cacheData[serviceId];
      localStorage.setItem(CACHE_KEYS.SINGLE_SERVICES, JSON.stringify(cacheData));
      return null;
    } catch (error) {
      console.warn(`Error leyendo cache del servicio ${serviceId}:`, error);
      return null;
    }
  }, [isClient, isCacheValid]);

  const setSingleServiceCache = useCallback((serviceId: string, service: Service) => {
    if (!isClient) return;

    try {
      const cached = localStorage.getItem(CACHE_KEYS.SINGLE_SERVICES);
      const cacheData: SingleServiceCache = cached ? JSON.parse(cached) : {};
      
      cacheData[serviceId] = {
        data: service,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(CACHE_KEYS.SINGLE_SERVICES, JSON.stringify(cacheData));
      console.log(`💾 Servicio ${serviceId} guardado en cache`);
    } catch (error) {
      console.warn(`Error guardando cache del servicio ${serviceId}:`, error);
    }
  }, [isClient]);

  // Función para limpiar todo el cache
  const clearAllCache = useCallback(() => {
    if (!isClient) return;

    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('🧹 Todo el cache ha sido limpiado');
    } catch (error) {
      console.warn('Error limpiando cache:', error);
    }
  }, [isClient]);

  // Función para obtener estadísticas del cache
  const getCacheStats = useCallback(() => {
    if (!isClient) return null;

    try {
      const stats = {
        featuredServices: 0,
        allServices: 0,
        singleServices: 0,
        totalSize: 0,
      };

      // Servicios destacados
      const featured = localStorage.getItem(CACHE_KEYS.FEATURED_SERVICES);
      if (featured) {
        const data = JSON.parse(featured);
        stats.featuredServices = data.data?.length || 0;
        stats.totalSize += featured.length;
      }

      // Todos los servicios
      const all = localStorage.getItem(CACHE_KEYS.ALL_SERVICES);
      if (all) {
        const data = JSON.parse(all);
        stats.allServices = data.data?.length || 0;
        stats.totalSize += all.length;
      }

      // Servicios individuales
      const single = localStorage.getItem(CACHE_KEYS.SINGLE_SERVICES);
      if (single) {
        const data = JSON.parse(single);
        stats.singleServices = Object.keys(data).length;
        stats.totalSize += single.length;
      }

      return stats;
    } catch (error) {
      console.warn('Error obteniendo estadísticas del cache:', error);
      return null;
    }
  }, [isClient]);

  // Nueva función para verificar rápidamente si un servicio está en cache
  const isServiceInCache = useCallback((serviceId: string): boolean => {
    if (!isClient) return false;
    return getSingleServiceFromCache(serviceId) !== null;
  }, [isClient, getSingleServiceFromCache]);

  // Función para obtener múltiples servicios del cache a la vez
  const getMultipleServicesFromCache = useCallback((serviceIds: string[]): Service[] => {
    if (!isClient) return [];
    
    const services: Service[] = [];
    serviceIds.forEach(serviceId => {
      const cachedService = getSingleServiceFromCache(serviceId);
      if (cachedService) {
        services.push(cachedService);
      }
    });
    
    return services;
  }, [isClient, getSingleServiceFromCache]);

  // Limpiar cache expirado al inicializar
  useEffect(() => {
    if (isClient) {
      cleanExpiredCache();
    }
  }, [isClient, cleanExpiredCache]);

  return {
    // Servicios destacados
    getFeaturedServicesFromCache,
    setFeaturedServicesCache,
    
    // Todos los servicios
    getAllServicesFromCache,
    setAllServicesCache,
    
    // Servicios individuales
    getSingleServiceFromCache,
    setSingleServiceCache,
    
    // Cache persistente
    loadPersistentCache,
    saveToPersistentCache,
    
    // Utilidades
    clearAllCache,
    cleanExpiredCache,
    getCacheStats,
    isServiceInCache,
    getMultipleServicesFromCache,
    isClient,
  };
};

export default useServiceCache;