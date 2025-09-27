/**
 * Componente ServiceHeader
 * 
 * Muestra la sección principal de una página de detalle de servicio con un layout
 * de dos columnas (imagen + información) similar a una página de producto de e-commerce.
 */

import React, { useState, useCallback, useEffect, ReactElement } from 'react';
import { Service } from '@/types/service';
import { MapPin, Clock, Star, Share2, Heart, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import Image from 'next/image';

interface ServiceHeaderProps {
  service: Service;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ service }): ReactElement => {
  // State for image gallery and UI
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showShareTooltip, setShowShareTooltip] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format schedule information
  const formatSchedule = (): string => {
    // First check if horario is available
    if (service.horario) return service.horario;
    
    // Handle hours which can be either string or object
    if (service.hours) {
      // If hours is a string, return it directly
      if (typeof service.hours === 'string') return service.hours;
      
      // If hours is an object, format it into a readable string
      if (typeof service.hours === 'object' && service.hours !== null) {
        const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;
        const dayMap = {
          'lunes': 'Lun',
          'martes': 'Mar',
          'miércoles': 'Mié',
          'jueves': 'Jue',
          'viernes': 'Vie',
          'sábado': 'Sáb',
          'domingo': 'Dom'
        };
        
        // Group consecutive days with the same hours
        let result: string[] = [];
        let currentGroup: string[] = [];
        let currentHours = '';
        
        days.forEach(day => {
          // Safely access the day's hours with proper type checking
          const dayHours = service.hours && typeof service.hours === 'object' && day in service.hours 
            ? (service.hours as Record<string, any>)[day]
            : null;
            
          if (!dayHours || dayHours.closed) return;
          
          const hoursStr = dayHours.open && dayHours.close 
            ? `${dayHours.open}-${dayHours.close}`
            : 'Horario no especificado';
          
          if (currentHours === hoursStr) {
            // Extend current group
            currentGroup[1] = dayMap[day];
          } else {
            // Close previous group if exists
            if (currentGroup.length > 0) {
              result.push(`${currentGroup[0]}-${currentGroup[1]} ${currentHours}`);
            }
            // Start new group
            currentGroup = [dayMap[day], dayMap[day]];
            currentHours = hoursStr;
          }
        });
        
        // Add the last group if exists
        if (currentGroup.length > 0) {
          result.push(`${currentGroup[0]}-${currentGroup[1]} ${currentHours}`);
        }
        
        return result.length > 0 ? result.join(', ') : 'Horario no especificado';
      }
    }
    
    return 'Horario no especificado';
  };

  // Validate image URL
  const isValidImage = (imageUrl: string | undefined): boolean => {
    return !!imageUrl &&
      imageUrl !== 'none' &&
      imageUrl !== '' &&
      imageUrl !== 'null' &&
      imageUrl !== 'undefined' &&
      !imageUrl.includes('invalid') &&
      (imageUrl.startsWith('http') || imageUrl.startsWith('/'));
  };

  // Get valid images or use placeholder
  const validImages: string[] = React.useMemo(() => {
    if (service.images?.length) {
      return service.images.filter((img): img is string => isValidImage(img));
    }
    return service.image && isValidImage(service.image) 
      ? [service.image] 
      : ['/images/placeholder-service.jpg'];
  }, [service.images, service.image]);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(() => {
    if (!isClient) return;
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Update favorites in localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (newFavoriteState) {
      if (!favorites.includes(service.id)) {
        favorites.push(service.id);
      }
    } else {
      const index = favorites.indexOf(service.id);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [isFavorite, service.id, isClient]);

  // Share functionality
  const fallbackShare = useCallback((): void => {
    if (!isClient) return;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  }, [isClient]);

  const handleShare = useCallback(async (): Promise<void> => {
    if (!isClient) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: service.name,
          text: `Descubre ${service.name} en TuBarrio.pe`,
          url: window.location.href
        });
      } else {
        fallbackShare();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      fallbackShare();
    }
  }, [service.name, fallbackShare, isClient]);

  // Check if service is in favorites on mount
  useEffect(() => {
    if (!isClient) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(service.id));
  }, [service.id, isClient]);

  // Image navigation
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % validImages.length);
  }, [validImages]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages]);

  // Render star rating
  const renderRating = (rating: number): ReactElement => {
    const stars: ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header with back button and title */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => window.history.back()}
          className="mr-2 p-1 rounded-full hover:bg-gray-100"
          aria-label="Volver atrás"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-medium text-gray-900 truncate max-w-[80%]">
          {service.name}
        </h1>
      </div>

      {/* Main content */}
      <div className="px-4 py-3 pb-24">
        {/* Service title and rating */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {service.name}
          </h1>
          {service.rating && service.rating > 0 && (
            <div className="flex items-center">
              {renderRating(service.rating)}
              <span className="ml-2 text-sm text-blue-600">
                {service.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Image gallery */}
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          {validImages.length > 0 && (
            <Image
              src={validImages[currentImageIndex]}
              alt={`${service.name} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          )}
          
          {/* Navigation arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Image indicators */}
        {validImages.length > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Ir a la imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Service description */}
        {service.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
          </div>
        )}

        {/* Contact information */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Información de contacto</h2>
          
          {service.address && (
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700">{service.address}</p>
                {service.reference && (
                  <p className="text-sm text-gray-500 mt-1">Referencia: {service.reference}</p>
                )}
              </div>
            </div>
          )}

          {(service.horario || service.hours) && (
            <div className="flex items-start gap-3 mb-3">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{formatSchedule()}</p>
            </div>
          )}

          {(service.phone || service.whatsapp || service.contactUrl) && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                {service.phone && <p className="text-gray-700">Teléfono: {service.phone}</p>}
                {service.whatsapp && <p className="text-gray-700">WhatsApp: {service.whatsapp}</p>}
                {service.contactUrl && (
                  <a 
                    href={service.contactUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Contactar por {service.contactUrl.includes('whatsapp') ? 'WhatsApp' : 'enlace'}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center">
            <button
              onClick={handleFavoriteToggle}
              className="p-2 text-gray-700 hover:text-red-500 transition-colors"
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <Heart 
                className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              aria-label="Compartir"
            >
              <Share2 className="w-6 h-6" />
              {showShareTooltip && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  ¡Enlace copiado!
                </span>
              )}
            </button>
          </div>

          {service.price ? (
            <div className="text-right">
              <p className="text-sm text-gray-500">Precio desde</p>
              <p className="text-xl font-bold text-gray-900">S/ {service.price}</p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-sm text-gray-500">Precio</p>
              <p className="text-lg font-semibold text-gray-900">Consultar</p>
            </div>
          )}

          <a
            href={service.contactUrl || `https://wa.me/51${service.whatsapp || service.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Contactar
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeader;
