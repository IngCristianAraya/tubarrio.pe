import { Metadata } from 'next';

// Constantes de configuración
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tubarrio.pe';
const SITE_NAME = 'TuBarrio.pe';
const DEFAULT_DESCRIPTION = 'Descubre y encuentra los mejores servicios, restaurantes y comercios en tu barrio. Conectamos negocios locales con su comunidad.';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.jpg`;
const TWITTER_HANDLE = '@tubarriope';
const SITE_KEYWORDS = [
  'servicios locales', 
  'restaurantes cerca de mí',
  'comercios locales',
  'directorio de servicios',
  'TuBarrio.pe',
  'guía de barrio',
  'negocios locales',
  'comercio local',
  'servicios por barrio',
  'encontrar servicios',
  'directorio comercial',
  'guía de la ciudad',
  'recomendaciones locales',
  'negocios cercanos',
  'servicios profesionales',
  'comercios en mi zona'
];

type PageMetadata = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
};

export function generateMetadata({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: PageMetadata = {}): Metadata {
  // Combinar palabras clave globales con las específicas de la página
  const allKeywords = [...new Set([...SITE_KEYWORDS, ...keywords])];
  
  const metadata: Metadata = {
    title: title === SITE_NAME ? title : `${title} | ${SITE_NAME}`,
    description,
    keywords: allKeywords.join(', '),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: 'es_PE',
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
      nocache: false,
      noimageindex: false,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };

  // Definir el objeto schemaOrg
  const schemaOrg = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });

  // Inicializar metadata.other con el tipo correcto
  metadata.other = {
    ...(metadata.other as Record<string, string | string[]>),
    'application-ld+json': schemaOrg
  };

  // Add article specific metadata
  if (type === 'article') {
    // Usar campos nativos de Next.js cuando sea posible
    if (author) {
      metadata.authors = [{ name: author }];
    }
    
    if (section) {
      metadata.category = section;
    }
    
    // Usar el campo 'other' para metadatos personalizados
    const articleMeta: Record<string, string> = {};
    
    if (publishedTime) {
      articleMeta['article:published_time'] = publishedTime;
    }
    
    if (modifiedTime) {
      articleMeta['article:modified_time'] = modifiedTime;
    }
    
    // Añadir metadatos personalizados si existen
    if (Object.keys(articleMeta).length > 0) {
      metadata.other = {
        ...(metadata.other as Record<string, string | string[]> || {}),
        ...articleMeta
      };
    }
  }

  // Los campos de autor y sección ya se manejan dentro del bloque de artículos

  if (tags.length > 0) {
    metadata.keywords = [...new Set([...allKeywords, ...tags])].join(', ');
  }

  return metadata;
}

// Helper function to generate JSON-LD structured data
export function generateJsonLd<T extends Record<string, any>>(data: T, type: string) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

// Common structured data types
export const structuredData = {
  website: (url: string) => generateJsonLd(
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${url}/buscar?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    'WebSite'
  ),
  organization: () => generateJsonLd(
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      sameAs: [
        'https://www.facebook.com/tubarriope',
        'https://www.instagram.com/tubarriope',
      ],
    },
    'Organization'
  ),
  localBusiness: (business: any) => generateJsonLd(
    {
      '@type': 'LocalBusiness',
      ...business,
      '@context': 'https://schema.org',
    },
    'LocalBusiness'
  ),
  breadcrumbList: (items: Array<{ name: string; item: string }>) => generateJsonLd(
    {
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    },
    'BreadcrumbList'
  ),
};
