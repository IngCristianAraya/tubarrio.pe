'use client';

import { useEffect, useState } from 'react';
import TodosLosServiciosPage from '../app/todos-los-servicios/TodosLosServicios';

/**
 * Wrapper component que asegura que TodosLosServicios solo se renderice en el cliente
 * Esto evita problemas de hidratación con Firebase y el contexto de servicios
 */
export default function ClientOnlyTodosLosServicios() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return <TodosLosServiciosPage />;
}
