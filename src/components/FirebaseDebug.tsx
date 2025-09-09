'use client';

import { useEffect, useState } from 'react';
import { db, auth, app } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

interface FirebaseStatus {
  app: boolean;
  db: boolean;
  auth: boolean;
  canConnect: boolean;
  error: string | null;
  servicesCount: number;
}

export default function FirebaseDebug() {
  const [status, setStatus] = useState<FirebaseStatus>({
    app: false,
    db: false,
    auth: false,
    canConnect: false,
    error: null,
    servicesCount: 0
  });

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        console.log('🔍 Verificando Firebase...');
        console.log('App:', app);
        console.log('DB:', db);
        console.log('Auth:', auth);

        const newStatus: FirebaseStatus = {
          app: !!app,
          db: !!db,
          auth: !!auth,
          canConnect: false,
          error: null,
          servicesCount: 0
        };

        if (db) {
          try {
            console.log('🔗 Probando conexión a Firestore...');
            const servicesRef = collection(db, 'services');
            const snapshot = await getDocs(servicesRef);
            newStatus.canConnect = true;
            newStatus.servicesCount = snapshot.size;
            console.log(`✅ Conexión exitosa! ${snapshot.size} servicios encontrados`);
          } catch (error: any) {
            console.error('❌ Error al conectar con Firestore:', error);
            newStatus.error = error.message;
          }
        } else {
          newStatus.error = 'Firestore no inicializado';
        }

        setStatus(newStatus);
      } catch (error: any) {
        console.error('❌ Error general:', error);
        setStatus(prev => ({ ...prev, error: error.message }));
      }
    };

    checkFirebase();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-lg mb-2">🔥 Firebase Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>App:</span>
          <span className={status.app ? 'text-green-600' : 'text-red-600'}>
            {status.app ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Firestore:</span>
          <span className={status.db ? 'text-green-600' : 'text-red-600'}>
            {status.db ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Auth:</span>
          <span className={status.auth ? 'text-green-600' : 'text-red-600'}>
            {status.auth ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Conexión:</span>
          <span className={status.canConnect ? 'text-green-600' : 'text-red-600'}>
            {status.canConnect ? '✅' : '❌'}
          </span>
        </div>
        
        {status.canConnect && (
          <div className="flex justify-between">
            <span>Servicios:</span>
            <span className="text-blue-600">{status.servicesCount}</span>
          </div>
        )}
        
        {status.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
            <strong>Error:</strong> {status.error}
          </div>
        )}
      </div>
      
      <button 
        onClick={() => window.location.reload()} 
        className="mt-3 w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        Recargar
      </button>
    </div>
  );
}