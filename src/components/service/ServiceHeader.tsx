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

import React, { useState, useCallback, useEffect } from 'react';
import { Service } from '@/types/service';
import { MapPin, Clock, Star, Share2, Heart, ChevronLeft, ChevronRight, Phone, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

type ReactElement = React.ReactElement;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
    },
  },
  tap: {
    scale: 0.98,
  },
};

interface ServiceHeaderProps {
  service: Service & {
    featured?: boolean;
    images?: string[];
    id: string;
  };
}

// Mapeo de categorías a colores
type CategoryColors = {
  [key: string]: {
    from: string;
    to: string;
    via?: string;
  };
};

const categoryColors: CategoryColors = {
  'Restaurantes': { 
    from: 'from-red-500', 
    to: 'to-orange-500',
    via: 'via-red-400' 
  },
  'Abarrotes': { 
    from: 'from-green-500', 
    to: 'to-emerald-500',
    via: 'via-green-400' 
  },
  'Lavanderías': { 
    from: 'from-blue-500', 
    to: 'to-indigo-600',
    via: 'via-blue-400' 
  },
  'Gimnasios': { 
    from: 'from-purple-500', 
    to: 'to-pink-600',
    via: 'via-purple-400' 
  },
  'Servicios': { 
    from: 'from-amber-500', 
    to: 'to-orange-500',
    via: 'via-amber-400' 
  },
  'Peluquerías': { 
    from: 'from-pink-500', 
    to: 'to-rose-500',
    via: 'via-pink-400' 
  },
  'default': { 
    from: 'from-gray-500', 
    to: 'to-gray-700',
    via: 'via-gray-400' 
  },
};

const getCategoryGradient = (category: string) => {
  const colors = categoryColors[category] || categoryColors.default;
  return `bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to}`;
};

