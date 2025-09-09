'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { collection, getDocs, getDoc, doc, query, orderBy, where, limit, startAfter, Firestore, DocumentData } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

// Type for the cache entry
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Initialize Firestore with null check
let db: Firestore;

try {
  if (!app) {
    throw new Error('Firebase app is not initialized');
  }
  
  db = getFirestore(app);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Firestore initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
  throw new Error('Firebase initialization failed. Please check your configuration.');
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50; // Max number of services to cache

// Types
export interface Service {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  location: string;
  description: string;
  contactUrl?: string;
  detailsUrl?: string;
  horario?: string;
  tags?: string[];
  hours?: string;
  social?: string;
  whatsapp?: string;
  active?: boolean;
}

interface ServicesContextType {
  services: Service[];
  filteredServices: Service[];
  featuredServices: Service[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  getServiceById: (id: string) => Promise<Service | null>;
  searchServices: (query: string, category?: string) => void;
  resetSearch: () => void;
  isSearching: boolean;
  refreshServices: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Cache implementation
class ServiceCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private cacheDuration: number;
  
  constructor(maxSize: number = MAX_CACHE_SIZE, cacheDuration: number = CACHE_DURATION) {
    this.cache = new Map<string, CacheEntry<T>>();
    this.maxSize = maxSize;
    this.cacheDuration = cacheDuration;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: T): void {
    // Enforce max cache size
    if (this.cache.size >= this.maxSize) {
      // Delete the oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Optional: Add method to clean up expired entries
  cleanup(): void {
    const now = Date.now();
    // Convert to array to safely delete entries while iterating
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.cacheDuration) {
        this.cache.delete(key);
      }
    });
  }
}

// Initialize cache with proper typing and configuration
const cache = new ServiceCache<Service | Service[]>(
  MAX_CACHE_SIZE,
  CACHE_DURATION
);

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({ children }) => {
  // State management using a single state object for better performance
  const [state, setState] = useState({
    services: [] as Service[],
    filteredServices: [] as Service[],
    featuredServices: [] as Service[],
    categories: [] as string[],
    loading: true,
    error: null as string | null,
    searchTerm: '',
    selectedCategory: '',
    isSearching: false
  });

  // Destructure state for easier access
  const {
    services,
    filteredServices,
    featuredServices,
    categories,
    loading,
    error: stateError,
    searchTerm,
    selectedCategory,
    isSearching
  } = state;

  // Helper function to update state
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Get Firestore instance
  const getFirestoreInstance = useCallback((): Firestore => {
    if (!app) {
      throw new Error('Firebase app is not initialized');
    }
    return getFirestore(app);
  }, []);

  // Update categories from services
  const updateCategories = useCallback((servicesData: Service[]) => {
    const categoriesList = Array.from(
      new Set(servicesData.map(service => service.category).filter(Boolean))
    ) as string[];
    
    updateState({ categories: categoriesList });
  }, [updateState]);

  // Load featured services
  const loadFeaturedServices = useCallback(async (servicesData?: Service[]) => {
    try {
      const cacheKey = 'featured-services';
      const cached = cache.get(cacheKey) as Service[] | null;
      
      if (cached) {
        updateState({ featuredServices: cached });
        return;
      }
      
      // If services data is provided, use it; otherwise, fetch from Firestore
      let featured: Service[] = [];
      
      if (servicesData) {
        // Filter featured services from provided data
        featured = servicesData.filter(service => service.tags?.includes('featured'));
      } else {
        // Fetch from Firestore if no data provided
        const db = getFirestoreInstance();
        const featuredQuery = query(
          collection(db, 'services'),
          where('tags', 'array-contains', 'featured'),
          where('active', '==', true),
          limit(6)
        );
        
        const querySnapshot = await getDocs(featuredQuery);
        featured = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
      }
      
      // Update cache and state
      cache.set(cacheKey, featured);
      updateState({ featuredServices: featured });
    } catch (error) {
      console.error('Error loading featured services:', error);
      toast.error('Error al cargar los servicios destacados');
    }
  }, [getFirestoreInstance, updateState]);

  // Load services from Firestore or cache
  const loadServices = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'all-services';
    
    try {
      updateState({ loading: true, error: null });
      
      // Try to get from cache first if not forcing refresh
      if (!forceRefresh) {
        const cached = cache.get(cacheKey) as Service[] | null;
        if (cached) {
          updateState({
            services: cached,
            filteredServices: cached,
            loading: false
          });
          updateCategories(cached);
          // Load featured services from cache if available
          const featuredCache = cache.get('featured-services') as Service[] | null;
          if (!featuredCache) {
            loadFeaturedServices(cached);
          }
          return cached;
        }
      }
      
      // Fetch from Firestore
      const db = getFirestoreInstance();
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('active', '==', true), orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const servicesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          category: data.category || '',
          image: data.image || '',
          images: data.images || [],
          rating: data.rating || 0,
          location: data.location || '',
          description: data.description || '',
          contactUrl: data.contactUrl || '',
          detailsUrl: data.detailsUrl || '',
          horario: data.horario || '',
          tags: data.tags || [],
          hours: data.hours || '',
          social: data.social || '',
          whatsapp: data.whatsapp || '',
          active: data.active !== undefined ? data.active : true
        } as Service;
      });
      
      // Update cache
      cache.set(cacheKey, servicesData);
      
      // Update state
      updateState({
        services: servicesData,
        filteredServices: servicesData,
        loading: false
      });
      
      // Update categories and load featured services
      updateCategories(servicesData);
      loadFeaturedServices(servicesData);
      
      return servicesData;
    } catch (error) {
      console.error('Error loading services:', error);
      updateState({
        error: 'Error al cargar los servicios. Por favor, intente nuevamente.',
        loading: false
      });
      throw error;
    }
  }, [getFirestoreInstance, updateCategories, loadFeaturedServices, updateState]);

  // Get service by ID
  const getServiceById = useCallback(async (id: string): Promise<Service | null> => {
    if (!id) return null;
    
    try {
      // Check cache first
      const cachedService = services.find(service => service.id === id);
      if (cachedService) return cachedService;
      
      // If not in cache, fetch from Firestore
      const db = getFirestoreInstance();
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Service not found');
      }
      
      const serviceData = {
        id: docSnap.id,
        ...docSnap.data()
      } as Service;
      
      // Update cache with the fetched service
      const updatedServices = [...services];
      const existingIndex = updatedServices.findIndex(s => s.id === id);
      
      if (existingIndex >= 0) {
        updatedServices[existingIndex] = serviceData;
      } else {
        updatedServices.push(serviceData);
      }
      
      // Update state with the new service data
      updateState({
        services: updatedServices,
        filteredServices: updatedServices
      });
      
      return serviceData;
    } catch (error) {
      console.error('Error getting service by ID:', error);
      toast.error('Error al cargar el servicio');
      return null;
    }
  }, [getFirestoreInstance, services, updateState]);

  // Search services
  const searchServices = useCallback((searchQuery: string, category: string = '') => {
    updateState({ isSearching: true, searchTerm: searchQuery, selectedCategory: category });
    
    let results = [...services];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (category) {
      results = results.filter(service => service.category === category);
    }
    
    updateState({ filteredServices: results });
  }, [services, updateState]);

  // Reset search
  const resetSearch = useCallback(() => {
    updateState({
      filteredServices: services,
      searchTerm: '',
      selectedCategory: '',
      isSearching: false
    });
  }, [services, updateState]);

  // Refresh services
  const refreshServices = useCallback(async () => {
    return loadServices(true);
  }, [loadServices]);

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Context value
  const contextValue = useMemo(() => ({
    services,
    filteredServices,
    featuredServices,
    loading,
    error: stateError,
    searchTerm,
    selectedCategory,
    categories,
    isSearching,
    setSearchTerm: (term: string) => updateState({ searchTerm: term }),
    setSelectedCategory: (category: string) => updateState({ selectedCategory: category }),
    getServiceById,
    searchServices,
    resetSearch,
    refreshServices
  }), [
    services,
    filteredServices,
    featuredServices,
    loading,
    stateError,
    searchTerm,
    selectedCategory,
    categories,
    isSearching,
    updateState,
    getServiceById,
    searchServices,
    resetSearch,
    refreshServices
  ]);

  return (
    <ServicesContext.Provider value={contextValue}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = (): ServicesContextType => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

export default ServicesContext;
