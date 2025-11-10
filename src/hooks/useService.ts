import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Service } from '@/types/service';
import { getFallbackServiceById } from '../lib/firebase/fallback';
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
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = await getSupabaseClient();
        console.log(`🔍 [Supabase] Buscando servicio por slug/ID: ${id}`);
        let qb = supabase
          .from('services')
          .select('*')
          .or(`slug.eq.${id},id.eq.${id}`)
          .limit(1);
        const country = getCountry();
        if (country) {
          qb = qb.eq('country', country);
        }
        const { data, error } = await qb;
        if (error) {
          throw error;
        }
        const row = (data || [])[0];
        if (!row) {
          throw { code: 'not-found', message: `Servicio ${id} no encontrado en Supabase` };
        }
        const serviceData: Service = {
          id: row.id?.toString?.() || row.uid || id,
          slug: row.slug || row.id?.toString?.() || id,
          name: row.name || 'Servicio sin nombre',
          description: row.description || 'Sin descripción disponible',
          category: row.category || 'Sin categoría',
          categorySlug: row.categorySlug || row.category_slug || row.category?.toLowerCase?.().replace?.(/\s+/g, '-') || 'sin-categoria',
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

      console.log(`🔍 Buscando servicio con ID: ${id}`);
      
      // Asegurarse de que db esté inicializado
      let firestoreDb;
      try {
        firestoreDb = db.instance;
        logger.debug('Firestore está disponible');
      } catch (error) {
        logger.error('Error al obtener la instancia de Firestore:', error);
        throw { 
          code: 'db-not-initialized', 
          message: 'No se pudo inicializar Firestore',
          originalError: error 
        };
      }
      
      // Usar la colección 'services' (en inglés) como principal
      const docRef = doc(firestoreDb, 'services', id);
      logger.debug(`Buscando servicio en colección 'services': ${id}`);
      
      logger.debug('Obteniendo documento de Firestore...');
      let docSnap = await getDoc(docRef);
      logger.debug('Documento obtenido:', { 
        exists: docSnap.exists(), 
        id: docSnap.id 
      });
      
      if (!docSnap.exists()) {
        logger.warn(`Servicio ${id} no encontrado en 'services', intentando con 'servicios'...`);
        
        // Intentar con la colección 'servicios' (español) si no se encuentra en 'services'
        const spanishDocRef = doc(firestoreDb, 'servicios', id);
        logger.debug(`Buscando servicio en colección 'servicios': ${id}`);
        const spanishDocSnap = await getDoc(spanishDocRef);
        
        if (!spanishDocSnap.exists()) {
          logger.warn(`Servicio ${id} no encontrado en Firestore, buscando en respaldo local...`);
          const fallbackService = getFallbackServiceById(id);
          
          if (!fallbackService) {
            const error = { 
              code: 'not-found', 
              message: `Servicio ${id} no encontrado` 
            };
            logger.error('Error al buscar servicio:', error);
            throw error;
          }
          
          logger.debug(`Usando datos de respaldo local para el servicio ${id}`);
          setIsFallbackData(true);
          return fallbackService;
        }
        
        // Usar el documento de la colección 'servicios' si se encuentra allí
        logger.debug(`Servicio ${id} encontrado en colección 'servicios'`);
        docSnap = spanishDocSnap;
      }
      
      const data = docSnap.data();
      if (!data) {
        const error = { 
          code: 'no-data', 
          message: 'Datos del servicio no disponibles' 
        };
        logger.error(`Datos del servicio ${id} están vacíos`, error);
        throw error;
      }
      
      logger.debug(`Servicio cargado: ${data.name || 'Sin nombre'} (ID: ${id})`);
      setIsFallbackData(false);
      
      const serviceData: Service = {
        id: docSnap.id,
        slug: data.slug || docSnap.id, // Use provided slug or fallback to ID
        name: data.name || 'Servicio sin nombre',
        description: data.description || 'Sin descripción disponible',
        category: data.category || 'Sin categoría',
        categorySlug: data.categorySlug || data.category?.toLowerCase().replace(/\s+/g, '-') || 'sin-categoria',
        image: data.image || '/images/placeholder-service.jpg',
        images: data.images || [data.image || '/images/placeholder-service.jpg'],
        rating: data.rating || 0,
        location: data.location || 'Ubicación no especificada',
        contactUrl: data.contactUrl || '',
        detailsUrl: data.detailsUrl || '',
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      };
      
      return serviceData;
      
    } catch (error: any) {
      logger.error(`Error al cargar el servicio ${serviceId}:`, {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
      
      // Siempre intentar con datos de respaldo en caso de cualquier error
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
