'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';

interface FirebaseStatusInfo {
  dbAvailable: boolean;
  envVars: {
    disableFirebase: string | undefined;
    projectId: string | undefined;
    apiKey: string | undefined;
  };
  isClient: boolean;
}

export default function FirebaseStatus() {
  const [status, setStatus] = useState<FirebaseStatusInfo | null>(null);

  useEffect(() => {
    const checkFirebaseStatus = () => {
      const statusInfo: FirebaseStatusInfo = {
        dbAvailable: !!db,
        envVars: {
          disableFirebase: process.env.NEXT_PUBLIC_DISABLE_FIREBASE,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado'
        },
        isClient: typeof window !== 'undefined'
      };
      
      setStatus(statusInfo);
      
      // Log para debug
      console.log('🔍 Firebase Status Check:', statusInfo);
      console.log('🔍 db object:', db);
      console.log('🔍 typeof db:', typeof db);
    };

    checkFirebaseStatus();
  }, []);

  if (!status) {
    return <div className="p-4 bg-gray-100 rounded">Verificando Firebase...</div>;
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <h3 className="font-bold text-blue-800 mb-2">Estado de Firebase</h3>
      <div className="space-y-1 text-sm">
        <div>
          <strong>DB Disponible:</strong> 
          <span className={status.dbAvailable ? 'text-green-600' : 'text-red-600'}>
            {status.dbAvailable ? ' ✅ Sí' : ' ❌ No'}
          </span>
        </div>
        <div>
          <strong>En Cliente:</strong> 
          <span className={status.isClient ? 'text-green-600' : 'text-red-600'}>
            {status.isClient ? ' ✅ Sí' : ' ❌ No'}
          </span>
        </div>
        <div>
          <strong>DISABLE_FIREBASE:</strong> 
          <span className={status.envVars.disableFirebase === 'true' ? 'text-red-600' : 'text-green-600'}>
            {status.envVars.disableFirebase || 'undefined'}
          </span>
        </div>
        <div>
          <strong>Project ID:</strong> 
          <span className={status.envVars.projectId ? 'text-green-600' : 'text-red-600'}>
            {status.envVars.projectId || 'No configurado'}
          </span>
        </div>
        <div>
          <strong>API Key:</strong> 
          <span className={status.envVars.apiKey === 'Configurado' ? 'text-green-600' : 'text-red-600'}>
            {status.envVars.apiKey}
          </span>
        </div>
      </div>
    </div>
  );
}