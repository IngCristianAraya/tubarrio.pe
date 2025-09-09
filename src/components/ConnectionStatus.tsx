'use client';

import React from 'react';
import { useServices } from '@/context/ServicesContext';

export default function ConnectionStatus() {
  const { services, loading, error, usingMockData } = useServices();

  if (loading) {
    return (
      <div className="bg-blue-100 border border-blue-400 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">Cargando servicios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-600">⚠️</span>
          <div>
            <p className="text-yellow-800 font-medium">Estado de conexión</p>
            <p className="text-yellow-700 text-sm">{error}</p>
            {usingMockData && (
              <p className="text-yellow-600 text-xs mt-1">
                Mostrando {services.length} servicios de ejemplo
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (usingMockData) {
    return (
      <div className="bg-orange-100 border border-orange-400 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-orange-600">🔄</span>
          <div>
            <p className="text-orange-800 font-medium">Modo de demostración</p>
            <p className="text-orange-700 text-sm">
              Mostrando {services.length} servicios de ejemplo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-100 border border-green-400 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-green-600">✅</span>
        <div>
          <p className="text-green-800 font-medium">Conectado a Firebase</p>
          <p className="text-green-700 text-sm">
            {services.length} servicios cargados desde la base de datos
          </p>
        </div>
      </div>
    </div>
  );
}