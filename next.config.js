const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Duración de caché en segundos
const CACHE_HEADERS = {
  // Archivos estáticos (JS, CSS, fuentes, imágenes)
  static: 'public, max-age=31536000, immutable', // 1 año
  // Páginas HTML
  server: 'public, max-age=0, s-maxage=31536000, must-revalidate', // 1 año en CDN
  // Datos de la API
  api: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400', // 1 hora en CDN, 1 día de gracia
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes optimizadas
  images: {
    // Formatos modernos (AVIF es más eficiente que WebP)
    formats: ['image/avif', 'image/webp'],
    // Tamaños de imagen estándar para el viewport
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Densidades de píxeles soportadas
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Dominios permitidos para optimización de imágenes
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'cdn.pixabay.com',
      'firebasestorage.googleapis.com',
    ],
    // Cargar imágenes bajo demanda
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días de caché
    // Configuración de caché para imágenes
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuración de cabeceras de caché y seguridad
  async headers() {
    return [
      // Configuración global para todos los assets
      {
        source: '/(.*)',
        headers: [
          // Seguridad
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      
      // Archivos estáticos (JS, CSS, fuentes, imágenes)
      {
        source: '/(.*)\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp|avif)$',
        headers: [
          {
            key: 'Cache-Control',
            value: CACHE_HEADERS.static,
          },
        ],
      },
      
      // Páginas HTML
      {
        source: '/(.*)\.html$',
        headers: [
          {
            key: 'Cache-Control',
            value: CACHE_HEADERS.server,
          },
        ],
      },
      
      // Rutas de la API
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: CACHE_HEADERS.api,
          },
        ],
      },
      
      // Páginas dinámicas (SSG/ISR)
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: '',
            value: '(?<query>.*)',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: CACHE_HEADERS.api,
          },
        ],
      },
    ];
  },
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de prefetching
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
  
  // Configuración de revalidación ISR
  reactStrictMode: true,
};

// SUGERENCIA: Para builds modernos, asegúrate de tener un archivo .browserslistrc con:
// last 2 Chrome versions
// last 2 Edge versions
// last 2 Firefox versions
// last 2 Safari versions
// not IE 11
// not dead
// Esto evitará polyfills y transpile innecesario para navegadores legacy.

module.exports = withBundleAnalyzer(nextConfig);
