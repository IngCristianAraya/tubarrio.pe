// src/mocks/properties.ts
import { Property, PropertyType } from '@/types/property';

export const propertyTypes: PropertyType[] = [
  {
    id: 'departamento',
    name: 'Departamentos',
    slug: 'departamentos',
    icon: '🏢',
    emoji: '🏢',
    propertyCount: 45
  },
  {
    id: 'casa',
    name: 'Casas',
    slug: 'casas',
    icon: '🏠',
    emoji: '🏠',
    propertyCount: 28
  },
  {
    id: 'local-comercial',
    name: 'Locales Comerciales',
    slug: 'locales-comerciales',
    icon: '🏪',
    emoji: '🏪',
    propertyCount: 15
  },
  {
    id: 'oficina',
    name: 'Oficinas',
    slug: 'oficinas',
    icon: '🏢',
    emoji: '🏢',
    propertyCount: 12
  }
];

export const mockProperties: Property[] = [
  {
    id: 'dept-san-isidro-001',
    slug: 'departamento-san-isidro-moderno',
    title: 'Departamento Moderno en San Isidro',
    description: 'Hermoso departamento de 3 dormitorios con vista al parque, completamente amoblado y en excelente ubicación. Cuenta con cocina equipada, sala-comedor amplia y 2 baños completos.',
    type: 'Departamento',
    typeSlug: 'departamentos',
    neighborhood: 'San Isidro',
    address: 'Av. Javier Prado Este 1234',
    reference: 'Frente al Parque El Olivar',
    district: 'San Isidro',
    zone: 'Lima Centro',
    price: 2800,
    currency: 'PEN',
    priceType: 'rent',
    pricePerM2: 35,
    features: {
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      area: 80,
      furnished: true,
      petFriendly: false,
      balcony: true,
      garden: false,
      pool: true,
      gym: true,
      security: true,
      elevator: true
    },
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    contact: {
      phone: '+51 999 123 456',
      whatsapp: '+51999123456',
      email: 'contacto@inmobiliariapremium.pe',
      agentName: 'María González',
      agencyName: 'Inmobiliaria Premium'
    },
    rating: 4.8,
    views: 245,
    featured: true,
    available: true,
    publishedDate: new Date('2024-01-15'),
    updatedDate: new Date('2024-01-20'),
    detailsUrl: '/inmueble/departamento-san-isidro-moderno',
    contactUrl: 'https://wa.me/51999123456',
    tags: ['amoblado', 'vista al parque', 'moderno', 'céntrico'],
    amenities: ['Piscina', 'Gimnasio', 'Seguridad 24h', 'Ascensor', 'Estacionamiento'],
    coordinates: {
      lat: -12.0969,
      lng: -77.0428
    }
  },
  {
    id: 'casa-miraflores-002',
    slug: 'casa-miraflores-familiar',
    title: 'Casa Familiar en Miraflores',
    description: 'Acogedora casa de 4 dormitorios con jardín privado, perfecta para familias. Ubicada en zona residencial tranquila, cerca de colegios y centros comerciales.',
    type: 'Casa',
    typeSlug: 'casas',
    neighborhood: 'Miraflores',
    address: 'Calle Los Rosales 567',
    reference: 'A 2 cuadras del Parque Kennedy',
    district: 'Miraflores',
    zone: 'Lima Sur',
    price: 4500,
    currency: 'PEN',
    priceType: 'rent',
    pricePerM2: 30,
    features: {
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      area: 150,
      furnished: false,
      petFriendly: true,
      balcony: false,
      garden: true,
      pool: false,
      gym: false,
      security: false,
      elevator: false
    },
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    contact: {
      phone: '+51 987 654 321',
      whatsapp: '+51987654321',
      email: 'ventas@casaslima.pe',
      agentName: 'Carlos Mendoza',
      agencyName: 'Casas Lima'
    },
    rating: 4.6,
    views: 189,
    featured: true,
    available: true,
    publishedDate: new Date('2024-01-10'),
    updatedDate: new Date('2024-01-18'),
    detailsUrl: '/inmueble/casa-miraflores-familiar',
    contactUrl: 'https://wa.me/51987654321',
    tags: ['jardín', 'familiar', 'tranquilo', 'cerca de colegios'],
    amenities: ['Jardín privado', 'Cochera doble', 'Zona de parrilla'],
    coordinates: {
      lat: -12.1203,
      lng: -77.0282
    }
  },
  {
    id: 'local-san-miguel-003',
    slug: 'local-comercial-san-miguel',
    title: 'Local Comercial en San Miguel',
    description: 'Excelente local comercial en zona de alto tránsito, ideal para restaurante, tienda o oficina. Cuenta con baño, depósito y excelente visibilidad desde la calle.',
    type: 'Local Comercial',
    typeSlug: 'locales-comerciales',
    neighborhood: 'San Miguel',
    address: 'Av. La Marina 890',
    reference: 'Cerca al Metro de Lima',
    district: 'San Miguel',
    zone: 'Lima Oeste',
    price: 3200,
    currency: 'PEN',
    priceType: 'rent',
    pricePerM2: 40,
    features: {
      bedrooms: 0,
      bathrooms: 1,
      parking: 0,
      area: 80,
      furnished: false,
      petFriendly: false,
      balcony: false,
      garden: false,
      pool: false,
      gym: false,
      security: false,
      elevator: false
    },
    image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    contact: {
      phone: '+51 955 789 123',
      whatsapp: '+51955789123',
      email: 'locales@comercialperu.pe',
      agentName: 'Ana Torres',
      agencyName: 'Comercial Perú'
    },
    rating: 4.4,
    views: 156,
    featured: false,
    available: true,
    publishedDate: new Date('2024-01-12'),
    updatedDate: new Date('2024-01-19'),
    detailsUrl: '/inmueble/local-comercial-san-miguel',
    contactUrl: 'https://wa.me/51955789123',
    tags: ['comercial', 'alto tránsito', 'céntrico', 'transporte público'],
    amenities: ['Depósito', 'Baño', 'Vitrina', 'Acceso vehicular'],
    coordinates: {
      lat: -12.0776,
      lng: -77.0865
    }
  },
  {
    id: 'dept-surco-004',
    slug: 'departamento-surco-estreno',
    title: 'Departamento de Estreno en Surco',
    description: 'Moderno departamento de 2 dormitorios en edificio nuevo con todas las comodidades. Acabados de primera, cocina equipada y excelente iluminación natural.',
    type: 'Departamento',
    typeSlug: 'departamentos',
    neighborhood: 'Santiago de Surco',
    address: 'Av. Primavera 1456',
    reference: 'Cerca al Jockey Plaza',
    district: 'Santiago de Surco',
    zone: 'Lima Sur',
    price: 2400,
    currency: 'PEN',
    priceType: 'rent',
    pricePerM2: 40,
    features: {
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      area: 60,
      furnished: false,
      petFriendly: true,
      balcony: true,
      garden: false,
      pool: true,
      gym: true,
      security: true,
      elevator: true
    },
    image: 'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    contact: {
      phone: '+51 944 567 890',
      whatsapp: '+51944567890',
      email: 'nuevos@surcohogar.pe',
      agentName: 'Roberto Silva',
      agencyName: 'Surco Hogar'
    },
    rating: 4.9,
    views: 312,
    featured: true,
    available: true,
    publishedDate: new Date('2024-01-08'),
    updatedDate: new Date('2024-01-22'),
    detailsUrl: '/inmueble/departamento-surco-estreno',
    contactUrl: 'https://wa.me/51944567890',
    tags: ['estreno', 'moderno', 'equipado', 'cerca al mall'],
    amenities: ['Piscina', 'Gimnasio', 'Seguridad 24h', 'Ascensor', 'Área de juegos'],
    coordinates: {
      lat: -12.1267,
      lng: -76.9947
    }
  },
  {
    id: 'oficina-san-borja-005',
    slug: 'oficina-san-borja-corporativa',
    title: 'Oficina Corporativa en San Borja',
    description: 'Moderna oficina en edificio corporativo con excelente ubicación. Ideal para empresas medianas, cuenta con salas de reuniones, recepción y área de trabajo abierta.',
    type: 'Oficina',
    typeSlug: 'oficinas',
    neighborhood: 'San Borja',
    address: 'Av. San Luis 2100',
    reference: 'Torre Empresarial San Borja',
    district: 'San Borja',
    zone: 'Lima Centro',
    price: 5500,
    currency: 'PEN',
    priceType: 'rent',
    pricePerM2: 55,
    features: {
      bedrooms: 0,
      bathrooms: 2,
      parking: 3,
      area: 100,
      furnished: true,
      petFriendly: false,
      balcony: false,
      garden: false,
      pool: false,
      gym: false,
      security: true,
      elevator: true
    },
    image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    contact: {
      phone: '+51 933 456 789',
      whatsapp: '+51933456789',
      email: 'oficinas@corporativoperu.pe',
      agentName: 'Patricia Ramos',
      agencyName: 'Corporativo Perú'
    },
    rating: 4.7,
    views: 98,
    featured: false,
    available: true,
    publishedDate: new Date('2024-01-14'),
    updatedDate: new Date('2024-01-21'),
    detailsUrl: '/inmueble/oficina-san-borja-corporativa',
    contactUrl: 'https://wa.me/51933456789',
    tags: ['corporativa', 'amoblada', 'céntrica', 'estacionamiento'],
    amenities: ['Recepción', 'Salas de reuniones', 'Seguridad 24h', 'Ascensor', 'Estacionamiento'],
    coordinates: {
      lat: -12.1058,
      lng: -77.0011
    }
  },
  {
    id: 'casa-pueblo-libre-006',
    slug: 'casa-pueblo-libre-tradicional',
    title: 'Casa Tradicional en Pueblo Libre',
    description: 'Hermosa casa tradicional de 3 dormitorios con patio interior y terraza. Perfecta para familias que buscan tranquilidad en zona histórica de Lima.',
    type: 'Casa',
    typeSlug: 'casas',
    neighborhood: 'Pueblo Libre',
    address: 'Jr. Sucre 345',
    reference: 'A 3 cuadras del Museo Nacional',
    district: 'Pueblo Libre',
    zone: 'Lima Centro',
    price: 2200,
    currency: 'PEN',
    priceType: 'rent',
    pricePerM2: 22,
    features: {
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      area: 100,
      furnished: false,
      petFriendly: true,
      balcony: false,
      garden: true,
      pool: false,
      gym: false,
      security: false,
      elevator: false
    },
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    contact: {
      phone: '+51 922 345 678',
      whatsapp: '+51922345678',
      email: 'tradicional@casashistoricas.pe',
      agentName: 'Luis Herrera',
      agencyName: 'Casas Históricas'
    },
    rating: 4.3,
    views: 134,
    featured: false,
    available: true,
    publishedDate: new Date('2024-01-11'),
    updatedDate: new Date('2024-01-17'),
    detailsUrl: '/inmueble/casa-pueblo-libre-tradicional',
    contactUrl: 'https://wa.me/51922345678',
    tags: ['tradicional', 'histórica', 'patio', 'tranquila'],
    amenities: ['Patio interior', 'Terraza', 'Cochera', 'Zona histórica'],
    coordinates: {
      lat: -12.0732,
      lng: -77.0634
    }
  }
];

export default mockProperties;