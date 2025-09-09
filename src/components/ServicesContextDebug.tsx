'use client';

import { useServices } from '@/context/ServicesContext';
import { useEffect } from 'react';

export default function ServicesContextDebug() {
  const {
    services,
    loading,
    error,
    usingMockData,
    refreshServices,
    loadServicesFromFirestore
  } = useServices();

  useEffect(() => {
    console.log('🔍 ServicesContextDebug - Estado completo:', {
      servicesCount: services.length,
      loading,
      error,
      usingMockData,
      services: services.slice(0, 3).map(s => ({ id: s.id, name: s.name }))
    });
  }, [services, loading, error, usingMockData]);

  const handleForceRefresh = async () => {
    console.log('🔄 Forzando refresh desde debug...');
    try {
      await refreshServices(true);
    } catch (err) {
      console.error('Error en refresh:', err);
    }
  };

  const handleFirestoreLoad = async () => {
    console.log('🔥 Forzando carga desde Firestore...');
    try {
      await loadServicesFromFirestore(true);
    } catch (err) {
      console.error('Error en Firestore load:', err);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">Debug del Contexto de Servicios</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <strong>Servicios cargados:</strong> {services.length}
        </div>
        <div>
          <strong>Estado:</strong> {loading ? 'Cargando...' : 'Listo'}
        </div>
        <div>
          <strong>Fuente de datos:</strong> {usingMockData ? 'Mock/Prueba' : 'Firebase Real'}
        </div>
        <div>
          <strong>Error:</strong> {error || 'Ninguno'}
        </div>
      </div>

      {services.length > 0 && (
        <div className="mb-4">
          <strong>Primeros 3 servicios:</strong>
          <ul className="list-disc list-inside mt-2">
            {services.slice(0, 3).map(service => (
              <li key={service.id} className="text-sm">
                {service.name} - {service.category}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleForceRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Forzar Refresh
        </button>
        <button
          onClick={handleFirestoreLoad}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          Cargar desde Firestore
        </button>
      </div>
    </div>
  );
}