/**
 * Componente ServiceHeader
 * 
 * Muestra la sección principal de una página de detalle de servicio con un layout
 * de dos columnas (imagen + información) similar a una página de producto de e-commerce.
 * Integra:
 * - Imagen/logo del servicio (izquierda)
 * - Información detallada (derecha):
 *   - Nombre del servicio
 *   - Categoría y ubicación
 *   - Calificación con estrellas
 *   - Descripción
 *   - Botones de acción (contacto, WhatsApp, etc.)
 *   - Información de contacto y horarios
 */

import React, { useState, useCallback, ReactElement } from 'react';
import { Service } from '@/types/service';
import { MapPin, Clock, Star, Share2, Heart, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import Image from 'next/image';

interface ServiceImageProps {
  src: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
}

interface ServiceHeaderProps {
  service: Service;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ service }): ReactElement => {
  // Función para formatear el horario
  const formatSchedule = (): string => {
    if (service.horario) return service.horario;
    if (service.hours) return service.hours;
    return 'No especificado';
  };

  // Manejo de la galería de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const images: string[] = service.images && service.images.length > 0 
    ? service.images 
    : service.image 
      ? [service.image] 
      : ['/images/placeholder-service.jpg'];

  const nextImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Componente para mostrar las miniaturas de las imágenes
  const ServiceImageThumbnail: React.FC<ServiceImageProps> = ({
    src,
    alt,
    isActive,
    onClick
  }): ReactElement => (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
        isActive 
          ? 'border-orange-500 ring-2 ring-orange-200' 
          : 'border-transparent hover:border-gray-300'
      }`}
      aria-label={`Ver imagen ${alt}`}
    >
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        className="w-full h-full object-cover"
      />
    </button>
  );

  // Función para formatear el rating
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8 lg:gap-12 items-start">
        {/* Columna de la Imagen */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={`${service.name} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            
            {/* Controles de navegación */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg z-10"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                      aria-current={index === currentImageIndex ? 'true' : 'false'}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img: string, index: number) => (
                <ServiceImageThumbnail
                  key={index}
                  src={img}
                  alt={`${service.name} - Imagen ${index + 1}`}
                  isActive={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Columna de Información */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
            
            {/* Categoría y Rating */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {service.category && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  {service.category}
                </span>
              )}
              
              {service.rating && service.rating > 0 && (
                <div className="flex items-center">
                  {renderRating(service.rating)}
                  <span className="ml-2 text-sm text-gray-500">
                    ({Math.floor(Math.random() * 50) + 10} reseñas)
                  </span>
                </div>
              )}
            </div>
            
            {/* Descripción del servicio */}
            {service.description && service.description !== 'none' && (
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )}
            
            {/* Ubicación */}
            {service.location && service.location !== 'none' && (
              <div className="mt-4 flex items-start gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Ubicación</h3>
                  <p className="text-gray-600">{service.location}</p>
                </div>
              </div>
            )}
            
            {/* Horario */}
            {(service.horario || service.hours) && (
              <div className="mt-4 flex items-start gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Horario de Atención</h3>
                  <p className="text-gray-600">{formatSchedule()}</p>
                </div>
              </div>
            )}
            
            {/* Contacto */}
            <div className="mt-4 flex items-start gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Contacto</h3>
                <div className="flex flex-wrap gap-4 mt-1">
                  {service.whatsapp && service.whatsapp !== 'none' && (
                    <a 
                      href={`https://wa.me/${service.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-700 hover:underline"
                    >
                      <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.5 14.4l-2-2c-.3-.2-.6-.3-1-.2-1.1.3-2.2.4-3.3.4-3.6 0-6.5-2.9-6.5-6.5 0-.5.1-1 .2-1.5.1-.4 0-.8-.2-1.1l-2.9-2.9c-.3-.3-.7-.4-1.1-.2-.9.2-1.8.3-2.7.3-1.8 0-3.5-.5-5-1.4l-1.4 1.4c1.2.9 2.6 1.6 4.1 2.1l-4.1 4.1c-1.6-1.6-2.6-3.8-2.6-6.1 0-1.1.2-2.1.5-3.1l1.4-1.4c-.9-1.5-1.4-3.2-1.4-5 0-1.3.3-2.6.8-3.8L5.9 2.4C4.8 3.5 4 5 4 6.5 4 12.4 8.6 17 14.5 17c1.5 0 2.9-.4 4.2-1l1.8 1.8c.4.4 1 .4 1.4 0l1.4-1.4c.4-.4.4-1 0-1.4l-1.7-1.9z"/>
                      </svg>
                      +{service.whatsapp}
                    </a>
                  )}
                  
                  {service.contactUrl && service.contactUrl !== 'none' && (
                    <a 
                      href={service.contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                      </svg>
                      {new URL(service.contactUrl).hostname.replace('www.', '')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción - Mejorados con UX/UI */}
        <div className="space-y-4 pt-2">
          {/* Fila principal de botones */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Botón Ver Página Web */}
            {service.detailsUrl && (
              <a 
                href={service.detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-1 relative overflow-hidden bg-white border-2 border-orange-500 text-orange-600 hover:text-white hover:bg-gradient-to-r from-orange-500 to-orange-600 font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center text-center min-w-[200px]"
              >
                <span className="absolute inset-0 w-0 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full -z-1"></span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-5 h-5 mr-2.5 transform group-hover:scale-110 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="relative z-10 font-semibold tracking-wide">Visitar Página Web</span>
              </a>
            )}
            
            {/* Botón Contactar (WhatsApp) */}
            <a 
              href={service.whatsapp ? `https://wa.me/${service.whatsapp}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex-1 relative overflow-hidden ${
                service.whatsapp 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white cursor-pointer shadow-md hover:shadow-lg hover:shadow-green-200' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center text-center min-w-[200px]`}
            >
              {service.whatsapp && (
                <span className="absolute inset-0 w-0 bg-green-700 transition-all duration-300 ease-out group-hover:w-full -z-1"></span>
              )}
              <svg 
                className={`w-5 h-5 mr-2.5 transform ${service.whatsapp ? 'group-hover:scale-110' : ''} transition-transform`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.5 14.4l4-4a1 1 0 000-1.4l-3-3a1 1 0 00-1.4 0l-1.3 1.3a12.1 12.1 0 01-3.6-2.4 12.1 12.1 0 01-2.4-3.6L8.4 7a1 1 0 00-1.4 0l-3 3a1 1 0 000 1.4l4 4a1 1 0 001.2.2l1.5-.7a1 1 0 011 .2l2.3 2.3a1 1 0 001.4 0l2.4-2.4a1 1 0 01.2-1l-.7-1.5a1 1 0 01.2-1.2z"/>
              </svg>
              <span className="relative z-10 font-semibold tracking-wide">
                {service.whatsapp ? 'Chatear por WhatsApp' : 'WhatsApp no disponible'}
              </span>
            </a>
          </div>
          
          {/* Botones secundarios con mejor contraste */}
          <div className="flex justify-center sm:justify-start gap-3 pt-2">
            <button 
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors duration-200 shadow-sm hover:shadow-md group"
              aria-label="Guardar en favoritos"
            >
              <Heart className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
            </button>
            <button 
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors duration-200 shadow-sm hover:shadow-md group"
              aria-label="Compartir"
            >
              <Share2 className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
            </button>
          </div>
          
          {/* Llamada a la acción */}
          <p className="text-center sm:text-left text-sm text-gray-500 mt-2">
            ¡Contáctanos ahora para más información! 📞
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the component as default
export default ServiceHeader;
