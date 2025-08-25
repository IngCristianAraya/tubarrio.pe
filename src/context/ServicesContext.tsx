'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Definición de tipos
export interface Service {
  id: string; // Cambiado de number a string para slugs amigables con URL
  name: string;
  category: string;
  image: string;
  images?: string[]; // Array de múltiples imágenes
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
  active?: boolean; // Estado activo/inactivo del servicio
}

// Tipos de carga de datos
export type LoadType = 'all' | 'featured' | 'single' | 'paginated';

interface ServicesContextType {
  services: Service[];
  filteredServices: Service[];
  featuredServices: Service[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  isRetrying: boolean;
  retryCount: number;
  nextRetryTime: Date | null;
  currentLoadType: LoadType;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  refreshServices: (forceRefresh?: boolean) => Promise<void>;
  softRefresh: () => Promise<void>;
  hardRefresh: () => Promise<void>;
  getServiceBySlug: (slug: string) => Service | undefined;
  searchServices: (query: string) => void;
  resetSearch: () => void;
  isSearching: boolean;
  retryConnection: () => void;
  // Nuevas funciones optimizadas
  loadFeaturedServices: (forceRefresh?: boolean) => Promise<void>;
  loadSingleService: (serviceId: string) => Promise<Service | null>;
  loadServicesPaginated: (page: number, limit: number) => Promise<Service[]>;
}

// Firebase
import { db } from '../lib/firebase/config';
import { collection, getDocs, QueryDocumentSnapshot, query, orderBy, where, limit } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import localServicesData from '../../services.json';

// Crear el contexto
const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Mock data for when Firebase is not available
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Restaurante El Sabor',
    category: 'Restaurantes',
    image: '/images/hero_001.webp',
    rating: 4.5,
    location: 'Lima, Perú',
    description: 'Deliciosa comida criolla y platos tradicionales peruanos. Ambiente familiar y acogedor.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Lun-Dom 12:00 PM - 10:00 PM',
    whatsapp: '+51999999999',
    tags: ['comida', 'criolla', 'tradicional']
  },
  {
    id: '2',
    name: 'Panadería San Martín',
    category: 'Panadería',
    image: '/images/hero_001.webp',
    rating: 4.8,
    location: 'San Martín de Porres, Lima',
    description: 'Pan fresco todos los días, pasteles y tortas para ocasiones especiales.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Lun-Dom 6:00 AM - 9:00 PM',
    whatsapp: '+51987654321',
    tags: ['pan', 'pasteles', 'tortas']
  },
  {
    id: 'panaderia-el-molinos',
    name: 'Panadería El Molinos',
    category: 'Panadería',
    image: '/images/panaderia-el-molinos/panaderia_molino_2.webp',
    images: [
      '/images/panaderia-el-molinos/panaderia_molino_2.webp',
      '/images/panaderia-el-molinos/panaderia_molino_3.webp',
      '/images/panaderia-el-molinos/panaderia_molino_4.webp',
      '/images/panaderia-el-molinos/panaderia_molino_5.webp'
    ],
    rating: 4.9,
    location: 'Lima Norte, Perú',
    description: 'Panadería artesanal con productos frescos y de calidad. Especialistas en panes tradicionales y repostería.',
    contactUrl: 'https://wa.me/51987654321',
    detailsUrl: '/servicio/panaderia-el-molinos',
    hours: 'Lun-Dom 5:00 AM - 10:00 PM',
    whatsapp: '+51987654321',
    tags: ['panadería', 'artesanal', 'repostería'],
    active: true
  },
  {
    id: '3',
    name: 'Ferretería Los Andes',
    category: 'Ferretería',
    image: '/images/hero_001.webp',
    rating: 4.2,
    location: 'Los Olivos, Lima',
    description: 'Todo lo que necesitas para tu hogar y construcción. Herramientas y materiales de calidad.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Lun-Sab 8:00 AM - 7:00 PM',
    whatsapp: '+51912345678',
    tags: ['herramientas', 'construcción', 'hogar']
  },
  {
    id: '4',
    name: 'Salón de Belleza Glamour',
    category: 'Belleza',
    image: '/images/hero_001.webp',
    rating: 4.7,
    location: 'Independencia, Lima',
    description: 'Servicios de peluquería, manicure, pedicure y tratamientos de belleza.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Mar-Dom 9:00 AM - 7:00 PM',
    whatsapp: '+51923456789',
    tags: ['belleza', 'peluquería', 'manicure']
  },
  {
    id: '5',
    name: 'Farmacia Central',
    category: 'Salud',
    image: '/images/hero_001.webp',
    rating: 4.6,
    location: 'Comas, Lima',
    description: 'Medicamentos, productos de cuidado personal y atención farmacéutica profesional.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Lun-Dom 7:00 AM - 11:00 PM',
    whatsapp: '+51934567890',
    tags: ['medicamentos', 'salud', 'farmacia']
  },
  {
    id: '6',
    name: 'Taller Mecánico Rodríguez',
    category: 'Automotriz',
    image: '/images/hero_001.webp',
    rating: 4.3,
    location: 'Puente Piedra, Lima',
    description: 'Reparación y mantenimiento de vehículos. Servicio técnico especializado.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Lun-Sab 8:00 AM - 6:00 PM',
    whatsapp: '+51945678901',
    tags: ['mecánica', 'autos', 'reparación']
  },
  {
    id: '7',
    name: 'Minimarket Don José',
    category: 'Abarrotes',
    image: '/images/hero_001.webp',
    rating: 4.1,
    location: 'Carabayllo, Lima',
    description: 'Productos de primera necesidad, abarrotes y artículos para el hogar.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Lun-Dom 6:00 AM - 11:00 PM',
    whatsapp: '+51956789012',
    tags: ['abarrotes', 'productos', 'minimarket']
  },
  {
    id: '8',
    name: 'Academia de Inglés Future',
    category: 'Educación',
    image: '/images/hero_001.webp',
    rating: 4.9,
    location: 'San Martín de Porres, Lima',
    description: 'Cursos de inglés para niños, jóvenes y adultos. Metodología moderna y efectiva.',
    contactUrl: '#',
    detailsUrl: '#',
    hours: 'Lun-Vie 3:00 PM - 9:00 PM, Sab 9:00 AM - 1:00 PM',
    whatsapp: '+51967890123',
    tags: ['inglés', 'educación', 'cursos']
  }
];

