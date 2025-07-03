'use client';

import { Star, MapPin, Phone, ExternalLink } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface Service {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  description: string;
  contactUrl?: string;
  detailsUrl?: string;
}

interface ServiceCardProps {
  service: Service;
}

import React from 'react';

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-98 border border-gray-100 overflow-hidden group h-full flex flex-col min-w-0">
      {/* Image */}
      <div className="relative overflow-hidden h-36 sm:h-40 md:h-48 min-w-0">
        <OptimizedImage
          src={service.image}
          alt={`Foto de ${service.name}`}
          className="w-full h-full object-cover group-hover:scale-105 group-hover:ring-2 group-hover:ring-orange-300 transition-transform duration-300"
          width={300}
          height={200}
          loading="lazy"
          
          placeholderColor="#f3f4f6"
          objectFit="cover"
          fallbackSrc="/images/placeholder-business.jpg"
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
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] active:bg-[#075e54] text-white font-semibold tracking-wide py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border border-white/40 hover:border-white/70 shadow-lg hover:shadow-xl transition-all duration-200 text-2xs sm:text-xs md:text-sm min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 hover:-translate-y-0.5"
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0 text-white" />
              <span>Contacto</span>
            </a>
          ) : (
            <button
              className="flex-1 bg-[#25D366] text-white font-semibold tracking-wide py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border border-white/40 shadow-lg opacity-50 cursor-not-allowed text-2xs sm:text-xs md:text-sm min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center"
              disabled
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0 text-white" />
              <span>Contacto</span>
            </button>
          )}
          {service.detailsUrl ? (
            <a
              href={service.detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#fb8500] hover:bg-[#e65100] active:bg-[#b45309] text-white font-semibold tracking-wide py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border border-white/40 hover:border-white/70 shadow-lg hover:shadow-xl transition-all duration-200 text-2xs sm:text-xs md:text-sm min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 hover:-translate-y-0.5"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </a>
          ) : (
            <button
              className="flex-1 bg-[#fb8500] text-white font-semibold tracking-wide py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border border-white/40 shadow-lg opacity-50 cursor-not-allowed text-2xs sm:text-xs md:text-sm min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center"
              disabled
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ServiceCard);
