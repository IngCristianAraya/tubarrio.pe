'use client';

import { useState } from 'react';
import { ShoppingCart, Utensils, Shirt, Cake, Truck, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';

const CategorySections = () => {
  // Estado para controlar la paginación
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const servicesPerPage = 4; // Número de servicios por página
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
          name: 'Tacos El Güero',
          category: 'Comida Mexicana',
          image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.5,
          location: '5 min',
          description: 'Tacos tradicionales y quesadillas'
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

  return (
    <section id="categorias" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <div key={category.id} className={`mb-16 ${index !== categories.length - 1 ? 'border-b border-gray-200 pb-16' : ''}`}>
            {/* Category Header */}
            <div className="text-center mb-12">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white mb-4`}>
                {category.icon}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {category.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {category.subtitle}
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.services
                .slice(
                  ((currentPage[category.id] || 1) - 1) * servicesPerPage,
                  (currentPage[category.id] || 1) * servicesPerPage
                )
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>

            {/* Pagination Controls */}
            {category.services.length > servicesPerPage && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => ({
                    ...prev,
                    [category.id]: Math.max(1, (prev[category.id] || 1) - 1)
                  }))}
                  disabled={(currentPage[category.id] || 1) === 1}
                  className={`p-2 rounded-lg flex items-center justify-center ${(currentPage[category.id] || 1) === 1 ? 'text-gray-400 cursor-not-allowed' : `text-white bg-gradient-to-r ${category.color} hover:shadow-md`}`}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="text-sm font-medium text-gray-700">
                  Página {currentPage[category.id] || 1} de {Math.ceil(category.services.length / servicesPerPage)}
                </div>
                
                <button 
                  onClick={() => setCurrentPage(prev => ({
                    ...prev,
                    [category.id]: Math.min(Math.ceil(category.services.length / servicesPerPage), (prev[category.id] || 1) + 1)
                  }))}
                  disabled={(currentPage[category.id] || 1) >= Math.ceil(category.services.length / servicesPerPage)}
                  className={`p-2 rounded-lg flex items-center justify-center ${(currentPage[category.id] || 1) >= Math.ceil(category.services.length / servicesPerPage) ? 'text-gray-400 cursor-not-allowed' : `text-white bg-gradient-to-r ${category.color} hover:shadow-md`}`}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
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
