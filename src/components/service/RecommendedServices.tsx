/**
 * Componente RecommendedServices
 * 
 * Muestra un carrusel de servicios relacionados con el servicio actualmente visualizado,
 * mostrando típicamente otros servicios de la misma categoría. Características:
 * - Diseño de carrusel responsivo usando SwiperJS
 * - Filtrado para mostrar solo servicios de la misma categoría
 * - Exclusión del servicio actual de las recomendaciones
 * - Tarjetas visuales con imagen, nombre y ubicación del servicio
 * - Enlaces para ver detalles de los servicios recomendados
 * 
 * Este componente ayuda a aumentar el compromiso del usuario sugiriendo
 otros servicios que podrían ser de su interés.
 */

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Service } from '@/types/service';
import Link from 'next/link';

// Cargar Swiper solo en el cliente para SSR
const SwiperComponent = dynamic(
  () => import('swiper/react').then(mod => {
    const { Swiper, SwiperSlide } = mod;
    return { default: Swiper, SwiperSlide };
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="flex space-x-4 overflow-x-auto pb-4 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-shrink-0 w-64 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }
);

// Necesitamos importar SwiperSlide por separado para TypeScript
const SwiperSlide = dynamic(
  () => import('swiper/react').then(mod => mod.SwiperSlide),
  { ssr: false }
);

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RecommendedServicesProps {
  services?: Service[];
  currentServiceId: string;
  category: string;
}

const RecommendedServices: React.FC<RecommendedServicesProps> = ({ 
  services, 
  currentServiceId, 
  category 
}) => {
  // Filter services by the same category, excluding the current service
  const recommendedServices = services?.filter(
    service => service.category === category && service.id !== currentServiceId
  ) || [];

  // If there are no recommended services, don't render anything
  if (recommendedServices.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center sm:text-left px-4">
        Recomendados en {category}
      </h2>
      
      <div className="px-2">
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {recommendedServices.map(service => (
            <div key={service.id} className="flex-shrink-0 w-48">
              <Link href={`/servicio/${service.id}`} className="block group h-full" prefetch={false}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col">
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image
                      src={(service.images && service.images.length > 0 ? service.images[0] : service.image) || '/images/default-service.jpg'}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 300px, (max-width: 1024px) 250px, 200px"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="font-medium text-sm mb-1 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-xs mt-auto">
                       <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="truncate">{service.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedServices;
