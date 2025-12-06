import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getCountry } from '@/lib/featureFlags';
import { getSupabaseClient } from '@/lib/supabase/client';

// Tipos para los datos de servicios y categorías
type Service = {
  id: string;
  slug: string;
  name?: string;
  categorySlug?: string;
  updatedAt?: Date;
};

type Category = {
  id: string;
  slug: string;
  name: string;
};

// Función para obtener servicios
export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await getSupabaseClient();
    const country = getCountry();
    let qb = supabase
      .from('services')
      .select('id, slug, categorySlug, updated_at, active')
      .eq('active', true)
      .limit(5000); // límite razonable
    if (country) qb = qb.eq('country', country);
    const { data, error } = await qb;
    if (error) throw error;
    const items: Service[] = (data || []).map((row: any) => ({
      id: row.id?.toString?.() || row.id,
      slug: row.slug,
      categorySlug: row.categorySlug || row.category_slug,
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    }));
    return items;
  } catch (err) {
    console.error('[sitemap] Error obteniendo servicios desde Supabase:', err);
    return [];
  }
}

// Función para obtener categorías
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, name, status')
      .eq('status', 'active')
      .order('name', { ascending: true });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id?.toString?.() || row.id,
      slug: row.slug,
      name: row.name,
    }));
  } catch (err) {
    console.error('[sitemap] Error obteniendo categorías desde Supabase:', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rutas estáticas
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
    url: `${SITE_URL}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terminos-condiciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/registrar-negocio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Obtener servicios dinámicos
  const services = await getServices();
  
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => {
    // Construir la URL del servicio
    const url = service.categorySlug 
      ? `${SITE_URL}/${service.categorySlug}/${service.slug}`
      : `${SITE_URL}/servicio/${service.slug || service.id}`;
      
    return {
      url,
      lastModified: service.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  // Obtener categorías
  const categories = await getCategories();
  
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // Agregar ruta para cada categoría individual
  const categoryPageRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Combinar todas las rutas
  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...categoryRoutes,
    ...categoryPageRoutes,
  ];
}

// Configuración para regenerar el sitemap cada 24 horas
export const revalidate = 86400; // 24 horas en segundos
