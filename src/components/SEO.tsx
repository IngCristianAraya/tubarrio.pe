'use client';

import React from 'react';
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other";
}

/**
 * Componente SEO para gestionar metadatos dinámicos en cada página
 * Adaptado para Next.js 13+ usando el nuevo sistema de metadatos
 */
const SEO = ({
  title = 'Revista Pando - Descubre todos los servicios de tu zona',
  description = 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en Lima Este. La revista digital que conecta negocios y clientes en tu barrio.',
  keywords = 'revista digital, negocios locales, Lima Este, Pando, restaurantes, servicios, directorio comercial, emprendimientos',
  image = '/images/hero_3.webp',
  url = 'https://revistapando.com',
  type = 'website'
}: SEOProps) => {
  // Construir título completo con formato consistente
  const fullTitle = title.includes('Revista Pando') ? title : `${title} | Revista Pando`;
  
  // En Next.js 13+, los metadatos se gestionan de manera diferente
  // Este componente ahora solo establece metadatos para el cliente
  // y sirve como compatibilidad con el código existente
  return (
    <>
      {/* Este componente ya no inserta metadatos directamente en el head */}
      {/* Sirve como un componente de compatibilidad para el código existente */}
      {/* Los metadatos reales se configuran en layout.tsx o page.tsx usando la API de metadatos */}
    </>
  );
};

// Función de utilidad para generar metadatos en archivos layout.tsx o page.tsx
export const generateMetadata = (props: SEOProps): Metadata => {
  const {
    title = 'Revista Pando - Descubre todos los servicios de tu zona',
    description = 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en Lima Este. La revista digital que conecta negocios y clientes en tu barrio.',
    keywords = 'revista digital, negocios locales, Lima Este, Pando, restaurantes, servicios, directorio comercial, emprendimientos',
    image = '/images/hero_3.webp',
    url = 'https://revistapando.com',
    type = 'website' as const
  } = props;
  
  // Construir título completo con formato consistente
  const fullTitle = title.includes('Revista Pando') ? title : `${title} | Revista Pando`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.split(',').map(k => k.trim()),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Revista Pando',
      images: [{
        url: image.startsWith('http') ? image : `${url}${image}`,
        width: 1200,
        height: 630,
        alt: fullTitle,
      }],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `${url}${image}`],
    },
    alternates: {
      canonical: url,
    },
  };
};

export default SEO;
