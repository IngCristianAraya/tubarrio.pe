'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function ServicesDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServices = async () => {
      try {
        console.log('🔍 ServicesDebug - Iniciando verificación...');
        
        const info: any = {
          timestamp: new Date().toISOString(),
          environment: {
            isClient: typeof window !== 'undefined',
            disableFirebase: process.env.NEXT_PUBLIC_DISABLE_FIREBASE,
            hasDb: !!db,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
          },
          services: {
            count: 0,
            error: null,
            sampleData: []
          }
        };

        if (db) {
          console.log('🔥 Firebase disponible, consultando servicios...');
          const servicesRef = collection(db, 'services');
          const q = query(servicesRef, orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          
          info.services.count = snapshot.size;
          info.services.sampleData = snapshot.docs.slice(0, 3).map(doc => ({
            id: doc.id,
            name: doc.data().name,
            category: doc.data().category,
            active: doc.data().active
          }));
          
          console.log(`✅ ${snapshot.size} servicios encontrados en Firebase`);
        } else {
          info.services.error = 'Firebase db no disponible';
          console.log('❌ Firebase db no disponible');
        }
        
        setDebugInfo(info);
      } catch (error: any) {
        console.error('❌ Error en ServicesDebug:', error);
        setDebugInfo({
          timestamp: new Date().toISOString(),
          error: error.message,
          environment: {
            isClient: typeof window !== 'undefined',
            disableFirebase: process.env.NEXT_PUBLIC_DISABLE_FIREBASE,
            hasDb: !!db
          }
        });
      } finally {
        setLoading(false);
      }
    };

    checkServices();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
        <h3 className="font-bold text-blue-800 mb-2">🔍 Services Debug</h3>
        <p>Verificando servicios...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-4">
      <h3 className="font-bold text-gray-800 mb-2">🔍 Services Debug</h3>
      <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-64">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}