import React, { Suspense } from 'react';
import { Service } from '@/types/service';
import { ServiceCard, ServiceCardSkeleton } from './ServiceCard';
import { cn } from '@/lib/utils';

interface ServiceListProps {
  services: Service[];
  isLoading?: boolean;
  className?: string;
  skeletonCount?: number;
}

export function ServiceList({
  services,
  isLoading = false,
  className,
  skeletonCount = 6,
}: ServiceListProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ServiceCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No se encontraron servicios</h3>
        <p className="mt-2 text-gray-500">Intenta con otros filtros o vuelve más tarde.</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
          {Array.from({ length: 3 }).map((_, index) => (
            <ServiceCardSkeleton key={`suspense-${index}`} />
          ))}
        </div>
      }
    >
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </Suspense>
  );
}
