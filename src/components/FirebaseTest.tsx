'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase/config';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Inicializando...');
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    console.log('🧪 FirebaseTest - useEffect ejecutado');
    console.log('🧪 Firebase db status:', { db: !!db, isClient: typeof window !== 'undefined' });
    
    if (typeof window !== 'undefined') {
      console.log('✅ Cliente detectado');
      setStatus('Cliente detectado');
      
      if (db) {
        console.log('✅ Firebase disponible, intentando consulta');
        setStatus('Firebase disponible, consultando...');
        
        const testFirebase = async () => {
          try {
            const servicesRef = collection(db, 'services');
            const q = query(servicesRef, limit(3));
            const snapshot = await getDocs(q);
            
            console.log('🎉 Consulta Firebase exitosa:', snapshot.size);
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(docs);
            setStatus(`Firebase conectado - ${snapshot.size} servicios encontrados`);
          } catch (error) {
            console.error('❌ Error en consulta Firebase:', error);
            setStatus(`Error: ${error}`);
          }
        };
        
        testFirebase();
      } else {
        console.log('❌ Firebase no disponible');
        setStatus('Firebase no disponible');
      }
    } else {
      console.log('❌ Ejecutándose en servidor');
      setStatus('Ejecutándose en servidor');
    }
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
      <h3 className="font-bold text-lg mb-2">🧪 Firebase Test</h3>
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