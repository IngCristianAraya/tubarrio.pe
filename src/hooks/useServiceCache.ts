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
const CACHE_EXPIRY = {
  FEATURED: 30 * 60 * 1000, // 30 minutos para servicios destacados
  ALL_SERVICES: 60 * 60 * 1000, // 1 hora para todos los servicios
  SINGLE_SERVICE: 24 * 60 * 60 * 1000, // 24 horas para servicios individuales
};

const CACHE_KEYS = {
  FEATURED_SERVICES: 'tubarrio_featured_services',
  ALL_SERVICES: 'tubarrio_all_services',
  SINGLE_SERVICES: 'tubarrio_single_services',
  LAST_FETCH_TIME: 'tubarrio_last_fetch_time',
};

export const useServiceCache = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Función para verificar si el cache es válido
  const isCacheValid = useCallback((timestamp: number, expiryTime: number): boolean => {
    return Date.now() - timestamp < expiryTime;
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

  const setAllServicesCache = useCallback((services: Service[]) => {
    if (!isClient) return;

    try {
      const cacheData: CacheData = {
        data: services,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      localStorage.setItem(CACHE_KEYS.ALL_SERVICES, JSON.stringify(cacheData));
      console.log(`💾 Todos los servicios guardados en cache (${services.length} servicios)`);
    } catch (error) {
      console.warn('Error guardando cache de todos los servicios:', error);
    }
  }, [isClient]);

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
    
    // Utilidades
    clearAllCache,
    cleanExpiredCache,
    getCacheStats,
    isClient,
  };
};

export default useServiceCache;