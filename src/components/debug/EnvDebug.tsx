'use client';

import React, { useEffect, useState } from 'react';

export default function EnvDebug() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Verificando...');

  useEffect(() => {
    // Verificar variables de entorno en el cliente
    const vars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_DISABLE_FIREBASE: process.env.NEXT_PUBLIC_DISABLE_FIREBASE,
      NEXT_PUBLIC_FIRESTORE_READS_ENABLED: process.env.NEXT_PUBLIC_FIRESTORE_READS_ENABLED
    };
    
    setEnvVars(vars);
    
    console.log('=== DEBUG VARIABLES DE ENTORNO (CLIENTE) ===');
    Object.entries(vars).forEach(([key, value]) => {
      console.log(`${key}:`, value || 'undefined');
    });
    
    // Verificar Firebase
    const checkFirebase = async () => {
      try {
        const { initializeFirebase } = await import('../../lib/firebase/config');
        console.log('🔥 Intentando inicializar Firebase desde cliente...');
        const result = await initializeFirebase();
        console.log('✅ Firebase inicializado:', result);
        setFirebaseStatus(`✅ Firebase inicializado: ${result ? 'Éxito' : 'Falló'}`);
      } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        setFirebaseStatus(`❌ Error: ${error}`);
      }
    };
    
    checkFirebase();
  }, []);

  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
  ];

  const missingVars = requiredVars.filter(varName => !envVars[varName]);

  return (
    <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">🔍 Debug Variables de Entorno</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Variables de entorno:</h4>
        {Object.entries(envVars).map(([key, value]) => (
          <p key={key} className={`text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
            <strong>{key}:</strong> {value ? '✅ Configurada' : '❌ No definida'}
          </p>
        ))}
      </div>

      {missingVars.length > 0 && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 rounded">
          <p className="text-red-600 font-semibold">❌ Variables faltantes:</p>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {missingVars.map(varName => (
              <li key={varName}>{varName}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Estado de Firebase:</h4>
        <p className="text-sm">{firebaseStatus}</p>
      </div>

      {missingVars.length === 0 && (
        <div className="p-2 bg-green-100 border border-green-400 rounded">
          <p className="text-green-600 font-semibold">✅ Todas las variables están configuradas</p>
        </div>
      )}
    </div>
  );
}