'use client';

import React, { useState, Suspense, useCallback, useEffect } from 'react';
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


// Constante para evitar re-renders innecesarios
const PAGE_SIZE = 12;

const getUniqueCategories = (services: Service[]): string[] => {
  const set = new Set(services.map((s) => s.category));
  return Array.from(set);
};

export default function TodosLosServiciosPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TodosLosServiciosPage />
    </Suspense>
  );
}

function TodosLosServiciosPage() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const busquedaParam = searchParams.get('busqueda');

  const { 
    paginatedServices, 
    loadServicesPaginated, 
    loading, 
    currentLoadType,
    hasMorePages,
    resetPagination
  } = useServices();

  const [search, setSearch] = useState(busquedaParam ?? '');
  // Si no hay parámetro de categoría, mostrar todos por defecto
  const [category, setCategory] = useState(categoriaParam ?? '');
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 🔥 SOLUCIÓN: useCallback para funciones estables
  const loadInitialServices = useCallback(async () => {
    if (loadServicesPaginated && resetPagination && !hasLoadedInitial) {
      console.log('🔄 Cargando servicios iniciales...');
      resetPagination();
      await loadServicesPaginated(1, PAGE_SIZE);
      setHasLoadedInitial(true);
    }
  }, [loadServicesPaginated, resetPagination, hasLoadedInitial]);

  // 🔥 SOLUCIÓN: useEffect simplificado
  useEffect(() => {
    loadInitialServices();
  }, [loadInitialServices]); // ✅ Dependencia estable

  // 🔥 SOLUCIÓN: Separar la actualización de estado de la carga de datos
  useEffect(() => {
    setCategory(categoriaParam ?? '');
    setSearch(busquedaParam ?? '');
  }, [categoriaParam, busquedaParam]);

  // 🔥 SOLUCIÓN: useEffect separado para recargar cuando cambian los filtros
  useEffect(() => {
    if (hasLoadedInitial && resetPagination && loadServicesPaginated) {
      const reloadWithFilters = async () => {
        console.log('🔄 Recargando con nuevos filtros...');
        resetPagination();
        await loadServicesPaginated(1, PAGE_SIZE, true);
      };
      
      // Debounce para evitar múltiples llamadas
      const timeoutId = setTimeout(reloadWithFilters, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [categoriaParam, busquedaParam, hasLoadedInitial]); // ✅ Solo dependencias necesarias

  // Función para cargar más servicios
  const loadMoreServices = async () => {
    if (hasMorePages && !isLoadingMore && loadServicesPaginated) {
      setIsLoadingMore(true);
      try {
        const currentPage = Math.floor(paginatedServices.length / PAGE_SIZE) + 1;
        await loadServicesPaginated(currentPage, PAGE_SIZE);
      } catch (error) {
        console.error('Error cargando más servicios:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const categories = getUniqueCategories(paginatedServices);

  // Filtrado de servicios paginados
  const filtered = paginatedServices.filter((s) => {
    const searchLower = search.toLowerCase();
    const matchesName = s.name.toLowerCase().includes(searchLower);
    const matchesDescription = s.description.toLowerCase().includes(searchLower);
    const matchesTags = s.tags ? s.tags.some(tag => tag.toLowerCase().includes(searchLower)) : false;
    const matchesSearch = matchesName || matchesDescription || matchesTags;
    const matchesCategory = category ? s.category === category : true;
    return matchesSearch && matchesCategory;
  });

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
              onChange={(e) => { setSearch(e.target.value); }}
              className="w-full max-w-2xl border-2 border-gray-200 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
            {/* chips de categorías */}
            <div className="flex flex-wrap gap-2">
              <CategoryChips
                categories={categories}
                selected={category}
                onSelect={(cat) => { setCategory(cat); }}
              />
            </div>
          </div>

          {/* Skeleton loader */}
          {(loading && paginatedServices.length === 0) ? (
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
              {filtered.map((service) => (
                <div key={service.id + service.name} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}
          
          {/* Botón Cargar Más */}
          {hasMorePages && filtered.length > 0 && (
            <div className="flex justify-center mt-12 mb-8">
              <button
                onClick={loadMoreServices}
                disabled={isLoadingMore}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center gap-3"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Cargando más servicios...</span>
                  </>
                ) : (
                  <>
                    <span>Cargar más servicios</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Loading indicator para cargas adicionales */}
          {(loading || isLoadingMore) && paginatedServices.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Información de servicios cargados */}
          {filtered.length > 0 && (
            <div className="text-center mt-8 mb-4">
              <div className="text-sm text-gray-600 font-medium">
                {filtered.length} servicios {search || category ? 'encontrados' : 'cargados'}
                {hasMorePages && ' • Hay más servicios disponibles'}
              </div>
            </div>
          )}

          <GoToTopButton />
        </div>
      </main>
      <BusinessBanner />
      <Footer />
    </div>
  );
}
