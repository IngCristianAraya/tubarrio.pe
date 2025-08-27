'use client';

import React, { useState, Suspense } from 'react';
import { useServices } from '../../context/ServicesContext';
import ServiceCard from '../../components/ServiceCard';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton';
import EmptyState from '../../components/EmptyState';
import GoToTopButton from '../../components/GoToTopButton';
import CategoryChips from '../../components/CategoryChips';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BusinessBanner from '../../components/BusinessBanner';
import OptimizedImage from '../../components/OptimizedImage';
import type { Service } from '../../context/ServicesContext';
import { useSearchParams } from 'next/navigation';

function useResponsivePageSize() {
  // Always return 8 items per page for all screen sizes
  return 8;
}

const getUniqueCategories = (services: Service[]): string[] => {
  const set = new Set(services.map((s) => s.category));
  return Array.from(set);
};

export default function TodosLosServiciosPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-10">Cargando servicios...</div>}>
      <TodosLosServiciosPage />
    </Suspense>
  );
}

function TodosLosServiciosPage() {
  const PAGE_SIZE = useResponsivePageSize();
  const { 
    services, 
    loadServicesPaginated, 
    loading, 
    currentLoadType 
  } = useServices();
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const busquedaParam = searchParams.get('busqueda');

  const [search, setSearch] = useState(busquedaParam ?? '');
  // Si no hay parámetro de categoría, mostrar todos por defecto
  const [category, setCategory] = useState(categoriaParam ?? '');
  const [page, setPage] = useState(1);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Cargar servicios paginados al montar el componente
  React.useEffect(() => {
    if (!hasLoadedInitial && currentLoadType !== 'paginated') {
      loadServicesPaginated(1, PAGE_SIZE);
      setHasLoadedInitial(true);
    }
  }, [loadServicesPaginated, PAGE_SIZE, hasLoadedInitial, currentLoadType]);

  // Si cambian los query params, actualizar los filtros
  React.useEffect(() => {
    setCategory(categoriaParam ?? '');
    setSearch(busquedaParam ?? '');
    setPage(1);
  }, [categoriaParam, busquedaParam]);

  // Cargar más servicios cuando cambie la página
  React.useEffect(() => {
    if (hasLoadedInitial && page > 1) {
      loadServicesPaginated(page, PAGE_SIZE);
    }
  }, [page, PAGE_SIZE, loadServicesPaginated, hasLoadedInitial]);

  const categories = getUniqueCategories(services);

  // Filtrado
  const filtered = services.filter((s) => {
    const searchLower = search.toLowerCase();
    const matchesName = s.name.toLowerCase().includes(searchLower);
    const matchesDescription = s.description.toLowerCase().includes(searchLower);
    const matchesTags = s.tags ? s.tags.some(tag => tag.toLowerCase().includes(searchLower)) : false;
    const matchesSearch = matchesName || matchesDescription || matchesTags;
    const matchesCategory = category ? s.category === category : true;
    return matchesSearch && matchesCategory;
  });

  // Paginación
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 md:py-24 mb-14 sm:mb-20 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 w-full h-full z-0">
          <OptimizedImage 
            src="/images/hero_001.webp" 
            alt="Fondo de servicios" 
            className="w-full h-full object-cover object-center"
            width={1920}
            height={1080}
            loading="eager"
            priority={true}
            objectFit="cover"
            fallbackSrc="/images/hero_001.webp"
            quality={95}
            isMobile={true}
            placeholder="blur"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative">
            {/* Contenedor principal con fondo claro */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl border border-gray-200">
              {/* Efectos decorativos sutiles */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-yellow-100/30 rounded-3xl"></div>
              
              {/* Contenido principal */}
              <div className="relative z-10 text-center">
                {/* Badge superior */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-full mb-6 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-semibold tracking-wide">DIRECTORIO LOCAL</span>
                </div>
                
                {/* Título principal */}
                <h1 className="relative mb-8">
                  <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight tracking-tight mb-2">
                    Todos los
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-orange-600 leading-tight tracking-tight mb-2">
                    servicios
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700 leading-tight tracking-wide">
                    de la zona
                  </div>
                </h1>
                
                {/* Línea decorativa simple */}
                <div className="flex justify-center mb-8">
                  <div className="h-1 w-32 md:w-48 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
                </div>
                
                {/* Descripción */}
                <p className="text-gray-700 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-10">
                  Explora todos los servicios disponibles en tu comunidad y{' '}
                  <span className="text-orange-600 font-semibold">encuentra exactamente</span> lo que necesitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Título específico */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-8 mb-10 md:mb-10">
        <div className="max-w-7xl px-3 sm:px-6 lg:px-8 -mt-8 mb-10 md:mb-2 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-left">
            Servicios locales
          </h2>
          <div className="h-1 w-40 sm:w-56 md:w-72 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 rounded-full mb-4" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16 -mt-14 sm:-mt-20 relative z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col gap-4 mb-8 sticky top-2 sm:top-4 z-20 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
          {/* input de buscador */}
            <input 
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full max-w-2xl border-2 border-gray-200 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
            {/* chips de categorías */}
            <div className="flex flex-wrap gap-2">
              <CategoryChips
                categories={categories}
                selected={category}
                onSelect={(cat) => { setCategory(cat); setPage(1); }}
              />
            </div>
          </div>

          {/* Skeleton loader */}
          {(loading && services.length === 0) ? (
            <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="w-full">
                  <ServiceCardSkeleton />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState message={search || category ? "No se encontraron servicios para tu búsqueda o categoría seleccionada." : "No hay servicios disponibles por el momento."} />
          ) : (
            <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginated.map((service) => (
                <div key={service.id + service.name} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}
          
          {/* Loading indicator para cargas adicionales */}
          {loading && services.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}

          <GoToTopButton />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-6 mt-12 mb-8">
              {/* Información de página */}
              <div className="text-sm text-gray-600 font-medium">
                Página {page} de {totalPages} • {filtered.length} servicios encontrados
              </div>
              
              {/* Controles de paginación */}
              <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                {/* Botón Primera página */}
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    page === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                  title="Primera página"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>

                {/* Botón Anterior */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const getPageNumbers = () => {
                      const delta = 2;
                      const range = [];
                      const rangeWithDots = [];
                      
                      for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
                        range.push(i);
                      }
                      
                      if (page - delta > 2) {
                        rangeWithDots.push(1, '...');
                      } else {
                        rangeWithDots.push(1);
                      }
                      
                      rangeWithDots.push(...range);
                      
                      if (page + delta < totalPages - 1) {
                        rangeWithDots.push('...', totalPages);
                      } else if (totalPages > 1) {
                        rangeWithDots.push(totalPages);
                      }
                      
                      return rangeWithDots;
                    };
                    
                    return getPageNumbers().map((pageNum, index) => {
                      if (pageNum === '...') {
                        return (
                          <span key={`dots-${index}`} className="px-2 py-1 text-gray-400">
                            •••
                          </span>
                        );
                      }
                      
                      const isActive = pageNum === page;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum as number)}
                          className={`min-w-[40px] h-10 rounded-xl font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
                              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:scale-105"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* Botón Siguiente */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
                  }`}
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Botón Última página */}
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    page === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                  title="Última página"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Selector de elementos por página */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>Mostrar:</span>
                <select
                  value={PAGE_SIZE}
                  onChange={(e) => {
                    // Esta funcionalidad se puede implementar si se hace dinámico el PAGE_SIZE
                    console.log('Cambiar elementos por página:', e.target.value);
                  }}
                  className="px-3 py-1 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value={8}>8 por página</option>
                  <option value={12}>12 por página</option>
                  <option value={16}>16 por página</option>
                  <option value={24}>24 por página</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </main>
      <BusinessBanner />
      <Footer />
    </div>
  );
}
