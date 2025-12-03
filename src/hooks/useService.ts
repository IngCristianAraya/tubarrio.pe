import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { generateSlug } from '@/lib/utils';
import { Service } from '@/types/service';
import { getFallbackServiceById } from '@/lib/fallback';
import { logger } from '@/lib/utils/logger';
import { getDataSource, getCountry } from '@/lib/featureFlags';

interface UseServiceResult {
  service: Service | null;
  loading: boolean;
  error: any;
  isFallbackData: boolean;
}

export const useService = (serviceId?: string): UseServiceResult => {
  const [isFallbackData, setIsFallbackData] = useState(false);
  
  const fetcher = useCallback(async ([_, id]: [string, string]): Promise<Service | null> => {
    if (!id) {
      logger.error('ID de servicio no proporcionado');
      throw { code: 'missing-id', message: 'ID de servicio no proporcionado' };
    }
    
    // Verificar si estamos offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    // Intentar usar datos de fallback primero si estamos offline
    const shouldUseFallback = isOffline;
    
    if (shouldUseFallback) {
      const message = isOffline ? 'Modo offline' : 'Firebase no disponible';
      logger.warn(`${message}, usando datos de respaldo para servicio ${id}`);
      
      const fallbackService = getFallbackServiceById(id);
      if (fallbackService) {
        logger.debug(`Datos de respaldo encontrados para el servicio ${id}`);
        setIsFallbackData(true);
        return fallbackService;
      }
      
      logger.warn(`No se encontraron datos de respaldo para el servicio ${id}`);
    }
    
    try {
      // Si el origen de datos es Supabase, buscar primero allí (por slug o ID)
      if (getDataSource() === 'supabase') {
        // Usar la API del proyecto para centralizar lógica de filtros/país
        console.log(`🔍 [API] Buscando servicio por slug/ID: ${id}`);
        const res = await fetch(`/api/services/${encodeURIComponent(id)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
        });
        if (res.status === 404) {
          throw { code: 'not-found', message: `Servicio ${id} no encontrado` };
        }
        if (!res.ok) {
          const text = await res.text();
          throw { code: 'api-error', message: `Error API: ${text}` };
        }
        const row: any = await res.json();
        if (!row) {
          throw { code: 'not-found', message: `Servicio ${id} no encontrado` };
        }
        const serviceData: Service = {
          id: row.id?.toString?.() || row.uid || id,
          slug: row.slug || row.id?.toString?.() || id,
          name: row.name || 'Servicio sin nombre',
          description: row.description || 'Sin descripción disponible',
          category: row.category || 'Sin categoría',
          categorySlug: (() => {
            const raw = row.categorySlug || row.category_slug || row.category;
            if (typeof raw === 'string') return generateSlug(raw);
            if (raw && typeof raw === 'object') {
              const maybe = (raw as any).name || (raw as any).label || String(raw);
              return generateSlug(maybe);
            }
            return 'sin-categoria';
          })(),
          image: row.image || '/images/placeholder-service.jpg',
          images: row.images || [row.image || '/images/placeholder-service.jpg'],
          rating: row.rating || 0,
          location: row.location || row.address || 'Ubicación no especificada',
          contactUrl: row.contactUrl || row.contact_url || '',
          detailsUrl: row.detailsUrl || row.details_url || '',
          whatsapp: row.whatsapp || '',
          social: row.social || '',
          featured: row.featured || false,
          active: row.active !== false,
          createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
          updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
          ...row,
        } as Service;
        setIsFallbackData(false);
        return serviceData;
      }

      // Si no es Supabase, usar datos de fallback como última opción
      const fallbackService = getFallbackServiceById(id);
      if (fallbackService) {
        setIsFallbackData(true);
        return fallbackService;
      }
      throw { code: 'not-found', message: `Servicio ${id} no encontrado` };
      
    } catch (error: any) {
      logger.error(`Error al cargar el servicio ${serviceId}:`, {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
      
      // Intentar con datos de respaldo en caso de error
      if (serviceId) {
        const fallbackService = getFallbackServiceById(serviceId);
        if (fallbackService) {
          logger.debug(`Firebase falló, usando datos de respaldo para el servicio ${serviceId}`);
          setIsFallbackData(true);
          return fallbackService;
        }
        
        logger.error(`No hay datos de respaldo disponibles para el servicio ${serviceId}`);
      }
      
      // Si no hay datos de respaldo, propagar el error
      const isConnectionError = error.code === 'unavailable' || 
                              error.message?.includes('offline') || 
                              error.message?.includes('failed to get document') || 
                              error.message?.includes('network error') ||
                              error.code === 'permission-denied' ||
                              error.message?.includes('Missing or insufficient permissions');
      
      throw { 
        ...error, 
        isOffline: typeof navigator !== 'undefined' && !navigator.onLine,
        isFallbackData: false,
        message: isConnectionError 
          ? 'Servicio temporalmente no disponible. Mostrando datos locales.'
          : `No se encontró el servicio solicitado (${serviceId})`
      };
    }
  }, [serviceId]);

  const { data: service, error, isValidating } = useSWR<Service | null>(
    serviceId ? ['service', serviceId] : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      onErrorRetry: (err, key, config, revalidate, { retryCount = 0 }) => {
        // No reintentar si el error es 404 o si ya hemos reintentado 3 veces
        if (err?.code === 'not-found' || retryCount >= 3) return;
        
        // Reintentar después de un retraso exponencial (1s, 2s, 4s)
        const timeout = Math.min(1000 * 2 ** retryCount, 10000);
        console.log(`🔄 Reintentando en ${timeout}ms... (${retryCount + 1}/3)`);
        
        setTimeout(() => revalidate({ retryCount: retryCount + 1 }), timeout);
      }
    }
  );
  
  // Verificar si estamos mostrando datos de respaldo
  const isUsingFallback = isFallbackData || 
                         (error?.code === 'not-found' && service) || 
                         (error && service);
  
  return {
    service: service || null,
    loading: isValidating && !service,
    error: error && !service ? error : null,
    isFallbackData: !!isUsingFallback
  };
};

// Alias para compatibilidad
export const useServiceById = useService;
