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
    setCurrentImageIndex(index);
  }, []);

  // Funciones para manejar el swipe en móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };

  if (!images || images.length === 0) {
    return <div className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Imagen principal con transición */}
      <div 
        className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl bg-gray-100"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${name} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-service.jpg';
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Controles de navegación - Solo en desktop */}
        {images.length > 1 && !isMobile && (
          <>
            <button
              onClick={prevImage}
              onKeyDown={(e) => e.key === 'Enter' && prevImage()}
              tabIndex={0}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              onKeyDown={(e) => e.key === 'Enter' && nextImage()}
              tabIndex={0}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
        
        {/* Indicadores - Solo si hay múltiples imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                onKeyDown={(e) => e.key === 'Enter' && goToImage(index)}
                tabIndex={0}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'w-6 bg-white' 
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Miniaturas optimizadas - Solo en desktop */}
      {images.length > 1 && !isMobile && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                console.log(`Clicking thumbnail ${index}`); // Debug log
                goToImage(index);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log(`Enter pressed on thumbnail ${index}`); // Debug log
                  goToImage(index);
                }
              }}
              tabIndex={0}
              className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                index === currentImageIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200 shadow-md scale-105' 
                  : 'border-gray-200 hover:border-gray-400 hover:scale-102'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${name} - Miniatura ${index + 1}`}
                width={56}
                height={56}
                className="w-full h-full object-cover pointer-events-none"
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-service.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceImages;