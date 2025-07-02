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
  contactUrl?: string;
  detailsUrl?: string;
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
    name: 'Superburger',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    description: 'Las mejores hamburguesas artesanales.',
    location: 'Sta. Teodosia 573',
    contactUrl: 'https://www.hamburguesaselrey.com',
    detailsUrl: 'https://www.hamburguesaselrey.com'
  },
  {
    id: 2,
    name: 'Pizzería Toscana',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Av. Universitaria 1697',
    description: 'Pizzas a la piedra',
    contactUrl: 'https://www.pizzaitaliana.com',
    detailsUrl: 'https://www.pizzaitaliana.com'
  },
  {
    id: 3,
    name: 'Rey del Shawarma',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    location: 'jr. Santa Nicerata 334',
    description: 'Tacos tradicionales y quesadillas',
    contactUrl: 'https://www.tacoselguero.com',
    detailsUrl: 'https://www.tacoselguero.com'
  },
  {
    id: 4,
    name: 'IRO Sushi',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: 'Av. Universitaria 1743',
    description: 'Sushi fresco y rollos especiales',
    contactUrl: 'https://www.sushiexpress.com',
    detailsUrl: 'https://www.sushiexpress.com'
  },
  {
    id: 5,
    name: 'Bobocha Bubble Tea Shop',
    category: 'Cafeteria',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    location: 'Av. Universitaria 1795',
    description: 'Tienda de bubble té',
    contactUrl: 'https://www.cafecentral.com',
    detailsUrl: 'https://www.cafecentral.com'
  },
  {
    id: 6,
    name: 'Shawarma El Faraón',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    description: 'Auténticos shawarmas y comida árabe preparada con recetas tradicionales',
    location: 'Av. Universitaria 1687',
    contactUrl: 'https://www.shawarmpalace.com',
    detailsUrl: 'https://www.shawarmpalace.com'
  },

  // Abarrotes
  {
    id: 7,
    name: 'Abarrotes Don Richard',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    description: 'Venta de abarrotes, frutas y verduras ',
    location: 'Jirón Sáenz Peña 392',
    contactUrl: 'https://www.abarrotesdonrichard.com',
    detailsUrl: 'https://www.abarrotesdonrichard.com'
  },
  {
    id: 8,
    name: 'Lácteos y Embutidos A&C',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    location: 'Calle Sta Nicerata 354',
    description: 'Lácteos y embutidos',
    contactUrl: 'https://www.supervisorfamiliar.com',
    detailsUrl: 'https://www.supervisorfamiliar.com'
  },
  {
    id: 9,
    name: 'Bodega Mercedes',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    location: 'Calle Sta Nicerata 152',
    description: 'Productos frescos del campo',
    contactUrl: 'https://www.frutasyverdurasmaria.com',
    detailsUrl: 'https://www.frutasyverdurasmaria.com'
  },
  {
    id: 10,
    name: 'Carnicería El Buen Corte',
    category: 'Carnicería',
    image: 'https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Calle Sta Nicerata 120',
    description: 'Carnes frescas y embutidos',
    contactUrl: 'https://www.carniceriabuenacorte.com',
    detailsUrl: 'https://www.carniceriabuenacorte.com'
  },

  // Panaderías
  {
    id: 11,
    name: 'Panadería El Molino',
    category: 'Panaderías',
    image: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    location: 'Calle Sta Nicerata 314',
    description: 'Pan fresco horneado diariamente',
    contactUrl: 'https://www.panaderiasanmiguel.com',
    detailsUrl: 'https://www.panaderiasanmiguel.com'
  },
  {
    id: 12,
    name: 'D Landa Alfajores',
    category: 'Pastelería',
    image: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: 'Calle Santa Teodosia 580',
    description: 'Pasteles artesanales para toda ocasión',
    contactUrl: 'https://www.pasteleriadulcehogar.com',
    detailsUrl: 'https://www.pasteleriadulcehogar.com'
  },

  // Lavanderías
  {
    id: 13,
    name: 'Lavandería Antares',
    category: 'Lavanderías',
    image: 'https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg',
    rating: 4.5,
    location: 'Sta. Teodosia 593',
    description: 'Lavado y planchado profesional',
    contactUrl: 'https://www.lavanderiasantares.com',
    detailsUrl: 'https://www.lavanderiasantares.com'
  },
  {
    id: 14,
    name: 'Lavandería Floiki',
    category: 'Lavanderías',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    location: 'Sta. Teodosia 593',
    description: 'Servicio de lavado y secado en 1 hora',
    contactUrl: 'https://www.lavanderiayfloyki.com',
    detailsUrl: 'https://www.lavanderiayfloyki.com'
  },

  // Delivery
  {
    id: 15,
    name: 'CLOCK BOX',
    category: 'Delivery',
    image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    location: 'Julio Rodavero 971',
    description: 'Envíos rápidos a toda la ciudad',
    contactUrl: 'https://www.deliveryrapido.com',
    detailsUrl: 'https://www.deliveryrapido.com'
  },
  {
    id: 16,
    name: 'Agente BCP',
    category: 'Agentes bancarios',
    image: 'https://images.pexels.com/photos/7706434/pexels-photo-7706434.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    location: 'Calle Sta Nicerata 334',
    description: 'Entregas en menos de 30 minutos',
    contactUrl: 'https://www.mensajeriaveloz.com',
    detailsUrl: 'https://www.mensajeriaveloz.com'
  },

  // Servicios
  {
    id: 17,
    name: 'Trino Tech Solution',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: 'Av. Universitaria 1581',
    description: 'Reparación de celulares y computadoras',
    contactUrl: 'https://www.reparaciones.tech',
    detailsUrl: 'https://www.reparaciones.tech'
  },
  {
    id: 18,
    name: 'Peluquería Estilo',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Sta. Paula 567',
    description: 'Cortes y peinados modernos',
    contactUrl: 'https://www.peluqueriaestilo.com',
    detailsUrl: 'https://www.peluqueriaestilo.com'
  },
  {
    id: 19,
    name: 'Salsa Bachatera',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/8957662/pexels-photo-8957662.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Parque Santa Teodosia',
    description: 'Clases de bailes Salsa y bachata',
    contactUrl: 'https://www.salsabachatera.com',
    detailsUrl: 'https://www.salsabachatera.com'
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
