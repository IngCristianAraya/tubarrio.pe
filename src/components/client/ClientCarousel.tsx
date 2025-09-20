'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  image?: string;
  images?: string[];
  slug: string;
}

interface ClientCarouselProps {
  services: Service[];
  categoryName: string;
}

export default function ClientCarousel({ services = [], categoryName = '' }: ClientCarouselProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 480px)': {
        slides: { perView: 2.2, spacing: 16 },
      },
      '(min-width: 768px)': {
        slides: { perView: 3.2, spacing: 24 },
      },
    },
  });

  if (!mounted) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="relative py-4">
      <div className="px-4 mb-3">
        <h3 className="text-lg font-bold text-gray-900">{categoryName}</h3>
        <p className="text-sm text-gray-500">
          {services.length} {services.length === 1 ? 'servicio' : 'servicios'} disponibles
        </p>
      </div>
      
      <div ref={sliderRef} className="keen-slider overflow-visible">
        {services.map((service) => (
          <div key={service.id} className="keen-slider__slide min-w-[280px] max-w-[280px]">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 h-full flex flex-col">
              <div className="relative h-40 bg-gray-100">
                {(service.images?.[0] || service.image) && (
                  <Image
                    src={service.images?.[0] || service.image || ''}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {service.name}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                  {service.description}
                </p>
                <Link
                  href={`/servicio/${service.slug}`}
                  className="mt-auto text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Ver detalles →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
