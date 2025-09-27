import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/Skeleton';
import { Service } from '@/types/service';
import { FaGlobe, FaWhatsapp } from 'react-icons/fa';

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

const ServiceCard: React.FC<ServiceCardProps> = ({ service, className, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-lg shadow-md overflow-hidden', className)}>
        <Skeleton className="h-48 w-full" isRounded={false} />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
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
      {...getAriaLoadingProps(isLoading)}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {service.name}
        </h3>
        
        {service.category && (
          <p className="text-sm text-gray-600 mb-2">{service.category}</p>
        )}
        
        {service.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {service.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-4">
          {service.price && (
            <span className="text-sm font-medium text-gray-900">
              {service.price}
            </span>
          )}
          
          <div className="flex items-center">
            {service.rating !== undefined && (
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-sm text-gray-600">
                  {service.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
