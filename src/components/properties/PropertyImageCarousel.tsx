"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import NextImage from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { CloudinaryUtils, CLOUDINARY_TRANSFORMATIONS } from '@/hooks/useCloudinary';

interface Props {
  images: string[];
  title: string;
}

function transformUrl(url: string, variant: 'hero' | 'gallery' | 'thumbnail') {
  if (CloudinaryUtils.isCloudinaryUrl(url)) {
    const publicId = CloudinaryUtils.extractPublicId(url);
    // Intentar obtener cloudName desde env o desde la propia URL
    const envCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const match = url.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\//);
    const cloudName = envCloud && envCloud.length > 0 ? envCloud : (match ? match[1] : '');

    if (!publicId || !cloudName) {
      // Si faltan datos, devolvemos la URL original para no romper la carga
      return url;
    }

    const versions = CloudinaryUtils.generateResponsiveUrls(publicId, cloudName);
    if (variant === 'hero') return versions.hero;
    if (variant === 'thumbnail') return versions.thumbnail;
    return versions.gallery;
  }
  return url;
}

export default function PropertyImageCarousel({ images, title }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const slides = useMemo(() => images || [], [images]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === 'ArrowRight') emblaApi.scrollNext();
      if (e.key === 'ArrowLeft') emblaApi.scrollPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [emblaApi]);

  // Preload neighbors to avoid flicker
  useEffect(() => {
    const preload = (index: number) => {
      const url = slides[index];
      if (!url) return;
      const img = typeof window !== 'undefined' ? new window.Image() : null;
      if (!img) return;
      img.src = transformUrl(url, 'gallery');
    };
    preload(selectedIndex + 1);
    preload(selectedIndex - 1);
  }, [selectedIndex, slides]);

  // Close lightbox with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <div className="group">
      {/* Hero carousel */}
      <div className="relative" aria-label="Carrusel de imágenes del inmueble">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {slides.map((src, idx) => (
              <div key={src + idx} className="relative min-w-0 flex-[0_0_100%]">
                <div
                  className="relative h-72 md:h-96 bg-gray-100 cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <NextImage
                    src={transformUrl(src, 'hero')}
                    alt={`${title} – imagen ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop arrows */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="hidden md:inline-flex absolute top-1/2 -translate-y-1/2 left-3 z-10 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow p-2"
          aria-label="Anterior"
        >
          ◀
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="hidden md:inline-flex absolute top-1/2 -translate-y-1/2 right-3 z-10 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow p-2"
          aria-label="Siguiente"
        >
          ▶
        </button>

        {/* Acciones rápidas */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            className="bg-white/80 hover:bg-white text-gray-900 rounded-full shadow px-3 py-1 text-xs"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title, url: window.location.href }).catch(() => { });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            Compartir
          </button>
          <button
            className="bg-white/80 hover:bg-white text-gray-900 rounded-full shadow px-3 py-1 text-xs"
            onClick={() => {
              // Placeholder: toggle favorito
            }}
          >
            Guardar
          </button>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 rounded-full px-3 py-1 text-white text-xs">
          <span>{selectedIndex + 1}/{slides.length}</span>
        </div>
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2" aria-label="Miniaturas de la galería">
          {slides.map((src, idx) => (
            <button
              key={'thumb-' + src + idx}
              onClick={() => scrollTo(idx)}
              className={`relative aspect-[4/3] w-24 md:w-28 flex-shrink-0 rounded overflow-hidden border ${selectedIndex === idx ? 'border-orange-500' : 'border-gray-200'}`}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <NextImage
                src={transformUrl(src, 'thumbnail')}
                alt={`Miniatura ${idx + 1}`}
                fill
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="absolute top-3 right-3 z-10">
            <button
              className="bg-white/80 hover:bg-white text-gray-900 rounded-full shadow px-3 py-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              aria-label="Cerrar"
            >
              Cerrar ✕
            </button>
          </div>
          <div className="absolute inset-0 overflow-hidden z-0" onClick={(e) => e.stopPropagation()}>
            {/* Reuse embla for lightbox */}
            <LightboxEmbla images={slides} title={title} zoomed={zoomed} setZoomed={setZoomed} />
          </div>
        </div>
      )}
    </div>
  );
}

function LightboxEmbla({ images, title, zoomed, setZoomed }: { images: string[]; title: string; zoomed: boolean; setZoomed: (v: boolean) => void; }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slides = images;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full h-full">
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((src, idx) => (
            <div key={'lb-' + src + idx} className="relative min-w-0 flex-[0_0_100%]">
              <div
                className={`relative h-full ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onDoubleClick={() => setZoomed(!zoomed)}
              >
                <NextImage
                  src={transformUrl(src, 'gallery')}
                  alt={`${title} – imagen ampliada ${idx + 1}`}
                  fill
                  className={`object-contain transition-transform duration-200 ${zoomed ? 'scale-150' : 'scale-100'}`}
                  priority={idx === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute top-1/2 -translate-y-1/2 left-3 z-10 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow p-2"
        aria-label="Anterior"
      >
        ◀
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute top-1/2 -translate-y-1/2 right-3 z-10 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow p-2"
        aria-label="Siguiente"
      >
        ▶
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-full px-3 py-1 text-white text-xs">
        <span>{selectedIndex + 1}/{slides.length}</span>
      </div>
    </div>
  );
}
