'use client';

import { Star, MapPin } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import type { Service } from '../context/ServicesContext';
import React from 'react';
import Link from 'next/link';
import { useEventTracking } from '@/hooks/usePageTracking';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

const ServiceCard = ({ service, className = '' }: ServiceCardProps) => {
  const { trackServiceView } = useEventTracking();
  
  const handleServiceView = () => {
    trackServiceView(service.id, service.name);
  };

  // Función para obtener el emoji de la categoría
  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Restaurantes': '🍽️',
      'Abarrotes': '🛒',
      'Lavanderías': '🧺',
      'Gimnasios': '💪',
      'Servicios': '🔧',
      'Peluquerías': '✂️',
      'Mascotas': '🐶',
      'default': '🏷️'
    };
    return emojis[category] || emojis.default;
  };

  return (
    <Link 
      href={`/servicio/${service.id}`}
      className={`
        block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 
        overflow-hidden border border-gray-100 hover:border-orange-200
        flex flex-col h-full ${className}
      `}
      onClick={handleServiceView}
    >
      {/* Imagen con ratio consistente */}
      <div className="relative h-40 w-full bg-gray-50">
        <OptimizedImage
          src={service.images && service.images.length > 0 ? service.images[0] : service.image}
          alt={`Foto de ${service.name}`}
          className="w-full h-full object-cover"
          width={300}
          height={160}
          loading="lazy"
          fallbackSrc="/images/hero_001.webp"
        />
        
        {/* Badge de categoría */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-xs font-medium shadow-sm">
          <span className="mr-1">{getCategoryEmoji(service.category)}</span>
          <span className="text-gray-700">{service.category}</span>
        </div>
        
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full px-2 py-1 flex items-center text-xs font-bold shadow-md">
          <Star className="w-3 h-3 fill-current mr-0.5" />
          <span>{service.rating}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Nombre del servicio */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {service.name}
        </h3>
        
        {/* Descripción */}
        <div className="text-sm text-gray-600 mb-3 flex-grow line-clamp-3 whitespace-pre-line">
          {service.description}
        </div>
        
        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-500 mt-auto">
          <MapPin className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {service.location || service.address || 'Ubicación no especificada'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(ServiceCard);