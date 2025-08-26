import { NextResponse } from 'next/server';

// Datos mock de servicios para usar como fallback
const mockServices = [
  {
    id: 'mock-1',
    name: 'Restaurante El Sabor',
    category: 'Restaurantes',
    description: 'Comida criolla y platos típicos peruanos',
    address: 'Av. Principal 123, Lima',
    phone: '+51 999 888 777',
    whatsapp: '+51 999 888 777',
    email: 'contacto@elsabor.pe',
    website: 'https://elsabor.pe',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    rating: 4.5,
    reviewCount: 128,
    isOpen: true,
    openingHours: {
      monday: '08:00-22:00',
      tuesday: '08:00-22:00',
      wednesday: '08:00-22:00',
      thursday: '08:00-22:00',
      friday: '08:00-23:00',
      saturday: '08:00-23:00',
      sunday: '09:00-21:00'
    },
    featured: true,
    active: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-08-20').toISOString()
  },
  {
    id: 'mock-2',
    name: 'Abarrotes Don José',
    category: 'Abarrotes',
    description: 'Productos de primera necesidad y abarrotes en general',
    address: 'Jr. Comercio 456, Lima',
    phone: '+51 987 654 321',
    whatsapp: '+51 987 654 321',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
    rating: 4.2,
    reviewCount: 89,
    isOpen: true,
    openingHours: {
      monday: '06:00-22:00',
      tuesday: '06:00-22:00',
      wednesday: '06:00-22:00',
      thursday: '06:00-22:00',
      friday: '06:00-22:00',
      saturday: '06:00-22:00',
      sunday: '07:00-20:00'
    },
    featured: true,
    active: true,
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-08-18').toISOString()
  },
  {
    id: 'mock-3',
    name: 'Lavandería Express',
    category: 'Lavanderías',
    description: 'Servicio de lavado y planchado rápido',
    address: 'Av. Los Olivos 789, Lima',
    phone: '+51 976 543 210',
    whatsapp: '+51 976 543 210',
    image: 'https://images.pexels.com/photos/963278/pexels-photo-963278.jpeg',
    rating: 4.7,
    reviewCount: 156,
    isOpen: false,
    openingHours: {
      monday: '07:00-19:00',
      tuesday: '07:00-19:00',
      wednesday: '07:00-19:00',
      thursday: '07:00-19:00',
      friday: '07:00-19:00',
      saturday: '07:00-17:00',
      sunday: 'Cerrado'
    },
    featured: true,
    active: true,
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-08-22').toISOString()
  },
  {
    id: 'mock-4',
    name: 'Panadería La Espiga',
    category: 'Panaderías',
    description: 'Pan fresco todos los días y productos de pastelería',
    address: 'Jr. Panaderos 321, Lima',
    phone: '+51 965 432 109',
    whatsapp: '+51 965 432 109',
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg',
    rating: 4.8,
    reviewCount: 203,
    isOpen: true,
    openingHours: {
      monday: '05:00-20:00',
      tuesday: '05:00-20:00',
      wednesday: '05:00-20:00',
      thursday: '05:00-20:00',
      friday: '05:00-20:00',
      saturday: '05:00-20:00',
      sunday: '06:00-18:00'
    },
    featured: true,
    active: true,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-08-25').toISOString()
  },
  {
    id: 'mock-5',
    name: 'Farmacia San Miguel',
    category: 'Farmacias',
    description: 'Medicamentos y productos farmacéuticos',
    address: 'Av. Salud 654, Lima',
    phone: '+51 954 321 098',
    whatsapp: '+51 954 321 098',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg',
    rating: 4.3,
    reviewCount: 97,
    isOpen: true,
    openingHours: {
      monday: '08:00-22:00',
      tuesday: '08:00-22:00',
      wednesday: '08:00-22:00',
      thursday: '08:00-22:00',
      friday: '08:00-22:00',
      saturday: '08:00-22:00',
      sunday: '09:00-21:00'
    },
    featured: false,
    active: true,
    createdAt: new Date('2024-04-12').toISOString(),
    updatedAt: new Date('2024-08-19').toISOString()
  },
  {
    id: 'mock-6',
    name: 'Ferretería El Martillo',
    category: 'Ferreterías',
    description: 'Herramientas y materiales de construcción',
    address: 'Jr. Construcción 987, Lima',
    phone: '+51 943 210 987',
    whatsapp: '+51 943 210 987',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
    rating: 4.1,
    reviewCount: 74,
    isOpen: true,
    openingHours: {
      monday: '07:00-18:00',
      tuesday: '07:00-18:00',
      wednesday: '07:00-18:00',
      thursday: '07:00-18:00',
      friday: '07:00-18:00',
      saturday: '07:00-16:00',
      sunday: 'Cerrado'
    },
    featured: false,
    active: true,
    createdAt: new Date('2024-05-08').toISOString(),
    updatedAt: new Date('2024-08-21').toISOString()
  }
];

export async function GET() {
  try {
    console.log('🔄 Usando datos mock como fallback para servicios');
    
    const activeServices = mockServices.filter(service => service.active);
    const featuredServices = mockServices.filter(service => service.featured && service.active);
    const inactiveServices = mockServices.filter(service => !service.active);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      method: 'Mock Data Fallback',
      source: 'fallback',
      total: mockServices.length,
      active: activeServices.length,
      featured: featuredServices.length,
      inactive: inactiveServices.length,
      services: activeServices,
      featuredServices: featuredServices,
      categories: [...new Set(activeServices.map(s => s.category))],
      success: true,
      note: 'Datos de demostración. Configure las variables de Firebase para usar datos reales.'
    });
    
  } catch (error) {
    console.error('❌ Error en API fallback:', error);
    
    return NextResponse.json(
      { 
        error: 'Error en API fallback', 
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
        method: 'Mock Data Fallback'
      },
      { status: 500 }
    );
  }
}