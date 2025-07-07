'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definición de tipos
export interface Service {
  id: string; // Cambiado de number a string para slugs amigables con URL
  name: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  description: string;
  contactUrl?: string;
  detailsUrl?: string;
  horario?: string;
  tags?: string[]; // Nuevo: palabras clave para búsqueda avanzada
  hours?: string; // Horario de atención
  social?: string; // Enlace a red social
  whatsapp?: string; // Número de WhatsApp
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
    id: 'superburger',
    name: 'Superburger',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    description: 'Las mejores hamburguesas artesanales.',
    horario: 'Lunes a Viernes: 10:00 - 22:00',
    location: 'Sta. Teodosia 573',
    contactUrl: 'https://www.hamburguesaselrey.com',
    detailsUrl: 'https://delifoods-gamma.vercel.app/',
    tags: ['hamburguesa', 'comida rápida', 'carne', 'papas', 'queso']
  },
  {
    id: 'pizzeria-toscana',
    name: 'Pizzería Toscana',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Av. Universitaria 1697',
    description: 'Pizzas a la piedra',
    contactUrl: 'https://www.pizzaitaliana.com',
    detailsUrl: 'https://www.pizzaitaliana.com',
    tags: ['pizza', 'italiana', 'queso', 'pasta', 'horno', 'comida italiana', 'familiar', 'delivery', 'mozarella', 'tomate']
  },
  {
    id: 'rey-del-shawarma',
    name: 'Rey del Shawarma',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    location: 'jr. Santa Nicerata 334',
    description: 'Tacos tradicionales y quesadillas',
    contactUrl: 'https://www.tacoselguero.com',
    detailsUrl: 'https://www.tacoselguero.com',
    tags: ['shawarma', 'taco', 'quesadilla', 'mexicana', 'árabe', 'pollo', 'carne', 'wrap', 'comida rápida', 'delivery']
  },
  {
    id: 'iro-sushi',
    name: 'IRO Sushi',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: 'Av. Universitaria 1743',
    description: 'Sushi fresco y rollos especiales',
    contactUrl: 'https://www.sushiexpress.com',
    detailsUrl: 'https://www.sushiexpress.com',
    tags: ['sushi', 'japonés', 'makis', 'rollos', 'pescado', 'arroz', 'soya', 'wasabi', 'delivery', 'comida oriental']
  },
  {
    id: 'bobocha-bubble-tea-shop',
    name: 'Bobocha Bubble Tea Shop',
    category: 'Cafeteria',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    location: 'Av. Universitaria 1795',
    description: 'Tienda de bubble té',
    contactUrl: 'https://www.cafecentral.com',
    detailsUrl: 'https://www.cafecentral.com',
    tags: ['bubble tea', 'té', 'bebidas', 'perlas', 'fruta', 'cafetería', 'postres', 'dulces', 'snacks', 'leche']
  },
  {
    id: 'shawarma-el-faraon',
    name: 'Shawarma El Faraón',
    category: 'Restaurantes',
    image: 'https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    description: 'Auténticos shawarmas y comida árabe preparada con recetas tradicionales',
    location: 'Av. Universitaria 1687',
    contactUrl: 'https://www.shawarmpalace.com',
    detailsUrl: 'https://www.shawarmpalace.com',
    tags: ['shawarma', 'árabe', 'pollo', 'carne', 'wrap', 'pan pita', 'delivery', 'comida rápida', 'kebab', 'ensalada']
  },
  {
    id: 'abarrotes-don-richard',
    name: 'Abarrotes Don Richard',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    location: 'Av. Universitaria 1701',
    description: 'Abarrotes y productos de primera necesidad',
    contactUrl: 'https://www.abarrotesdonrichard.com',
    detailsUrl: 'https://www.abarrotesdonrichard.com',
    tags: ['arroz', 'azúcar', 'aceite', 'fideos', 'lentejas', 'menestras', 'galletas', 'leche', 'productos básicos', 'conservas', 'granos', 'harina', 'snacks']
  },
  {
    id: 'lacteos-y-embutidos-ayc',
    name: 'Lácteos y Embutidos A&C',
    category: 'Abarrotes',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Sta. Paula 123',
    description: 'Lácteos frescos y embutidos',
    contactUrl: 'https://www.lacteosayc.com',
    detailsUrl: 'https://www.lacteosayc.com',
    tags: ['queso', 'leche', 'yogurt', 'embutidos', 'mantequilla', 'jamón', 'salchicha', 'pan', 'arroz']
  },
  {
    id: 'carniceria-el-buen-corte',
    name: 'Carnicería El Buen Corte',
    category: 'Carnicería',
    image: 'https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Av. Universitaria 1727',
    description: 'Carnes frescas y cortes especiales',
    contactUrl: 'https://www.carniceriaelbuencorte.com',
    detailsUrl: 'https://www.carniceriaelbuencorte.com',
    tags: ['carne', 'pollo', 'cerdo', 'res', 'cordero', 'chuleta', 'bistec', 'embutidos', 'milanesa', 'pescado', 'hueso', 'asado']
  },
  {
    id: 'lavanderia-antares',
    name: 'Lavandería Antares',
    category: 'Lavanderías',
    image: 'https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg',
    rating: 4.7,
    location: 'Av. Universitaria 1733',
    description: 'Lavado y planchado profesional',
    contactUrl: 'https://www.lavanderiaantares.com',
    detailsUrl: 'https://www.lavanderiaantares.com',
    tags: ['lavandería', 'lavado', 'planchado', 'ropa', 'servicio a domicilio', 'secado', 'limpieza', 'blanco', 'camisas', 'uniforme']
  },
  {
    id: 'clock-box',
    name: 'CLOCK BOX',
    category: 'Delivery',
    image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    location: 'Julio Rodavero 971',
    description: 'Envíos rápidos a toda la ciudad',
    contactUrl: 'https://www.deliveryrapido.com',
    detailsUrl: 'https://www.deliveryrapido.com',
    tags: ['delivery', 'envío', 'reparto', 'paquetería', 'mensajería', 'domicilio', 'rápido', 'servicio express', 'entrega', 'ciudad']
  },
  {
    id: 'agente-bcp',
    name: 'Agente BCP',
    category: 'Agentes bancarios',
    image: 'https://images.pexels.com/photos/7706434/pexels-photo-7706434.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    location: 'Calle Sta Nicerata 334',
    description: 'Entregas en menos de 30 minutos',
    contactUrl: 'https://www.mensajeriaveloz.com',
    detailsUrl: 'https://www.mensajeriaveloz.com',
    tags: ['banco', 'depósito', 'retiro', 'transferencia', 'pagos', 'servicios', 'agente', 'bcp', 'recargas', 'cuenta', 'dinero']
  },
  {
    id: 'trino-tech-solution',
    name: 'Trino Tech Solution',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    location: 'Av. Universitaria 1581',
    description: 'Reparación de celulares y computadoras',
    contactUrl: 'https://www.reparaciones.tech',
    detailsUrl: 'https://www.reparaciones.tech',
    tags: ['celulares', 'computadoras', 'reparación', 'tecnología', 'soporte técnico', 'pantalla', 'batería', 'software', 'hardware', 'accesorios']
  },
  {
    id: 'peluqueria-estilo',
    name: 'Peluquería Estilo',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Sta. Paula 567',
    description: 'Cortes y peinados modernos',
    contactUrl: 'https://www.peluqueriaestilo.com',
    detailsUrl: 'https://www.peluqueriaestilo.com',
    tags: ['peluquería', 'corte', 'cabello', 'peinado', 'tinte', 'barbería', 'secado', 'alisado', 'niños', 'damas', 'caballeros']
  },
  {
    id: 'salsa-bachatera',
    name: 'Salsa Bachatera',
    category: 'Servicios',
    image: 'https://images.pexels.com/photos/8957662/pexels-photo-8957662.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Parque Santa Teodosia',
    description: 'Clases de bailes Salsa y bachata',
    contactUrl: 'https://www.salsabachatera.com',
    detailsUrl: 'https://www.salsabachatera.com',
    tags: ['baile', 'salsa', 'bachata', 'clases', 'danza', 'música', 'academia', 'show', 'ritmo', 'pareja']
  },
  {
    id: 'Panaderia-El-Molino',
    name: 'Panaderia El Molino',
    category: 'Panaderías',
    image: 'https://images.pexels.com/photos/8957662/pexels-photo-8957662.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    location: 'Av. Universitaria 1733',
    description: 'Panaderia El Molino',
    contactUrl: 'https://www.panaderiaelmolino.com',
    detailsUrl: 'https://www.panaderiaelmolino.com',
    tags: ['Pan', 'harina', 'panaderia', 'pastel','Tortas','Pastel', 'Pastelería','Repostería', 'Panadería artesanal', 'Horno', 'Productos horneados', 'Desayunos', 'Meriendas', 'Pan de molde','Baguettes']
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
        const tagsMatch = service.tags
          ? searchTerms.some(term => service.tags!.some(tag => tag.toLowerCase().includes(term)))
          : false;
        return nameMatch || descriptionMatch || tagsMatch;
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
