'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useServices, type Service } from '../../context/ServicesContext';
import ServiceCard from '../../components/ServiceCard';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton';
import EmptyState from '../../components/EmptyState';
import CategoryChips from '../../components/CategoryChips';
import { useSearchParams } from 'next/navigation';

const PAGE_SIZE = 6;

const getUniqueCategories = (services: Service[]): string[] => {
  const categories = new Map<string, string>();
  
  services.forEach(service => {
    if (service.category) {
      // Usamos el nombre de la categoría en minúsculas como clave
      const lowerCaseCategory = service.category.toLowerCase();
      // Almacenamos el nombre original de la categoría
      if (!categories.has(lowerCaseCategory)) {
        categories.set(lowerCaseCategory, service.category);
      }
    }
  });
  
  // Devolvemos los nombres originales de las categorías, ordenados
  return Array.from(categories.values()).sort();
};

interface TodosLosServiciosProps {
  initialCategory?: string;
  initialSearch?: string;
  isHome?: boolean;
}

export default function TodosLosServicios({ 
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

  // Obtener categorías únicas de los servicios
  const categories = useMemo(() => {
    return getUniqueCategories(services);
  }, [services]);

  // Filtrar servicios por búsqueda, categoría y etiquetas
  const filteredServices = useMemo(() => {
    let filtered = [...services];
    
    if (search) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter(service => {
        // Buscar en nombre, descripción, categoría, categorySlug y etiquetas
        const matchesSearch = 
          service.name?.toLowerCase().includes(searchTerm) ||
          service.description?.toLowerCase().includes(searchTerm) ||
          service.category?.toLowerCase().includes(searchTerm) ||
          service.categorySlug?.toLowerCase().includes(searchTerm) ||
          (Array.isArray(service.tags) && 
           service.tags.some(tag => 
             tag && typeof tag === 'string' && 
             tag.toLowerCase().includes(searchTerm)
           ));
        
        return matchesSearch;
      });
    }
    
    if (category) {
      // Normalizar la categoría para comparación (sin acentos, sin espacios/guiones y en minúsculas)
      const normalize = (str: string) => 
        str.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')  // Eliminar acentos
          .toLowerCase()
          .trim()
          .replace(/[\s-]/g, '');  // Eliminar espacios y guiones
      
      const normalizedCategory = normalize(category);
      
      filtered = filtered.filter(service => {
        if (!service.category && !service.categorySlug) return false;
        
        const serviceCategory = service.category ? normalize(service.category) : '';
        const serviceCategorySlug = service.categorySlug ? normalize(service.categorySlug) : '';
        
        return serviceCategory === normalizedCategory || 
               serviceCategorySlug === normalizedCategory;
      });
    }
    
    return filtered;
  }, [services, search, category]);

  // Manejar carga de más servicios
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  if (loading && services.length === 0) {
    return (
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!isHome && (
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {category ? `Servicios: ${category}` : 'Todos Nuestros Servicios'}
          </h1>
        )}
        
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
        
        {filteredServices.length === 0 ? (
          <EmptyState 
            message={search || category 
              ? "No se encontraron servicios para tu búsqueda o categoría seleccionada." 
              : "No hay servicios disponibles por el momento."
            } 
          />
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <div key={service.id} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}
        
        {hasMore && !isHome && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Cargar más servicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
