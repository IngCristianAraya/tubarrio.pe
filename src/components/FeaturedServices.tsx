'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Mock data for services
const MOCK_SERVICES = [
  {
    id: '1',
    name: 'Creciendo Digital Cursos',
    description: 'Cursos de programación para principiantes y avanzados.',
    category: 'Tecnología',
    image: '/images/cursos_de_programacion.png',
    rating: 4.8,
    location: 'Pando 3ra Etapa',
    contactUrl: '#',
    detailsUrl: '#',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  },
  {
    id: '2',
    name: 'Clases de Guitarra',
    description: 'Aprende a tocar guitarra desde cero o mejora tu técnica.',
    category: 'Educación',
    image: '/images/placeholder-service.jpg',
    rating: 4.9,
    location: 'Centro',
    contactUrl: 'https://tubarrio.pe/',
    detailsUrl: 'https://tubarrio.pe/',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  },
  {
    id: '3',
    name: 'Reparación de Computadoras',
    description: 'Solución rápida a problemas de hardware y software.',
    category: 'Tecnología',
    image: '/images/placeholder-service.jpg',
    rating: 4.7,
    location: 'Zona Sur',
    contactUrl: '#',
    detailsUrl: '#',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  },
  {
    id: '4',
    name: 'Diseño Gráfico',
    description: 'Diseños profesionales para tu marca o negocio.',
    category: 'Diseño',
    image: '/images/placeholder-service.jpg',
    rating: 4.9,
    location: 'Zona Este',
    contactUrl: '#',
    detailsUrl: '#',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  }
];

// Lazy load components
const ServiceCard = dynamic(() => import('./ServiceCard'), { ssr: false });
const ChevronLeft = dynamic(
  () => import('lucide-react').then(mod => mod.ChevronLeft),
  { ssr: false }
);
const ChevronRight = dynamic(
  () => import('lucide-react').then(mod => mod.ChevronRight),
  { ssr: false }
);

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  contactUrl: string;
  detailsUrl: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

const FeaturedServices: React.FC = () => {
  const [state, setState] = useState({
    currentPage: 1,
    selectedCategory: 'Todas',
    isMobile: false,
    servicesPerPage: 3
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setState(prev => ({
        ...prev,
        isMobile: isMobileView,
        servicesPerPage: isMobileView ? 1 : 3
      }));
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Filter services by selected category
  const filteredServices = useMemo(() => {
    if (state.selectedCategory === 'Todas') {
      return MOCK_SERVICES;
    }
    return MOCK_SERVICES.filter(service => 
      service.category === state.selectedCategory && service.active
    );
  }, [state.selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / state.servicesPerPage);
  const currentServices = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.servicesPerPage;
    return filteredServices.slice(startIndex, startIndex + state.servicesPerPage);
  }, [filteredServices, state.currentPage, state.servicesPerPage]);

  // Extract unique categories for the filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(MOCK_SERVICES.map(service => service.category)));
    return ['Todas', ...uniqueCategories];
  }, []);

  // Navigation handlers
  const goToPage = (page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, totalPages))
    }));
  };

  const nextPage = () => {
    if (state.currentPage < totalPages) {
      setState(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  const prevPage = () => {
    if (state.currentPage > 1) {
      setState(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setState(prev => ({
      ...prev,
      selectedCategory: category,
      currentPage: 1
    }));
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Servicios Destacados</h2>
          
          {/* Category Filter */}
          <div className="mt-4">
            <select
              value={state.selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="block w-full max-w-xs mx-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {service.image ? (
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Imagen no disponible</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
                <div className="mt-3 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-700">{service.rating}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">{service.location}</span>
                </div>
                <div className="mt-4">
                  <a 
                    href={service.detailsUrl} 
                    className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Ver detalles
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={prevPage}
              disabled={state.currentPage === 1}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-gray-700">
              Página {state.currentPage} de {totalPages}
            </span>
            
            <button
              onClick={nextPage}
              disabled={state.currentPage >= totalPages}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Siguiente página"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;
