import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Service } from '@/types/service';
import { getFallbackServiceById } from '../lib/firebase/fallback';

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
      console.error('❌ ID de servicio no proporcionado');
      throw { code: 'missing-id', message: 'ID de servicio no proporcionado' };
    }
    
    // Verificar si estamos offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    // Si estamos offline o Firebase no está disponible, usar datos de respaldo de inmediato
    if (isOffline || !db) {
      console.warn(isOffline ? '📴 Modo offline' : '🔌 Firebase no disponible', 
                  `buscando servicio ${id} en datos de respaldo`);
      const fallbackService = getFallbackServiceById(id);
      if (!fallbackService) {
        throw { 
          code: 'not-found', 
          message: 'Servicio no encontrado en datos de respaldo', 
          isOffline 
        };
      }
      setIsFallbackData(true);
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
        setIsFallbackData(true);
        return fallbackService;
      }
      
      const data = docSnap.data();
      if (!data) {
        console.error(`❌ Datos del servicio ${id} están vacíos`);
        throw { code: 'no-data', message: 'Datos del servicio no disponibles' };
      }
      
      console.log(`✅ Servicio cargado: ${data.name || 'Sin nombre'} (ID: ${id})`);
      setIsFallbackData(false);
      
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
      console.warn(`⚠️ Intento de carga fallido para servicio ${serviceId}:`, error.message);
      
      // Intentar con datos de respaldo en caso de error
      const fallbackService = getFallbackServiceById(serviceId || '');
      if (fallbackService) {
        console.log('🔄 Usando datos de respaldo para el servicio', serviceId);
        setIsFallbackData(true);
        return fallbackService;
      }
      
      // Si no hay datos de respaldo, verificar si es un error de conexión
      const isConnectionError = error.code === 'unavailable' || 
                              error.message?.includes('offline') || 
                              error.message?.includes('failed to get document') || 
                              error.message?.includes('network error');
      
      if (isConnectionError) {
        console.warn('🔌 Problema de conexión, no se encontraron datos de respaldo');
      } else {
        console.error(`❌ No se pudo cargar el servicio ${serviceId} y no hay datos de respaldo`);
      }
      
      // Propagar el error con información adicional
      throw { 
        ...error, 
        isOffline: typeof navigator !== 'undefined' && !navigator.onLine,
        isFallbackData: false,
        message: isConnectionError 
          ? 'No se pudo conectar al servidor. Por favor verifica tu conexión.'
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
