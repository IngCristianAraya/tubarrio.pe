'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceImagesProps {
  images: string[];
  name: string;
  className?: string;
}

const ServiceImages = ({ 
  images, 
  name, 
  className = '' 
}: ServiceImagesProps): JSX.Element => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Función para cambiar imagen directamente
  const goToImage = useCallback((index: number): void => {
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index);
    }
  }, [images.length]);

  // Manejo de gestos táctiles para móvil
  const handleTouchStart = (e: React.TouchEvent): void => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (): void => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  // Validación de imágenes y fallback
  const isValidImage = (imageUrl: string | null | undefined): boolean => {
    return !!imageUrl &&
      imageUrl !== 'none' &&
      imageUrl !== '' &&
      imageUrl !== 'null' &&
      imageUrl !== 'undefined' &&
      (imageUrl.startsWith('http') || imageUrl.startsWith('/'));
  };

  const validImages = Array.isArray(images) ? images.filter((img) => isValidImage(img)) : [];
  const displayImages = validImages.length > 0 ? validImages : ['/images/default-service.jpg'];

  if (!displayImages || displayImages.length === 0) {
    return (
      <div className={`w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No hay imágenes disponibles</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {isMobile ? (
        // Vista móvil - Carrusel con swipe
        <div className="relative">
          <div 
            className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={displayImages[currentImageIndex]}
                  alt={`${name} - Imagen ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={currentImageIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Controles de navegación móvil */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Indicadores móvil */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToImage(index);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goToImage(index);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                    title={`Imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Vista desktop - Estilo MercadoLibre
        <div className="flex gap-4">
          {/* Thumbnails a la izquierda */}
          <div className="flex flex-col gap-2 w-20">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToImage(index);
                }}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  index === currentImageIndex 
                    ? 'border-blue-500 ring-2 ring-blue-500/30' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
                title={`Imagen ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${name} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {/* Overlay para imagen activa */}
                {index === currentImageIndex && (
                  <div className="absolute inset-0 bg-blue-500/10" />
                )}
              </button>
            ))}
          </div>

          {/* Imagen principal */}
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={displayImages[currentImageIndex]}
                    alt={`${name} - Imagen ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={currentImageIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Controles de navegación desktop */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Contador de imágenes */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceImages;