'use client';

import * as React from 'react';
const { useState, useEffect } = React;

import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/types/service';
import { useMediaQuery } from 'react-responsive';
import ServiceCarousel from './ServiceCarousel';

interface CategorySectionProps {
  category: {
    name: string;
    slug: string;
  };
  services: Service[];
  categorySlug?: string;
}

export default function CategorySection({
  category,
  services,
  categorySlug = category.slug
}: CategorySectionProps) {
  if (!services || services.length === 0) return null;

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const previewServices = services.slice(0, 4);

  const isValidImage = (imageUrl?: string) => {
    if (!imageUrl) return false;
    const trimmed = imageUrl.trim().toLowerCase();
    if (!trimmed || trimmed === 'none' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'invalid') {
      return false;
    }
    return trimmed.startsWith('http') || trimmed.startsWith('/');
  };

  const getServiceImage = (service: Service) => {
    const candidates = Array.isArray(service.images) ? service.images : [];
    const firstValidFromArray = candidates.find((img) => isValidImage(img));
    if (isValidImage(firstValidFromArray)) return firstValidFromArray as string;
    if (isValidImage(service.image)) return service.image as string;
    return '/images/placeholder-service.jpg';
  };

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight break-words flex-1 min-w-0">{category.name}</h2>
          <Link
            href={`/servicios?categoria=${category.slug}`}
            className="group subtle-pulse inline-flex items-center gap-1.5 px-4 py-2 h-10 flex-none shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ring-1 ring-orange-300/40 hover:ring-orange-400/60"
            aria-label={`Ver más de ${category.name}`}
          >
            Ver más
            <svg className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isMobile ? (
          <ServiceCarousel services={previewServices} categoryName={category.name} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewServices.map((service) => (
              <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/servicio/${service.slug}`} className="block"> {/* ← ¡Cambia a service.slug! */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={getServiceImage(service)}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2" title={service.name}>
                      {service.name}
                    </h3>
                    {service.barrio && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {service.barrio}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes subtlePulse {
          0% {
            transform: scale(1);
            filter: brightness(1);
            box-shadow: 0 1px 4px rgba(255, 115, 0, 0.15);
          }
          50% {
            transform: scale(1.015);
            filter: brightness(1.03);
            box-shadow: 0 2px 10px rgba(255, 115, 0, 0.25);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
            box-shadow: 0 1px 4px rgba(255, 115, 0, 0.15);
          }
        }
        .subtle-pulse {
          animation: subtlePulse 3.8s ease-out infinite;
          will-change: transform, filter, box-shadow;
        }
        .subtle-pulse:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .subtle-pulse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
