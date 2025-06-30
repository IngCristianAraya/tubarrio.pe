'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definición de tipos
export interface Service {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  description: string;
}

interface ServicesContextType {
  services: Service[];
  filteredServices: Service[];
  searchServices: (query: string, category: string) => void;
  resetSearch: () => void;
  isSearching: boolean;
}

// Crear el contexto
const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Datos de servicios combinados de FeaturedServices y CategorySections
const allServices: Service[] = [
  // Restaurantes
  {
    id: 1,
    name: 'Hamburguesas El Rey',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    description: 'Las mejores hamburguesas artesanales de la zona con ingredientes frescos',
    location: 'Centro, 5 min',
  },
  {
    id: 2,
    name: 'Pizza Italiana',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: '8 min',
    description: 'Pizzas artesanales con masa madre'
  },
  {
    id: 3,
    name: 'Tacos El Güero',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    location: '5 min',
    description: 'Tacos tradicionales y quesadillas'
  },
  {
    id: 4,
    name: 'Sushi Express',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: '12 min',
    description: 'Sushi fresco y rollos especiales'
  },
  {
    id: 5,
    name: 'Café Central',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    location: '3 min',
    description: 'Café de especialidad y postres'
  },
  {
    id: 6,
    name: 'Shawarma Palace',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    description: 'Auténticos shawarmas y comida árabe preparada con recetas tradicionales',
    location: 'Plaza Central, 7 min',
  },

  // Abarrotes
  {
    id: 7,
    name: 'Abarrotes Don José',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    description: 'Productos frescos, abarrotes y todo lo que necesitas para el hogar',
    location: 'Barrio Norte, 3 min',
  },
  {
    id: 8,
    name: 'Super Familiar',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    location: '6 min',
    description: 'Todo lo que necesitas para el hogar'
  },
  {
    id: 9,
    name: 'Frutas y Verduras María',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    location: '7 min',
    description: 'Productos frescos del campo'
  },
  {
    id: 10,
    name: 'Carnicería El Buen Corte',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: '9 min',
    description: 'Carnes frescas y embutidos'
  },

  // Panaderías
  {
    id: 11,
    name: 'Panadería San Miguel',
    category: 'Panaderías',
    image: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    location: '4 min',
    description: 'Pan fresco horneado diariamente'
  },
  {
    id: 12,
    name: 'Pastelería Dulce Hogar',
    category: 'Panaderías',
    image: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: '5 min',
    description: 'Pasteles artesanales para toda ocasión'
  },

  // Lavanderías
  {
    id: 13,
    name: 'Lavandería Antares',
    category: 'Lavanderías',
    image: 'https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg',
    rating: 4.5,
    location: '10 min',
    description: 'Lavado y planchado profesional'
  },
  {
    id: 14,
    name: 'Lavandería Floyki',
    category: 'Lavanderías',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    location: '8 min',
    description: 'Servicio de lavado y secado en 1 hora'
  },

  // Delivery
  {
    id: 15,
    name: 'Delivery Rápido',
    category: 'Delivery',
    image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    location: '20 min',
    description: 'Envíos rápidos a toda la ciudad'
  },
  {
    id: 16,
    name: 'Mensajería Veloz',
    category: 'Delivery',
    image: 'https://images.pexels.com/photos/7706434/pexels-photo-7706434.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    location: '15 min',
    description: 'Entregas en menos de 30 minutos'
  },

  // Servicios
  {
    id: 17,
    name: 'Reparaciones Tech',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: '15 min',
    description: 'Reparación de celulares y computadoras'
  },
  {
    id: 18,
    name: 'Peluquería Estilo',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: '8 min',
    description: 'Cortes y peinados modernos'
  },
  {
    id: 19,
    name: 'Salsa Bachatera',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/8957662/pexels-photo-8957662.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Parque Santa Teodosia',
    description: 'Clases de bailes Salsa y bachata'
  }
];

// Provider del contexto
export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchServices = (query: string, category: string) => {
    let results = [...allServices];

    // Filtrar por categoría si no es "Todos los servicios"
    if (category !== 'Todos los servicios') {
      results = results.filter(service => service.category === category);
    }

    // Filtrar por texto de búsqueda
    if (query.trim() !== '') {
      const searchTerms = query.toLowerCase().trim().split(' ');
      results = results.filter(service => {
        const nameMatch = searchTerms.some(term => 
          service.name.toLowerCase().includes(term)
        );
        const descriptionMatch = searchTerms.some(term => 
          service.description.toLowerCase().includes(term)
        );
        return nameMatch || descriptionMatch;
      });
    }

    setFilteredServices(results);
    setIsSearching(true);
  };

  const resetSearch = () => {
    setFilteredServices([]);
    setIsSearching(false);
  };

  return (
    <ServicesContext.Provider value={{ 
      services: allServices, 
      filteredServices, 
      searchServices, 
      resetSearch,
      isSearching 
    }}>
      {children}
    </ServicesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices debe ser usado dentro de un ServicesProvider');
  }
  return context;
};