const ServiceHeader = ({ service }: ServiceHeaderProps): ReactElement => {
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
  // Función para validar si una imagen es válida
  const isValidImage = (imageUrl: string | null | undefined): boolean => {
    return !!imageUrl && 
           imageUrl !== 'none' && 
           imageUrl !== '' && 
           imageUrl !== 'null' && 
           imageUrl !== 'undefined' &&
           !imageUrl.includes('invalid') &&
           (imageUrl.startsWith('http') || imageUrl.startsWith('/'));
  };

  // Asegurarse de que siempre trabajamos con un array de imágenes
  const serviceImages = Array.isArray(service.images) 
    ? service.images 
    : service.image 
      ? [service.image] 
      : [];
  
  // Filtrar y validar imágenes
  const validImages = serviceImages.filter((img): img is string => 
    typeof img === 'string' && isValidImage(img)
  );
  
  // Usar imágenes válidas o el placeholder si no hay imágenes
  const images = validImages.length > 0 
    ? validImages 
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
  useEffect(() => {
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

  // Obtener el gradiente basado en la categoría
  const gradientClass = getCategoryGradient(service.category || '');

  // Efecto para animar la entrada
  useEffect(() => {
    // Forzar una repintada para asegurar que las animaciones se ejecuten
    const timer = setTimeout(() => {
      // Este timeout vacío ayuda a asegurar que las animaciones se ejecuten
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Función para manejar el efecto de ondas al hacer clic en botones
  const createRipple = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    // Limpiar ripples anteriores
    const existingRipples = button.getElementsByClassName('ripple');
    Array.from(existingRipples).forEach(ripple => ripple.remove());
    
    button.appendChild(ripple);
    
    // Eliminar el ripple después de la animación
    setTimeout(() => ripple.remove(), 1000);
  };
  
  // Añadir estilos para el efecto ripple
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 600ms linear;
        pointer-events: none;
      }
      
      .gradient-text {
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        className={`absolute inset-0 -z-10 ${gradientClass} opacity-90`}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 0.9,
          transition: { duration: 0.8, ease: 'easeOut' }
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <motion.div 
          className="lg:grid lg:grid-cols-2 lg:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Columna derecha - Información */}
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 1. Título */}
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              {service.name}
            </motion.h1>
            
            {/* Categoría y Rating */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center gap-4"
              variants={itemVariants}
            >
              <motion.span 
                className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-800 text-sm font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <span className="mr-2">
                  {service.category === 'Restaurantes' && '🍽️'}
                  {service.category === 'Abarrotes' && '🛒'}
                  {service.category === 'Lavanderías' && '🧺'}
                  {service.category === 'Gimnasios' && '💪'}
                  {service.category === 'Servicios' && '🔧'}
                  {service.category === 'Peluquerías' && '✂️'}
                  {!['Restaurantes', 'Abarrotes', 'Lavanderías', 'Gimnasios', 'Servicios', 'Peluquerías'].includes(service.category || '') && '🏷️'}
                </span>
                {service.category}
              </motion.span>
              
              {service.rating && service.rating > 0 && (
                <motion.div 
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm"
                  whileHover={{ scale: 1.03 }}
                >
                  {renderRating(service.rating)}
                </motion.div>
              )}
            </motion.div>

            {/* Galería de imágenes (solo móvil) */}
            <div className="lg:hidden relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl my-6">
              <Image
                src={images[currentImageIndex]}
                alt={service.name}
                fill
                className="object-cover"
                priority
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'w-6 bg-white' 
                            : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Ir a imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Descripción */}
            {service.description && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>
              </motion.div>
            )}

            {/* Información del Servicio */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Información del Servicio</h3>
              <div className="space-y-3 sm:space-y-4">
                {/* Ubicación */}
                {(service.location || service.address) && (
                  <motion.div 
                    className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">Ubicación</h4>
                      <div className="space-y-1">
                        {(() => {
                          const address = service.address?.trim();
                          const reference = service.reference?.trim();
                          const location = service.location?.trim();
                          
                          // Si address y reference son iguales, solo mostrar address
                          if (address && reference && address === reference) {
                            return (
                              <p className="text-gray-700 text-sm font-medium">
                                {address}
                              </p>
                            );
                          }
                          
                          // Si hay address y reference diferentes, mostrar ambos
                          if (address && reference && address !== reference) {
                            return (
                              <div className="space-y-1">
                                <p className="text-gray-700 text-sm font-medium">
                                  {address}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Referencia:</span> {reference}
                                </p>
                              </div>
                            );
                          }
                          
                          // Si solo hay address, mostrarlo
                          if (address) {
                            return (
                              <p className="text-gray-700 text-sm font-medium">
                                {address}
                              </p>
                            );
                          }
                          
                          // Si solo hay location, mostrarlo
                          if (location) {
                            return (
                              <p className="text-gray-700 text-sm">
                                {location}
                              </p>
                            );
                          }
                          
                          return null;
                        })()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Horario */}
                {service.horario && (
                  <motion.div 
                    className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ y: -2 }}
                    variants={itemVariants}
                  >
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-1">Horario</h4>
                      <p className="text-gray-700 text-sm">{formatSchedule()}</p>
                    </div>
                  </motion.div>
                )}

                {/* Contacto */}
                <motion.div 
                  className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                  variants={itemVariants}
                >
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 mb-1">Contacto</h4>
                    <div className="space-y-2">
                      {(service.whatsapp || (service.contactUrl && (service.contactUrl.includes('wa.me') || service.contactUrl.includes('whatsapp') || service.contactUrl.includes('wa.link')))) && (
                        <motion.a
                          variants={itemVariants}
                          whileHover="hover"
                          whileTap="tap"
                          href={`https://wa.me/${service.whatsapp?.replace(/\s/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex-1 inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          {/* Animated background effect */}
                          <span className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0"></span>
                          
                          {/* WhatsApp icon with animation */}
                          <motion.span 
                            className="relative flex items-center gap-2"
                            initial={{ x: -5, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
                          >
                            <FaWhatsapp className="w-5 h-5 text-white" />
                            <span>Enviar mensaje</span>
                          </motion.span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.button
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleFavoriteToggle}
                className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm ${isFavorite ? 'text-red-500' : 'text-gray-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300`}
                aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
              >
                <motion.div
                  animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart 
                    className={`h-6 w-6 ${isFavorite ? 'fill-red-500' : ''}`} 
                    aria-hidden="true" 
                  />
                </motion.div>
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleShare}
                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Compartir"
              >
                <Share2 className="h-6 w-6" aria-hidden="true" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Columna izquierda - Imágenes (solo escritorio) */}
          <motion.div 
            className="mb-8 lg:mb-0 relative hidden lg:block"
            variants={itemVariants}
          >
            {/* Imagen principal */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={images[currentImageIndex]}
                alt={service.name}
                fill
                className="object-cover"
                priority
              />
              {/* Controles de navegación de imágenes */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              {/* Indicadores de imagen */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'w-6 bg-white' 
                          : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Ir a la imagen ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Featured Badge */}
            {service.featured && (
              <motion.div 
                className="absolute top-4 left-4 z-10"
                initial={{ scale: 0, rotate: -15, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0, 
                  opacity: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                    delay: 0.3
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.6 }
                }}
              >
                <span className="inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-yellow-300">
                  <svg 
                    className="w-4 h-4 mr-1.5 text-yellow-700" 
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Destacado
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Botones de acción (solo en móvil) */}
          <div className="lg:hidden mt-6 space-y-3">
            {/* Botón WhatsApp */}
            {(service.whatsapp || (service.contactUrl && (service.contactUrl.includes('wa.me') || service.contactUrl.includes('whatsapp') || service.contactUrl.includes('wa.link')))) && (
              <motion.a
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                href={`https://wa.me/${service.whatsapp?.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-1 inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full"
              >
                <span className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0"></span>
                <motion.span 
                  className="relative flex items-center gap-2"
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <FaWhatsapp className="w-5 h-5 text-white" />
                  <span>Enviar mensaje</span>
                </motion.span>
              </motion.a>
            )}
            
            {/* Botones secundarios */}
            <div className="flex gap-3">
              <motion.button
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleFavoriteToggle}
                className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm ${isFavorite ? 'text-red-500' : 'text-gray-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex-1`}
                aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
              >
                <motion.div
                  animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart 
                    className={`h-6 w-6 ${isFavorite ? 'fill-red-500' : ''}`} 
                    aria-hidden="true" 
                  />
                </motion.div>
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleShare}
                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex-1"
                aria-label="Compartir"
              >
                <Share2 className="h-6 w-6" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceHeader;