'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Utensils, Shirt, Cake, Truck, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';

const CategorySections = () => {
  // Estado para controlar la paginación y filtros
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Verificar al cargar y cuando cambia el tamaño de la ventana
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Número de servicios por página (adaptativo)
  const servicesPerPage = isMobile ? 1 : 4;
  const categories = [
    {
      id: 'food',
      title: 'Sabores de la zona',
      subtitle: 'Restaurantes, hamburguesas, shawarmas y más',
      icon: <Utensils className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500',
      services: [
        {
          id: 1,
          name: 'Pizza Italiana',
          category: 'Pizzería',
          image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.7,
          location: '8 min',
          description: 'Pizzas artesanales con masa madre'
        },
        {
          id: 2,
          name: 'Angie Corazón',
          category: 'Anticuchos',
          image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.5,
          location: 'Sta. Teodosia 573',
          description: 'Anticuchos de corazón de Res'
        },
        {
          id: 3,
          name: 'Sushi Express',
          category: 'Comida Japonesa',
          image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.8,
          location: '12 min',
          description: 'Sushi fresco y rollos especiales'
        },
        {
          id: 4,
          name: 'Café Central',
          category: 'Cafetería',
          image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.6,
          location: '3 min',
          description: 'Café de especialidad y postres'
        }
      ]
    },
    {
      id: 'groceries',
      title: 'Mercado local',
      subtitle: 'Abarrotes, panaderías y productos frescos',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      services: [
        {
          id: 5,
          name: 'Super Familiar',
          category: 'Supermercado',
          image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.4,
          location: '6 min',
          description: 'Todo lo que necesitas para el hogar'
        },
        {
          id: 6,
          name: 'Panadería San Miguel',
          category: 'Panadería',
          image: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.9,
          location: '4 min',
          description: 'Pan fresco horneado diariamente'
        },
        {
          id: 7,
          name: 'Frutas y Verduras María',
          category: 'Frutería',
          image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.6,
          location: '7 min',
          description: 'Productos frescos del campo'
        },
        {
          id: 8,
          name: 'Carnicería El Buen Corte',
          category: 'Carnicería',
          image: 'https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.7,
          location: '9 min',
          description: 'Carnes frescas y embutidos'
        }
      ]
    },
    {
      id: 'services',
      title: 'Servicios express',
      subtitle: 'Lavanderías, delivery y servicios rápidos',
      icon: <Wrench className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      services: [
        {
          id: 9,
          name: 'Lavandería Antares',
          category: 'Lavandería',
          image: 'https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg',
          rating: 4.5,
          location: '10 min',
          description: 'Servicio rápido y de calidad'
        },
        {
          id: 10,
          name: 'Mensajería Express',
          category: 'Delivery',
          image: 'https://images.pexels.com/photos/4391478/pexels-photo-4391478.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.3,
          location: '15 min',
          description: 'Entregas en tiempo récord'
        },
        {
          id: 11,
          name: 'Cerrajería 24/7',
          category: 'Cerrajería',
          image: 'https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.8,
          location: '5 min',
          description: 'Servicio de emergencia disponible'
        },
        {
          id: 12,
          name: 'Peluquería Estilo',
          category: 'Belleza',
          image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.7,
          location: '8 min',
          description: 'Cortes y peinados modernos'
        }
      ]
    }
  ];

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
          <div key={category.id} className={`mb-12 md:mb-16 ${index !== categories.length - 1 ? 'border-b border-gray-200 pb-12 md:pb-16' : ''}`}>
            {/* Category Header */}
            <div className="text-center mb-8 md:mb-12">
              <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white mb-3 md:mb-4`}>
                {category.icon}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                {category.title}
              </h2>
              <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
                {category.subtitle}
              </p>
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

            {/* Services Display - Grid for desktop, Slider for mobile */}
            {isMobile ? (
              <div className="relative overflow-hidden py-2">
                <div className="flex flex-col items-center">
                  {getFilteredServices(category.id).length > 0 ? (
                    <div className="w-full max-w-sm mx-auto">
                      {getFilteredServices(category.id)
                        .slice(
                          ((currentPage[category.id] || 1) - 1) * servicesPerPage,
                          (currentPage[category.id] || 1) * servicesPerPage
                        )
                        .map((service) => (
                          <div key={service.id} className="w-full px-2">
                            <ServiceCard service={service} />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center w-full">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No se encontraron servicios en esta categoría</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {getFilteredServices(category.id)
                  .slice(
                    ((currentPage[category.id] || 1) - 1) * servicesPerPage,
                    (currentPage[category.id] || 1) * servicesPerPage
                  )
                  .map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                
                {/* Mensaje cuando no hay resultados */}
                {getFilteredServices(category.id).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No se encontraron servicios en esta categoría</p>
                  </div>
                )}
              </div>
            )}

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
              <button className={`bg-gradient-to-r ${category.color} hover:shadow-lg text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105`}>
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
