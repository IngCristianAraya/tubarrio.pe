'use client';

import React, { useEffect, useState } from 'react';
import { useServices } from '@/context/ServicesContext';

export default function DebugInfo() {
  const [isClient, setIsClient] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);
  
  // Intentar obtener el contexto
  let contextData = null;
  try {
    const context = useServices();
    contextData = {
      servicesCount: context.services?.length || 0,
      loading: context.loading,
      error: context.error,
      usingMockData: context.usingMockData
    };
  } catch (error) {
    // El error se manejará en el render
  }

  useEffect(() => {
    setIsClient(true);
    console.log('🔍 DebugInfo montado');
    console.log('🔍 NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
    console.log('🔍 NEXT_PUBLIC_FIRESTORE_READS_ENABLED:', process.env.NEXT_PUBLIC_FIRESTORE_READS_ENABLED);
    console.log('🔍 Entorno: Cliente');
    
    if (contextData) {
      console.log('🔍 Contexto obtenido exitosamente:', contextData);
    }
  }, []);

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">🔍 Debug Info Completo</h3>
      <div className="space-y-2 text-sm">
        <div className="bg-white p-2 rounded">
          <p><strong>Entorno:</strong> {isClient ? 'Cliente ✅' : 'Servidor'}</p>
          <p><strong>Firebase Deshabilitado:</strong> {process.env.NEXT_PUBLIC_DISABLE_FIREBASE || 'undefined'}</p>
          <p><strong>Firestore Reads:</strong> {process.env.NEXT_PUBLIC_FIRESTORE_READS_ENABLED || 'undefined'}</p>
        </div>
        
        <div className="bg-white p-2 rounded">
          <p><strong>Estado del Contexto:</strong></p>
          {contextError ? (
            <p className="text-red-600">❌ Error: {contextError}</p>
          ) : contextData ? (
            <div className="ml-4">
              <p>✅ Contexto cargado</p>
              <p>• Servicios: {contextData.servicesCount}</p>
              <p>• Cargando: {contextData.loading ? 'Sí' : 'No'}</p>
              <p>• Error: {contextData.error || 'Ninguno'}</p>
              <p>• Usando Mock: {contextData.usingMockData ? 'Sí' : 'No'}</p>
            </div>
          ) : (
            <p className="text-gray-600">⏳ Verificando contexto...</p>
          )}
        </div>
      </div>
    </div>
  );
}