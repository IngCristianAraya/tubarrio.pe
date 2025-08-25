// Site configuration
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tubarrio.pe';
export const SITE_NAME = 'TuBarrio.pe';
export const SITE_DESCRIPTION = 'Encuentra los mejores servicios en tu barrio. Conectamos negocios locales con su comunidad.';
export const SITE_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const TWITTER_HANDLE = '@tubarriope';

// Default SEO configuration
export const DEFAULT_SEO = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  image: SITE_IMAGE,
  url: SITE_URL,
  type: 'website',
  locale: 'es_PE',
  siteName: SITE_NAME,
  twitterCard: 'summary_large_image',
  twitterHandle: TWITTER_HANDLE,
} as const;

// Default keywords for SEO
export const DEFAULT_KEYWORDS = [
  'servicios locales',
  'negocios cerca de mí',
  'directorio de servicios',
  'TuBarrio.pe',
  'servicios por barrio',
  'negocios locales',
  'comercio local',
  'servicios profesionales',
  'encontrar servicios',
  'guía de servicios',
];

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/tubarriope',
  instagram: 'https://www.instagram.com/tubarriope',
  twitter: `https://twitter.com/${TWITTER_HANDLE.replace('@', '')}`,
  whatsapp: 'https://wa.me/51999999999',
} as const;

// Contact information
export const CONTACT_INFO = {
  email: 'contacto@tubarrio.pe',
  phone: '+51999999999',
  address: 'Lima, Perú',
  businessHours: 'Lun-Sáb: 9:00 AM - 6:00 PM',
} as const;
