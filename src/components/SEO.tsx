'use client';

import React from 'react';
import { Metadata } from 'next';

/**
 * Interfaz que define las propiedades del componente SEO
 * @property {string} [title] - Título de la página
 * @property {string} [description] - Descripción para motores de búsqueda
 * @property {string} [keywords] - Palabras clave para SEO
 * @property {string} [image] - URL de la imagen para redes sociales
 * @property {string} [url] - URL canónica de la página
 * @property {string} [type] - Tipo de contenido (website, article, etc.)
 */
interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other";
}

/**
 * Componente para gestión de metadatos SEO en la aplicación
 * 
 * @component
 * @description 
 * Este componente se encarga de gestionar los metadatos SEO de la aplicación.
 * En Next.js 13+ con App Router, los metadatos se manejan principalmente a través
 * de la API de metadatos en los archivos layout.tsx o page.tsx. Este componente
 * se mantiene como compatibilidad con código existente y para casos donde se
 * necesite manipular metadatos del lado del cliente.
 * 
 * Características:
 * - Proporciona valores por defecto para todos los metadatos
 * - Construye títulos consistentes
 * - Es compatible con Open Graph y Twitter Cards
 * - Sigue las mejores prácticas de SEO
 */
const SEO = ({
  title = 'Tubarrio.pe - Descubre todos los servicios de tu zona',
  description = 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio. La plataforma digital que conecta negocios y clientes.',
  keywords = 'directorio comercial, negocios locales, servicios, restaurantes, emprendimientos, comercios, barrio',
  image = '/images/hero_3.webp',
  url = 'https://tubarrio.pe',
  type = 'website'
}: SEOProps) => {
  // Construir título completo con formato consistente
  // Si el título ya incluye 'Tubarrio.pe', se usa tal cual
  // De lo contrario, se agrega como sufijo
  const fullTitle = title.includes('Tubarrio.pe') ? title : `${title} | Tubarrio.pe`;
  
  /* 
   * NOTA: En Next.js 13+ con App Router, los metadatos se gestionan principalmente
   * a través de la API de metadatos en los archivos layout.tsx o page.tsx.
   * 
   * Este componente se mantiene para:
   * 1. Compatibilidad con código existente
   * 2. Casos donde se necesite manipular metadatos del lado del cliente
   * 3. Como proveedor de valores por defecto
   * 
   * Para la mayoría de los casos, es preferible usar la API de metadatos de Next.js
   * exportando un objeto 'metadata' o 'generateMetadata' en los archivos de página.
   */
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
    keywords = 'directorio comercial, negocios locales, servicios, restaurantes, emprendimientos, comercios, barrio',
    image = '/images/hero_3.webp',
    url = 'https://tubarrio.pe',
    type = 'website' as const
  } = props;
  
  // Construir título completo con formato consistente
  const fullTitle = title.includes('Tubarrio.pe') ? title : `${title} | Tubarrio.pe`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.split(',').map(k => k.trim()),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Tubarrio.pe',
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
