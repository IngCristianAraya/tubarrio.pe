'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import Link from 'next/link';
import { useServices } from '../context/ServicesContext';
import SEO from '../components/SEO';

const Hero = () => {
  // Estados locales para búsqueda, categoría y paginación
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos los servicios');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const resultsPerPage = 8; // Número de resultados por página

  // Categorías rápidas para acceso rápido
  const quickCategories = [
    { icon: '🍔', name: 'Comida', category: 'Restaurantes' },
    { icon: '🛒', name: 'Abarrotes', category: 'Abarrotes' },
    { icon: '👕', name: 'Lavandería', category: 'Lavanderías' },
    { icon: '🥖', name: 'Panadería', category: 'Panaderías' },
    { icon: '🚚', name: 'Delivery', category: 'Delivery' },
    { icon: '🔧', name: 'Servicios', category: 'Servicios' },
  ];

  // Usar el contexto de servicios
  const { searchServices, filteredServices, isSearching, resetSearch, services } = useServices();
  
  // Obtener categorías únicas de los servicios
  const [categories, setCategories] = useState<string[]>(['Todos los servicios']);
  
  // Actualizar categorías cuando cambien los servicios
  useEffect(() => {
    if (services.length > 0) {
      const uniqueCategories = ['Todos los servicios', ...Array.from(new Set(services.map(service => service.category)))];
      setCategories(uniqueCategories);
    }
  }, [services]);

  // Lógica de búsqueda
  const handleSearch = () => {
    if (searchQuery.trim() === '' && selectedCategory === 'Todos los servicios') {
      resetSearch();
      return;
    }
    searchServices(searchQuery, selectedCategory);
    setCurrentPage(1); // Resetear a la primera página cuando se hace una nueva búsqueda
  };
  
  // Resetear la página actual cuando cambian los resultados de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredServices.length]);

  return (
    <>
      <SEO 
        title="Inicio - Tubarrio.pe"
        description="Descubre los mejores servicios y negocios locales en tu barrio. Tu guía digital para encontrar restaurantes, tiendas, servicios y más en tu zona."
        keywords="directorio comercial, negocios locales, servicios, restaurantes, emprendimientos, comercios, barrio"
        image="/images/hero_3.webp"
      />
      <section id="inicio" className="relative min-h-[70vh] md:min-h-screen overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          {/* Imagen principal optimizada para LCP (Largest Contentful Paint)
    - 'priority' y 'fetchPriority="high"' aseguran carga anticipada
    - 'placeholder="blur"' y 'blurDataURL' mejoran la experiencia visual
    - Overlay removido para evitar retrasar el LCP visual
*/}
<OptimizedImage
          src="/images/prueba_yasmin_hd.webp"
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
    className="w-full max-w-2xl bg-white/75  shadow-2xl rounded-3xl border border-white/70 p-6 sm:p-8 md:p-10 flex flex-col gap-y-4 sm:gap-y-8 mt-16 md:mt-32 text-left"
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
  </div>
  
  {/* Buscador */}
  <div className="w-full max-w-2xl mt-8">
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
      <div className="flex flex-col space-y-4">
        {/* Input de búsqueda y selector de categoría */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Input de búsqueda */}
          <div className="w-full md:w-2/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="block w-full pl-10 pr-3 py-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800 placeholder-gray-500 text-base sm:text-sm min-h-[48px] touch-manipulation"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          {/* Selector de categoría */}
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-4 sm:py-3 border border-gray-300 rounded-lg appearance-none focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800 text-base sm:text-sm min-h-[48px] touch-manipulation"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Botón de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center text-center">
          <button
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto min-h-[48px] touch-manipulation active:scale-95"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5 mr-2" />
            Buscar servicios
          </button>
          <Link 
            href="/todos-los-servicios" 
            className="bg-white border-2 border-orange-500 text-orange-600 font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:bg-orange-50 hover:text-orange-700 w-full sm:w-auto min-h-[48px] touch-manipulation active:scale-95"
          >
            Explora todos los servicios
          </Link>
        </div>
      </div>
    </div>
    
    {/* Quick Category Buttons - Reposicionados más arriba con margen adecuado */}
    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-8 mb-12 sm:mb-16">
      {quickCategories.map((item) => (
        <button
          key={item.name}
          onClick={() => {
            setSelectedCategory(item.category);
            handleSearch();
          }}
          className={`flex items-center gap-2 px-5 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-medium min-h-[44px] touch-manipulation active:scale-95 ${
            selectedCategory === item.category
              ? 'bg-orange-100 text-orange-600 border border-orange-200'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-200 hover:text-orange-600'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  </div>
</div>
</section>
      {/* Espaciador adicional entre Hero y MapSection, más grande en móviles */}
      <div className="h-12 sm:h-8 md:h-4"></div>
      
      {/* Sección de resultados de búsqueda */}
      {isSearching && (
        <section className="bg-gray-50 py-16 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Resultados de búsqueda</h2>
              <button
                onClick={resetSearch}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-5 h-5" />
                <span>Cerrar búsqueda</span>
              </button>
            </div>
            
            {filteredServices.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredServices.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage).map((service) => (
                    <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
                      <div className="relative h-48 bg-gray-200">
                        <OptimizedImage 
                          src={service.image} 
                          alt={service.name}
                          width={300}
                          height={192}
                          className="w-full h-full"
                          objectFit="cover"
                          isMobile={true}
                          placeholder="blur"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{service.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'fill-current' : ''}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({service.rating})</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {service.category}
                          </span>
                          <Link href={`/servicio/${service.id}`} className="text-orange-500 hover:text-orange-700 text-sm font-medium">
                            Ver más
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Controles de paginación */}
                {filteredServices.length > resultsPerPage && (
                  <div className="flex justify-center items-center mt-10 space-x-3">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`p-3 rounded-lg flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-md active:scale-95'}`}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.ceil(filteredServices.length / resultsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            currentPage === index + 1
                              ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage >= Math.ceil(filteredServices.length / resultsPerPage)}
                      className={`p-3 rounded-lg flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-200 ${
                        currentPage >= Math.ceil(filteredServices.length / resultsPerPage)
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                          : 'text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-md active:scale-95'
                      }`}
                      aria-label="Página siguiente"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-800 mb-4">No encontramos servicios que coincidan con tu búsqueda.</p>
                <p className="text-gray-700 text-sm">Intenta con otros términos o categorías diferentes.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Hero;
