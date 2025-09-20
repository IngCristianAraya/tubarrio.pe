'use client';

import * as React from 'react';
const { useState, useEffect } = React;
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

// Definir la interfaz Service localmente para evitar problemas de importación
interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  slug: string;
}

// Cargar ClientCarousel de forma dinámica sin SSR
const ClientCarousel = dynamic(
  () => import('@/components/client/ClientCarousel'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }
);

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    serviceCount: number;
  };
  services: Service[];
}

export default function CategorySection({ category, services }: CategorySectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const previewServices = services.slice(0, 4);
  
  // Detectar si es móvil solo en el cliente
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    // Verificar al montar
    checkIfMobile();
    
    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar listener al desmontar
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-primary-100 p-2.5 rounded-xl mr-3 drop-shadow-sm">
            <span className="text-primary-600 text-xl md:text-2xl">{category.icon}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">{category.name}</h2>
        </div>
        {/* ✅ Botón de categoría */}
        <Link 
          href={`/categorias/${category.slug}`}
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center group text-sm md:text-base"
        >
          Ver más
          <svg 
            className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </Link>
      </div>

      {/* ✅ RENDERIZAR CARRUSEL EN MÓVIL, GRID EN DESKTOP */}
{isMobile ? (
        <ClientCarousel services={previewServices} categoryName={category.name} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewServices.length === 0 ? (
            <div className="col-span-full">
              <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            previewServices.map((service) => (
              <div 
                key={service.id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 hover:border-gray-200"
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 translate-x-full group-hover:translate-x-[-150%] transition-all duration-700 pointer-events-none"></div>

                {/* Image container */}
                <div className="relative h-40 bg-gray-100 overflow-hidden rounded-t-xl">
                  {service.images?.[0] && (
                    <Image
                      src={service.images[0]}
                      alt={`Foto de ${service.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}

                  {/* Overlay with text - NARANJA */}
                  <div className="absolute inset-0 bg-orange-300 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  </div>

                  {/* Featured badge */}
                  {service.featured && (
                    <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse-slow flex items-center">
                      ⭐ Destacado
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-700 transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span>⭐ {service.rating || 'Nuevo'}</span>
                    <span className="mx-2">•</span>
                    <span>{service.reviewCount || 0} reseñas</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {service.description}
                  </p>
                  {/* ✅ Botón de servicio */}
                  <Link 
                    href={`/servicio/${service.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 group-hover:translate-x-0.5 transform active:scale-95"
                  >
                    <span>Ver ahora</span>
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}