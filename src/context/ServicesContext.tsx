'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, getDocs, getDoc, doc, query, orderBy, where, limit, startAfter, Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

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
class ServiceCache<T = any> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check if cache is still valid
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: T): void {
    // If cache is too big, remove the oldest items
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Initialize cache with proper typing
const cache = new ServiceCache<Service | Service[]>();

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

  // Get Firestore instance
  const getFirestoreInstance = useCallback((): Firestore => {
    if (!app) {
      throw new Error('Firebase app is not initialized');
    }
    return getFirestore(app);
  }, []);

  // Update categories from services
  const updateCategories = useCallback((servicesData: Service[]) => {
    const uniqueCategories = Array.from(
      new Set(servicesData.map(service => service.category).filter(Boolean))
    ) as string[];
    setCategories(uniqueCategories);
  }, []);

  // Search services
  const searchServices = useCallback((query: string, category?: string) => {
    setIsSearching(true);
    
    let results = [...services];
    
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(service => 
        service.name.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (category) {
      results = results.filter(service => service.category === category);
    }
    
    setFilteredServices(results);
    setIsSearching(false);
  }, [services]);

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setFilteredServices(services);
  }, [services]);

  // Load featured services
  const loadFeaturedServices = useCallback(async (servicesData?: Service[]) => {
    try {
      const cacheKey = 'featured-services';
      const cached = cache.get(cacheKey) as Service[] | null;
      
      if (cached) {
        setFeaturedServices(cached);
        return;
      }

      let featured: Service[] = [];
      
      if (servicesData) {
        // If we already have the services data, filter for featured
        featured = servicesData.filter(service => service.rating >= 4).slice(0, 6);
      } else {
        // Otherwise, query for featured services
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
        featured = querySnapshot.docs.map(doc => {
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
          };
        });
      }

      cache.set(cacheKey, featured);
      setFeaturedServices(featured);
    } catch (err) {
      console.error('Error loading featured services:', err);
      // Don't show error to user for featured services
    }
  }, [getFirestoreInstance]);

  // Get service by ID
  const getServiceById = useCallback(async (id: string): Promise<Service | null> => {
    if (!id) return null;
    
    const cacheKey = `service-${id}`;
    const cached = cache.get(cacheKey) as Service | null;
    
    if (cached) {
      return cached;
    }

    try {
      const db = getFirestoreInstance();
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const service: Service = {
          id: docSnap.id,
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
        };
        cache.set(cacheKey, service);
        return service;
      }
      
      return null;
    } catch (err) {
      console.error('Error getting service:', err);
      return null;
    }
  }, [getFirestoreInstance]);

  // Load all services
  const loadServices = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const cacheKey = 'all-services';
      if (!forceRefresh) {
        const cached = cache.get(cacheKey) as Service[] | null;
        if (cached) {
          setServices(cached);
          setFilteredServices([...cached]);
          updateCategories(cached);
          // Load featured services from cache if available
          const featuredCache = cache.get('featured-services') as Service[] | null;
          if (!featuredCache) {
            loadFeaturedServices(cached);
          }
          return;
        }
      }

      const db = getFirestoreInstance();
      const servicesRef = collection(db, 'services');
      
      // Usar un índice existente que incluya 'active' y 'name'
      const q = query(
        servicesRef, 
        where('active', '==', true),
        orderBy('name')
      );
      
      console.log('🔍 Ejecutando consulta de servicios...');
      const querySnapshot = await getDocs(q);
      console.log(`✅ Se encontraron ${querySnapshot.docs.length} servicios`);
      
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
        };
      });

      cache.set(cacheKey, servicesData);
      setServices(servicesData);
      setFilteredServices([...servicesData]);
      updateCategories(servicesData);
      
      // Load featured services with the new data
      loadFeaturedServices(servicesData);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Error al cargar los servicios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [getFirestoreInstance, loadFeaturedServices, updateCategories]);

  // Refresh services
  const refreshServices = useCallback(async () => {
    await loadServices(true);
  }, [loadServices]);

  // Initial load
  useEffect(() => {
    loadServices();
  }, [loadServices]);

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
        refreshServices,
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

