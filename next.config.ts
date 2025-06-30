import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para imágenes externas
  images: {
    domains: ['images.pexels.com', 'cdn.pixabay.com', 'images.unsplash.com', 'via.placeholder.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    // Configuración para optimización de imágenes
    formats: ['image/avif', 'image/webp'],
    // Permitir imágenes sin optimizar para dominios externos
    unoptimized: true
  },
  // Configuración para mapbox-gl y otras librerías que requieren configuración especial
  transpilePackages: ['mapbox-gl', 'react-pageflip']
};

export default nextConfig;
