'use client';

import { useEffect, useState } from 'react';
import { db, app } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function TestFirebase() {
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 Iniciando prueba de Firebase en el cliente...');
    
    // Verificar variables de entorno
    const envVars = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      disableFirebase: process.env.NEXT_PUBLIC_DISABLE_FIREBASE
    };
    
    console.log('📋 Variables de entorno:', envVars);
    
    // Verificar estado de Firebase
    const status = {
      app: !!app,
      db: !!db,
      envVars
    };
    
    console.log('🔥 Estado de Firebase:', status);
    setFirebaseStatus(status);
    
    // Intentar conectar a Firestore
    if (db) {
      console.log('🔄 Intentando conectar a Firestore...');
      
      getDocs(collection(db, 'services'))
        .then((snapshot) => {
          console.log('✅ Conexión exitosa a Firestore');
          console.log('📊 Documentos encontrados:', snapshot.docs.length);
          
          const services = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setServicesData({
            count: snapshot.docs.length,
            services: services.slice(0, 3) // Solo los primeros 3 para mostrar
          });
        })
        .catch((error) => {
          console.error('❌ Error al conectar con Firestore:', error);
          setError(error.message);
        });
    } else {
      console.error('❌ Firestore no está inicializado');
      setError('Firestore no está inicializado');
    }
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Prueba de Firebase</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Estado de Firebase</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(firebaseStatus, null, 2)}
          </pre>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {servicesData && (
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Datos de Firestore</h2>
            <p className="mb-2"><strong>Total de servicios:</strong> {servicesData.count}</p>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(servicesData.services, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}