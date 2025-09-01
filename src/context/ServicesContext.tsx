'use client';

  import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
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
    // Función para cargar servicios desde Firestore
    loadServicesFromFirestore: (forceRefresh?: boolean) => Promise<void>;
    // Control del limitador de lecturas Firebase
    getFirebaseReadsLimiter: () => any;
  }

  // Firebase
  import { db } from '../lib/firebase/config';
  // Static imports for Firebase functions - más confiable que dynamic imports
  import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    query, 
    orderBy, 
    where, 
    limit, 
    startAfter, 
    onSnapshot,
    DocumentSnapshot 
  } from 'firebase/firestore';

  // 🚨 PARCHE DE EMERGENCIA - Limitar lecturas de Firebase
  let firebaseReads = 0;
  let firebaseReadsEnabled = true;

  const firebaseReadsLimiter = {
    maxReads: 100, // MÁXIMO 100 lecturas por sesión
    disableExcessReads: true,
    
    checkRead: () => {
      firebaseReads++;
      console.log(`📖 Lectura #${firebaseReads} de Firebase`);
      
      if (firebaseReadsLimiter.disableExcessReads && firebaseReads > firebaseReadsLimiter.maxReads) {
        console.warn('🚨 LÍMITE DE LECTURAS EXCEDIDO - Desactivando Firebase');
        firebaseReadsEnabled = false;
        return false;
      }
      
      return true;
    },
    
    reset: () => {
      firebaseReads = 0;
      firebaseReadsEnabled = true;
      console.log('🔄 Contador de lecturas reiniciado');
    }
  };

  // Interceptar TODAS las llamadas a Firebase usando wrappers
  const limitedGetDocs = function(...args: any[]) {
    if (!firebaseReadsEnabled) {
      console.warn('⛔ Lectura bloqueada - Límite excedido');
      return Promise.reject(new Error('Firebase reads disabled - limit exceeded'));
    }
    
    if (!firebaseReadsLimiter.checkRead()) {
      return Promise.reject(new Error('Firebase reads disabled - limit exceeded'));
    }
    
    return getDocs.apply(this, args);
  };

  const limitedGetDoc = function(...args: any[]) {
    if (!firebaseReadsEnabled) {
      console.warn('⛔ Lectura bloqueada - Límite excedido');
      return Promise.reject(new Error('Firebase reads disabled - limit exceeded'));
    }
    
    if (!firebaseReadsLimiter.checkRead()) {
      return Promise.reject(new Error('Firebase reads disabled - limit exceeded'));
    }
    
    return getDoc.apply(this, args);
  };

  // Exponer el limitador para control desde la aplicación
  const getFirebaseReadsLimiter = () => ({
    ...firebaseReadsLimiter,
    currentReads: firebaseReads,
    enabled: firebaseReadsEnabled,
    getStats: () => ({
      reads: firebaseReads,
      enabled: firebaseReadsEnabled,
      maxReads: firebaseReadsLimiter.maxReads,
      remaining: Math.max(0, firebaseReadsLimiter.maxReads - firebaseReads)
    })
  });

  // Function to get Firebase functions (now using static imports)
  const getFirestoreFunctions = () => {
    // ⚠️ TEMPORAL: Siempre retornar las funciones de Firestore sin verificar db
    // La verificación de db se hace en las funciones que usan estas funciones
    console.log('✅ getFirestoreFunctions: Retornando funciones de Firestore (import estático)');
    console.log('🔍 Estado actual de db:', { db: !!db, type: typeof db });
    return {
      collection,
      getDocs,
      getDoc,
      doc,
      query,
      orderBy,
      where,
      limit,
      startAfter,
      onSnapshot,
      DocumentSnapshot
    };
  };
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
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [usingMockData, setUsingMockData] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [nextRetryTime, setNextRetryTime] = useState<Date | null>(null);
    const [retryTimer, setRetryTimer] = useState<NodeJS.Timeout | null>(null);
    const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
    const [cacheExpiry] = useState(30 * 60 * 1000); // 30 minutos de cache
    const [currentLoadType, setCurrentLoadType] = useState<LoadType>('all');
    
    // Cache para diferentes tipos de datos
    const [featuredCache, setFeaturedCache] = useState<{ data: Service[], timestamp: Date } | null>(null);
    const [singleServiceCache, setLocalSingleServiceCache] = useState<Map<string, { data: Service, timestamp: Date }>>(new Map());
    
    const filteredServices = useMemo(() => {
      if (!searchTerm && selectedCategory === 'Todas') {
        return allServices;
      }
      
      return allServices.filter(service => {
        const matchesSearch = !searchTerm || 
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'Todas' || service.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    }, [allServices, searchTerm, selectedCategory]);

    const featuredServices = useMemo(() => {
      return allServices
        .filter(service => service.rating >= 4)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    }, [allServices]);

    const categories = useMemo(() => {
      return ['Todas', ...new Set(allServices.map(service => service.category))];
    }, [allServices]); 

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

    // ❌ PRECARGA AUTOMÁTICA DESACTIVADA - Solo manual para evitar duplicaciones
    // La precarga se activa solo después de interacción del usuario

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
        setAllServices(activeServices);
        console.log(`Cargados ${activeServices.length} servicios desde datos locales`);
      } catch (error) {
        console.error('Error cargando datos locales:', error);
        setAllServices(mockServices);
        
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
            // ✅ featuredServices se calculan automáticamente con useMemo
            setLoading(false);
            console.log(`⚡ Servicios destacados desde localStorage: ${cachedServices.length} servicios (0 lecturas Firebase)`);
            return;
          }
          
          // Verificar cache en memoria como fallback
          if (featuredCache) {
            const timeSinceLastFetch = Date.now() - featuredCache.timestamp.getTime();
            if (timeSinceLastFetch < cacheExpiry) {
              console.log('Usando servicios destacados en cache memoria');
              // ✅ featuredServices se calculan automáticamente con useMemo
              setLoading(false);
              return;
            }
          }
        }
        
        // Debug: Verificar estado de Firebase
        console.log('🔍 DEBUG - Estado Firebase:');
        console.log('  NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
        console.log('  db disponible:', !!db);
        console.log('  tipo de db:', typeof db);
        
        // ⚠️ TEMPORAL: Comentando verificación problemática para forzar uso de Firebase
        // Esta verificación está causando que siempre use datos mock
        /*
        if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true' || !db) {
          console.log('❌ Firebase deshabilitado, usando servicios destacados mock');
          const mockFeatured = mockServices.slice(0, 8);
          
          setUsingMockData(true);
          setLoading(false);
          return;
        }
        */
        
        // Get Firebase functions
        console.log('🔍 DEBUG - Obteniendo funciones de Firestore...');
        const firestore = getFirestoreFunctions();
        console.log('🔍 DEBUG - Firestore functions:', !!firestore);
        if (firestore) {
          console.log('🔍 DEBUG - Funciones disponibles:', Object.keys(firestore));
        }
        
        if (!firestore) {
          console.log('❌ Firebase functions not available, using mock data');
          const mockFeatured = mockServices.slice(0, 8);
          
          setUsingMockData(true);
          setLoading(false);
          return;
        }
        
        console.log('🔥 Cargando servicios destacados desde Firebase...');
        
        // Consulta optimizada para servicios destacados (reducido para ahorrar lecturas)
        const featuredQuery = firestore.query(
          firestore.collection(db, 'services'),
          firestore.orderBy('rating', 'desc'), // Ordenar por rating para obtener los mejores
          firestore.limit(4) // Reducido a 4 servicios para ahorrar lecturas
        );
        const featuredSnapshot = await limitedGetDocs(featuredQuery);
        
        const featuredData = featuredSnapshot.docs.map((doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          } as Service;
        });
        
        const activeFeatured = featuredData.filter(service => service.active !== false);
        // ✅ featuredServices se calculan automáticamente con useMemo
        
        // 💾 Actualizar ambos caches
        setFeaturedCache({ data: activeFeatured, timestamp: new Date() });
        setFeaturedServicesCache(activeFeatured);
        setUsingMockData(false);
        
        console.log(`✅ ${activeFeatured.length} servicios destacados cargados (${featuredSnapshot.docs.length} lecturas Firebase)`);
        
      } catch (error: any) {
        console.error('Error cargando servicios destacados:', error);
        // Fallback a servicios mock destacados
        const mockFeatured = mockServices.slice(0, 8);
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
        
        // ⚠️ TEMPORAL: Comentando verificación problemática para forzar uso de Firebase
        /*
        if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true' || !db) {
          console.log(`Firebase deshabilitado, buscando servicio ${serviceId} en datos mock`);
          const mockService = mockServices.find(s => s.id === serviceId);
          if (mockService) {
            // Registrar visita para analytics
            trackServiceVisit(serviceId);
          }
          return mockService || null;
        }
        */
        
        // Get Firebase functions
        const firestore = getFirestoreFunctions();
        if (!firestore) {
          console.log('Firebase functions not available, using mock data');
          const mockService = mockServices.find(s => s.id === serviceId);
          if (mockService) {
            trackServiceVisit(serviceId);
          }
          return mockService || null;
        }
        
        console.log(`🔥 Cargando servicio individual: ${serviceId}`);
        
        // 🚀 OPTIMIZACIÓN: Usar getDoc en lugar de getDocs para mayor eficiencia
        const serviceDocRef = firestore.doc(db, 'services', serviceId);
        const serviceDoc = await limitedGetDoc(serviceDocRef);
        
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
    const loadServicesPaginated = useCallback(async (page: number, pageSize: number, forceRefresh: boolean = false) => {
      try {
        console.log('🚀 DEBUG: loadServicesPaginated INICIANDO - called with:', { page, pageSize, forceRefresh });
        console.log('🚀 DEBUG: loadServicesPaginated called with:', { page, pageSize, forceRefresh });
        setLoading(true);
        setError(null);
        setCurrentLoadType('paginated');
        
        // 🔍 DEBUG: Información detallada
        console.log('🔍 DEBUG loadServicesPaginated - Iniciando...');
        console.log('  page:', page);
        console.log('  pageSize:', pageSize);
        console.log('  forceRefresh:', forceRefresh);
        console.log('  NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
        console.log('  db disponible:', !!db);
        console.log('  tipo de db:', typeof db);
        
        // ⚠️ TEMPORAL: Comentando verificación problemática para forzar uso de Firebase
        // Esta verificación está causando que siempre use datos mock
        /*
        if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true' || !db) {
          console.log('❌ Firebase deshabilitado o db no disponible, usando datos mock para paginación');
          console.log('  Razón: NEXT_PUBLIC_DISABLE_FIREBASE =', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
          console.log('  Razón: !db =', !db);
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedMockServices = mockServices.slice(startIndex, endIndex);
          
          if (page === 1) {
            setPaginatedServices(paginatedMockServices);
            setFilteredServices(paginatedMockServices);
          } else {
            const updatedServices = [...paginatedServices, ...paginatedMockServices];
            setPaginatedServices(updatedServices);
            setFilteredServices(updatedServices);
          }
          
          setHasMorePages(endIndex < mockServices.length);
          setUsingMockData(true);
          console.log('✅ DEBUG: Mock data set successfully. paginatedServices should now have:', paginatedMockServices.length, 'services');
          
          return {
            services: paginatedMockServices,
            totalPages: Math.ceil(mockServices.length / pageSize),
            currentPage: page,
            totalServices: mockServices.length,
            hasMore: endIndex < mockServices.length
          };
        }
        */
        
        // 🚀 OPTIMIZACIÓN MEJORADA: Verificar cache localStorage con timestamp
        if (!forceRefresh) {
          const cachedServices = getAllServicesFromCache();
          if (cachedServices && cachedServices.length > 0) {
            // Verificar si el cache aún es válido (30 minutos)
            const cacheTimestamp = localStorage.getItem('services_cache_timestamp');
            const now = Date.now();
            const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;
            
            if (cacheAge < cacheExpiry) {
              if (page === 1) {
                const firstPageServices = cachedServices.slice(0, pageSize);
                setPaginatedServices(firstPageServices);
                setHasMorePages(cachedServices.length > pageSize);
                console.log(`⚡ Primera página desde localStorage: ${firstPageServices.length} servicios (0 lecturas Firebase)`);
                return {
                  services: firstPageServices,
                  totalPages: Math.ceil(cachedServices.length / pageSize),
                  currentPage: page,
                  totalServices: cachedServices.length,
                  hasMore: cachedServices.length > pageSize
                };
              } else {
                // Para páginas posteriores, también usar cache si está disponible
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                if (startIndex < cachedServices.length) {
                  const pageServices = cachedServices.slice(startIndex, endIndex);
                  const updatedServices = [...paginatedServices, ...pageServices];
                  setPaginatedServices(updatedServices);
                  setHasMorePages(endIndex < cachedServices.length);
                  console.log(`⚡ Página ${page} desde localStorage: ${pageServices.length} servicios (0 lecturas Firebase)`);
                  return {
                    services: pageServices,
                    totalPages: Math.ceil(cachedServices.length / pageSize),
                    currentPage: page,
                    totalServices: cachedServices.length,
                    hasMore: endIndex < cachedServices.length
                  };
                }
              }
            }
          }
        }
        
        // Get Firebase functions
        console.log('🔍 DEBUG: Obteniendo funciones de Firestore...');
        const firestore = getFirestoreFunctions();
        console.log('🔍 DEBUG: Firestore functions obtenidas:', !!firestore);
        console.log('🔍 DEBUG: Estado de db:', { db: !!db, type: typeof db });
        if (firestore) {
          console.log('🔍 DEBUG: Funciones disponibles:', Object.keys(firestore));
        }
        
        if (!firestore) {
          console.log('❌ Firebase functions not available, usando datos mock para paginación');
          console.log('  Esto significa que getFirestoreFunctions() retornó null');
          console.log('📊 DEBUG: Total mock services:', mockServices.length);
          console.log('📊 DEBUG: Mock services with active status:', mockServices.map(s => ({ name: s.name, active: s.active, activeCheck: s.active !== false })));
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedMockServices = mockServices.slice(startIndex, endIndex);
          console.log('📊 DEBUG: Paginated mock services before filter:', paginatedMockServices.length, paginatedMockServices.map(s => s.name));
          
          if (page === 1) {
            setPaginatedServices(paginatedMockServices);
          } else {
            const updatedServices = [...paginatedServices, ...paginatedMockServices];
            setPaginatedServices(updatedServices);
            setAllServices(updatedServices);
          }
          
          setHasMorePages(endIndex < mockServices.length);
          setUsingMockData(true);
          
          return {
            services: paginatedMockServices,
            totalPages: Math.ceil(mockServices.length / pageSize),
            currentPage: page,
            totalServices: mockServices.length,
            hasMore: endIndex < mockServices.length
          };
        }
        
        // Verificar que db esté disponible antes de usarlo
        if (!db) {
          console.log('❌ db is null, usando datos mock para paginación');
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedMockServices = mockServices.slice(startIndex, endIndex);
          
          if (page === 1) {
            setPaginatedServices(paginatedMockServices);  
          } else {
            const updatedServices = [...paginatedServices, ...paginatedMockServices];
            setPaginatedServices(updatedServices);
            setAllServices(updatedServices);
          }
          
          setHasMorePages(endIndex < mockServices.length);
          setUsingMockData(true);
          
          return {
            services: paginatedMockServices,
            totalPages: Math.ceil(mockServices.length / pageSize),
            currentPage: page,
            totalServices: mockServices.length,
            hasMore: endIndex < mockServices.length
          };
        }
        
        // Construir query de Firestore con paginación real
        const servicesRef = firestore.collection(db, 'services');
        let firestoreQuery = firestore.query(
          servicesRef,
          firestore.orderBy('name'),
          firestore.limit(pageSize)
        );
        
        // Para páginas posteriores a la primera, usar startAfter
        if (page > 1 && lastDocumentSnapshot) {
          firestoreQuery = firestore.query(
            servicesRef,
            firestore.orderBy('name'),
            firestore.startAfter(lastDocumentSnapshot),
            firestore.limit(pageSize)
          );
        }
        
        const querySnapshot = await limitedGetDocs(firestoreQuery);
          const newServices: Service[] = [];
          let lastDoc: any | null = null;
        
        querySnapshot.forEach((doc: any) => {
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
            active: data.active !== false, // Mantener el valor original para filtrado posterior
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          };
          newServices.push(service);
          lastDoc = doc;
        });
        
        // Actualizar estado de paginación
        if (page === 1) {
          setPaginatedServices(newServices);
          setAllServices(newServices);
        } else {
          const updatedServices = [...paginatedServices, ...newServices];
          setPaginatedServices(updatedServices);
          setAllServices(updatedServices);
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
        console.error('❌ ERROR loading paginated services:', error);
        setError(error.message);
        
        // Fallback a datos mock
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedMockServices = mockServices.slice(startIndex, endIndex);
        
        if (page === 1) {
          setPaginatedServices(paginatedMockServices);
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
        console.log('🏁 DEBUG: loadServicesPaginated finished, setting loading to false');
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
            setAllServices(cachedServices);
            setLoading(false);
            console.log(`⚡ Todos los servicios desde localStorage: ${cachedServices.length} servicios (0 lecturas Firebase)`);
            return;
          }
          
          // Verificar cache en memoria como fallback
          if (lastFetchTime && allServices.length > 0) {
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
            // Get Firebase functions
            const firestore = getFirestoreFunctions();
            if (!firestore) {
              throw new Error('Firebase functions not available');
            }
            
            console.log('🔥 Realizando consulta optimizada a Firebase...');
            
            // Cargar todos los servicios disponibles
            const servicesQuery = firestore.query(
              firestore.collection(db, 'services'),
              firestore.orderBy('name')
              // Removido el límite para cargar todos los servicios
            );
            const servicesSnapshot = await limitedGetDocs(servicesQuery);
            
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
            
            setAllServices(activeServices);

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
          console.warn('⚠️ Firebase db no está disponible, intentando inicializar...');
          // Intentar reinicializar Firebase
          const { initializeFirebase } = await import('../lib/firebase/config');
          if (typeof initializeFirebase === 'function') {
            const result = await initializeFirebase();
            if (result?.db) {
              console.log('✅ Firebase reinicializado exitosamente');
              // Reintentar la carga
              return await loadServicesFromFirestore(forceRefresh);
            }
          }
          throw new Error('Firebase no está disponible después del reintento');
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
            setAllServices(mockServices);
      
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
            setAllServices(mockServices);
            setUsingMockData(true);
          }
        } finally {
          setLoading(false);
        }
      };
      
      loadServices();
    }, []);

    const searchServices = useCallback((query: string, category?: string) => {
      setIsSearching(true);
      setSearchTerm(query);
      if (category) {
        setSelectedCategory(category);
      }
    }, []);

    const resetSearch = useCallback(() => {
      setSearchTerm('');
      setSelectedCategory('Todas');
      setIsSearching(false);
    }, []);

    // Función para reintento manual
    const retryConnection = useCallback(() => {
      console.log('Reintento manual iniciado...');
      setIsRetrying(true);
      loadServicesFromFirestore();
    }, []);

    // Los useEffect para categorías y filtrado ya no son necesarios
    // porque se calculan automáticamente con useMemo
    // Forzando recompilación para resolver errores de caché

    const getServiceBySlug = useCallback((slug: string): Service | undefined => {
      return allServices.find(service => service.id === slug);
    }, [allServices]);

    const refreshServices = useCallback(async (forceRefresh = false) => {
      // ⚠️ TEMPORAL: Comentando verificación problemática para forzar uso de Firebase
      /*
      if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true' || !db) {
        loadLocalServices();
      } else {
        await loadServicesFromFirestore(forceRefresh);
      }
      */
      await loadServicesFromFirestore(forceRefresh);
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

    const value = useMemo(() => ({
      services: allServices,
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
      isPreloading,
      // Función para cargar servicios desde Firestore
      loadServicesFromFirestore,
      // Control del limitador de lecturas Firebase
      getFirebaseReadsLimiter
    }), [
      allServices, filteredServices, featuredServices, categories,
      loading, error, searchTerm, selectedCategory, usingMockData,
      isRetrying, retryCount, nextRetryTime, currentLoadType, isSearching,
      setSearchTerm, setSelectedCategory, refreshServices, softRefresh, hardRefresh,
      getServiceBySlug, searchServices, resetSearch, retryConnection,
      loadFeaturedServices, loadSingleService, loadServicesPaginated,
      paginatedServices, hasMorePages, resetPagination,
      trackServiceVisit, getAnalyticsStats, preloadPopularServices,
      forcePreload, isPreloading, loadServicesFromFirestore,
      getFirebaseReadsLimiter
    ]);

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

