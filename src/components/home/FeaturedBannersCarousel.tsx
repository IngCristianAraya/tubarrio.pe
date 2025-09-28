// src/components/home/FeaturedBannersCarousel.tsx
'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image: string | {
    desktop: string;
    mobile: string;
  };
  buttonText?: string;
  buttonLink?: string;
}

interface FeaturedBannersCarouselProps {
  banners: Banner[];
  interval?: number; // Intervalo en ms (default: 5000 = 5s)
}

export default function FeaturedBannersCarousel({
  banners,
  interval = 3000, // Cambia el banner cada 3 segundos
}: FeaturedBannersCarouselProps) {
  const timerRef = useRef<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
    // Optimizaciones de rendimiento
    renderMode: 'performance',
    dragSpeed: 1.0,
    mode: 'snap',
    rubberband: false,
    breakpoints: {
      '(min-width: 768px)': {
        dragSpeed: 1.0,
      },
    },
    // Configuración de animación mejorada
    defaultAnimation: {
      duration: 400, // Animación un poco más rápida
      easing: (t) => t, // Transición lineal
    },
    // Manejo de eventos mejorado
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
      // Reiniciar el autoplay después de cada cambio de slide
      stopAutoplay();
      startAutoplay(s);
    },
    created(s) {
      setCurrentSlide(s.track.details.rel);
      startAutoplay(s);
    },
    dragStarted() {
      stopAutoplay();
    },
    dragEnded() {
      startAutoplay(slider.current);
    },
  });

  const startAutoplay = (s: any) => {
    stopAutoplay();
    if (interval > 0 && s) {
      timerRef.current = window.setTimeout(() => {
        try {
          s.next();
        } catch (error) {
          console.error('Error advancing carousel:', error);
          // En caso de error, reiniciar el autoplay
          startAutoplay(s);
        }
      }, interval);
    }
  };

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Precargar imágenes cuando el componente se monte
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Usar el API de precarga de imágenes nativo
    const preloadImages = async () => {
      const imagePromises: Promise<void>[] = [];
      
      banners.forEach(banner => {
        const addImageToPreload = (url: string) => {
          if (!url) return;
          const img = document.createElement('img');
          const promise = new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // No hacer nada en caso de error
          });
          img.src = url;
          imagePromises.push(promise);
        };

        if (typeof banner.image === 'object') {
          addImageToPreload(banner.image.desktop);
          addImageToPreload(banner.image.mobile);
        } else if (banner.image) {
          addImageToPreload(banner.image);
        }
      });

      // Esperar a que todas las imágenes se carguen
      await Promise.all(imagePromises);
    };

    preloadImages().catch(console.error);
    
    // Limpieza
    return () => {
      stopAutoplay();
    };
  }, [banners]);

  // Efecto para manejar el montaje/desmontaje
  useEffect(() => {
    setIsMounted(true);
    
    // Iniciar el autoplay cuando el componente se monta
    if (slider.current) {
      startAutoplay(slider.current);
    }
    
    // Limpieza al desmontar
    return () => {
      stopAutoplay();
    };
  }, [slider]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full">
      <div className="relative w-full mb-0" onMouseEnter={stopAutoplay} onMouseLeave={() => startAutoplay(slider.current)}>
        <div ref={sliderRef} className="keen-slider mb-0" style={{ height: '300px' }}>
        {banners.map((banner) => (
          <div key={banner.id} className="keen-slider__slide h-full">
            <div className="relative w-full h-full">
              {/* Versión desktop - oculta en móviles */}
              <div className="hidden md:block w-full h-full relative">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src={typeof banner.image === 'string' ? banner.image : banner.image.desktop}
                      alt={banner.title || 'Banner promocional'}
                      width={1200}
                      height={300}
                      className="object-contain w-full h-auto max-h-[300px]"
                      priority={true}
                      loading="eager"
                      quality={85}
                      sizes="(max-width: 767px) 0px, 1200px"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        console.error(`Error loading desktop image: ${target.src}`);
                        // Mostrar un placeholder o mensaje de error
                        target.onerror = null; // Prevenir bucles de error
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Versión móvil - solo se muestra en móviles */}
              <div className="md:hidden w-full relative mb-0">
                <div className="relative w-full mb-0">
                  <div className="w-full flex items-center justify-center mb-0">
                    <Image
                      src={typeof banner.image === 'string' ? banner.image : banner.image.mobile}
                      alt={banner.title || 'Banner promocional'}
                      width={800}
                      height={400}
                      className="object-cover w-full h-auto"
                      priority={true}
                      loading="eager"
                      quality={85}
                      sizes="100vw"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        console.error(`Error loading mobile image: ${target.src}`);
                        // Mostrar un placeholder o mensaje de error
                        target.onerror = null; // Prevenir bucles de error
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Navigation Arrows - Desktop */}
      {isMounted && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all duration-300 transform hover:scale-110"
            aria-label="Banner anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => slider.current?.next()}
            className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all duration-300 transform hover:scale-110"
            aria-label="Siguiente banner"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Mobile Navigation - Swipe Only */}
          <div className="md:hidden absolute inset-0 z-0">
            <div 
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
              onClick={() => slider.current?.prev()}
              aria-label="Anterior"
            />
            <div 
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
              onClick={() => slider.current?.next()}
              aria-label="Siguiente"
            />
          </div>
        </>
      )}
      </div>

      {/* Pagination Indicators - Outside banner container */}
      {banners.length > 1 && (
        <div className="flex justify-center space-x-2 -mt-4 md:-mt-1 py-1 md:py-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => slider.current?.moveToIdx(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx 
                  ? 'bg-orange-500 w-6 opacity-100' 
                  : 'bg-orange-300 w-3 hover:bg-orange-400'
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
