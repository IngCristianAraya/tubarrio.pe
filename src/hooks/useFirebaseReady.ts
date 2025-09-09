'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';

export function useFirebaseReady() {
  const [isReady, setIsReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      console.log('🔥 useFirebaseReady - Ejecutándose en el servidor, saltando...');
      return;
    }

    // Marcar que estamos en el cliente
    setIsClient(true);
    console.log('🔥 useFirebaseReady - Ejecutándose en el cliente');
    console.log('🔥 NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
    
    // Verificar si Firebase está deshabilitado
    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true') {
      console.log('🔥 Firebase está deshabilitado por configuración - usando servicios locales');
      setIsReady(true);
      return;
    }

    // Firebase está habilitado - siempre marcar como listo para usar fallback
    console.log('🔥 Firebase está habilitado - marcando como listo (con fallback a servicios locales)');
    setIsReady(true);
  }, []);

  return { isReady, isClient };
}