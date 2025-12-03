// src/components/home/CategorySection.tsx
'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import ServiceCarousel from '../ServiceCarousel';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types/service';

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    emoji: string;
    serviceCount: number;
  };
  services: Service[];
}

export default function CategorySection({ category, services }: CategorySectionProps) {
  if (!services || services.length === 0) return null;

  // Only use the hook in the browser
  const isMobile = typeof window !== 'undefined' ? useIsMobile() : false;
  const previewServices = services.slice(0, 8);

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
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div className="flex items-start flex-1 min-w-0">
          <div className="bg-primary-100 p-2.5 rounded-xl mr-3 drop-shadow-sm">
            <span className="text-primary-600 text-xl md:text-2xl">{category.emoji || category.icon}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight leading-tight break-words">
            {category.name}
          </h2>
        </div>
        <Link
          href={`/servicios?categoria=${category.slug}`}
          className="group subtle-pulse inline-flex items-center gap-1.5 px-4 py-2 h-10 flex-none shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ring-1 ring-orange-300/40 hover:ring-orange-400/60"
          aria-label={`Ver más de ${category.name}`}
        >
          Ver más
          <svg
            className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {isMobile ? (
        <ServiceCarousel services={previewServices} categoryName={category.name} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 hover:border-gray-200"
            >
              <div className="relative h-40 bg-gray-100 overflow-hidden rounded-t-xl">
                <Image
                  src={getServiceImage(service)}
                  alt={`Foto de ${service.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
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
          ))}
        </div>
      )}
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
