import { useCallback, useEffect, useState } from 'react';
import { useServiceAnalytics } from './useServiceAnalytics';
import { useServiceCache } from './useServiceCache';
import { Service } from '@/types/service';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface PreloadStatus {
  isPreloading: boolean;
  preloadedCount: number;
  totalToPreload: number;
  lastPreloadTime: number | null;
}

const PRELOAD_CONFIG = {
  PRELOAD_INTERVAL: 30 * 60 * 1000, // 30 minutos
  MAX_CONCURRENT_PRELOADS: 3, // Máximo 3 servicios precargando simultáneamente
  PRELOAD_DELAY: 2000, // Delay entre precargas para no sobrecargar
  ENABLE_BACKGROUND_PRELOAD: true
};

export const useServicePreloader = () => {
  const { getServicesToPreload, getAnalyticsStats } = useServiceAnalytics();
  const { getSingleServiceFromCache, setSingleServiceCache } = useServiceCache();
  
  const [preloadStatus, setPreloadStatus] = useState<PreloadStatus>({
    isPreloading: false,
    preloadedCount: 0,
    totalToPreload: 0,
    lastPreloadTime: null
  });

  const isClient = typeof window !== 'undefined';

  // Función para precargar un servicio individual
  const preloadSingleService = useCallback(async (serviceId: string): Promise<boolean> => {
    try {
      // Verificar si ya está en cache
      const cached = getSingleServiceFromCache(serviceId);
      if (cached) {
        console.log(`⚡ Servicio ${serviceId} ya está en cache, saltando precarga`);
        return true;
      }

      if (!db) {
        console.warn('Firebase no disponible para precarga');
        return false;
      }

      console.log(`🔄 Precargando servicio: ${serviceId}`);
      
      const serviceDocRef = doc(db, 'services', serviceId);
      const serviceDoc = await getDoc(serviceDocRef);
      
      if (!serviceDoc.exists()) {
        console.warn(`Servicio ${serviceId} no encontrado para precarga`);
        return false;
      }
      
      const data = serviceDoc.data();
      const service: Service = {
        id: serviceDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as Service;
      
      // Guardar en cache
      setSingleServiceCache(serviceId, service);
      
      console.log(`✅ Servicio ${serviceId} precargado exitosamente`);
      return true;
      
    } catch (error) {
      console.error(`❌ Error precargando servicio ${serviceId}:`, error);
      return false;
    }
  }, [getSingleServiceFromCache, setSingleServiceCache]);

  // Función para precargar servicios populares
  const preloadPopularServices = useCallback(async (force = false): Promise<void> => {
    if (!isClient || !PRELOAD_CONFIG.ENABLE_BACKGROUND_PRELOAD) return;

    const now = Date.now();
    const lastPreload = preloadStatus.lastPreloadTime;
    
    // Verificar si es necesario precargar
    if (!force && lastPreload && (now - lastPreload) < PRELOAD_CONFIG.PRELOAD_INTERVAL) {
      console.log('⏰ Precarga no necesaria aún, esperando intervalo');
      return;
    }

    const servicesToPreload = getServicesToPreload();
    
    if (servicesToPreload.length === 0) {
      console.log('📊 No hay servicios populares para precargar');
      return;
    }

    console.log(`🚀 Iniciando precarga de ${servicesToPreload.length} servicios populares`);
    
    setPreloadStatus(prev => ({
      ...prev,
      isPreloading: true,
      preloadedCount: 0,
      totalToPreload: servicesToPreload.length,
      lastPreloadTime: now
    }));

    let preloadedCount = 0;
    const maxConcurrent = PRELOAD_CONFIG.MAX_CONCURRENT_PRELOADS;
    
    // Precargar en lotes para no sobrecargar
    for (let i = 0; i < servicesToPreload.length; i += maxConcurrent) {
      const batch = servicesToPreload.slice(i, i + maxConcurrent);
      
      // Precargar lote actual
      const promises = batch.map(serviceId => preloadSingleService(serviceId));
      const results = await Promise.allSettled(promises);
      
      // Contar exitosos
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          preloadedCount++;
        }
      });
      
      // Actualizar estado
      setPreloadStatus(prev => ({
        ...prev,
        preloadedCount
      }));
      
      // Delay entre lotes para no sobrecargar
      if (i + maxConcurrent < servicesToPreload.length) {
        await new Promise(resolve => setTimeout(resolve, PRELOAD_CONFIG.PRELOAD_DELAY));
      }
    }
    
    setPreloadStatus(prev => ({
      ...prev,
      isPreloading: false
    }));
    
    console.log(`✅ Precarga completada: ${preloadedCount}/${servicesToPreload.length} servicios`);
  }, [isClient, preloadStatus.lastPreloadTime, getServicesToPreload, preloadSingleService]);

  // Función para precargar servicios de una categoría específica
  const preloadCategoryServices = useCallback(async (category: string, limit = 5): Promise<void> => {
    console.log(`🔄 Precargando servicios de categoría: ${category}`);
    
    const stats = getAnalyticsStats();
    const categoryServices = stats.popularServices
      .filter(service => {
        // Aquí podrías filtrar por categoría si tienes esa información en analytics
        return true; // Por ahora precargar todos los populares
      })
      .slice(0, limit)
      .map(service => service.serviceId);
    
    if (categoryServices.length === 0) {
      console.log(`📊 No hay servicios populares en categoría: ${category}`);
      return;
    }
    
    const promises = categoryServices.map(serviceId => preloadSingleService(serviceId));
    const results = await Promise.allSettled(promises);
    
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value
    ).length;
    
    console.log(`✅ Precarga de categoría ${category}: ${successCount}/${categoryServices.length} servicios`);
  }, [getAnalyticsStats, preloadSingleService]);

  // Función para obtener estadísticas de precarga
  const getPreloadStats = useCallback(() => {
    const analyticsStats = getAnalyticsStats();
    
    return {
      ...preloadStatus,
      analyticsStats,
      isPreloadEnabled: PRELOAD_CONFIG.ENABLE_BACKGROUND_PRELOAD,
      nextPreloadTime: preloadStatus.lastPreloadTime 
        ? preloadStatus.lastPreloadTime + PRELOAD_CONFIG.PRELOAD_INTERVAL
        : null
    };
  }, [preloadStatus, getAnalyticsStats]);

  // Función para forzar precarga inmediata
  const forcePreload = useCallback(async (): Promise<void> => {
    console.log('🔄 Forzando precarga inmediata...');
    await preloadPopularServices(true);
  }, [preloadPopularServices]);

  // Función para habilitar/deshabilitar precarga automática
  const toggleAutoPreload = useCallback((enabled: boolean) => {
    PRELOAD_CONFIG.ENABLE_BACKGROUND_PRELOAD = enabled;
    console.log(`🔧 Precarga automática ${enabled ? 'habilitada' : 'deshabilitada'}`);
  }, []);

  // Efecto para iniciar precarga automática
  useEffect(() => {
    if (!isClient || !PRELOAD_CONFIG.ENABLE_BACKGROUND_PRELOAD) return;

    // Delay inicial para no interferir con la carga inicial de la página
    const initialDelay = setTimeout(() => {
      preloadPopularServices();
    }, 5000); // 5 segundos después de montar el componente

    // Intervalo para precarga periódica
    const interval = setInterval(() => {
      preloadPopularServices();
    }, PRELOAD_CONFIG.PRELOAD_INTERVAL);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [isClient, preloadPopularServices]);

  return {
    preloadStatus,
    preloadPopularServices,
    preloadSingleService,
    preloadCategoryServices,
    getPreloadStats,
    forcePreload,
    toggleAutoPreload,
    isPreloading: preloadStatus.isPreloading
  };
};

export default useServicePreloader;