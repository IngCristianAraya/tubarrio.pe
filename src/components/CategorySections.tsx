'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Utensils, Shirt, Cake, Truck, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';

import { useServices } from '../context/ServicesContext';

const CATEGORY_META = [
  {
    id: 'Restaurantes',
    title: 'Sabores de la zona',
    subtitle: 'Restaurantes, hamburguesas, shawarmas y más',
    icon: <Utensils className="w-6 h-6" />, color: 'from-red-500 to-orange-500',
  },
  {
    id: 'Abarrotes',
    title: 'Mercado local',
    subtitle: 'Abarrotes, panaderías y productos frescos',
    icon: <ShoppingCart className="w-6 h-6" />, color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'Lavanderías',
    title: 'Limpieza y lavandería',
    subtitle: 'Lavanderías, tintorerías y más',
    icon: <Shirt className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'Delivery',
    title: 'Delivery & Mensajería',
    subtitle: 'Delivery, mensajería y envíos rápidos',
    icon: <Truck className="w-6 h-6" />, color: 'from-yellow-500 to-orange-400',
  },
  {
    id: 'Servicios',
    title: 'Servicios y más',
    subtitle: 'Peluquerías, clases, técnicos y más',
    icon: <Wrench className="w-6 h-6" />, color: 'from-purple-500 to-pink-500',
  },
];

const CategorySections = () => {
  const router = useRouter();
  const { services } = useServices();
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const servicesPerPage = isMobile ? 1 : 4;

  const categories = CATEGORY_META.map(meta => {
    const categoryServices = services.filter(s => s.category === meta.id);
    return { ...meta, services: categoryServices };
  }).filter(cat => cat.services.length > 0);

  // Función para obtener subcategorías únicas por categoría
  const getUniqueSubcategories = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    const subcategories = category.services.map(service => service.category);
    return ['Todos', ...Array.from(new Set(subcategories))];
  };

  // Función para filtrar servicios por subcategoría
  const getFilteredServices = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    const filter = activeFilters[categoryId] || 'Todos';
    return filter === 'Todos' ? category.services : category.services.filter(service => service.category === filter);
  };

  // Manejador para cambiar filtro
  const handleFilterChange = (categoryId: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [categoryId]: value
    }));
    
    // Reiniciar a la página 1 cuando se cambia el filtro
    setCurrentPage(prev => ({
      ...prev,
      [categoryId]: 1
    }));
  };

  return (
    <section id="categorias" className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <div key={category.id} className={`mb-8 md:mb-16 ${index !== categories.length - 1 ? 'border-b border-gray-200 pb-8 md:pb-16' : ''}`}>
            {/* Category Header */}
            <div className="mb-4 md:mb-12 text-left md:text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white mb-2 md:mb-4`}>
                {category.icon}
              </div>
              <h2 className="text-lg md:text-4xl font-bold text-gray-900 mb-1 md:mb-4">
                {category.title}
              </h2>
              <div className="text-gray-500 text-xs md:text-base mb-1 md:mb-2">{category.subtitle}</div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-center mb-6 md:mb-8">
              <div className="relative w-full max-w-xs mx-auto">
                <select
                  value={activeFilters[category.id] || 'Todas'}
                  onChange={(e) => handleFilterChange(category.id, e.target.value)}
                  className="w-full p-3 text-sm md:text-base bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                  aria-label="Filtrar por subcategoría"
                >
                  {getUniqueSubcategories(category.id).map((subcat) => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Mobile: horizontal scroll sin paginación */}
            <div className="block md:hidden overflow-x-auto pb-2 -mx-2">
              <div className="flex gap-3 px-2" style={{minWidth:'100%'}}>
                {getFilteredServices(category.id)
                  .map((service) => (
                    <div key={service.id + service.name} className="min-w-[220px] max-w-[70vw] flex-shrink-0">
                      <ServiceCard service={service} />
                    </div>
                  ))}
                {getFilteredServices(category.id).length === 0 && (
                  <div className="flex flex-col items-center justify-center min-w-[220px] max-w-[70vw] py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-center">No se encontraron servicios en esta categoría</p>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: grid de 4 columnas */}
            <div className="hidden md:grid grid-cols-4 gap-6">
              {getFilteredServices(category.id)
                .slice(0, servicesPerPage * (currentPage[category.id] || 1))
                .map((service) => (
                  <ServiceCard key={service.id + service.name} service={service} />
                ))}
              {getFilteredServices(category.id).length === 0 && (
                <div className="col-span-4 flex flex-col items-center justify-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-center">No se encontraron servicios en esta categoría</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {getFilteredServices(category.id).length > servicesPerPage && (
              <div className="flex justify-center items-center mt-6 md:mt-8 space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => ({
                    ...prev,
                    [category.id]: Math.max(1, (prev[category.id] || 1) - 1)
                  }))}
                  disabled={(currentPage[category.id] || 1) === 1}
                  className={`${isMobile ? 'w-8 h-8 sm:w-9 sm:h-9' : 'p-3 min-w-[48px] min-h-[48px]'} rounded-lg flex items-center justify-center ${(currentPage[category.id] || 1) === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : `text-white bg-gradient-to-r ${category.color} hover:shadow-md transition-all duration-200`}`}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </button>
                
                {isMobile ? (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {Array.from({ length: Math.ceil(getFilteredServices(category.id).length / servicesPerPage) }, (_, i) => i + 1).map((page) => {
                      // En móviles, mostrar solo página actual, primera, última y una antes/después de la actual
                      const isCurrentPage = (currentPage[category.id] || 1) === page;
                      const isFirstPage = page === 1;
                      const isLastPage = page === Math.ceil(getFilteredServices(category.id).length / servicesPerPage);
                      const isAdjacentPage = Math.abs((currentPage[category.id] || 1) - page) === 1;
                      const shouldShowOnMobile = isCurrentPage || isFirstPage || isLastPage || isAdjacentPage;
                      
                      return shouldShowOnMobile ? (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(prev => ({
                            ...prev,
                            [category.id]: page
                          }))}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs ${isCurrentPage ? `bg-gradient-to-r ${category.color} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'} transition-colors duration-200`}
                          aria-label={`Página ${page}`}
                          aria-current={isCurrentPage ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm font-medium text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                    Página {currentPage[category.id] || 1} de {Math.ceil(getFilteredServices(category.id).length / servicesPerPage)}
                  </div>
                )}
                
                <button 
                  onClick={() => setCurrentPage(prev => ({
                    ...prev,
                    [category.id]: Math.min(Math.ceil(getFilteredServices(category.id).length / servicesPerPage), (prev[category.id] || 1) + 1)
                  }))}
                  disabled={(currentPage[category.id] || 1) >= Math.ceil(getFilteredServices(category.id).length / servicesPerPage)}
                  className={`${isMobile ? 'w-8 h-8 sm:w-9 sm:h-9' : 'p-3 min-w-[48px] min-h-[48px]'} rounded-lg flex items-center justify-center ${(currentPage[category.id] || 1) >= Math.ceil(getFilteredServices(category.id).length / servicesPerPage) ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : `text-white bg-gradient-to-r ${category.color} hover:shadow-md transition-all duration-200`}`}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </button>
              </div>
            )}

            {/* View More Button */}
            <div className="text-center mt-8">
              <button
  onClick={() => {
    router.push('/todos-los-servicios');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }}
  className={`bg-gradient-to-r ${category.color} hover:shadow-lg text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 inline-block`}
>
  Ver todos en {category.title}
</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySections;
