import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/Skeleton';
import { Service } from '@/types/service';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaGlobe, FaWhatsapp } from 'react-icons/fa';

// Helper function to get ARIA attributes for loading state
function getAriaLoadingProps(isLoading: boolean) {
  return isLoading 
    ? { 
        'aria-busy': true,
        'aria-live': 'polite' as const,
        'aria-disabled': true
      } 
    : {};
}

interface ServiceCardProps {
  service: Service;
  className?: string;
  isLoading?: boolean;
}

export function ServiceCard({ service, className, isLoading = false }: ServiceCardProps) {
  if (isLoading) {
    return (
      <div 
        className={cn(
          'bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
          className
        )}
        {...getAriaLoadingProps(true)}
      >
        <Skeleton className="h-48 w-full" isRounded={false} />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-4 flex justify-between items-center">
          {service.price && (
            <span className="text-sm font-medium text-gray-900" id={`service-${service.id}-price`}>
              {service.price}
            </span>
          )}
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            aria-hidden="true"
          >
            Ver más
          </span>
        </div>
        <div id={`service-${service.id}-desc`} className="sr-only">
          {service.description || 'Servicio sin descripción disponible'}
        </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={`/servicio/${service.id}`}
      className={cn(
        'block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
        className
      )}
      aria-label={`Ver detalles de ${service.name}`}
      aria-describedby={`service-${service.id}-desc`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={(service.images && service.images.length > 0 ? service.images[0] : service.image) || '/images/default-service.jpg'}
          alt={service.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1" id={`service-${service.id}-title`}>
          {service.name}
        </h3>
        {service.category && (
          <p className="text-sm text-gray-600 mb-3" id={`service-${service.id}-category`}>
            {service.category}
          </p>
        )}
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {service.description || 'Sin descripción disponible'}
        </p>
        
        {/* Redes Sociales */}
        {(service.socialMedia?.facebook || service.socialMedia?.instagram || service.socialMedia?.tiktok || service.socialMedia?.youtube || service.socialMedia?.twitter || service.socialMedia?.website) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {service.socialMedia?.facebook && (
              <a 
                href={service.socialMedia.facebook.startsWith('http') ? service.socialMedia.facebook : `https://${service.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebook size={20} />
              </a>
            )}
            {service.socialMedia?.instagram && (
              <a 
                href={service.socialMedia.instagram.startsWith('http') ? service.socialMedia.instagram : `https://${service.socialMedia.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            )}
            {service.socialMedia?.tiktok && (
              <a 
                href={service.socialMedia.tiktok.startsWith('http') ? service.socialMedia.tiktok : `https://${service.socialMedia.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="TikTok"
                title="TikTok"
              >
                <FaTiktok size={20} />
              </a>
            )}
            {service.socialMedia?.youtube && (
              <a 
                href={service.socialMedia.youtube.startsWith('http') ? service.socialMedia.youtube : `https://${service.socialMedia.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
                aria-label="YouTube"
                title="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            )}
            {service.socialMedia?.twitter && (
              <a 
                href={service.socialMedia.twitter.startsWith('http') ? service.socialMedia.twitter : `https://${service.socialMedia.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
                title="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            )}
            {service.socialMedia?.website && (
              <a 
                href={service.socialMedia.website.startsWith('http') ? service.socialMedia.website : `https://${service.socialMedia.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
                aria-label="Sitio web"
                title="Sitio web"
              >
                <FaGlobe size={20} />
              </a>
            )}
            {service.whatsapp && (
              <a 
                href={`https://wa.me/${service.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {service.location || 'Ubicación no especificada'}
          </span>
          <span 
            className={cn(
              'px-3 py-1 text-sm font-medium rounded-full',
              service.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            )}
          >
            {service.available ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Loading component for ServiceCard
export function ServiceCardSkeleton({ className }: { className?: string }) {
  return <ServiceCard 
    service={{
      id: 'loading',
<<<<<<< HEAD
      slug: 'cargando-servicio',
=======
      slug: 'loading',
>>>>>>> 740a7fcda5bb7188a74029eb5919ab34a304f0ab
      name: 'Cargando servicio',
      description: 'Cargando descripción del servicio',
      category: 'Cargando categoría',
      categorySlug: 'cargando-categoria',
      location: 'Cargando ubicación',
      rating: 0,
<<<<<<< HEAD
      image: '/images/placeholder.jpg',
      images: ['/images/placeholder.jpg'],
      available: false
=======
      image: '/images/default-service.jpg',
      images: ['/images/default-service.jpg'],
      available: false,
      whatsapp: '',
      hours: '',
      social: ''
>>>>>>> 740a7fcda5bb7188a74029eb5919ab34a304f0ab
    }} 
    isLoading={true}
    className={className}
  />;
}
