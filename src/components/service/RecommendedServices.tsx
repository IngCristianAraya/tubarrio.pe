'use client';

import { Service } from '@/types/service';
import ServiceCard from '../ServiceCard';
import { sampleServices } from '@/mocks/services';

interface RecommendedServicesProps {
  currentServiceId: string;
  categorySlug: string;
}

export default function RecommendedServices({ currentServiceId, categorySlug }: RecommendedServicesProps) {
  // Convierte sampleServices (Record<string, Service[]>) a un array plano
  const allServices = Object.values(sampleServices).flat();

  // Debug: Verifica los slugs de categoría
  const uniqueCategorySlugs = [...new Set(allServices.map(s => s.categorySlug))];
  console.log('Todos los slugs de categoría únicos:', uniqueCategorySlugs);
  
  // Filtra por categorySlug
  const recommended = allServices
    .filter(service => {
      const matches = service.categorySlug === categorySlug && service.id !== currentServiceId;
      if (matches) {
        console.log('Servicio coincidente encontrado:', { 
          id: service.id, 
          name: service.name, 
          category: service.category, 
          categorySlug: service.categorySlug 
        });
      }
      return matches;
    })
    .slice(0, 4);

  // Debug: Verifica en consola
  console.log('Buscando servicios con categorySlug:', categorySlug);
  console.log('Total de servicios disponibles:', allServices.length);
  console.log('Servicios recomendados encontrados:', recommended.length, recommended);

  if (recommended.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center sm:text-left px-4">
        🔍 Servicios recomendados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {recommended.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
