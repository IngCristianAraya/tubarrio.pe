'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import Link from 'next/link';
import SEO from '../components/SEO';

const Hero = () => {
  // Estados locales para búsqueda y categoría
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos los servicios');

  // ✅ Categorías predefinidas SIN depender del contexto
  const categories = [
    'Todos los servicios',
    'Restaurantes',
    'Panaderías',
    'Abarrotes',
    'Lavanderías',
    'Delivery',
    'Servicios',
    'Ferreterías',
    'Belleza',
    'Salud'
  ];

  // Categorías rápidas para acceso rápido
  const quickCategories = [
    { icon: '🍔', name: 'Comida', category: 'Restaurantes' },
    { icon: '🛒', name: 'Abarrotes', category: 'Abarrotes' },
    { icon: '👕', name: 'Lavandería', category: 'Lavanderías' },
    { icon: '🥖', name: 'Panadería', category: 'Panaderías' },
    { icon: '🚚', name: 'Delivery', category: 'Delivery' },
    { icon: '🔧', name: 'Servicios', category: 'Servicios' },
  ];

  // Lógica de búsqueda - redirigir a todos los servicios
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construir la URL con parámetros de búsqueda
    const params = new URLSearchParams();
    
    const searchTerm = searchQuery.trim();
    if (searchTerm) {
      params.set('busqueda', searchTerm);
    }
    
    if (selectedCategory && selectedCategory !== 'Todos los servicios') {
      params.set('categoria', selectedCategory);
    }
    
    // Redirigir a la página de resultados de búsqueda
    const url = `/todos-los-servicios${params.toString() ? '?' + params.toString() : ''}`;
    window.location.href = url;
  };

  return (
    <>
      <SEO 
        title="Inicio - TuBarrio.pe"
        description="Descubre los mejores servicios y negocios locales en tu barrio. Tu guía digital para encontrar restaurantes, tiendas, servicios y más en tu zona."
        keywords="directorio comercial, negocios locales, servicios, restaurantes, emprendimientos, comercios, barrio"
        image="/images/hero_3.webp"
      />
      
      {/* Hero section hidden on mobile */}
      <div className="hidden md:block">
      
      <section id="inicio" className="relative min-h-[70vh] md:min-h-screen overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/images/heroyas.webp"
            alt="Tu Barrio PE - Conectando tu barrio con los mejores servicios locales"
            className="w-full h-full object-cover object-center"
            width={1920}
            height={1080}
            loading="eager"
            priority={true}
            objectFit="cover"
            fallbackSrc="/images/hero_001.webp"
            quality={100}
            sizes="100vw"
          />
        </div>

        {/* Contenido principal alineado a la izquierda */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-start justify-start">
          <div
            className="w-full max-w-2xl bg-white/75 shadow-2xl rounded-3xl border border-white/70 p-6 sm:p-8 md:p-10 flex flex-col gap-y-4 sm:gap-y-8 mt-16 md:mt-32 text-left"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
          >
            {/* Título moderno con colores sólidos */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-left">
              <span className="text-gray-800 drop-shadow-md">
                Explora
              </span>{' '}
              <span className="text-gray-800 drop-shadow-lg">
                los negocios de
              </span>{' '}
              <span className="text-orange-500 drop-shadow-md"> 
                tu barrio
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-800 max-w-xl text-left">
              Descubre los mejores negocios locales cerca de ti.
              <span className="block mt-2 text-orange-500 font-bold">
                Apoya a tu comunidad y encuentra lo que necesitas.
              </span>
            </p>
            
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
              <div className="relative flex">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="¿Qué estás buscando? Ej: pizzas, lavandería, delivery..."
                  className="w-full pl-12 pr-32 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  aria-label="Buscar servicios"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
          
          {/* Botones de categorías rápidas */}
          <div className="w-full max-w-2xl mt-8">
            <div className="flex flex-wrap justify-start gap-3">
              {quickCategories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    window.location.href = `/todos-los-servicios?categoria=${encodeURIComponent(item.category)}`;
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-medium min-h-[44px] touch-manipulation active:scale-95 ${
                    selectedCategory === item.category
                      ? 'bg-orange-100 text-orange-600 border border-orange-200'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-200 hover:text-orange-600'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
              
              <Link 
                href="/todos-los-servicios" 
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-700 border border-gray-200 hover:border-orange-200 hover:text-orange-600 font-medium transition-colors"
              >
                <span>Ver todos los servicios</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Espaciador adicional */}
      <div className="h-12 sm:h-8 md:h-4"></div>
      </div>
      
      {/* Add some spacing on mobile */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default Hero;