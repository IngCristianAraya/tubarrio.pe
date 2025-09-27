'use client';

import React, { useState, useMemo } from 'react';
import { useServicesPaginated } from '@/hooks/useServices';
import ServiceCard from '@/components/service/ServiceCard';
import { ChevronDown, Filter, MapPin, Tag } from 'lucide-react';
import { CloudinaryUtils, CLOUDINARY_TRANSFORMATIONS } from '@/hooks/useCloudinary';
import { Service } from '@/types/service';

interface ServiceListProps {
  category?: string;
  barrio?: string;
  userId?: string;
  pageSize?: number;
  showFilters?: boolean;
  title?: string;
  className?: string;
}

const ServiceList: React.FC<ServiceListProps> = ({
  category: initialCategory,
  barrio: initialBarrio,
  userId,
  pageSize = 12,
  showFilters = true,
  title = 'Servicios',
  className = ''
}) => {
  // Estados para filtros locales
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [selectedBarrio, setSelectedBarrio] = useState(initialBarrio || '');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Hook de paginación optimizado
  const { 
    services, 
    hasMore, 
    loadMore, 
    loading, 
    error 
  } = useServicesPaginated({
    category: selectedCategory || undefined,
    barrio: selectedBarrio || undefined,
    userId,
    pageSize
  });

  // Categorías y barrios únicos para filtros (se pueden mover a un contexto global)
  const categories = useMemo(() => [
    'Todas',
    'Peluquería',
    'Abarrotes',
    'Veterinaria',
    'Inmuebles',
    'Restaurante',
    'Tecnología',
    'Salud',
    'Educación',
    'Transporte'
  ], []);

  const barrios = useMemo(() => [
    'Todos',
    'San Isidro',
    'Miraflores',
    'Barranco',
    'Surco',
    'La Molina',
    'San Borja',
    'Magdalena',
    'Pueblo Libre',
    'Jesús María',
    'Lince'
  ], []);

  // Manejadores de filtros
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'Todas' ? '' : category);
  };

  const handleBarrioChange = (barrio: string) => {
    setSelectedBarrio(barrio === 'Todos' ? '' : barrio);
  };

  // Componente de filtros
  const FilterPanel = () => (
    <div className={`bg-white rounded-lg shadow-sm border p-4 mb-6 transition-all duration-300 ${
      showFilterPanel ? 'block' : 'hidden'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por categoría */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 mr-2" />
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category === 'Todas' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por barrio */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Barrio
          </label>
          <select
            value={selectedBarrio}
            onChange={(e) => handleBarrioChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {barrios.map(barrio => (
              <option key={barrio} value={barrio === 'Todos' ? '' : barrio}>
                {barrio}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Componente de carga
  const LoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: pageSize }).map((_, index) => (
        <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
      ))}
    </div>
  );

  // Componente de error
  const ErrorMessage = () => (
    <div className="text-center py-12">
      <div className="text-red-500 text-lg font-medium mb-2">
        Error al cargar servicios
      </div>
      <p className="text-gray-600 mb-4">
        {error?.message || 'Ha ocurrido un error inesperado'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );

  // Componente de servicios vacíos
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg font-medium mb-2">
        No se encontraron servicios
      </div>
      <p className="text-gray-400">
        {selectedCategory || selectedBarrio 
          ? 'Intenta cambiar los filtros para ver más resultados'
          : 'Aún no hay servicios disponibles'
        }
      </p>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Header con título y filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          {title}
          {services.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({services.length} {services.length === 1 ? 'servicio' : 'servicios'})
            </span>
          )}
        </h2>
        
        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${
              showFilterPanel ? 'rotate-180' : ''
            }`} />
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && <FilterPanel />}

      {/* Contenido principal */}
      {error ? (
        <ErrorMessage />
      ) : services.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        <>
          {/* Grid de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {services.map((service) => (
              <div key={service.id} className="transform hover:scale-105 transition-transform duration-200">
                <ServiceCard 
                  service={{
                    id: service.id,
                    slug: service.slug || `service-${service.id}`,
                    name: service.name || 'Servicio sin nombre',
                    description: service.description || '',
                    category: service.category || 'Sin categoría',
                    categorySlug: service.categorySlug || 'sin-categoria',
                    location: service.location,
                    address: service.address,
                    reference: service.reference,
                    rating: service.rating || 0,
                    image: service.image || '/images/default-service.jpg',
                    images: service.images || [],
                    detailsUrl: service.detailsUrl,
                    contactUrl: service.contactUrl,
                    whatsapp: service.whatsapp,
                    social: service.social,
                    horario: service.horario,
                    hours: service.hours,
                    ...(service.images?.main && CloudinaryUtils.isCloudinaryUrl(service.images.main) ? {
                      images: [
                        service.images.main.replace('/upload/', `/upload/${CLOUDINARY_TRANSFORMATIONS.thumbnail}/`),
                        ...(Array.isArray(service.images) ? service.images : [])
                      ]
                    } : {})
                  }}
                />
              </div>
            ))}
          </div>

          {/* Botón "Cargar más" */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cargando...
                  </div>
                ) : (
                  'Cargar más servicios'
                )}
              </button>
            </div>
          )}

          {/* Indicador de final */}
          {!hasMore && services.length > 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">
                Has visto todos los servicios disponibles
              </p>
            </div>
          )}
        </>
      )}

      {/* Loading inicial */}
      {loading && services.length === 0 && <LoadingGrid />}
    </div>
  );
};

export default ServiceList;