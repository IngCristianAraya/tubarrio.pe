'use client';

import React from 'react';
import type { Service } from '@/types/service';
import ServiceCard from '@/components/ServiceCard';

interface NearbyGridProps {
  services: Service[];
  title?: string;
}

export default function NearbyGrid({ services, title = 'Servicios cerca de ti' }: NearbyGridProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-700 mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
