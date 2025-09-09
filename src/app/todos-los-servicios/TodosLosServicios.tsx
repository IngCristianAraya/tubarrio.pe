'use client';

import React, { useState, Suspense, useCallback, useEffect, useMemo } from 'react';
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
import type { Service } from '../../types/service';
import { useSearchParams } from 'next/navigation';


// Constante para evitar re-renders innecesarios
const PAGE_SIZE = 6;

const getUniqueCategories = (services: Service[]): string[] => {
  console.log('📋 Extracting categories from services:', services.length);
  
  // Extraer categorías y filtrar valores nulos o vacíos
  const allCategories = services
    .map(s => s.category)
    .filter(Boolean) // Elimina valores falsy (undefined, null, '')
    .filter((cat): cat is string => typeof cat === 'string'); // Asegura que sean strings

  console.log('📊 Raw categories found:', allCategories);
  
  // Eliminar duplicados usando Set
  const uniqueCategories = Array.from(new Set(allCategories));
  
  console.log('✅ Unique categories:', uniqueCategories);
  return uniqueCategories;
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

  const [search, setSearch] = useState(busquedaParam ?? '');
  const [category, setCategory] = useState(categoriaParam ?? '');

  const {
    services,
    loading,
    error,
    refreshServices
  } = useServices();

  // Forzar carga de servicios si están vacíos
  useEffect(() => {
    console.log('🔍 TodosLosServicios - Estado actual:', {
      servicesCount: services.length,
      loading,
      error
    });
    
    if (services.length === 0 && !loading && !error) {
      console.log('🔄 Forzando carga de servicios desde TodosLosServicios');
      refreshServices();
    }
  }, [services.length, loading, error, refreshServices]);

  // Obtener categorías únicas de los servicios
  const categories = useMemo(() => {
    return getUniqueCategories(services);
  }, [services]);

  // Filtrar servicios por búsqueda y categoría
  const filteredServices = useMemo(() => {
    console.log('🔍 Filtering services:', { 
      totalServices: services.length, 
      searchTerm: search,
      selectedCategory: category,
      availableCategories: categories,
      sampleServices: services.slice(0, 2).map(s => ({ name: s.name, category: s.category }))
    });
    
    let filtered = [...services];
    
    // Aplicar filtro de búsqueda si existe
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Aplicar filtro de categoría si existe
    if (category) {
      filtered = filtered.filter(service => service.category === category);
    }
    
    console.log('✅ Filtering results:', {
      totalResults: filtered.length,
      appliedFilters: {
        search: search || 'none',
        category: category || 'all'
      }
    });
    
    return filtered;
  }, [services, search, category]);

  // Actualizar filtros cuando cambien los parámetros de URL
  useEffect(() => {
    setSearch(busquedaParam ?? '');
    setCategory(categoriaParam ?? '');
  }, [busquedaParam, categoriaParam]);


  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="">
        {/* Hero Section with top padding to account for fixed header */}
        <section className="relative pt-16 md:pt-20 py-10 sm:py-14 md:py-16 mb-14 sm:mb-16 overflow-hidden">
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

        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16 -mt-14 sm:-mt-20 relative z-10">
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
          <>
            {loading && services.length === 0 ? (
              <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="w-full">
                    <ServiceCardSkeleton />
                  </div>
                ))}
              </div>
            ) : error ? (
              <EmptyState message="Error al cargar los servicios. Por favor, intenta de nuevo." />
            ) : filteredServices.length === 0 ? (
              <EmptyState message={search || category ? "No se encontraron servicios para tu búsqueda o categoría seleccionada." : "No hay servicios disponibles por el momento."} />
            ) : (
              <>
                <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredServices.map((service) => (
                    <div key={service.id + service.name} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>
                <GoToTopButton />
              </>
            )}
          </>
          </div>
        </div>
      </div>
      <BusinessBanner />
      <Footer />
    </div>
  );
}
