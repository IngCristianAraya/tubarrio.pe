import { useCallback, useEffect, useState } from 'react';
import { generateSlug } from '@/lib/utils';
import { useServiceAnalytics } from './useServiceAnalytics';
import { useServiceCache } from './useServiceCache';
import { Service } from '@/types/service';

interface PreloadStatus {
  isPreloading: boolean;
  preloadedCount: number;
  totalToPreload: number;
  lastPreloadTime: number | null;
}

const PRELOAD_CONFIG = {
  PRELOAD_INTERVAL: 120 * 60 * 1000, // 2 HORAS entre precargas
  MAX_CONCURRENT_PRELOADS: 1, // SOLO 1 precarga a la vez
  PRELOAD_DELAY: 5000, // 5 segundos entre precargas
  ENABLE_BACKGROUND_PRELOAD: false, // DESACTIVADO por defecto
  MIN_TIME_BETWEEN_PRELOADS: 10 * 60 * 1000 // 10 minutos mínimo
};

// Optimización final aplicada

export const useServicePreloader = () => {
  const { getServicesToPreload, getAnalyticsStats } = useServiceAnalytics();
  const { getSingleServiceFromCache, setSingleServiceCache, getAllServicesFromCache } = useServiceCache();
  
  const [preloadStatus, setPreloadStatus] = useState<PreloadStatus>({
    isPreloading: false,
    preloadedCount: 0,
    totalToPreload: 0,
    lastPreloadTime: null
  });

  const [lastPreloadAttempt, setLastPreloadAttempt] = useState<number>(0);
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

      console.log(`🔄 Precargando servicio: ${serviceId}`);

      // Supabase-only: leer servicio por ID
      const { getSupabaseClient } = await import('@/lib/supabase/client');
      const supabase = await getSupabaseClient();
      let { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .limit(1);

      if (error) {
        console.error('❌ Error leyendo servicio desde Supabase:', error);
        return false;
      }

      let row = (data || [])[0];
      if (!row) {
        // Intento alterno por uid
        const alt = await supabase
          .from('services')
          .select('*')
          .eq('uid', serviceId)
          .limit(1);
        if (alt.error) {
          console.error('❌ Error alterno leyendo servicio por uid:', alt.error);
          return false;
        }
        row = (alt.data || [])[0];
        if (!row) {
          console.warn(`Servicio ${serviceId} no encontrado en Supabase`);
          return false;
        }
      }

      const dataObj = row as any;
      const service: Service = {
        id: dataObj.id?.toString?.() || dataObj.uid || serviceId,
        slug: dataObj.slug || serviceId,
        name: dataObj.name || 'Servicio sin nombre',
        description: dataObj.description || 'Sin descripción',
        category: dataObj.category || 'Sin categoría',
        categorySlug: (() => {
          const raw = dataObj.categorySlug || dataObj.category || '';
          if (typeof raw === 'string') return generateSlug(raw);
          if (raw && typeof raw === 'object') {
            const maybe = (raw as any).name || (raw as any).label || String(raw);
            return generateSlug(maybe);
          }
          return 'sin-categoria';
        })(),
        rating: dataObj.rating || 0,
        image: dataObj.image || '/images/placeholder-service.jpg',
        images: dataObj.images || [dataObj.image || '/images/placeholder-service.jpg'],
        ...dataObj,
        createdAt: dataObj.createdAt ? new Date(dataObj.createdAt) : new Date(),
        updatedAt: dataObj.updatedAt ? new Date(dataObj.updatedAt) : new Date()
      };
      
      // Guardar en cache
      setSingleServiceCache(serviceId, service);
      
      console.log(`✅ Servicio ${serviceId} precargado exitosamente`);
      return true;
      
    } catch (error) {
      console.error(`❌ Error precargando servicio ${serviceId}:`, error);
      return false;
    }
  }, [getSingleServiceFromCache, setSingleServiceCache]);

  // NUEVA FUNCIÓN: Precarga ultra-conservadora
  const conservativePreload = useCallback(async (serviceIds: string[]): Promise<void> => {
    if (!isClient || serviceIds.length === 0) return;

    console.log(`🔄 Precarga conservadora iniciada para ${serviceIds.length} servicios`);
    
    let successCount = 0;
    for (const serviceId of serviceIds) {
      // Verificar DOBLE cache antes de precargar
      const cached = getSingleServiceFromCache(serviceId);
      if (cached) {
        console.log(`⚡ Servicio ${serviceId} ya en cache, omitiendo`);
        continue;
      }
      
      // Precarga ultra-lenta con delays
      await new Promise(resolve => setTimeout(resolve, PRELOAD_CONFIG.PRELOAD_DELAY));
      
      try {
        const success = await preloadSingleService(serviceId);
        if (success) successCount++;
      } catch (error) {
        console.warn(`Error precargando ${serviceId}:`, error);
      }
    }
    
    console.log(`✅ Precarga conservadora completada: ${successCount}/${serviceIds.length} éxitos`);
  }, [isClient, preloadSingleService, getSingleServiceFromCache]);

  // REEMPLAZAR preloadPopularServices con versión ultra-optimizada
  const preloadPopularServices = useCallback(async (force = false): Promise<void> => {
    if (!isClient || !PRELOAD_CONFIG.ENABLE_BACKGROUND_PRELOAD) {
      console.log('⏸️ Precarga automática desactivada');
      return;
    }

    const now = Date.now();
    
    // Verificación EXTRA estricta
    if (!force) {
      if (preloadStatus.lastPreloadTime && 
          (now - preloadStatus.lastPreloadTime) < PRELOAD_CONFIG.PRELOAD_INTERVAL) {
        return;
      }
      
      if (now - lastPreloadAttempt < PRELOAD_CONFIG.MIN_TIME_BETWEEN_PRELOADS) {
        return;
      }
    }

    setLastPreloadAttempt(now);
    
    // Obtener servicios para precargar
    const servicesToPreload = getServicesToPreload();
    if (servicesToPreload.length === 0) return;

    // FILTRAR MÁS AGRESIVAMENTE - solo 3 servicios máximo
    const servicesToActuallyPreload = [];
    for (const serviceId of servicesToPreload.slice(0, 3)) { // SOLO 3 servicios
      const cached = getSingleServiceFromCache(serviceId);
      if (!cached) {
        servicesToActuallyPreload.push(serviceId);
      }
    }
    
    if (servicesToActuallyPreload.length === 0) return;

    console.log(`🚀 Precarga ultra-conservadora de ${servicesToActuallyPreload.length} servicios`);
    
    setPreloadStatus(prev => ({
      ...prev,
      isPreloading: true,
      preloadedCount: 0,
      totalToPreload: servicesToActuallyPreload.length,
      lastPreloadTime: now
    }));

    // Usar precarga conservadora
    await conservativePreload(servicesToActuallyPreload);
    
    setPreloadStatus(prev => ({
      ...prev,
      isPreloading: false
    }));
  }, [isClient, preloadStatus.lastPreloadTime, getServicesToPreload, lastPreloadAttempt, conservativePreload, getSingleServiceFromCache]);

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

  // Efecto INICIAL desactivado - precarga manual solamente
  useEffect(() => {
    if (!isClient) return;
    
    console.log('⏸️ Precarga automática desactivada por optimización');
    
    // Solo precargar después de interacción del usuario
    const handleFirstInteraction = () => {
      setTimeout(() => {
        if (PRELOAD_CONFIG.ENABLE_BACKGROUND_PRELOAD) {
          preloadPopularServices();
        }
      }, 30000); // 30 segundos después de la primera interacción
    };
    
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
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
