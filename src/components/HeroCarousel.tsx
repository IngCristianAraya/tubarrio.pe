'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  alt: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/images/hero_001.webp',
    alt: 'Descubre los mejores servicios en tu barrio',
    title: 'Bienvenidos a TuBarrio.pe',
    description: 'Encuentra los mejores servicios cerca de ti',
    ctaText: 'Explorar servicios',
    ctaLink: '#servicios'
  },
  {
    id: 2,
    image: '/images/hero_3.webp',
    alt: 'Apoya a los negocios locales',
    title: 'Apoya el Comercio Local',
    description: 'Descubre y apoya a los emprendedores de tu comunidad',
    ctaText: 'Ver ofertas',
    ctaLink: '#ofertas'
  },
  {
    id: 3,
    image: '/images/superbaner.gif',
    alt: 'Promociones especiales',
    title: 'Promociones Exclusivas',
    description: 'Aprovecha los descuentos especiales de nuestros aliados',
    ctaText: 'Ver promociones',
    ctaLink: '#promociones'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-advance slides every 5 seconds if not hovered
  useEffect(() => {
    if (!isHovered) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isHovered]);

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-[500px]">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white max-w-3xl px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
                {slide.ctaText && slide.ctaLink && (
                  <a 
                    href={slide.ctaLink}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
                  >
                    {slide.ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        aria-label="Anterior"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        aria-label="Siguiente"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