// Provider del contexto
export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [usingMockData, setUsingMockData] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryTime, setNextRetryTime] = useState<Date | null>(null);
  const [retryTimer, setRetryTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [cacheExpiry] = useState(5 * 60 * 1000); // 5 minutos de cache
  const [currentLoadType, setCurrentLoadType] = useState<LoadType>('all');
  
  // Cache para diferentes tipos de datos
  const [featuredCache, setFeaturedCache] = useState<{ data: Service[], timestamp: Date } | null>(null);
  const [singleServiceCache, setSingleServiceCache] = useState<Map<string, { data: Service, timestamp: Date }>>(new Map());

  const loadLocalServices = () => {
     try {
       // Convertir datos locales al formato esperado
       const localServices: Service[] = localServicesData.map((service: any) => ({
         id: service.id,
         name: service.name,
         category: service.category,
         description: service.description,
         image: service.image,
         images: service.images || [service.image],
         rating: service.rating,
         location: service.location,
         contactUrl: service.contactUrl,
         detailsUrl: service.detailsUrl,
         whatsapp: service.whatsapp,
         tags: service.tags || [],
         hours: service.horario || service.hours || '',
         active: service.active !== false
       }));
       
       const activeServices = localServices.filter(service => service.active);
       setServices(activeServices);
       setFilteredServices(activeServices);
       console.log(`Cargados ${activeServices.length} servicios desde datos locales`);
     } catch (error) {
       console.error('Error cargando datos locales:', error);
       setServices(mockServices);
       setFilteredServices(mockServices);
     }
   };

   const scheduleRetry = () => {
     // Limpiar timer anterior si existe
     if (retryTimer) {
       clearTimeout(retryTimer);
     }

     // Incrementar contador de reintentos
     setRetryCount(prev => prev + 1);
     
     // Calcular tiempo de espera (5 minutos)
     const retryDelay = 5 * 60 * 1000; // 5 minutos en milisegundos
     const nextRetry = new Date(Date.now() + retryDelay);
     setNextRetryTime(nextRetry);
     
     console.log(`Programando reintento automático en 5 minutos (${nextRetry.toLocaleTimeString()})`);
     
     const timer = setTimeout(() => {
       console.log('Ejecutando reintento automático...');
       setIsRetrying(true);
       loadServicesFromFirestore();
     }, retryDelay);
     
     setRetryTimer(timer);
   };

   // Función optimizada para cargar solo servicios destacados (6-8 servicios)
   const loadFeaturedServices = useCallback(async (forceRefresh = false) => {
     try {
       setLoading(true);
       setError(null);
       setCurrentLoadType('featured');
       
       if (!db) {
         throw new Error('Firebase no está disponible');
       }
       
       // Verificar cache de servicios destacados
       if (!forceRefresh && featuredCache) {
         const timeSinceLastFetch = Date.now() - featuredCache.timestamp.getTime();
         if (timeSinceLastFetch < cacheExpiry) {
           console.log('Usando servicios destacados en cache');
           setFeaturedServices(featuredCache.data);
           setLoading(false);
           return;
         }
       }
       
       console.log('Cargando servicios destacados desde Firebase...');
       
       // Consulta optimizada para servicios destacados (solo 8 servicios)
       const featuredQuery = query(
         collection(db, 'services'),
         orderBy('rating', 'desc'), // Ordenar por rating para obtener los mejores
         limit(8) // Solo 8 servicios destacados
       );
       const featuredSnapshot = await getDocs(featuredQuery);
       
       const featuredData = featuredSnapshot.docs.map(doc => {
         const data = doc.data();
         return {
           id: doc.id,
           ...data,
           createdAt: data.createdAt?.toDate?.() || new Date(),
           updatedAt: data.updatedAt?.toDate?.() || new Date()
         } as Service;
       });
       
       const activeFeatured = featuredData.filter(service => service.active !== false);
       setFeaturedServices(activeFeatured);
       setFeaturedCache({ data: activeFeatured, timestamp: new Date() });
       setUsingMockData(false);
       
       console.log(`✅ ${activeFeatured.length} servicios destacados cargados (${featuredSnapshot.docs.length} lecturas)`);
       
     } catch (error: any) {
       console.error('Error cargando servicios destacados:', error);
       // Fallback a servicios mock destacados
       const mockFeatured = mockServices.slice(0, 6);
       setFeaturedServices(mockFeatured);
       setUsingMockData(true);
     } finally {
       setLoading(false);
     }
   }, [db, featuredCache, cacheExpiry]);
   
   // Función para cargar un servicio específico
   const loadSingleService = useCallback(async (serviceId: string): Promise<Service | null> => {
     try {
       if (!db) {
         throw new Error('Firebase no está disponible');
       }
       
       // Verificar cache de servicio individual
       const cached = singleServiceCache.get(serviceId);
       if (cached) {
         const timeSinceLastFetch = Date.now() - cached.timestamp.getTime();
         if (timeSinceLastFetch < cacheExpiry) {
           console.log(`Usando servicio ${serviceId} en cache`);
           return cached.data;
         }
       }
       
       console.log(`Cargando servicio individual: ${serviceId}`);
       
       // Consulta específica para un solo servicio (1 lectura)
       const serviceQuery = query(
         collection(db, 'services'),
         where('__name__', '==', serviceId),
         limit(1)
       );
       const serviceSnapshot = await getDocs(serviceQuery);
       
       if (serviceSnapshot.empty) {
         console.log(`Servicio ${serviceId} no encontrado`);
         return null;
       }
       
       const doc = serviceSnapshot.docs[0];
       const data = doc.data();
       const service: Service = {
         id: doc.id,
         ...data,
         createdAt: data.createdAt?.toDate?.() || new Date(),
         updatedAt: data.updatedAt?.toDate?.() || new Date()
       } as Service;
       
       // Guardar en cache
       const newCache = new Map(singleServiceCache);
       newCache.set(serviceId, { data: service, timestamp: new Date() });
       setSingleServiceCache(newCache);
       
       console.log(`✅ Servicio ${serviceId} cargado (1 lectura)`);
       return service;
       
     } catch (error: any) {
       console.error(`Error cargando servicio ${serviceId}:`, error);
       // Fallback a datos locales o mock
       const mockService = mockServices.find(s => s.id === serviceId);
       return mockService || null;
     }
   }, [db, singleServiceCache, cacheExpiry]);
   
   // Función para carga paginada
   const loadServicesPaginated = useCallback(async (page: number, limit: number = 12): Promise<Service[]> => {
     try {
       if (!db) {
         throw new Error('Firebase no está disponible');
       }
       
       console.log(`Cargando página ${page} con ${limit} servicios`);
       
       const offset = (page - 1) * limit;
       const paginatedQuery = query(
         collection(db, 'services'),
         orderBy('name'),
         limit(limit)
         // TODO: Implementar offset real con startAfter para paginación eficiente
       );
       
       const paginatedSnapshot = await getDocs(paginatedQuery);
       
       const paginatedData = paginatedSnapshot.docs.map(doc => {
         const data = doc.data();
         return {
           id: doc.id,
           ...data,
           createdAt: data.createdAt?.toDate?.() || new Date(),
           updatedAt: data.updatedAt?.toDate?.() || new Date()
         } as Service;
       });
       
       const activeServices = paginatedData.filter(service => service.active !== false);
       console.log(`✅ Página ${page} cargada: ${activeServices.length} servicios (${paginatedSnapshot.docs.length} lecturas)`);
       
       return activeServices;
       
     } catch (error: any) {
       console.error(`Error cargando página ${page}:`, error);
       // Fallback a datos mock paginados
       const offset = (page - 1) * limit;
       return mockServices.slice(offset, offset + limit);
     }
   }, [db]);

   const loadServicesFromFirestore = async (forceRefresh = false) => {
     try {
       setLoading(true);
       setError(null);
       setCurrentLoadType('all');
       
       if (!db) {
         throw new Error('Firebase no está disponible');
       }
       
       // Verificar cache para evitar consultas innecesarias
       if (!forceRefresh && lastFetchTime && services.length > 0) {
         const timeSinceLastFetch = Date.now() - lastFetchTime.getTime();
         if (timeSinceLastFetch < cacheExpiry) {
           console.log('Usando datos en cache, evitando consulta a Firebase');
           setLoading(false);
           return;
         }
       }
       
       console.log('Realizando consulta optimizada a Firebase...');
       
       // Optimizar consulta con límite para reducir uso de cuota
       const servicesQuery = query(
         collection(db, 'services'), // Corregido: usar 'services' en lugar de 'servicios'
         orderBy('name'),
         limit(50) // Limitar a 50 servicios para reducir cuota
       );
       const servicesSnapshot = await getDocs(servicesQuery);
       
       const servicesData = servicesSnapshot.docs.map(doc => {
         const data = doc.data();
         return {
           id: doc.id,
           ...data,
           createdAt: data.createdAt?.toDate?.() || new Date(),
           updatedAt: data.updatedAt?.toDate?.() || new Date()
         } as Service;
       });
       
       const activeServices = servicesData.filter(service => service.active !== false);
       setServices(activeServices);
       setFilteredServices(activeServices);
       setUsingMockData(false);
       setLastFetchTime(new Date()); // Actualizar timestamp del cache
       
       // Limpiar estado de reintento si fue exitoso
       if (retryTimer) {
         clearTimeout(retryTimer);
         setRetryTimer(null);
       }
       setRetryCount(0);
       setNextRetryTime(null);
       setIsRetrying(false);
       
       console.log(`✅ Reconexión exitosa: ${activeServices.length} servicios cargados desde Firebase`);
       toast.success('Conexión restablecida con la base de datos');
       
     } catch (error: any) {
       console.error('Error en reintento:', error);
       setIsRetrying(false);
       
       // Si sigue siendo error de cuota, programar otro reintento
       if (error?.code === 'resource-exhausted' || 
           error?.message?.includes('Quota exceeded') ||
           error?.message?.includes('429')) {
         scheduleRetry();
       }
     } finally {
       setLoading(false);
     }
   };

  // Cargar servicios desde Firestore o usar datos mock
  React.useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        // Si Firebase está deshabilitado, usar datos mock
        if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true' || !db) {
          console.log('Usando datos mock para servicios');
          setServices(mockServices);
          setFilteredServices(mockServices);
          setUsingMockData(true);
          setLoading(false);
          return;
        }
        
        await loadServicesFromFirestore();
        
      } catch (error: any) {
        console.error('Error al cargar servicios:', error);
        
        // Verificar si es un error de cuota excedida
         if (error?.code === 'resource-exhausted' || 
             error?.message?.includes('Quota exceeded') ||
             error?.message?.includes('429')) {
           console.warn('Cuota de Firebase excedida, usando datos locales como fallback');
           toast('Conectando con datos locales debido a límites temporales del servidor', { icon: 'ℹ️' });
           loadLocalServices();
           setUsingMockData(true);
           scheduleRetry();
         } else {
           console.log('Fallback a datos mock');
           setServices(mockServices);
           setFilteredServices(mockServices);
           setUsingMockData(true);
         }
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, []);

  const searchServices = (query: string, category: string) => {
    if (usingMockData) {
      // Para datos de prueba, solo mostrar un mensaje
      toast('Configura Firebase para habilitar la búsqueda completa', { icon: 'ℹ️' });
      return;
    }
    
    setIsSearching(true);
    let filtered = [...services];

    // Filtrar por búsqueda
    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery) || 
        service.description?.toLowerCase().includes(searchQuery) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    // Filtrar por categoría
    if (category && category !== 'Todos los servicios') {
      filtered = filtered.filter(service => service.category === category);
    }

    setFilteredServices(filtered);
    setIsSearching(false);
  };

  const resetSearch = () => {
    setFilteredServices([]);
    setIsSearching(false);
  };

  // Función para reintento manual
  const retryConnection = useCallback(() => {
    console.log('Reintento manual iniciado...');
    setIsRetrying(true);
    loadServicesFromFirestore();
  }, []);

  // Extraer categorías únicas
  React.useEffect(() => {
    const uniqueCategories = ['Todas', ...new Set(services.map(service => service.category))];
    setCategories(uniqueCategories);
  }, [services]);

  // Filtrar servicios cuando cambian los criterios de búsqueda
  React.useEffect(() => {
    let filtered = [...services];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery) || 
        service.description?.toLowerCase().includes(searchQuery) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    // Filtrar por categoría
    if (selectedCategory && selectedCategory !== 'Todas') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  const getServiceBySlug = (slug: string): Service | undefined => {
    return services.find(service => service.id === slug);
  };

  const refreshServices = useCallback(async (forceRefresh = false) => {
     if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true' || !db) {
       loadLocalServices();
     } else {
       await loadServicesFromFirestore(forceRefresh);
     }
   }, []);

   // Función optimizada para refrescar datos (respeta cache)
   const softRefresh = useCallback(() => refreshServices(false), [refreshServices]);
   
   // Función para forzar actualización (ignora cache)
   const hardRefresh = useCallback(() => refreshServices(true), [refreshServices]);

  const value = {
     services,
     filteredServices,
     featuredServices,
     loading,
     error,
     searchTerm,
     selectedCategory,
     categories,
     isRetrying,
     retryCount,
     nextRetryTime,
     currentLoadType,
     setSearchTerm,
     setSelectedCategory,
     refreshServices,
     softRefresh,
     hardRefresh,
     getServiceBySlug,
     searchServices,
     resetSearch,
     isSearching,
     retryConnection,
     // Nuevas funciones optimizadas
     loadFeaturedServices,
     loadSingleService,
     loadServicesPaginated
   };

  return (
    <ServicesContext.Provider value={value}>
      {children}
      {loading && <div>Cargando servicios...</div>}
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

