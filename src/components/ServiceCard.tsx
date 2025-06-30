'use client';

import { Star, MapPin, Phone } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface Service {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden h-40">
        <OptimizedImage
          src={service.image}
          alt={service.name}
          className="w-full h-full group-hover:scale-110 transition-transform duration-300"
          objectFit="cover"
          height={160}
          loading="lazy"
        />
        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-semibold ml-1">{service.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{service.name}</h3>
          <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded-full">
            {service.category}
          </span>
        </div>

        <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
          {service.description}
        </p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
          {service.location}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm">
            <Phone className="w-3 h-3 inline-block mr-1" />
            Contactar
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200">
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
