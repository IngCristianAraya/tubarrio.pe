/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Habilita optimización de imágenes para mejorar LCP
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'localhost',
      'vercel.app',
      'tubarrio.vercel.app',
      'firebasestorage.googleapis.com',
      'googleapis.com',
      'google.com',
      'gstatic.com',
      'pexels.com',
      'images.pexels.com',
      'unsplash.com',
      'images.unsplash.com',
      'pixabay.com',
      'cdn.pixabay.com',
      'res.cloudinary.com',
      'tile.openstreetmap.org',
      'unpkg.com',
      'lh3.googleusercontent.com',
      'picsum.photos',
      'via.placeholder.com',
      // Supabase storage bucket (ajustar al dominio de tu proyecto)
      'fyekrdhzerjagradhxvv.supabase.co',
      'faumtjrpyyzxhrvtwwkj.supabase.co',
      'source.unsplash.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración optimizada para producción
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
