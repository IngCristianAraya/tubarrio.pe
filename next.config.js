const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar ESLint durante el build
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  // Configuración para imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },
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
