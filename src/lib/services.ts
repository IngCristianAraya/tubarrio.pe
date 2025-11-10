import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  orderBy, 
  startAfter, 
  DocumentData, 
  QueryDocumentSnapshot,
  Query,
  getDoc,
  doc,
  DocumentSnapshot
} from 'firebase/firestore';
import { cache } from 'react';
import { db } from './firebase/config';
import { getDataSource, getCountry } from './featureFlags';

// Helper type for cached data
interface CachedData<T> {
  data: T;
  timestamp: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  location?: string;
  address?: string;
  reference?: string;
  rating: number;
  image: string;
  images: string[];
  detailsUrl?: string;
  contactUrl?: string;
  whatsapp?: string;
  social?: string;
  horario?: string;
  hours?: string;
  featured?: boolean;
  status?: string;
  [key: string]: any; // For additional properties
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  serviceCount: number;
  status?: string;
  [key: string]: any; // For additional properties
}

// Cache for frequently accessed data
const servicesCache = new Map<string, CachedData<{ services: Service[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }>>();
const categoriesListCache = new Map<string, CachedData<Category[]>>();
const categoryCache = new Map<string, CachedData<Category | null>>();

// Helper function to get a cached query result or fetch fresh data
async function getCachedOrFetch<T>(
  cacheKey: string,
  cache: Map<string, CachedData<T>>,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default TTL
): Promise<T> {
  const cached = cache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < ttl) {
    return cached.data;
  }
  
  const data = await fetchFn();
  cache.set(cacheKey, { data, timestamp: now });
  return data;
}

// Preload function for better performance
export const preloadServices = (categorySlug: string) => {
  void getServicesByCategory(categorySlug);
};

interface ServicesResult {
  services: Service[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

export async function getServicesByCategory(
  categorySlug: string, 
  limitCount: number = 4,
  lastVisible: QueryDocumentSnapshot<DocumentData> | null = null
): Promise<ServicesResult> {
  const cacheKey = `services_${categorySlug}_${limitCount}_${lastVisible?.id || 'first'}`;
  
  const result = await getCachedOrFetch<ServicesResult>(
    cacheKey,
    servicesCache,
    async (): Promise<ServicesResult> => {
      try {
        // Rama Supabase: consultar servicios activos por slug de categoría
        if (getDataSource() === 'supabase') {
          const { getSupabaseClient } = await import('@/lib/supabase/client');
          const supabase = await getSupabaseClient();
          console.log('[lib/services] 📡 Supabase getServicesByCategory:', categorySlug);
          let qb = supabase
            .from('services')
            .select('*')
            .eq('active', true)
            .eq('categorySlug', categorySlug)
            .order('featured', { ascending: false })
            .order('name', { ascending: true })
            .limit(limitCount);
          const country = getCountry();
          if (country) {
            qb = qb.eq('country', country);
          }
          const { data, error } = await qb;
          if (error) {
            throw error;
          }
          const services = (data || []).map((row: any) => ({
            id: row.id?.toString?.() || row.uid,
            ...row,
          })) as Service[];
          // Supabase no usa lastVisible; retornar null
          return { services, lastVisible: null };
        }

        const servicesRef = collection(db.instance, 'services');
        let q: Query<DocumentData> = query(
          servicesRef,
          where('categorySlug', '==', categorySlug),
          where('status', '==', 'active'),
          orderBy('featured', 'desc'),
          orderBy('name'),
          limit(limitCount)
        );
        
        if (lastVisible) {
          q = query(q, startAfter(lastVisible));
        }
        
        const querySnapshot = await getDocs(q);
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
        
        const services = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Service));
        
        return { services, lastVisible: lastDoc };
      } catch (error) {
        console.error('Error fetching services by category:', error);
        return { services: [], lastVisible: null };
      }
    }
  );
  
  return result;
  }

// Cache categories for 1 hour
const CATEGORIES_TTL = 60 * 60 * 1000;

export const getAllCategories = cache(async (): Promise<Category[]> => {
  return getCachedOrFetch<Category[]>(
    'all_categories',
    categoriesListCache,
    async (): Promise<Category[]> => {
      try {
        if (getDataSource() === 'supabase') {
          const { getSupabaseClient } = await import('@/lib/supabase/client');
          const supabase = await getSupabaseClient();
          console.log('[lib/services] 📡 Supabase getAllCategories');
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('status', 'active')
            .order('name', { ascending: true });
          if (error) throw error;
          const categories = (data || []).map((row: any) => ({
            id: row.id?.toString?.() || row.uid,
            ...row,
          })) as Category[];
          categories.forEach(category => {
            if (category.id) {
              categoryCache.set(`category_id_${category.id}`, { data: category, timestamp: Date.now() });
            }
          });
          return categories;
        }
        const categoriesRef = collection(db.instance, 'categories');
        const q = query(
          categoriesRef, 
          where('status', '==', 'active'),
          orderBy('name')
        );
        
        const querySnapshot = await getDocs(q);
        
        const categories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Category));
        
        // Cache each category individually as well
        categories.forEach(category => {
          if (category.id) {
            categoryCache.set(`category_id_${category.id}`, { data: category, timestamp: Date.now() });
          }
        });
        
        return categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    CATEGORIES_TTL
  );
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const cacheKey = `category_slug_${slug}`;
  
  // First check if we have this category in the individual cache
  const cachedCategory = categoryCache.get(cacheKey);
  if (cachedCategory && (Date.now() - cachedCategory.timestamp) < CATEGORIES_TTL) {
    return cachedCategory.data;
  }
  
  const result = await getCachedOrFetch<Category | null>(
    cacheKey,
    categoryCache,
    async (): Promise<Category | null> => {
      try {
        if (getDataSource() === 'supabase') {
          const { getSupabaseClient } = await import('@/lib/supabase/client');
          const supabase = await getSupabaseClient();
          console.log('[lib/services] 📡 Supabase getCategoryBySlug:', slug);
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'active')
            .limit(1);
          if (error) throw error;
          const row = (data || [])[0];
          if (!row) return null;
          const categoryData: Category = { id: row.id?.toString?.() || row.uid, ...row } as Category;
          if (categoryData.id) {
            categoryCache.set(`category_id_${categoryData.id}`, { data: categoryData, timestamp: Date.now() });
          }
          return categoryData;
        }
        const categoriesRef = collection(db.instance, 'categories');
        const q = query(
          categoriesRef,
          where('slug', '==', slug),
          where('status', '==', 'active'),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          return null;
        }
        
        const categoryData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as Category;
        
        // Also cache the category by ID
        if (categoryData.id) {
          categoryCache.set(`category_id_${categoryData.id}`, { data: categoryData, timestamp: Date.now() });
        }
        
        return categoryData;
      } catch (error) {
        console.error('Error fetching category by slug:', error);
        return null;
      }
    },
    CATEGORIES_TTL
  );
  
  return result;
});
