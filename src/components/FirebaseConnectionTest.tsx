'use client';

import { useEffect, useState } from 'react';
import { db, initializeFirebase } from '@/lib/firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export default function FirebaseConnectionTest() {
  const [status, setStatus] = useState('Inicializando...');
  const [servicesCount, setServicesCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 FirebaseConnectionTest: Iniciando prueba de conexión...');
        
        // Inicializar Firebase explícitamente
        initializeFirebase();
        
        if (!db) {
          setStatus('❌ Firebase db no disponible');
          setError('Firebase db es null');
          return;
        }
        
        setStatus('🔄 Conectando a Firestore...');
        
        // Probar consulta simple
        const servicesRef = collection(db, 'services');
        const q = query(servicesRef, limit(5));
        const snapshot = await getDocs(q);
        
        setServicesCount(snapshot.size);
        setStatus(`✅ Conectado - ${snapshot.size} servicios encontrados`);
        setError(null);
        
        console.log('🧪 FirebaseConnectionTest: Conexión exitosa', {
          servicesFound: snapshot.size,
          sampleData: snapshot.docs.slice(0, 2).map(doc => ({
            id: doc.id,
            name: doc.data().name
          }))
        });
        
      } catch (err: any) {
        console.error('🧪 FirebaseConnectionTest: Error de conexión:', err);
        setStatus('❌ Error de conexión');
        setError(err.message);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-blue-800 mb-2">🧪 Test de Conexión Firebase</h3>
      <p className="text-sm text-blue-700">
        <strong>Estado:</strong> {status}
      </p>
      {servicesCount > 0 && (
        <p className="text-sm text-green-700">
          <strong>Servicios encontrados:</strong> {servicesCount}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700">
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
}