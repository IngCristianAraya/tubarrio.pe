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
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-98 border border-gray-100 overflow-hidden group h-full flex flex-col min-w-0 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e as any)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-36 sm:h-40 md:h-48 min-w-0">
        <OptimizedImage
          src={service.images && service.images.length > 0 ? service.images[0] : service.image}
          alt={`Foto de ${service.name}`}
          className="w-full h-full object-cover group-hover:scale-105 group-hover:ring-2 group-hover:ring-orange-300 transition-transform duration-300"
          width={300}
          height={200}
          loading="lazy"
          objectFit="cover"
          fallbackSrc="/images/hero_001.webp"
        />
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-400 to-yellow-300/90 px-2 py-1 rounded-full shadow-md ring-1 ring-orange-300">
          <span className="text-2xs sm:text-xs font-bold text-gray-900 drop-shadow">{service.category}</span>
        </div>
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-md ring-1 ring-yellow-300">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current drop-shadow" />
          <span className="text-2xs sm:text-xs font-bold ml-1 text-yellow-700">{service.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="mb-1 sm:mb-2">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{service.name}</h3>
        </div>

        <p className="text-gray-600 mb-2 sm:mb-3 text-2xs sm:text-xs md:text-sm leading-relaxed line-clamp-2 flex-grow">
          {service.description}
        </p>

        {/* Location and Rating */}
        <div className="flex items-center justify-between text-2xs sm:text-xs text-gray-500 mb-3 sm:mb-4">
          <div className="flex items-center">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 text-blue-500 flex-shrink-0" />
            <span className="truncate">{service.location}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 sm:gap-2 mt-auto">
          {service.contactUrl ? (
            <a
              href={service.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleContactClick}
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] active:bg-[#075e54] text-white font-semibold tracking-wide py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl border border-white/40 hover:border-white/70 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm md:text-base min-h-[48px] sm:min-h-[52px] md:min-h-[56px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 hover:-translate-y-0.5 touch-manipulation"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 text-white" />
              <span>Contacto</span>
            </a>
          ) : (
            <button
              className="flex-1 bg-[#25D366] text-white font-semibold tracking-wide py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl border border-white/40 shadow-lg opacity-50 cursor-not-allowed text-xs sm:text-sm md:text-base min-h-[48px] sm:min-h-[52px] md:min-h-[56px] flex items-center justify-center touch-manipulation"
              disabled
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 text-white" />
              <span>Contacto</span>
            </button>
          )}
          {service.detailsUrl ? (
            <a
              href={service.detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#fb8500] hover:bg-[#e65100] active:bg-[#b45309] text-white font-semibold tracking-wide py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl border border-white/40 hover:border-white/70 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm md:text-base min-h-[48px] sm:min-h-[52px] md:min-h-[56px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 hover:-translate-y-0.5 touch-manipulation"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>
          ) : (
            <span className="flex-1 text-gray-400 text-xs sm:text-sm font-medium min-h-[48px] sm:min-h-[52px] md:min-h-[56px] flex items-center justify-center bg-gray-100 rounded-xl border border-white/40 shadow-inner">
              Landing próximamente
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ServiceCard);
