'use client';

import React, { useState, useCallback } from 'react';
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

  const nextImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback((): void => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  if (!images || images.length === 0) {
    return <div className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Imagen principal con transición */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl">
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
        
        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              onKeyDown={(e) => e.key === 'Enter' && prevImage()}
              tabIndex={0}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              onKeyDown={(e) => e.key === 'Enter' && nextImage()}
              tabIndex={0}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Indicadores */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  onKeyDown={(e) => e.key === 'Enter' && setCurrentImageIndex(index)}
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
          </>
        )}
      </div>
      
      {/* Miniaturas optimizadas */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1.5">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              onKeyDown={(e) => e.key === 'Enter' && setCurrentImageIndex(index)}
              tabIndex={0}
              className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex 
                  ? 'border-white-500 ring-1 ring-white-200 bg-white' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${name} - Miniatura ${index + 1}`}
                width={56}
                height={56}
                className="w-full h-full object-cover"
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