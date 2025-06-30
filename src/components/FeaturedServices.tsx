'use client';

import { useState } from 'react';
import { Star, MapPin, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const FeaturedServices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 3; // Servicios por página, ajustable según necesidad
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
      name: 'Abarrotes Don José',
      category: 'Abarrotes',
      image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      description: 'Productos frescos, abarrotes y todo lo que necesitas para el hogar',
      location: 'Barrio Norte, 3 min',
      phone: '+1234567891',
      hours: 'Abierto hasta 10:00 PM',
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

  // Calcular el total de páginas
  const totalPages = Math.ceil(featuredServices.length / servicesPerPage);
  
  // Obtener los servicios para la página actual
  const currentServices = featuredServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  // Función para cambiar de página
  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <section id="servicios" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🔥 <span className="text-orange-500">Destacados</span> del mes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Los servicios más populares y mejor calificados por nuestra comunidad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
            >
              {/* Image - altura fija para todas las imágenes */}
              <div className="relative overflow-hidden h-48">
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
                <div className="absolute top-4 left-4">
                  <span className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${service.badge === 'Más Popular' ? 'bg-orange-500 text-white' : service.badge === 'Mejor Precio' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {service.badge}
                  </span>
                </div>
                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold ml-1">{service.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <span className="text-sm text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    {service.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    {service.hours}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                    <Phone className="w-4 h-4 inline-block mr-2" />
                    WhatsApp
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-colors duration-200">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 space-x-3">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg flex items-center justify-center ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-md'}`}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => changePage(index + 1)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentPage === index + 1 ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg flex items-center justify-center ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-md'}`}
              aria-label="Página siguiente"
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