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
 *   - Componente ServiceActions para botones de acción
 *   - Información de contacto y horarios
 */

import { useState, useCallback, useEffect } from 'react';
import { Service } from '@/types/service';

type ReactElement = JSX.Element;
import { MapPin, Clock, Star, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ServiceActions from './ServiceActions';
import ServiceImages from './ServiceImages';

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

  // Estados para favoritos y compartir
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

  // Manejar el cambio de favoritos
  const handleFavoriteToggle = (newIsFavorite: boolean) => {
    setIsFavorite(newIsFavorite);
  };

  // Función para compartir
  const handleShare = useCallback(async () => {
    const shareData = {
      title: service.name || 'Servicio',
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

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(service.id));
  }, [service.id]);

  // Función para formatear el rating
  const renderRating = (rating: number, textClass: string = 'text-sm'): ReactElement => {
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
      <div className="flex items-center">
        {stars}
        <span className={`ml-1 ${textClass || 'text-sm'} font-medium text-gray-700`}>
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Obtener el gradiente basado en la categoría
  const gradientClass = getCategoryGradient(service.category || '');

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
            
            {/* Categoría, Ubicación y Rating */}
            <motion.div 
              className="w-full"
              variants={itemVariants}
            >
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                {/* Categoría */}
                <motion.div className="flex-1 min-w-[100px]">
                  <motion.span 
                    className="inline-flex items-center justify-center w-full px-2 py-2 bg-white/80 backdrop-blur-sm text-gray-800 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
                    whileHover={{ y: -2 }}
                    title={service.category}
                  >
                    <span className="mr-1 sm:mr-2">
                      {service.category === 'Restaurantes' && '🍽️'}
                      {service.category === 'Abarrotes' && '🛒'}
                      {service.category === 'Lavanderías' && '🧺'}
                      {service.category === 'Gimnasios' && '💪'}
                      {service.category === 'Servicios' && '🔧'}
                      {service.category === 'Peluquerías' && '✂️'}
                      {!['Restaurantes', 'Abarrotes', 'Lavanderías', 'Gimnasios', 'Servicios', 'Peluquerías'].includes(service.category || '') && '🏷️'}
                    </span>
                    <span className="truncate">{service.category}</span>
                  </motion.span>
                </motion.div>
                
                {/* Barrio */}
                {service.neighborhood?.trim() && (
                  <motion.div className="flex-1 min-w-[100px]">
                    <motion.span 
                      className="inline-flex items-center justify-center w-full px-2 py-2 bg-blue-50/80 backdrop-blur-sm text-blue-800 text-xs sm:text-sm font-medium rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
                      whileHover={{ y: -2 }}
                      title={service.neighborhood.trim()}
                    >
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0 text-blue-500" />
                      <span className="truncate">{service.neighborhood.trim()}</span>
                    </motion.span>
                  </motion.div>
                )}
                
                {/* Rating */}
                {service.rating && service.rating > 0 && (
                  <motion.div className="flex-1 min-w-[100px]">
                    <motion.div 
                      className="flex items-center justify-center w-full h-full px-2 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm"
                      whileHover={{ scale: 1.03 }}
                    >
                      {renderRating(service.rating)}
                    </motion.div>
                  </motion.div>
                )}
              </div>
              
              {/* Se eliminó la sección de dirección duplicada en móvil */}
            </motion.div>

            {/* Galería de imágenes (solo móvil) */}
            <div className="lg:hidden my-6">
              <ServiceImages 
                images={images}
                name={service.name}
                className="sticky top-8"
              />
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
                          const neighborhood = service.neighborhood?.trim();
                          const district = service.district?.trim();
                          
                          // Crear un array para almacenar las partes de la dirección
                          const addressParts = [];
                          
                          // Agregar barrio si existe
                          if (neighborhood) {
                            addressParts.push({
                              label: 'Barrio',
                              value: neighborhood,
                              className: 'font-medium text-gray-800',
                              icon: <MapPin className="w-4 h-4 mr-1 text-blue-500 inline" />
                            });
                          }
                          
                          // Agregar distrito si existe
                          if (district) {
                            addressParts.push({
                              label: 'Distrito',
                              value: district,
                              className: 'font-medium text-gray-800',
                              icon: <MapPin className="w-4 h-4 mr-1 text-purple-500 inline" />
                            });
                          }
                          
                          // Agregar dirección si existe
                          if (address) {
                            addressParts.push({
                              label: 'Dirección',
                              value: address,
                              className: 'text-gray-700'
                            });
                          }
                          
                          // Agregar referencia si existe y es diferente a la dirección
                          if (reference && reference !== address) {
                            addressParts.push({
                              label: 'Referencia',
                              value: reference,
                              className: 'text-gray-600 text-sm'
                            });
                          }
                          
                          // Agregar ubicación general si no hay otros datos
                          if (addressParts.length === 0 && location) {
                            addressParts.push({
                              label: 'Ubicación',
                              value: location,
                              className: 'text-gray-700'
                            });
                          }
                          
                          // Si no hay datos de ubicación
                          if (addressParts.length === 0) {
                            return (
                              <p className="text-gray-500 text-sm">
                                Ubicación no especificada
                              </p>
                            );
                          }
                          
                          // Renderizar solo dirección y referencia (sin barrio/distrito duplicados)
                          return (
                            <div className="space-y-2">
                              {addressParts
                                .filter(part => part.label === 'Dirección' || part.label === 'Referencia')
                                .map((part, index) => (
                                  <div key={index} className="flex flex-col">
                                    {part.label && (
                                      <span className="text-xs text-gray-500 font-medium">
                                        {part.label}:
                                      </span>
                                    )}
                                    <span className={part.className}>
                                      {part.icon}
                                      {part.value}
                                    </span>
                                  </div>
                                ))}
                              
                              {addressParts.length === 0 && (
                                <p className="text-gray-500 text-sm">
                                  Ubicación no especificada
                                </p>
                              )}
                            </div>
                          );
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
                  className="flex flex-col gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                  variants={itemVariants}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 mb-1">Contacto</h4>
                      {service.phone && (
                        <div className="flex items-center gap-2 mb-3">
                          <a 
                            href={`tel:${service.phone}`} 
                            className="text-gray-700 text-sm font-medium hover:text-orange-600 transition-colors"
                          >
                            {service.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <ServiceActions 
                      service={service} 
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Columna izquierda - Imágenes (solo escritorio) */}
          <motion.div 
            className="lg:sticky lg:top-40 lg:self-start hidden lg:block mt-20"
            variants={itemVariants}
          >
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-2xl shadow-xl bg-white/50 backdrop-blur-sm p-1">
                <Image
                  src={images[0]}
                  alt={service.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Miniaturas de la galería (solo si hay más de una imagen) */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, index) => (
                    <div 
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-orange-400 transition-colors"
                    >
                      <Image
                        src={img}
                        alt={`${service.name} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
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
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceHeader;