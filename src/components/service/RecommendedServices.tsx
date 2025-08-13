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
import { Service } from '@/types/service';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

interface RecommendedServicesProps {
  services: Service[];
  currentServiceId: string;
  category: string;
}

const RecommendedServices: React.FC<RecommendedServicesProps> = ({ 
  services, 
  currentServiceId, 
  category 
}) => {
  // Filter services by the same category, excluding the current service
  const recommendedServices = services.filter(
    service => service.category === category && service.id !== currentServiceId
  );

  // If there are no recommended services, don't render anything
  if (recommendedServices.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center sm:text-left px-4">
        Recomendados en {category}
      </h2>
      
      <div className="px-2">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 4
          }}
          className="!pb-12 !px-2"
        >
          {recommendedServices.map(service => (
            <SwiperSlide key={service.id}>
              <div className="h-full">
                <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center h-full border border-orange-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-full h-40 bg-white flex items-center justify-center rounded-xl mb-3 border-2 border-orange-100 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                    {service.name}
                  </h3>
                  <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full mb-3">
                    {service.location}
                  </span>
                  <Link 
                    href={`/servicio/${service.id}`} 
                    className="mt-auto w-full text-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-all"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RecommendedServices;
