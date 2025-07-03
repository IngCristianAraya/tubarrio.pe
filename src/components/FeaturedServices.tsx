'use client';

import { useState } from 'react';
import { Star, MapPin, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const FeaturedServices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  // En móviles mostramos 1 servicio, en tablet 2 y en desktop 3
  const servicesPerPage = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 
                          typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 3;
  const featuredServices = [
    {
      id: 1,
      name: 'Hamburguesas El Rey',
      category: 'Restaurante',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      description: 'Las mejores hamburguesas artesanales de la zona con ingredientes frescos',
      location: 'Centro, 5 min',
      phone: '+1234567890',
      hours: 'Abierto hasta 11:00 PM',
      badge: 'Más Popular'
    },
    {
      id: 2,
      name: 'Abarrotes Don Richard',
      category: 'Abarrotes',
      image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      description: 'Productos frescos, abarrotes y todo lo que necesitas para el hogar',
      location: 'La Comercial, 3 min',
      phone: '+1234567891',
      hours: 'Abierto hasta 11:00 PM',
      badge: 'Mejor Precio'
    },
    {
      id: 3,
      name: 'Shawarma Palace',
      category: 'Comida Árabe',
      image: 'https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      description: 'Auténticos shawarmas y comida árabe preparada con recetas tradicionales',
      location: 'Plaza Central, 7 min',
      phone: '+1234567892',
      hours: 'Abierto hasta 12:00 AM',
      badge: 'Mejor Calificado'
    }
  ];

  // Extraer categorías únicas de los servicios
  const categories = ['Restaurante', 'Abarrotes', 'Comida Árabe'];
  
  // Filtrar servicios por categoría seleccionada
  const filteredServices = selectedCategory === 'Todos'
    ? featuredServices
    : featuredServices.filter(service => service.category === selectedCategory);
  
  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  
  // Obtener los servicios para la página actual
  const currentServices = filteredServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );
  
  // Reiniciar a la página 1 cuando se cambia la categoría
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Función para cambiar de página
  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <section id="servicios" className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            🔥 <span className="text-orange-500">Destacados</span> del mes
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Los servicios más populares y mejor calificados por nuestra comunidad
          </p>
        </div>
        
        {/* Filtro de categorías */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          <div className="w-full max-w-full sm:max-w-3xl overflow-x-auto pb-2 hide-scrollbar">
            <div className="inline-flex p-1 bg-gray-100 rounded-xl min-w-max">
              <button
                onClick={() => handleCategoryChange('Todos')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-2xs sm:text-xs md:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${selectedCategory === 'Todos' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-2xs sm:text-xs md:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${selectedCategory === category ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Estilos para ocultar la barra de desplazamiento */}
        <style jsx global>{`
          .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {currentServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 active:scale-98 border border-gray-100 overflow-hidden group h-full flex flex-col"
            >
              {/* Image - altura fija para todas las imágenes */}
              <div className="relative overflow-hidden h-40 sm:h-44 md:h-48">
                <OptimizedImage
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                  objectFit="cover"
                  loading="lazy"
                  placeholderColor="#f8f9fa"
                  height={192} /* 48 * 4px = 192px altura fija */
                />
                {/* Badge */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                  <span className={`inline-block py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-full text-2xs sm:text-xs font-medium sm:font-semibold ${service.badge === 'Más Popular' ? 'bg-orange-500 text-white' : service.badge === 'Mejor Precio' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {service.badge}
                  </span>
                </div>
                {/* Rating */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center shadow-sm">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  <span className="text-2xs sm:text-xs font-semibold ml-0.5 sm:ml-1">{service.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{service.name}</h3>
                  <span className="text-2xs sm:text-xs text-orange-500 font-medium bg-orange-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {service.category}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 sm:mb-4 text-2xs sm:text-xs md:text-sm leading-relaxed line-clamp-2 flex-grow">
                  {service.description}
                </p>

                {/* Info */}
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 md:mb-5">
                  <div className="flex items-center text-2xs sm:text-xs text-gray-500">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{service.location}</span>
                  </div>
                  <div className="flex items-center text-2xs sm:text-xs text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500 flex-shrink-0" />
                    <span className="truncate">{service.hours}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 sm:gap-2 md:gap-3 mt-auto">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 active:from-orange-700 active:to-yellow-600 text-white font-medium sm:font-semibold py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-all duration-200 text-2xs sm:text-xs md:text-sm min-h-[36px] sm:min-h-[40px] md:min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 flex items-center justify-center">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 flex-shrink-0" />
                    <span>WhatsApp</span>
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 min-w-[36px] sm:min-w-[40px] md:min-w-[44px] min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de paginación */}
        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // En móviles, mostrar solo página actual, primera, última y una antes/después de la actual
              const isCurrentPage = currentPage === page;
              const isFirstPage = page === 1;
              const isLastPage = page === totalPages;
              const isAdjacentPage = Math.abs(currentPage - page) === 1;
              const shouldShowOnMobile = isCurrentPage || isFirstPage || isLastPage || isAdjacentPage;
              
              return (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm ${isCurrentPage ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'} transition-colors duration-200 ${!shouldShowOnMobile ? 'hidden sm:flex' : ''} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
                  aria-label={`Página ${page}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
export default React.memo(FeaturedServices);