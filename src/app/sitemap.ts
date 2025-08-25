import { MetadataRoute } from 'next';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

// Tipos para los datos de servicios y categorías
type Service = {
  id: string;
  slug: string;
  updatedAt: Date;
  // Agrega más campos según sea necesario
};

type Category = {
  slug: string;
  // Agrega más campos según sea necesario
};

// Función para obtener servicios (simulada por ahora)
async function getServices(): Promise<Service[]> {
  // Implementar lógica real para obtener servicios
  return [];
}

// Función para obtener categorías (simulada por ahora)
async function getCategories(): Promise<Category[]> {
  // Implementar lógica real para obtener categorías
  return [];
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
      url: `${SITE_URL}/todos-los-servicios`,
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
  
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/servicio/${service.slug || service.id}`,
    lastModified: service.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Obtener categorías
  const categories = await getCategories();
  
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Combinar todas las rutas
  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...categoryRoutes,
  ];
}

// Configuración para regenerar el sitemap cada 24 horas
export const revalidate = 86400; // 24 horas en segundos
