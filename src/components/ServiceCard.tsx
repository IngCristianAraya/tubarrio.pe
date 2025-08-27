/**
 * Componente de tarjeta que muestra la información de un servicio.
 * 
 * Características principales:
 * - Muestra imagen, nombre, descripción y ubicación del servicio
 * - Incluye etiqueta de categoría y valoración visual
 * - Botones de acción para contacto y más información
 * - Diseño responsive con transiciones suaves
 * - Optimizado para rendimiento con carga lazy de imágenes
 * 
 * Props:
 * @param {Service} service - Objeto con la información del servicio a mostrar
 * @property {string} service.name - Nombre del servicio
 * @property {string} service.description - Descripción breve
 * @property {string} service.image - URL de la imagen del servicio
 * @property {string} service.category - Categoría del servicio
 * @property {number} service.rating - Valoración numérica (ej: 4.5)
 * @property {string} service.location - Ubicación del servicio
 * @property {string} [service.contactUrl] - URL para contacto (opcional)
 * @property {string} [service.detailsUrl] - URL para más detalles (opcional)
 */
'use client';

import { Star, MapPin, Phone, ExternalLink } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import type { Service } from '../context/ServicesContext';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEventTracking } from '@/hooks/usePageTracking';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const router = useRouter();
  const { trackServiceView, trackWhatsAppClick, trackPhoneClick } = useEventTracking();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevenir la navegación si se hace clic en un botón o enlace
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
      return;
    }
    // Trackear el clic en el servicio
    trackServiceView(service.id, service.name);
    router.push(`/servicio/${service.id}`);
  };

  const handleContactClick = () => {
    // Determinar si es WhatsApp o teléfono basado en la URL
    if (service.contactUrl?.includes('whatsapp') || service.contactUrl?.includes('wa.me') || service.contactUrl?.includes('wa.link')) {
      trackWhatsAppClick(service.id);
    } else {
      trackPhoneClick(service.id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer p-3"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e as any)}
    >
      {/* Simple Vertical Layout */}
      <div className="text-center">
        {/* Image */}
         <div className="relative overflow-hidden w-full h-32 sm:h-36 mb-3 rounded-lg">
           <OptimizedImage
             src={service.images && service.images.length > 0 ? service.images[0] : service.image}
             alt={`Foto de ${service.name}`}
             className="w-full h-full object-cover"
             width={200}
             height={144}
             loading="lazy"
             objectFit="cover"
             fallbackSrc="/images/hero_001.webp"
           />
           {/* Rating Overlay */}
           <div className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-xs text-yellow-600 shadow-sm">
             <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
             <span className="font-semibold">{service.rating}</span>
           </div>
         </div>

         {/* Service Name */}
          <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {service.name}
          </h3>

         {/* Location */}
         <div className="flex items-center justify-center text-xs text-gray-500">
           <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
           <span className="truncate">{service.location}</span>
         </div>
      </div>
    </div>
  );
};

export default React.memo(ServiceCard);
