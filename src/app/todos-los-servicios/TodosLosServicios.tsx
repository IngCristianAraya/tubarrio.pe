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

interface TodosLosServiciosProps {
  initialCategory?: string;
  initialSearch?: string;
  isHome?: boolean;
}

function TodosLosServicios({ 
  initialCategory = '', 
  initialSearch = '',
  isHome = false
}: TodosLosServiciosProps) {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams?.get('categoria') || '';
  const busquedaParam = searchParams?.get('busqueda') || '';

  const [search, setSearch] = useState(initialSearch || busquedaParam || '');
  const [category, setCategory] = useState(initialCategory || categoriaParam || '');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { services, loading, error, refreshServices } = useServices();

  // Forzar carga de servicios si están vacíos
  useEffect(() => {
    if (services.length === 0 && !loading && !error) {
      refreshServices();
    }
  }, [services, loading, error, refreshServices]);

  // Obtener categorías únicas de los servicios
  const categories = useMemo(() => {
    return getUniqueCategories(services);
  }, [services]);

  // Filtrar servicios por búsqueda y categoría
  const filteredServices = useMemo(() => {
    let filtered = [...services];
    
    // Aplicar filtro de búsqueda si existe
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(service => 
        service.name?.toLowerCase().includes(searchTerm) ||
        service.description?.toLowerCase().includes(searchTerm) ||
        service.category?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Aplicar filtro de categoría si existe
    if (category) {
      filtered = filtered.filter(service => service.category === category);
    }
    
    return filtered;
  }, [services, search, category]);

  // Actualizar filtros cuando cambien los parámetros de URL
  useEffect(() => {
    if (!searchParams) return;
    setSearch(busquedaParam || '');
    setCategory(categoriaParam || '');
  }, [searchParams, busquedaParam, categoriaParam]);

  // Manejar carga de más servicios
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  if (loading && services.length === 0) {
    return (
      <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full">
            <ServiceCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error al cargar los servicios</div>
        <button
          onClick={refreshServices}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isHome && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {category ? `Servicios: ${category}` : 'Todos Nuestros Servicios'}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <CategoryChips 
            categories={categories} 
            selected={category}
            onSelect={setCategory}
          />
        </div>
      )}

      {filteredServices.length === 0 ? (
        <EmptyState 
          message={search || category 
            ? "No se encontraron servicios para tu búsqueda o categoría seleccionada." 
            : "No hay servicios disponibles por el momento."
          } 
        />
      ) : (
        <>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <div key={service.id} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
          
          {hasMore && !isHome && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Cargar más servicios
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface TodosLosServiciosPageWrapperProps {
  isHome?: boolean;
}

export default function TodosLosServiciosPageWrapper({ isHome = false }: TodosLosServiciosPageWrapperProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TodosLosServicios isHome={isHome} />
    </Suspense>
  );
}
