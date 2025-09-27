import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const ServiceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
      <div className="animate-pulse">
        <Skeleton className="h-48 w-full" isRounded={false} />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
