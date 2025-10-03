'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useServices, type Service as ContextService } from '../../context/ServicesContext';
import type { Service } from '@/types/service';
import ServiceCard from '../../components/ServiceCard';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton';
import EmptyState from '../../components/EmptyState';
import CategoryChips from '../../components/CategoryChips';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type AnyService = Service | ContextService;

const getUniqueCategories = (services: AnyService[]): string[] => {
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

  const { 
    services, 
    filteredServices,
    loading, 
    error, 
    refreshServices,
    categories,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    // Pagination properties
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    pageSize,
    totalServices,
    // Pagination methods
    loadPage,
    loadNextPage,
    loadPreviousPage,
    resetPagination
  } = useServices();

  // Update search term in context when local search changes
  useEffect(() => {
    setSearchTerm(search);
  }, [search, setSearchTerm]);

  // Update selected category in context when local category changes
  useEffect(() => {
    setSelectedCategory(category);
  }, [category, setSelectedCategory]);

  // Reset to first page when search or category changes
  useEffect(() => {
    if (search !== searchTerm || category !== selectedCategory) {
      resetPagination();
    }
  }, [search, category, searchTerm, selectedCategory, resetPagination]);

  // Handle page navigation
  const handlePageChange = useCallback((page: number) => {
    loadPage(page);
  }, [loadPage]);

  // Generate page numbers for pagination
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis and first/last pages if needed
      if (start > 1) {
        if (start > 2) {
          pages.unshift('...');
        }
        pages.unshift(1);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  if (loading && services.length === 0) {
    return (
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category ? `Servicios: ${category}` : 'Todos Nuestros Servicios'}
            </h1>
            <p className="text-gray-600">
              {totalServices > 0 && (
                <>
                  Mostrando {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalServices)} de {totalServices} servicios
                  {(search || category) && ' filtrados'}
                </>
              )}
            </p>
          </div>
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
          <>
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((service) => (
                <div key={service.id} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && !isHome && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </div>
                
                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={loadPreviousPage}
                    disabled={!hasPreviousPage}
                    className={`p-2 rounded-lg border ${
                      hasPreviousPage 
                        ? 'border-gray-300 hover:bg-gray-50 text-gray-700' 
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers.map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page as number)}
                            className={`px-3 py-2 rounded-lg border text-sm ${
                              currentPage === page
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  {/* Next Button */}
                  <button
                    onClick={loadNextPage}
                    disabled={!hasNextPage}
                    className={`p-2 rounded-lg border ${
                      hasNextPage 
                        ? 'border-gray-300 hover:bg-gray-50 text-gray-700' 
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
