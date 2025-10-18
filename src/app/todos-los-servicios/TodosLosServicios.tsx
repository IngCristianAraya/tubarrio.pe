'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useServices, type Service as ContextService } from '../../context/ServicesContext';
import type { Service } from '@/types/service';
import ServiceCard from '../../components/ServiceCard';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton';
import EmptyState from '../../components/EmptyState';
import CategoryChips from '../../components/CategoryChips';
import { useSearchParams } from 'next/navigation';

type AnyService = Service | ContextService;

// Las categorías ahora vienen del contexto como `{ slug, name }`.

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
  const barrioParam = searchParams?.get('barrio') || '';
  const distritoParam = searchParams?.get('distrito') || '';

  const [search, setSearch] = useState(initialSearch || busquedaParam || '');
  const [category, setCategory] = useState(initialCategory || categoriaParam || '');
  const [neighborhood, setNeighborhood] = useState(barrioParam || '');
  const [district, setDistrict] = useState(distritoParam || '');

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
    // Nuevos filtros geográficos
    selectedNeighborhood,
    selectedDistrict,
    setSelectedNeighborhood,
    setSelectedDistrict
  } = useServices();

  const neighborhoods = useMemo(() => {
    const set = new Set<string>();
    services.forEach(s => {
      if (s.neighborhood) set.add(s.neighborhood);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [services]);

  const districts = useMemo(() => {
    const set = new Set<string>();
    services.forEach(s => {
      if (s.district) set.add(s.district);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [services]);

  // Update search term in context when local search changes
  useEffect(() => {
    setSearchTerm(search);
  }, [search, setSearchTerm]);

  // Update selected category in context when local category changes
  useEffect(() => {
    setSelectedCategory(category);
  }, [category, setSelectedCategory]);

  // Update selected neighborhood/district in context
  useEffect(() => {
    setSelectedNeighborhood(neighborhood);
  }, [neighborhood, setSelectedNeighborhood]);

  useEffect(() => {
    setSelectedDistrict(district);
  }, [district, setSelectedDistrict]);

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
              {category 
                ? `Servicios: ${categories.find(c => c.slug === category)?.name || category}` 
                : 'Todos Nuestros Servicios'}
            </h1>
            <p className="text-gray-600">
              {filteredServices.length > 0 && (
                <>
                  Mostrando {filteredServices.length} servicios
                  {(search || category || neighborhood || district) && ' filtrados'}
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
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="">Todos los barrios</option>
            {neighborhoods.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="">Todos los distritos</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
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
            message={search || category || neighborhood || district
              ? "No se encontraron servicios para tu búsqueda o filtros seleccionados." 
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
      </div>
    </div>
  );
}
