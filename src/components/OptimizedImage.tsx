'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Componente OptimizedImage simplificado para cargar imágenes de manera eficiente
 * - Usa next/image para optimización automática
 * - Incluye manejo de errores
 * - Soporte para lazy loading
 * - Manejo de hidratación mejorado
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width = 500, // Default width if not provided
  height = 300, // Default height if not provided
  loading = 'lazy',
  objectFit = 'cover',
  onLoad,
  fallbackSrc = '/images/placeholder.jpg',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) => {
  const [isClient, setIsClient] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc);
  const [hasError, setHasError] = useState(false);

  // Establecer isClient a true después de la hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manejar errores de carga
  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Actualizar la fuente cuando cambie la prop src
  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setHasError(false);
    } else if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  // Si no estamos en el cliente, renderizar un placeholder
  if (!isClient) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
        }}
      />
    );
  }

  // Si no hay fuente, mostrar un placeholder
  if (!currentSrc) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{
          width: width || '100%',
          height: height || '100%',
        }}
      >
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
      suppressHydrationWarning
    >
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className="w-full h-full"
        style={{
          objectFit,
          objectPosition: 'center',
        }}
        onLoad={onLoad}
        onError={handleError}
        priority={priority}
        sizes={sizes}
        unoptimized={process.env.NODE_ENV !== 'production'}
      />
    </div>
  );
};

export default OptimizedImage;
