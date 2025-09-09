'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFeaturedServices } from '../hooks/useServices';
import ServiceCard from './ServiceCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Componente optimizado con SWR para servicios destacados

const FeaturedServices = () => {
  // Hook optimizado con SWR - solo 1 consulta Firebase con caché inteligente
  const { services: featuredServices, loading, error } = useFeaturedServices();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [servicesPerPage, setServicesPerPage] = useState(3);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  // Effect para inicialización
  useEffect(() => {
    setIsMounted(true);
    setIsLoading(loading);
  }, [loading]);
  
  // Actualizar estado de carga cuando cambie el loading del hook
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);
  
  // Effect separado para responsive
  useEffect(() => {
    const updateServicesPerPage = () => {
      if (typeof window === 'undefined') return;
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setServicesPerPage(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 2 : 3);
    };

    updateServicesPerPage();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateServicesPerPage, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const activeServices = useMemo(() => {
    return featuredServices || [];
  }, [featuredServices]);
  
  const categories = useMemo(() => {
    if (!activeServices || activeServices.length === 0) return ['Todos'];
    const cats = new Set(activeServices.map(service => service.category));
    return ['Todos', ...Array.from(cats)].sort();
  }, [activeServices]);

  const filteredByCategory = useMemo(() => {
    if (selectedCategory === 'Todos') return activeServices;
    return activeServices.filter(service => service.category === selectedCategory);
  }, [activeServices, selectedCategory]);

  const currentServices = useMemo(() => {
    const startIndex = (currentPage - 1) * servicesPerPage;
    return filteredByCategory.slice(startIndex, startIndex + servicesPerPage);
  }, [filteredByCategory, currentPage, servicesPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredByCategory.length / servicesPerPage);
  }, [filteredByCategory.length, servicesPerPage]);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setCurrentSlide(0);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, filteredByCategory.length - 1);
      return prev >= maxSlide ? 0 : prev + 1;
    });
  }, [filteredByCategory.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, filteredByCategory.length - 1);
      return prev <= 0 ? maxSlide : prev - 1;
    });
  }, [filteredByCategory.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  }, [touchStart, touchEnd, nextSlide, prevSlide]);

  useEffect(() => {
    if (activeServices.length > 0 || !loading) {
      setIsLoading(false);
    }
  }, [activeServices, loading]);

  if (!isMounted || (loading && featuredServices.length === 0)) {
    return (
      <section id="servicios" className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="servicios" className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isLoading && currentServices.length === 0) {
    return (
      <section id="servicios" className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🔥 <span className="text-orange-500">Servicios</span> Destacados
            </h2>
            <p className="text-gray-500 mb-6">
              {selectedCategory === 'Todos' 
                ? 'No hay servicios disponibles en este momento.'
                : `No hay servicios en la categoría "${selectedCategory}".`}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicios" className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🔥 <span className="text-orange-500">Servicios</span> Destacados
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Los servicios más populares y mejor calificados por nuestra comunidad
          </p>
        </div>

        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="inline-flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isMobile ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {filteredByCategory.map((service, index) => (
                  <div key={service.id} className="w-full flex-shrink-0 px-2">
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            </div>
            
            {filteredByCategory.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors z-10"
                  aria-label="Servicio anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors z-10"
                  aria-label="Siguiente servicio"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <div className="flex justify-center mt-4 space-x-2">
                  {filteredByCategory.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                      aria-label={`Ir al servicio ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};




export default FeaturedServices;