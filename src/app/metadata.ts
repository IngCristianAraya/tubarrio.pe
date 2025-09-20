import { generateMetadata as generateSeoMetadata } from '@/lib/seo';

// Generate metadata for better SEO
export async function generateMetadata() {
  return generateSeoMetadata({
    title: 'Tubarrio.pe - Descubre todos los servicios de tu zona',
    description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio.',
    url: '/',
    type: 'website',
  });
}
