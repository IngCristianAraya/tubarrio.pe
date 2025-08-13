'use client';

import { notFound, useParams } from 'next/navigation';
import { useServices } from '@/context/ServicesContext';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceHeader from '@/components/service/ServiceHeader';
import RecommendedServices from '@/components/service/RecommendedServices';

export default function ServicioDetallePage() {
  // Obtener todos los servicios del contexto (esto solo funciona en Client Components)
  // Para Server Components, normalmente cargarías los datos desde una fuente persistente (DB/API).
  // Aquí, por simplicidad, se hace una búsqueda dummy. Puedes migrar a fetch real si lo necesitas.
  // Si usas datos estáticos, puedes importar el array aquí.

  // Ejemplo de importación directa (ajusta la ruta si es necesario):
  // import { allServices } from '@/context/ServicesContext';

  // Obtener el id dinámico de la URL
  const { id } = useParams() as { id: string };

  // Obtener servicios del contexto global
  const { services: allServices } = useServices();


  const service = allServices.find(s => s.id === id);

  if (!service) return notFound();

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 w-full py-10 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Container */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Service Header Component (now includes all service details and actions) */}
            <div className="p-4 sm:p-6 md:p-8">
              <ServiceHeader service={service} />
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200" />
            
            {/* Recommended Services Section */}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios relacionados</h2>
              <RecommendedServices 
                services={allServices}
                currentServiceId={service.id}
                category={service.category}
              />
            </div>
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

