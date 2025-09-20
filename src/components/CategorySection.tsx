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

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h2>
          <Link 
            href={`/categorias/${category.slug}`}
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center"
          >
            Ver más
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                      src={service.image || '/images/placeholder-service.jpg'}
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
    </section>
  );
}