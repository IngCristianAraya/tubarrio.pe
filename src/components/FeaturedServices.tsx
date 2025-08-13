'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Star, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useServices } from '@/context/ServicesContext';

// Importación dinámica para OptimizedImage con carga perezosa
const OptimizedImage = dynamic(() => import('./OptimizedImage'), {
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />,
  ssr: false
});

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    category: string;
    image: string;
    rating: number;
    description: string;
    location: string;
    horario?: string;
    whatsapp?: string;
    contactUrl?: string;
    detailsUrl?: string; // Añadido para corregir el error de TypeScript
  };
}

// Componente de tarjeta de servicio memoizado
const ServiceCard = memo(({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          width={400}
          height={300}
          loading="lazy"
          objectFit="cover"
          fallbackSrc="/images/placeholder-business.jpg"
        />
        {service.rating >= 4.5 && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            ⭐ {service.rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{service.name}</h3>
          <div className="flex items-center bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 mr-1" fill="currentColor" />
            {service.rating?.toFixed(1) || 'Nuevo'}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {service.description || 'Sin descripción disponible'}
        </p>
        
        {service.location && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{service.location}</span>
          </div>
        )}
        
        {service.horario && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            <span>{service.horario}</span>
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <a
            href={service.detailsUrl || `#`}
            className={`block w-full text-center px-4 py-2 rounded-md font-medium ${
              service.detailsUrl
                ? 'bg-orange-500 text-white hover:bg-orange-600 transition-colors'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {service.detailsUrl ? 'Ver detalles' : 'Próximamente'}
          </a>
        </div>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const FeaturedServices = () => {
  const { services, filteredServices, isSearching } = useServices();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [servicesPerPage, setServicesPerPage] = useState(3);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para manejar la hidratación
  useEffect(() => {
    setIsMounted(true);
    
    const updateServicesPerPage = () => {
      if (typeof window === 'undefined') return;
      setServicesPerPage(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };

    // Establecer valor inicial
    updateServicesPerPage();

    // Usar debounce para evitar demasiadas actualizaciones durante el redimensionamiento
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

  // Obtener categorías únicas de los servicios
  const categories = useMemo(() => {
    if (!services || services.length === 0) return ['Todos'];
    const cats = new Set(services.map(service => service.category));
    return ['Todos', ...Array.from(cats)].sort();
  }, [services]);

  // Filtrar servicios por categoría
  const filteredByCategory = useMemo(() => {
    if (selectedCategory === 'Todos') return filteredServices;
    return filteredServices.filter(service => service.category === selectedCategory);
  }, [filteredServices, selectedCategory]);

  // Calcular servicios paginados
  const currentServices = useMemo(() => {
    const startIndex = (currentPage - 1) * servicesPerPage;
    return filteredByCategory.slice(startIndex, startIndex + servicesPerPage);
  }, [filteredByCategory, currentPage, servicesPerPage]);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredByCategory.length / servicesPerPage);
  }, [filteredByCategory.length, servicesPerPage]);

  // Cambiar de página
  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    // Desplazarse suavemente al inicio de la sección
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Manejar cambio de categoría
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Resetear a la primera página al cambiar de categoría
  }, []);

  // Efecto para manejar la carga inicial
  useEffect(() => {
    if (services.length > 0) {
      setIsLoading(false);
    }
  }, [services]);

  // Si no está montado, mostrar un loader simple
  if (!isMounted) {
    return (
      <section id="servicios" className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar loading si los servicios están cargando
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

  // Si no hay servicios, mostrar mensaje
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

        {/* Filtro de categorías */}
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

        {/* Lista de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Paginación */}
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
      </div>
    </section>
  );
};

export default React.memo(FeaturedServices);