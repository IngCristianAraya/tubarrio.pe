'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useServiceCache } from '@/hooks/useServiceCache';
import { useServiceAnalytics } from '@/hooks/useServiceAnalytics';
import { useServicePreloader } from '@/hooks/useServicePreloader';

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
  searchServices: (query: string, category?: string) => void;
  resetSearch: () => void;
  isSearching: boolean;
  retryConnection: () => void;
  usingMockData: boolean;
  // Nuevas funciones optimizadas
  loadFeaturedServices: (forceRefresh?: boolean) => Promise<void>;
  loadSingleService: (serviceId: string) => Promise<Service | null>;
  loadServicesPaginated: (page: number, limitCount: number, forceRefresh?: boolean) => Promise<any>;
  paginatedServices: Service[];
  hasMorePages: boolean;
  resetPagination: () => void;
  // Funciones de analytics y precarga
  trackServiceVisit: (serviceId: string, category?: string) => void;
  getAnalyticsStats: () => any;
  preloadPopularServices: () => Promise<void>;
  forcePreload: () => Promise<void>;
  isPreloading: boolean;
}

// Firebase
import { db } from '../lib/firebase/config';
import { collection, getDocs, getDoc, doc, QueryDocumentSnapshot, query, orderBy, where, limit, startAfter, DocumentSnapshot } from 'firebase/firestore';
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
  const [singleServiceCache, setLocalSingleServiceCache] = useState<Map<string, { data: Service, timestamp: Date }>>(new Map());
  
  // 🚀 Integrar sistema de cache optimizado
   const {
     getFeaturedServicesFromCache,
     setFeaturedServicesCache,
     getSingleServiceFromCache,
     setSingleServiceCache: setServiceToLocalStorage,
     getAllServicesFromCache,
     setAllServicesCache,
     clearAllCache
   } = useServiceCache();

  // 📊 Integrar sistema de analytics y precarga
  const {
    trackServiceVisit,
    getAnalyticsStats
  } = useServiceAnalytics();

  const {
    preloadPopularServices,
    forcePreload,
    isPreloading
  } = useServicePreloader();

  // 🚀 Inicializar precarga automática al montar el componente
  React.useEffect(() => {
    // Esperar un poco antes de iniciar la precarga para no interferir con la carga inicial
    const timer = setTimeout(() => {
      preloadPopularServices();
    }, 3000); // 3 segundos después del montaje

    return () => clearTimeout(timer);
  }, [preloadPopularServices]);

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
       
       // 🚀 OPTIMIZACIÓN: Verificar cache localStorage primero
       if (!forceRefresh) {
         const cachedServices = getFeaturedServicesFromCache();
         if (cachedServices && cachedServices.length > 0) {
           setFeaturedServices(cachedServices);
           setLoading(false);
           console.log(`⚡ Servicios destacados desde localStorage: ${cachedServices.length} servicios (0 lecturas Firebase)`);
           return;
         }
         
         // Verificar cache en memoria como fallback
         if (featuredCache) {
           const timeSinceLastFetch = Date.now() - featuredCache.timestamp.getTime();
           if (timeSinceLastFetch < cacheExpiry) {
             console.log('Usando servicios destacados en cache memoria');
             setFeaturedServices(featuredCache.data);
             setLoading(false);
             return;
           }
         }
       }
       
       if (!db) {
         throw new Error('Firebase no está disponible');
       }
       
       console.log('🔥 Cargando servicios destacados desde Firebase...');
       
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
       
       // 💾 Actualizar ambos caches
       setFeaturedCache({ data: activeFeatured, timestamp: new Date() });
       setFeaturedServicesCache(activeFeatured);
       setUsingMockData(false);
       
       console.log(`✅ ${activeFeatured.length} servicios destacados cargados (${featuredSnapshot.docs.length} lecturas Firebase)`);
       
     } catch (error: any) {
       console.error('Error cargando servicios destacados:', error);
       // Fallback a servicios mock destacados
       const mockFeatured = mockServices.slice(0, 6);
       setFeaturedServices(mockFeatured);
       setUsingMockData(true);
     } finally {
       setLoading(false);
     }
   }, [db, featuredCache, cacheExpiry, getFeaturedServicesFromCache, setFeaturedServicesCache]);
   
   // Función para cargar un servicio específico
   const loadSingleService = useCallback(async (serviceId: string): Promise<Service | null> => {
     try {
       // 🚀 OPTIMIZACIÓN: Verificar cache localStorage primero
        const cachedService = getSingleServiceFromCache(serviceId);
        if (cachedService) {
          console.log(`⚡ Servicio ${serviceId} desde localStorage (0 lecturas Firebase)`);
          return cachedService;
        }
       
       // Verificar cache en memoria como fallback
       const cached = singleServiceCache.get(serviceId);
       if (cached) {
         const timeSinceLastFetch = Date.now() - cached.timestamp.getTime();
         if (timeSinceLastFetch < cacheExpiry) {
           console.log(`Usando servicio ${serviceId} en cache memoria`);
           return cached.data;
         }
       }
       
       if (!db) {
         throw new Error('Firebase no está disponible');
       }
       
       console.log(`🔥 Cargando servicio individual: ${serviceId}`);
       
       // 🚀 OPTIMIZACIÓN: Usar getDoc en lugar de getDocs para mayor eficiencia
       const serviceDocRef = doc(db, 'services', serviceId);
       const serviceDoc = await getDoc(serviceDocRef);
       
       if (!serviceDoc.exists()) {
         console.log(`Servicio ${serviceId} no encontrado`);
         return null;
       }
       
       const data = serviceDoc.data();
       const service: Service = {
         id: serviceDoc.id,
         ...data,
         createdAt: data.createdAt?.toDate?.() || new Date(),
         updatedAt: data.updatedAt?.toDate?.() || new Date()
       } as Service;
       
       // 💾 Guardar en ambos caches
       const newCache = new Map(singleServiceCache);
       newCache.set(serviceId, { data: service, timestamp: new Date() });
       setLocalSingleServiceCache(newCache);
       // Guardar en localStorage
       setServiceToLocalStorage(serviceId, service);
       
       // 📊 Registrar visita para analytics
       trackServiceVisit(serviceId);
       
       console.log(`✅ Servicio ${serviceId} cargado con getDoc (1 lectura Firebase optimizada)`);
       return service;
       
     } catch (error: any) {
       console.error(`Error cargando servicio ${serviceId}:`, error);
       // Fallback a datos locales o mock
       const mockService = mockServices.find(s => s.id === serviceId);
       return mockService || null;
     }
   }, [db, singleServiceCache, cacheExpiry, getSingleServiceFromCache, setLocalSingleServiceCache]);
   
   // Estado para paginación real con Firestore
   const [lastDocumentSnapshot, setLastDocumentSnapshot] = useState<DocumentSnapshot | null>(null);
   const [paginatedServices, setPaginatedServices] = useState<Service[]>([]);
   const [hasMorePages, setHasMorePages] = useState(true);
   
   // Función para carga paginada real con Firestore startAfter
   const loadServicesPaginated = useCallback(async (page: number = 1, pageSize: number = 12, forceRefresh = false) => {
     try {
       setLoading(true);
       setError(null);
       setCurrentLoadType('paginated');
       
       // 🚀 OPTIMIZACIÓN: Para la primera página, verificar cache localStorage primero
       if (page === 1 && !forceRefresh) {
         const cachedServices = getAllServicesFromCache();
         if (cachedServices && cachedServices.length > 0) {
           const firstPageServices = cachedServices.slice(0, pageSize);
           setPaginatedServices(firstPageServices);
           setFilteredServices(firstPageServices);
           setHasMorePages(cachedServices.length > pageSize);
           console.log(`⚡ Primera página desde localStorage: ${firstPageServices.length} servicios (0 lecturas Firebase)`);
           return {
             services: firstPageServices,
             totalPages: Math.ceil(cachedServices.length / pageSize),
             currentPage: page,
             totalServices: cachedServices.length,
             hasMore: cachedServices.length > pageSize
           };
         }
       }
       
       // Construir query de Firestore con paginación real
       const servicesRef = collection(db, 'services');
       let firestoreQuery = query(
         servicesRef,
         where('active', '!=', false),
         orderBy('active'),
         orderBy('createdAt', 'desc'),
         limit(pageSize)
       );
       
       // Para páginas posteriores a la primera, usar startAfter
       if (page > 1 && lastDocumentSnapshot) {
         firestoreQuery = query(
           servicesRef,
           where('active', '!=', false),
           orderBy('active'),
           orderBy('createdAt', 'desc'),
           startAfter(lastDocumentSnapshot),
           limit(pageSize)
         );
       }
       
       const querySnapshot = await getDocs(firestoreQuery);
       const newServices: Service[] = [];
       let lastDoc: DocumentSnapshot | null = null;
       
       querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
         const data = doc.data();
         const service: Service = {
           id: doc.id,
           name: data.name || 'Sin nombre',
           category: data.category || 'Sin categoría',
           image: data.image || '/images/hero_001.webp',
           images: data.images || [data.image || '/images/hero_001.webp'],
           rating: data.rating || 0,
           location: data.location || 'Ubicación no especificada',
           description: data.description || 'Sin descripción',
           contactUrl: data.contactUrl,
           detailsUrl: data.detailsUrl || `/servicio/${doc.id}`,
           hours: data.hours || data.horario,
           whatsapp: data.whatsapp,
           tags: data.tags || [],
           active: data.active !== false,
           createdAt: data.createdAt?.toDate?.() || new Date(),
           updatedAt: data.updatedAt?.toDate?.() || new Date()
         };
         newServices.push(service);
         lastDoc = doc;
       });
       
       // Actualizar estado de paginación
       if (page === 1) {
         setPaginatedServices(newServices);
         setFilteredServices(newServices);
       } else {
         const updatedServices = [...paginatedServices, ...newServices];
         setPaginatedServices(updatedServices);
         setFilteredServices(updatedServices);
       }
       
       setLastDocumentSnapshot(lastDoc);
       setHasMorePages(newServices.length === pageSize);
       
       // 💾 Guardar en cache localStorage solo la primera página
       if (page === 1 && newServices.length > 0) {
         setAllServicesCache(newServices);
       }
       
       const result = {
         services: newServices,
         totalPages: -1, // No podemos calcular total con paginación real
         currentPage: page,
         totalServices: -1, // No podemos calcular total sin cargar todo
         hasMore: newServices.length === pageSize
       };
       
       console.log(`✅ Página ${page} cargada desde Firebase: ${newServices.length} servicios (${newServices.length} lecturas Firebase)`);
       return result;
       
     } catch (error: any) {
       console.error('Error al cargar servicios paginados:', error);
       setError(error.message);
       
       // Fallback a datos mock
       const startIndex = (page - 1) * pageSize;
       const endIndex = startIndex + pageSize;
       const paginatedMockServices = mockServices.slice(startIndex, endIndex);
       
       if (page === 1) {
         setPaginatedServices(paginatedMockServices);
         setFilteredServices(paginatedMockServices);
       }
       setUsingMockData(true);
       
       return {
         services: paginatedMockServices,
         totalPages: Math.ceil(mockServices.length / pageSize),
         currentPage: page,
         totalServices: mockServices.length,
         hasMore: endIndex < mockServices.length
       };
     } finally {
       setLoading(false);
     }
   }, [db, getAllServicesFromCache, setAllServicesCache, lastDocumentSnapshot, paginatedServices]);

   const loadServicesFromFirestore = async (forceRefresh = false) => {
     try {
       setLoading(true);
       setError(null);
       setCurrentLoadType('all');
       
       // 🚀 OPTIMIZACIÓN: Verificar cache localStorage primero
       if (!forceRefresh) {
         const cachedServices = getAllServicesFromCache();
         if (cachedServices && cachedServices.length > 0) {
           setServices(cachedServices);
           setFilteredServices(cachedServices);
           setLoading(false);
           console.log(`⚡ Todos los servicios desde localStorage: ${cachedServices.length} servicios (0 lecturas Firebase)`);
           return;
         }
         
         // Verificar cache en memoria como fallback
         if (lastFetchTime && services.length > 0) {
           const timeSinceLastFetch = Date.now() - lastFetchTime.getTime();
           if (timeSinceLastFetch < cacheExpiry) {
             console.log('Usando datos en cache memoria, evitando consulta');
             setLoading(false);
             return;
           }
         }
       }
       
       // Intentar Firebase primero, luego fallback a API
       if (db) {
         try {
           console.log('🔥 Realizando consulta optimizada a Firebase...');
           
           // Optimizar consulta con límite para reducir uso de cuota
           const servicesQuery = query(
             collection(db, 'services'),
             orderBy('name'),
             limit(50) // Mantener límite para evitar lecturas masivas
           );
           const servicesSnapshot = await getDocs(servicesQuery);
           
           const servicesData = servicesSnapshot.docs.map(doc => {
             const data = doc.data();
             return {
               id: doc.id,
               ...data,
               location: data.address || data.location || 'Lima, Perú',
               createdAt: data.createdAt?.toDate?.() || new Date(),
               updatedAt: data.updatedAt?.toDate?.() || new Date()
             } as Service;
           });
           
           // Filtrar solo servicios activos
           const activeServices = servicesData.filter(service => service.active !== false);
           
           setServices(activeServices);
           setFilteredServices(activeServices);
           setLastFetchTime(new Date());
           setUsingMockData(false);
           
           // 💾 Guardar en cache localStorage
           setAllServicesCache(activeServices);
           
           console.log(`✅ ${activeServices.length} servicios cargados desde Firebase (${servicesSnapshot.docs.length} lecturas Firebase)`);
           
         } catch (firebaseError: any) {
           console.error('Error de Firebase:', firebaseError);
           throw firebaseError;
         }
       } else {
         throw new Error('Firebase no está disponible');
       }
       
       // Limpiar estado de reintento si fue exitoso
       if (retryTimer) {
         clearTimeout(retryTimer);
         setRetryTimer(null);
       }
       setRetryCount(0);
       setNextRetryTime(null);
       setIsRetrying(false);
       
       console.log(`✅ Servicios cargados exitosamente`);
       toast.success('Servicios cargados correctamente');
       
     } catch (error: any) {
       console.error('Error al cargar servicios:', error);
       setError(error.message);
       
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

  const searchServices = (query: string, category?: string) => {
    setIsSearching(true);
    let filtered = [...services];

    // Filtrar por búsqueda
    if (query && query.trim() !== '') {
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
    // No establecer setIsSearching(false) aquí para mantener la sección visible
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

  const resetPagination = useCallback(() => {
    setLastDocumentSnapshot(null);
    setPaginatedServices([]);
    setHasMorePages(true);
  }, []);

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
     usingMockData,
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
     loadServicesPaginated,
     paginatedServices,
     hasMorePages,
     resetPagination,
     // Funciones de analytics y precarga
     trackServiceVisit,
     getAnalyticsStats,
     preloadPopularServices,
     forcePreload,
     isPreloading
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

