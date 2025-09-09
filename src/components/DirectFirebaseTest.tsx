'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function DirectFirebaseTest() {
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Verificando...');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    console.log('🔥 DirectFirebaseTest montado en cliente');
    console.log('🔥 db instance:', db);
    
    if (db) {
      setFirebaseStatus('Firebase inicializado ✅');
      loadServicesDirectly();
    } else {
      setFirebaseStatus('Firebase NO inicializado ❌');
      setError('Firebase no está inicializado');
    }
  }, [mounted]);

  const loadServicesDirectly = async () => {
    console.log('🔥 Iniciando carga directa de servicios...');
    setLoading(true);
    setError(null);
    
    try {
      if (!db) {
        throw new Error('Firestore no está disponible');
      }
      
      console.log('🔥 Consultando colección services...');
      const servicesRef = collection(db, 'services');
      const snapshot = await getDocs(servicesRef);
      
      console.log('🔥 Snapshot obtenido:', snapshot.size, 'documentos');
      
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('🔥 Servicios cargados:', servicesData.length);
      console.log('🔥 Primeros 3 servicios:', servicesData.slice(0, 3).map(s => ({ id: s.id, name: s.name })));
      
      setServices(servicesData);
      setFirebaseStatus(`${servicesData.length} servicios cargados ✅`);
      
    } catch (err: any) {
      console.error('🔥 Error cargando servicios:', err);
      setError(err.message);
      setFirebaseStatus('Error en carga ❌');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p>Cargando componente Firebase...</p>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-red-800 mb-3">🔥 Prueba Directa de Firebase</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <strong>Estado Firebase:</strong> {firebaseStatus}
        </div>
        <div>
          <strong>Servicios encontrados:</strong> {services.length}
        </div>
        <div>
          <strong>Cargando:</strong> {loading ? 'Sí ⏳' : 'No'}
        </div>
        <div>
          <strong>Error:</strong> {error || 'Ninguno ✅'}
        </div>
      </div>

      {services.length > 0 && (
        <div className="mb-4">
          <strong>Servicios cargados:</strong>
          <ul className="list-disc list-inside mt-2 max-h-32 overflow-y-auto">
            {services.slice(0, 5).map(service => (
              <li key={service.id} className="text-sm">
                {service.name} - {service.category || 'Sin categoría'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={loadServicesDirectly}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading || !db}
      >
        {loading ? 'Cargando... ⏳' : 'Cargar Servicios Directamente 🔄'}
      </button>
      
      <div className="mt-4 text-xs text-gray-600">
        <p>💡 Revisa la consola del navegador para logs detallados</p>
        <p>🔍 Este componente prueba Firebase directamente sin usar el contexto</p>
      </div>
    </div>
  );
}