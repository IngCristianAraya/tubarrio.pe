import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tubarrio.pe';
const SITE_NAME = 'TuBarrio.pe';
const DEFAULT_DESCRIPTION = 'Encuentra los mejores servicios en tu barrio. Conectamos negocios locales con su comunidad.';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.jpg`;
const TWITTER_HANDLE = '@tubarriope';

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
  keywords = [
    'servicios locales', 
    'negocios cerca de mí', 
    'directorio de servicios', 
    'TuBarrio.pe',
    'servicios por barrio',
    'negocios locales',
    'comercio local',
    'servicios profesionales',
    'encontrar servicios',
    'guía de servicios'
  ],
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: PageMetadata = {}): Metadata {
  const metadata: Metadata = {
    title: title === SITE_NAME ? title : `${title} | ${SITE_NAME}`,
    description,
    keywords: [...new Set([...keywords])].join(', '),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
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
      locale: 'es_PE',
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
    },
  };

  // Add article specific metadata
  if (type === 'article') {
    metadata.other = {
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime })
    };
  }

  if (author) {
    metadata.authors = [{ name: author }];
  }

  if (section) {
    metadata.category = section;
  }

  if (tags.length > 0) {
    metadata.keywords = [...new Set([...keywords, ...tags])].join(', ');
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
