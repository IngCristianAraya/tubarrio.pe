'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  Firestore,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

// Get Firestore instance with error handling
function getFirestoreInstance(): Firestore {
  return db.instance;
}

// Simple debounce implementation for search
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate = false
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  } as T & { cancel: () => void };
  
  debounced.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced;
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50; // Max number of services to cache

// Import the Service type from our types
import { Service as BaseService } from '@/types/service';

export interface Service extends Omit<BaseService, 'slug' | 'categorySlug'> {
  slug?: string;
  categorySlug?: string;
  active?: boolean;
  featured?: boolean;
  // Add any additional fields specific to the context
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

// Enhanced Cache implementation with TTL and size limits
class ServiceCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private pendingRequests = new Map<string, Promise<any>>();

  // Get cached item if valid
  get<T>(key: string, ttl: number = CACHE_DURATION): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check if cache is still valid
    const isExpired = Date.now() - item.timestamp > (item.ttl || ttl);
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    // Cast to T since we know the type when getting
    return item.data as T;
  }

  // Set item in cache with optional TTL override
  set<T>(key: string, data: T, ttl: number = CACHE_DURATION): void {
    // Clean up old cache entries if we're reaching the limit
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const keysToDelete = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, Math.floor(MAX_CACHE_SIZE / 4))
        .map(([key]) => key);
      
      keysToDelete.forEach(key => this.cache.delete(key));
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Get or create a value, preventing duplicate requests
  async getOrCreate<T>(
    key: string, 
    creator: () => Promise<T>,
    ttl: number = CACHE_DURATION
  ): Promise<T> {
    // Return cached value if available
    const cached = this.get<T>(key, ttl);
    if (cached !== null) {
      return cached;
    }
    
    // Return pending promise if request is in progress
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }
    
    // Create and store new promise
    const promise = (async (): Promise<T> => {
      try {
        const data = await creator();
        this.set(key, data, ttl);
        return data;
      } finally {
        this.pendingRequests.delete(key);
      }
    })();
    
    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
  
  // Invalidate specific cache entries by key pattern
  invalidate(pattern: string | RegExp): void {
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (typeof pattern === 'string' ? key === pattern : pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Initialize cache as a variable that will be set on the client side
let cache: ServiceCache;

// Initialize cache only on the client side
if (typeof window !== 'undefined') {
  cache = new ServiceCache();
}

// Create a function to get the cache instance
export function getCache() {
  if (typeof window === 'undefined') {
    throw new Error('Cache can only be used on the client side');
  }
  if (!cache) {
    cache = new ServiceCache();
  }
  return cache;
}

// Función para generar un slug a partir de un texto
const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Función para crear un objeto de servicio con valores predeterminados
const createServiceFromData = (id: string, data: any): Service => {
  const slug = data.slug || generateSlug(data.name) || id;
  const categorySlug = data.categorySlug || generateSlug(data.category) || '';
  
  // Handle both 'tag' and 'tags' fields from Firebase
  let serviceTags: string[] = [];
  
  if (data.tag && Array.isArray(data.tag)) {
    serviceTags = data.tag;
  } else if (data.tags && Array.isArray(data.tags)) {
    serviceTags = data.tags;
  }
  
  // Debug log para verificar los tags
  console.log(`🔍 Service ${data.name}:`, {
    id,
    hasTag: !!data.tag,
    hasTags: !!data.tags,
    tagValue: data.tag,
    tagsValue: data.tags,
    finalTags: serviceTags,
    tagType: typeof data.tag,
    tagsType: typeof data.tags
  });
  
  return {
    id,
    slug,
    name: data.name || '',
    category: data.category || '',
    categorySlug,
    image: data.image || '',
    images: data.images || [],
    rating: data.rating || 0,
    location: data.location || '',
    description: data.description || '',
    contactUrl: data.contactUrl || '',
    detailsUrl: data.detailsUrl || '',
    tags: serviceTags,
    hours: data.hours || '',
    social: data.social || '',
    whatsapp: data.whatsapp || '',
    active: data.active !== undefined ? data.active : true
  };
};

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Use the Firestore instance
  const firestore = getFirestoreInstance();

  // Update categories from services
  const updateCategories = useCallback((servicesData: Service[]) => {
    const uniqueCategories = Array.from(
      new Set(servicesData.map(service => service.category).filter(Boolean))
    ) as string[];
    setCategories(uniqueCategories);
  }, []);

  // Debounced search implementation
  const searchServices = useCallback(
    debounce((query: string, category?: string) => {
      setIsSearching(true);
      
      let results = [...services];
      
      if (query) {
        const searchLower = query.toLowerCase();
        results = results.filter(service => 
          service.name.toLowerCase().includes(searchLower) ||
          service.description?.toLowerCase().includes(searchLower) ||
          service.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (category) {
        results = results.filter(service => service.category === category);
      }
      
      setFilteredServices(results);
      setIsSearching(false);
    }, 300), // 300ms debounce
    [services]
  );
  
  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      searchServices.cancel();
    };
  }, [searchServices]);

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setFilteredServices(services);
  }, [services]);

  const handleTagClick = useCallback((tag: string) => {
    setSearchTerm(tag);
    setSelectedCategory('');
  }, []);

  // Load featured services
  const loadFeaturedServices = useCallback(async (servicesData?: Service[]) => {
    try {
      const cacheKey = 'featured-services';
      
      // Skip if we're on the server
      if (typeof window === 'undefined') {
        return Promise.resolve([]);
      }
      
      // If services data is provided, filter for featured
      if (servicesData) {
        const featured = servicesData
          .filter(service => service.rating && service.rating >= 4)
          .slice(0, 6);
        getCache().set(cacheKey, featured);
        return Promise.resolve(featured);
      }
      
      // Otherwise, use cache or fetch from Firestore
      return getCache().getOrCreate<Service[]>(
        cacheKey,
        async (): Promise<Service[]> => {
          const db = getFirestoreInstance();
          const servicesRef = collection(db, 'services');
          const q = query(
            servicesRef, 
            where('active', '==', true),
            where('rating', '>=', 4),
            orderBy('rating', 'desc'),
            limit(6)
          );
          
          const querySnapshot = await getDocs(q);
          const featuredServices = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...createServiceFromData(doc.id, doc.data())
          }));
          
          return featuredServices;
        }
      );
    } catch (err) {
      console.error('Error loading featured services:', err);
      return Promise.resolve([]);
    }
  }, []);

  // Get service by ID with optimized caching
  const getServiceById = useCallback(async (id: string): Promise<Service | null> => {
    // Skip if we're on the server
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    
    try {
      const cacheKey = `service-${id}`;
      const cachedService = getCache().get<Service>(cacheKey);
      if (cachedService) return cachedService;
      
      // If not in cache, fetch from Firestore
      const db = getFirestoreInstance();
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const service = createServiceFromData(docSnap.id, docSnap.data());
        // Cache the service
        if (typeof window !== 'undefined') {
          getCache().set(cacheKey, service);
        }
        return service;
      }
      
      throw new Error('Service not found');
    } catch (err) {
      console.error('Error getting service:', err);
      return null;
    }
  }, []); // Removed getFirestoreInstance dependency

  // Load all services
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Skip if we're on the server
      if (typeof window === 'undefined') {
        console.log('🚫 Skipping service load - running on server');
        setLoading(false);
        return [];
      }

      // Clear cache to force fresh data
      getCache().clear();
      console.log('🧹 Cache cleared - loading fresh data from Firebase');

      const cacheKey = 'all-services';
      
      // If not in cache, fetch from Firestore
      console.log('📡 Fetching services from Firestore...');
      const db = getFirestoreInstance();
      const servicesRef = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesRef);
      
      console.log(`📊 Found ${servicesSnapshot.docs.length} documents in Firestore`);
      
      const servicesData = servicesSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`📄 Processing document ${doc.id}:`, {
          name: data.name,
          hasTag: !!data.tag,
          hasTags: !!data.tags,
          tagValue: data.tag,
          tagsValue: data.tags,
          rawData: data
        });
        
        return createServiceFromData(doc.id, data);
      });
      
      console.log(`✅ Processed ${servicesData.length} services`);
      console.log('🔍 Sample service:', servicesData[0]);
      
      // Cache the services
      if (typeof window !== 'undefined') {
        getCache().set(cacheKey, servicesData);
      }
      
      setServices(servicesData);
      setFilteredServices(servicesData);
      updateCategories(servicesData);
      
      // Load featured services if not already loaded
      const featuredCache = getCache().get('featured-services') as Service[] | null;
      if (!featuredCache) {
        const featured = servicesData
          .filter(service => service.rating && service.rating >= 4)
          .slice(0, 6);
        setFeaturedServices(featured);
        getCache().set('featured-services', featured);
      }
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Error al cargar los servicios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []); // Removed all dependencies to prevent circular updates

  // Refresh services data
  const refreshServices = useCallback(async () => {
    // Clear cache if we're on the client
    if (typeof window !== 'undefined') {
      getCache().clear();
    }
    await loadServices();
  }, [loadServices]);

  // Initial load - only run once on mount
  useEffect(() => {
    loadServices();
  }, []); // Empty dependency array to run only once

  // Update filtered services when search term or category changes
  useEffect(() => {
    if (searchTerm || selectedCategory) {
      searchServices(searchTerm, selectedCategory || undefined);
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, selectedCategory, services, searchServices]);

  return (
    <ServicesContext.Provider
      value={{
        services,
        filteredServices,
        featuredServices,
        loading,
        error,
        searchTerm,
        selectedCategory,
        categories,
        setSearchTerm,
        setSelectedCategory,
        getServiceById,
        searchServices,
        resetSearch,
        isSearching,
        refreshServices
      }}
    >
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

