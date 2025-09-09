/**
 * Hook para gestión optimizada de imágenes con Cloudinary
 * Reemplaza Firebase Storage para mejor rendimiento y costos
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
}

interface UploadOptions {
  transformation?: string;
  folder?: string;
  publicId?: string;
  tags?: string[];
}

interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface UseCloudinaryReturn {
  uploadImage: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  uploadMultiple: (files: File[], options?: UploadOptions) => Promise<UploadResult[]>;
  generateOptimizedUrl: (publicId: string, transformation?: string) => string;
  deleteImage: (publicId: string) => Promise<boolean>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

// Configuración por defecto
const defaultConfig: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'tubarrio_services',
  folder: 'services'
};

// Transformaciones predefinidas para diferentes usos
export const CLOUDINARY_TRANSFORMATIONS = {
  thumbnail: 'w_300,h_200,c_fill,f_auto,q_auto:eco',
  main: 'w_800,h_600,c_fill,f_auto,q_auto:good',
  gallery: 'w_1200,h_900,c_fill,f_auto,q_auto:good',
  avatar: 'w_150,h_150,c_fill,f_auto,q_auto:good,r_max',
  hero: 'w_1920,h_1080,c_fill,f_auto,q_auto:good'
};

export function useCloudinary(config: Partial<CloudinaryConfig> = {}): UseCloudinaryReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const finalConfig = { ...defaultConfig, ...config };

  /**
   * Sube una imagen individual a Cloudinary
   */
  const uploadImage = useCallback(async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    if (!finalConfig.cloudName) {
      throw new Error('Cloudinary cloud name no configurado');
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', finalConfig.uploadPreset);
      
      if (options.folder || finalConfig.folder) {
        formData.append('folder', options.folder || finalConfig.folder || '');
      }
      
      if (options.publicId) {
        formData.append('public_id', options.publicId);
      }
      
      if (options.tags) {
        formData.append('tags', options.tags.join(','));
      }
      
      if (options.transformation) {
        formData.append('transformation', options.transformation);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${finalConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          // Agregar listener de progreso si es necesario
        }
      );

      if (!response.ok) {
        throw new Error(`Error al subir imagen: ${response.statusText}`);
      }

      const result = await response.json();
      
      setUploadProgress(100);
      toast.success('Imagen subida exitosamente');
      
      return {
        url: result.url,
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(`Error al subir imagen: ${errorMessage}`);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [finalConfig]);

  /**
   * Sube múltiples imágenes en paralelo
   */
  const uploadMultiple = useCallback(async (
    files: File[], 
    options: UploadOptions = {}
  ): Promise<UploadResult[]> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const uploadPromises = files.map((file, index) => 
        uploadImage(file, {
          ...options,
          publicId: options.publicId ? `${options.publicId}_${index + 1}` : undefined
        })
      );
      
      const results = await Promise.all(uploadPromises);
      toast.success(`${results.length} imágenes subidas exitosamente`);
      
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir imágenes';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [uploadImage]);

  /**
   * Genera URL optimizada con transformaciones
   */
  const generateOptimizedUrl = useCallback((
    publicId: string, 
    transformation: string = CLOUDINARY_TRANSFORMATIONS.main
  ): string => {
    if (!finalConfig.cloudName || !publicId) {
      return '';
    }
    
    return `https://res.cloudinary.com/${finalConfig.cloudName}/image/upload/${transformation}/${publicId}`;
  }, [finalConfig.cloudName]);

  /**
   * Elimina una imagen de Cloudinary
   */
  const deleteImage = useCallback(async (publicId: string): Promise<boolean> => {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Credenciales de Cloudinary no configuradas para eliminación');
      return false;
    }

    try {
      // Nota: La eliminación requiere autenticación del servidor
      // Implementar endpoint API en /api/cloudinary/delete
      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId })
      });

      if (!response.ok) {
        throw new Error('Error al eliminar imagen');
      }

      toast.success('Imagen eliminada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar imagen';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  return {
    uploadImage,
    uploadMultiple,
    generateOptimizedUrl,
    deleteImage,
    isUploading,
    uploadProgress,
    error
  };
}

/**
 * Hook especializado para servicios
 */
export function useServiceImages() {
  const cloudinary = useCloudinary({ folder: 'services' });
  
  const uploadServiceImages = useCallback(async (
    serviceId: string,
    mainImage: File,
    galleryImages: File[] = []
  ) => {
    try {
      // Subir imagen principal
      const mainResult = await cloudinary.uploadImage(mainImage, {
        publicId: `${serviceId}/main`,
        tags: ['service', 'main', serviceId],
        transformation: CLOUDINARY_TRANSFORMATIONS.main
      });

      // Subir imágenes de galería
      const galleryResults = await Promise.all(
        galleryImages.map((file, index) => 
          cloudinary.uploadImage(file, {
            publicId: `${serviceId}/gallery_${index + 1}`,
            tags: ['service', 'gallery', serviceId],
            transformation: CLOUDINARY_TRANSFORMATIONS.gallery
          })
        )
      );

      return {
        main: mainResult.secureUrl,
        gallery: galleryResults.map(result => result.secureUrl),
        thumbnail: cloudinary.generateOptimizedUrl(
          `${serviceId}/main`, 
          CLOUDINARY_TRANSFORMATIONS.thumbnail
        )
      };
    } catch (error) {
      console.error('Error al subir imágenes del servicio:', error);
      throw error;
    }
  }, [cloudinary]);

  return {
    ...cloudinary,
    uploadServiceImages
  };
}

/**
 * Utilidades para URLs de Cloudinary
 */
export const CloudinaryUtils = {
  /**
   * Extrae el public_id de una URL de Cloudinary
   */
  extractPublicId: (url: string): string => {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return match ? match[1] : '';
  },

  /**
   * Verifica si una URL es de Cloudinary
   */
  isCloudinaryUrl: (url: string): boolean => {
    return url.includes('res.cloudinary.com');
  },

  /**
   * Genera múltiples versiones de una imagen
   */
  generateResponsiveUrls: (publicId: string, cloudName: string) => {
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
    
    return {
      thumbnail: `${baseUrl}/${CLOUDINARY_TRANSFORMATIONS.thumbnail}/${publicId}`,
      main: `${baseUrl}/${CLOUDINARY_TRANSFORMATIONS.main}/${publicId}`,
      gallery: `${baseUrl}/${CLOUDINARY_TRANSFORMATIONS.gallery}/${publicId}`,
      hero: `${baseUrl}/${CLOUDINARY_TRANSFORMATIONS.hero}/${publicId}`
    };
  }
};