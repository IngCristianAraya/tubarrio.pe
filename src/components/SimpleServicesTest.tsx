'use client';

import React, { useState, useEffect } from 'react';
import { useServices } from '@/context/ServicesContext';

export default function SimpleServicesTest() {
  const { services, loading, error, refreshServices, usingMockData } = useServices();
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    console.log('🧪 SimpleServicesTest montado');
    console.log('🧪 Services length:', services.length);
    console.log('🧪 Loading:', loading);
    console.log('🧪 Error:', error);
    console.log('🧪 Using mock data:', usingMockData);
  }, [services.length, loading, error, usingMockData]);

  const handleLoadServices = async () => {
    setTestLoading(true);
    try {
      console.log('🔄 Refrescando servicios manualmente...');
      await refreshServices(true);
      console.log('✅ Servicios refrescados exitosamente');
    } catch (err) {
      console.error('❌ Error refrescando servicios:', err);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">🧪 Test Simple de Servicios</h3>
      
      <div className="mb-4">
        <p><strong>Estado:</strong> {loading ? 'Cargando...' : 'Listo'}</p>
        <p><strong>Servicios:</strong> {services.length}</p>
        <p><strong>Error:</strong> {error || 'Ninguno'}</p>
        <p><strong>Usando Mock Data:</strong> {usingMockData ? 'Sí' : 'No'}</p>
        <p><strong>Firebase Deshabilitado:</strong> {process.env.NEXT_PUBLIC_DISABLE_FIREBASE}</p>
      </div>

      <button
        onClick={handleLoadServices}
        disabled={testLoading || loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {testLoading ? 'Refrescando...' : 'Refrescar Servicios'}
      </button>

      {services.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Primeros 3 servicios:</h4>
          <ul className="list-disc list-inside">
            {services.slice(0, 3).map((service) => (
              <li key={service.id}>
                <strong>{service.name}</strong> ({service.category}) - {service.location}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}