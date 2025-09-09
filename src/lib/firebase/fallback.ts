// Fallback data para cuando Firebase no esté disponible
import { Service } from '@/types/service';

// Datos de servicios de respaldo
export const fallbackServices: Service[] = [
  {
    id: 'agente-bcp',
    name: 'Agente BCP',
    description: 'Servicios bancarios y financieros disponibles en tu zona.',
    category: 'Agentes bancarios',
    barrio: 'San Isidro',
    address: 'Av. Javier Prado Este 123',
    phone: '+51 1 234-5678',
    whatsapp: '+51 987 654 321',
    email: 'contacto@agentebcp.com',
    website: 'https://www.bcp.com.pe',
    images: ['https://images.pexels.com/photos/7706434/pexels-photo-7706434.jpeg?auto=compress&cs=tinysrgb&w=400'],
    rating: 4.5,
    reviewCount: 25,
    active: true,
    featured: true,
    userId: 'user1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '14:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  {
    id: 'bobocha-bubble-tea',
    name: 'Bobocha Bubble Tea Shop',
    description: 'Deliciosos bubble teas y bebidas refrescantes.',
    category: 'Cafeteria',
    barrio: 'Miraflores',
    address: 'Av. Larco 456',
    phone: '+51 1 345-6789',
    whatsapp: '+51 987 123 456',
    email: 'info@bobocha.pe',
    images: ['https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400'],
    rating: 4.8,
    reviewCount: 42,
    active: true,
    featured: true,
    userId: 'user2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    hours: {
      monday: { open: '10:00', close: '22:00', closed: false },
      tuesday: { open: '10:00', close: '22:00', closed: false },
      wednesday: { open: '10:00', close: '22:00', closed: false },
      thursday: { open: '10:00', close: '22:00', closed: false },
      friday: { open: '10:00', close: '23:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    }
  },
  {
    id: 'carniceria-el-buen-corte',
    name: 'Carnicería El Buen Corte',
    description: 'Carnes frescas y de la mejor calidad.',
    category: 'Carnicería',
    barrio: 'San Borja',
    address: 'Av. San Borja Norte 789',
    phone: '+51 1 456-7890',
    whatsapp: '+51 987 456 789',
    images: ['https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'],
    rating: 4.3,
    reviewCount: 18,
    active: true,
    featured: false,
    userId: 'user3',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    hours: {
      monday: { open: '07:00', close: '19:00', closed: false },
      tuesday: { open: '07:00', close: '19:00', closed: false },
      wednesday: { open: '07:00', close: '19:00', closed: false },
      thursday: { open: '07:00', close: '19:00', closed: false },
      friday: { open: '07:00', close: '19:00', closed: false },
      saturday: { open: '07:00', close: '17:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  {
    id: 'panaderia-san-martin',
    name: 'Panadería San Martín',
    description: 'Pan fresco todos los días y productos de panadería.',
    category: 'Panadería',
    barrio: 'Surco',
    address: 'Av. Primavera 321',
    phone: '+51 1 567-8901',
    whatsapp: '+51 987 567 890',
    images: ['https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'],
    rating: 4.6,
    reviewCount: 35,
    active: true,
    featured: true,
    userId: 'user4',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    hours: {
      monday: { open: '06:00', close: '20:00', closed: false },
      tuesday: { open: '06:00', close: '20:00', closed: false },
      wednesday: { open: '06:00', close: '20:00', closed: false },
      thursday: { open: '06:00', close: '20:00', closed: false },
      friday: { open: '06:00', close: '20:00', closed: false },
      saturday: { open: '06:00', close: '20:00', closed: false },
      sunday: { open: '07:00', close: '18:00', closed: false }
    }
  },
  {
    id: 'restaurante-el-sabor',
    name: 'Restaurante El Sabor',
    description: 'Comida criolla y platos tradicionales peruanos.',
    category: 'Restaurantes',
    barrio: 'Barranco',
    address: 'Jr. Unión 654',
    phone: '+51 1 678-9012',
    whatsapp: '+51 987 678 901',
    email: 'reservas@elsabor.pe',
    images: ['https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'],
    rating: 4.7,
    reviewCount: 67,
    active: true,
    featured: true,
    userId: 'user5',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    hours: {
      monday: { open: '12:00', close: '22:00', closed: false },
      tuesday: { open: '12:00', close: '22:00', closed: false },
      wednesday: { open: '12:00', close: '22:00', closed: false },
      thursday: { open: '12:00', close: '22:00', closed: false },
      friday: { open: '12:00', close: '23:00', closed: false },
      saturday: { open: '12:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    }
  },
  {
    id: 'farmacia-salud',
    name: 'Farmacia Salud',
    description: 'Medicamentos y productos farmacéuticos.',
    category: 'Farmacia',
    barrio: 'La Molina',
    address: 'Av. La Molina 987',
    phone: '+51 1 789-0123',
    whatsapp: '+51 987 789 012',
    images: ['https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400'],
    rating: 4.4,
    reviewCount: 28,
    active: true,
    featured: false,
    userId: 'user6',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    hours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '22:00', closed: false },
      sunday: { open: '09:00', close: '21:00', closed: false }
    }
  }
];

// Función para filtrar servicios de respaldo
export const filterFallbackServices = (options: {
  category?: string;
  barrio?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Service[] => {
  let filtered = [...fallbackServices];

  // Filtrar por categoría
  if (options.category && options.category !== 'Todas' && options.category !== 'Todos') {
    filtered = filtered.filter(service => service.category === options.category);
  }

  // Filtrar por barrio
  if (options.barrio) {
    filtered = filtered.filter(service => service.barrio === options.barrio);
  }

  // Filtrar por búsqueda
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower) ||
      service.category.toLowerCase().includes(searchLower)
    );
  }

  // Filtrar por destacados
  if (options.featured) {
    filtered = filtered.filter(service => service.featured);
  }

  // Solo servicios activos
  filtered = filtered.filter(service => service.active);

  // Aplicar offset y límite para paginación
  const startIndex = options.offset || 0;
  const endIndex = options.limit ? startIndex + options.limit : filtered.length;
  
  return filtered.slice(startIndex, endIndex);
};

// Función para obtener un servicio específico
export const getFallbackServiceById = (id: string): Service | null => {
  return fallbackServices.find(service => service.id === id) || null;
};

// Función para verificar si Firebase está disponible
export const isFirebaseAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && !!window.navigator.onLine;
  } catch {
    return false;
  }
};