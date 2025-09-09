'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Componente que solo se ejecuta en el cliente
function FirebaseTestClient() {
  const [status, setStatus] = useState('Inicializando...');
  const [services, setServices] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('🧪 ClientOnlyFirebaseTest - useEffect ejecutado');
    console.log('🧪 Window available:', typeof window !== 'undefined');
    
    const testFirebase = async () => {
      try {
        // Importar Firebase dinámicamente solo en el cliente
        const { db } = await import('../lib/firebase/config');
        const { collection, getDocs, limit, query } = await import('firebase/firestore');
        
        console.log('✅ Firebase modules imported');
        console.log('🧪 Firebase db status:', { db: !!db });
        
        if (db) {
          console.log('✅ Firebase disponible, intentando consulta');
          setStatus('Firebase disponible, consultando...');
          
          const servicesRef = collection(db, 'services');
          const q = query(servicesRef, limit(3));
          const snapshot = await getDocs(q);
          
          console.log('🎉 Consulta Firebase exitosa:', snapshot.size);
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setServices(docs);
          setStatus(`Firebase conectado - ${snapshot.size} servicios encontrados`);
        } else {
          console.log('❌ Firebase no disponible');
          setStatus('Firebase no disponible');
        }
      } catch (error) {
        console.error('❌ Error en consulta Firebase:', error);
        setStatus(`Error: ${error}`);
      }
    };
    
    testFirebase();
  }, []);

  if (!mounted) {
    return <div className="p-4 bg-gray-100 border rounded mb-4">Cargando test...</div>;
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
      <h3 className="font-bold text-lg mb-2">🧪 Client-Only Firebase Test</h3>
      <p><strong>Estado:</strong> {status}</p>
      <p><strong>Servicios encontrados:</strong> {services.length}</p>
      {services.length > 0 && (
        <div className="mt-2">
          <strong>Primeros servicios:</strong>
          <ul className="list-disc list-inside">
            {services.slice(0, 3).map((service, index) => (
              <li key={index}>{service.name || service.id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Exportar con dynamic import para evitar SSR
const ClientOnlyFirebaseTest = dynamic(() => Promise.resolve(FirebaseTestClient), {
  ssr: false,
  loading: () => <div className="p-4 bg-gray-100 border rounded mb-4">Cargando Firebase test...</div>
});

export default ClientOnlyFirebaseTest;