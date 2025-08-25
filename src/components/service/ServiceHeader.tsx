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
import { MapPin, Clock, Star, Share2, Heart, ChevronLeft, ChevronRight, Phone, ExternalLink } from 'lucide-react';
import Image from 'next/image';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const images: string[] = service.images && service.images.length > 0 
    ? service.images 
    : service.image 
      ? [service.image] 
      : ['/images/placeholder-service.jpg'];

  // Función para manejar favoritos
  const handleFavoriteToggle = useCallback(() => {
    setIsFavorite(!isFavorite);
    // Aquí puedes agregar lógica para guardar en localStorage o base de datos
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!isFavorite) {
      favorites.push(service.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
      const updatedFavorites = favorites.filter((id: string) => id !== service.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  }, [isFavorite, service.id]);

  // Función para compartir
  const handleShare = useCallback(async () => {
    const shareData = {
      title: service.name,
      text: `Descubre ${service.name} en TuBarrio.pe`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  }, [service.name]);

  // Función de respaldo para compartir
  const fallbackShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  }, []);

  // Verificar si está en favoritos al cargar
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(service.id));
  }, [service.id]);

  const nextImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header con gradiente sutil */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl p-8 lg:p-12 shadow-xl border border-orange-100">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 items-start">
          {/* Columna de la Imagen */}
          <div className="space-y-6 order-1 lg:order-1">
            <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src={images[currentImageIndex]}
                alt={`${service.name} - Imagen ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
              
              {/* Controles de navegación */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
            
            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-transparent hover:bg-transparent focus:bg-transparent ${
                      index === currentImageIndex 
                        ? 'border-orange-500 ring-2 ring-orange-200 shadow-md' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{ background: 'transparent' }}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${service.name} - Miniatura ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Botones de Acción - Movidos aquí */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">¿Te interesa este servicio?</h3>
              
              <div className="space-y-3">
                {/* Botón WhatsApp */}
                {(service.whatsapp || (service.contactUrl && (service.contactUrl.includes('wa.me') || service.contactUrl.includes('whatsapp') || service.contactUrl.includes('wa.link')))) && (
                  <a 
                    href={
                      service.contactUrl && (service.contactUrl.includes('wa.me') || service.contactUrl.includes('whatsapp') || service.contactUrl.includes('wa.link'))
                        ? service.contactUrl
                        : `https://wa.me/${service.whatsapp}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>💬</span>
                    <span>Chatear por WhatsApp</span>
                  </a>
                )}
                
                {/* Botón Ver Página Web */}
                {service.detailsUrl && (
                  <a 
                    href={service.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>🌐</span>
                    <span>Visitar Página Web</span>
                  </a>
                )}
                
                {/* Botones secundarios */}
                <div className="flex gap-2 sm:gap-3 pt-2">
                  <button 
                    onClick={handleFavoriteToggle}
                    className={`flex-1 font-medium py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                      isFavorite 
                        ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="hidden xs:inline">{isFavorite ? 'Guardado' : 'Guardar'}</span>
                    <span className="xs:hidden">{isFavorite ? '❤️' : '♥'}</span>
                  </button>
                  <div className="relative flex-1">
                    <button 
                      onClick={handleShare}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-2 sm:px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden xs:inline">Compartir</span>
                      <span className="xs:hidden">📤</span>
                    </button>
                    {showShareTooltip && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        ¡Enlace copiado!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna de Información */}
          <div className="space-y-6 order-2 lg:order-2">
            {/* Información básica del servicio */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {service.name}
              </h1>
              
              {/* Categoría y Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm font-semibold rounded-full border border-orange-300">
                  📂 {service.category}
                </span>
                
                {service.rating && service.rating > 0 && (
                  <div className="flex items-center gap-2">
                    {renderRating(service.rating)}
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {service.description && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {service.description}
                </p>
              </div>
            )}

            {/* Información del Servicio */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Servicio</h3>
              <div className="space-y-4">
                {/* Ubicación */}
                {(service.location || service.address) && (
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">Ubicación</h4>
                      <div className="space-y-1">
                        {service.address && service.address.trim() !== '' ? (
                          <p className="text-gray-700 text-sm font-medium">
                            {service.address}
                            {service.location && service.location.trim() !== '' && (
                              <span>, ref {service.location}</span>
                            )}
                          </p>
                        ) : (
                          service.location && (
                            <p className="text-gray-700 text-sm">{service.location}</p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Horario */}
                {service.horario && (
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-1">Horario</h4>
                      <p className="text-gray-700 text-sm">{formatSchedule()}</p>
                    </div>
                  </div>
                )}

                {/* Contacto */}
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 mb-1">Contacto</h4>
                    <div className="space-y-2">
                      {(service.whatsapp || (service.contactUrl && (service.contactUrl.includes('wa.me') || service.contactUrl.includes('whatsapp') || service.contactUrl.includes('wa.link')))) && (
                        <div className="text-gray-700 text-sm">
                          💬 {
                            service.contactUrl && (service.contactUrl.includes('wa.me') || service.contactUrl.includes('whatsapp') || service.contactUrl.includes('wa.link'))
                              ? (service.whatsapp || 'WhatsApp')
                              : service.whatsapp
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeader;
