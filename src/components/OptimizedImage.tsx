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
  quality?: number; // Calidad de la imagen (1-100)
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  isMobile?: boolean;
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
  fallbackSrc = '/images/hero_001.webp',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 90, // Calidad por defecto alta
  placeholder = 'blur',
  blurDataURL,
  isMobile = false,
}: OptimizedImageProps) => {
  const [isClient, setIsClient] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Establecer isClient a true después de la hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detectar si es móvil para optimizar calidad
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimizar calidad basada en dispositivo
  const optimizedQuality = isMobileDevice || isMobile ? Math.min(quality, 75) : quality;

  // Generar placeholder blur simple si no se proporciona
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
  const finalBlurDataURL = blurDataURL || defaultBlurDataURL;

  // Manejar errores de carga con múltiples fallbacks
  const handleError = () => {
    console.warn('Error loading image:', currentSrc);
    
    if (fallbackSrc && currentSrc !== fallbackSrc && !hasError) {
      console.log('Trying fallback image:', fallbackSrc);
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
    } else if (currentSrc !== '/images/placeholder.jpg') {
      // Si el fallback también falla, usar imagen placeholder local
      console.log('Using local placeholder image');
      setCurrentSrc('/images/placeholder.jpg');
      setHasError(true);
      setIsLoading(false);
    } else {
      // Si todo falla, mostrar el div de "No image"
      console.error('All image sources failed, showing no image placeholder');
      setCurrentSrc('');
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Manejar carga exitosa
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
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

  // Si no estamos en el cliente y no es una imagen prioritaria, renderizar un placeholder
  if (!isClient && !priority) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse rounded-lg`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
        }}
        aria-label={`Cargando imagen: ${alt}`}
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
      {isLoading && placeholder === 'blur' && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"
          aria-hidden="true"
        />
      )}
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{
          objectFit,
          objectPosition: 'center',
        }}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        sizes={sizes}
        quality={optimizedQuality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? finalBlurDataURL : undefined}
        unoptimized={false}
      />
    </div>
  );
};

export default OptimizedImage;
