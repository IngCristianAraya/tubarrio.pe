'use client';

import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { db } from '@/lib/firebase/config';
import FirebaseStatus from './FirebaseStatus';

export default function FirebaseStatusWrapper() {
  // Obtener solo el primer servicio para verificar la conexión
  const { services, loading: servicesLoading, error: servicesError } = useServices();
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    // Verificar si Firebase está disponible
    const checkFirebaseStatus = () => {
      if (!db) {
        setIsUsingFallback(true);
        return;
      }

      // Verificar si hay errores de conexión
      if (servicesError) {
        const errorMessage = servicesError.message || '';
        const isConnectionError = 
          errorMessage.includes('quota') ||
          errorMessage.includes('resource-exhausted') ||
          errorMessage.includes('429') ||
          errorMessage.includes('ERR_ABORTED') ||
          errorMessage.includes('network') ||
          errorMessage.includes('offline');
        
        setIsUsingFallback(isConnectionError);
      } else {
        setIsUsingFallback(false);
      }
    };

    checkFirebaseStatus();
  }, [servicesError, db]);

  // Solo mostrar si estamos usando datos de respaldo
  if (isUsingFallback) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Modo de respaldo:</strong> Mostrando datos locales. La conexión con Firebase se restablecerá automáticamente.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Los datos mostrados son representativos y pueden no estar actualizados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}