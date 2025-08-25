import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow admin and API routes
      disallow: ['/admin/', '/api/', '/_next/', '/*/edit/', '/*?*sort=', '/*?*filter='],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Optional: Add a crawl delay if needed
    // crawlDelay: 10,
  };
}
