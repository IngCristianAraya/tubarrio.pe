import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import sampleServices from '@/mocks/services';
import sampleCategories from '@/mocks/categories';

// Tipos para los datos de servicios y categorías
type Service = {
  id: string;
  slug: string;
  name: string;
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
  // Aplanar el objeto de servicios por categoría a un solo array
  const allServices: Service[] = [];
  
  Object.values(sampleServices).forEach(categoryServices => {
    categoryServices.forEach(service => {
      allServices.push({
        id: service.id,
        slug: service.slug,
        name: service.name,
        categorySlug: service.categorySlug,
        updatedAt: new Date() // Usamos la fecha actual como última modificación
      });
    });
  });
  
  return allServices;
}

// Función para obtener categorías
export async function getCategories(): Promise<Category[]> {
  // Mapear las categorías de muestra al formato esperado
  return sampleCategories.map(category => ({
    id: category.id,
    slug: category.slug,
    name: category.name
  }));
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
