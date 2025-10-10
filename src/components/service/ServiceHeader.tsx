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
    
    if (service.hours) {
      // Si hours es un string, retornarlo directamente
      if (typeof service.hours === 'string') return service.hours;
      
      // Si hours es un objeto, formatearlo a un string legible
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
        
        // Agrupar días consecutivos con el mismo horario
        let result: string[] = [];
        let currentGroup: string[] = [];
        let currentHours = '';
        
        days.forEach(day => {
          const dayHours = (service.hours as Record<string, any>)?.[day];
          if (!dayHours || dayHours.closed) return;
          
          const hoursStr = `${dayHours.open}-${dayHours.close}`;
          
          if (currentHours === hoursStr) {
            // Extender el grupo actual
            currentGroup[1] = dayMap[day];
          } else {
            // Cerrar el grupo anterior si existe
            if (currentGroup.length > 0) {
              result.push(`${currentGroup[0]}-${currentGroup[1]} ${currentHours}`);
            }
            // Iniciar nuevo grupo
            currentGroup = [dayMap[day], dayMap[day]];
            currentHours = hoursStr;
          }
        });
        
        // Agregar el último grupo si existe
        if (currentGroup.length > 0) {
          result.push(`${currentGroup[0]}-${currentGroup[1]} ${currentHours}`);
        }
        
        return result.length > 0 ? result.join(', ') : 'No especificado';
      }
    }
    
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
          {/* Columna izquierda - Galería de imágenes (solo desktop) */}
          <motion.div 
            className="hidden lg:block"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ServiceImages 
                images={images}
                name={service.name}
                className="sticky top-8"
              />
            </motion.div>
          </motion.div>

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
            <motion.div 
              className="lg:hidden"
              variants={itemVariants}
            >
              <ServiceImages 
                images={images}
                name={service.name}
                className="mb-6"
              />
            </motion.div>

            {/* Descripción */}
            {service.description && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ y: -2 }}
                variants={itemVariants}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Descripción</h3>
                <div className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {service.description}
                </div>
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
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {service.phone.split('-').map((phone, index) => {
                            const cleanPhone = phone.trim();
                            return (
                              <a 
                                key={index}
                                href={`tel:${cleanPhone}`} 
                                className="text-gray-700 text-sm font-medium hover:text-orange-600 transition-colors"
                              >
                                {cleanPhone}
                              </a>
                            );
                          })}
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


        </motion.div>
      </div>
    </div>
  );
};

export default ServiceHeader;