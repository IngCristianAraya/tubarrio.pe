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
  placeholderColor?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  fallbackSrc?: string;
}

/**
 * Componente OptimizedImage para mejorar el rendimiento de carga de imágenes
 * - Carga perezosa (lazy loading) nativa
 * - Placeholder de color mientras carga
 * - Soporte para dimensiones específicas
 * - Transición suave al cargar
 * - Imagen de fallback en caso de error
 * - Precarga para imágenes críticas
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  placeholderColor = '#f3f4f6', // Color gris claro por defecto
  objectFit = 'cover',
  onLoad,
  fallbackSrc = '/images/placeholder.jpg' // Imagen de fallback por defecto
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Resetear el estado cuando cambia la fuente
    if (src !== imageSrc && !hasError) {
      setIsLoaded(false);
      setImageSrc(src);
      setHasError(false);
    }
    
    // Precarga para imágenes con loading='eager'
    if (loading === 'eager') {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      img.onerror = () => {
        console.error(`Error al precargar la imagen: ${src}`);
        setHasError(true);
        setImageSrc(fallbackSrc);
      };
    }
  }, [src, imageSrc, loading, onLoad, fallbackSrc, hasError]);

  // Función para manejar errores de carga
  const handleError = () => {
    console.error(`Error al cargar la imagen: ${src}`);
    setHasError(true);
    setImageSrc(fallbackSrc);
  };

  // Función para manejar la carga exitosa
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Estilos para el contenedor y la imagen
  const containerStyle = {
    backgroundColor: placeholderColor,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const imageStyle = {
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    objectFit,
  };

  // Determinar si la URL es externa o local
  const isExternalImage = src.startsWith('http');

  // Mostrar un indicador de carga mientras la imagen se está cargando
  const loadingIndicator = !isLoaded && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div style={containerStyle} className={className}>
      {loadingIndicator}
      
      {/* Usamos Next/Image para todas las imágenes con configuración optimizada */}
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 500}
        height={height || 300}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...imageStyle,
          objectFit: objectFit as any,
        }}
        className="w-full h-full"
        priority={loading === 'eager'}
        quality={90}
        unoptimized={isExternalImage} // Importante para imágenes externas
      />
    </div>
  );
};

export default OptimizedImage;
