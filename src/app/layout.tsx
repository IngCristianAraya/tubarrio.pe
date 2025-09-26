import { GeistSans } from 'geist/font/sans';
import React from 'react';
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet.css";
import "@/styles/leaflet-fixes.css";
import { Providers } from '@/app/providers';
import { JsonLd } from '@/components/seo/JsonLd';
import { Skeleton } from '@/components/ui/Skeleton';
import { AnalyticsInitializer } from '@/components/analytics/AnalyticsInitializer';
import { SITE_URL } from '@/lib/constants';
import { generateMetadata } from "@/lib/seo";
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR to avoid hydration issues
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const PromoBar = dynamic(() => import('@/components/PromoBar'), { 
  ssr: false,
  loading: () => <div className="h-10 bg-gray-100 animate-pulse"></div> 
});


// Loading component for the main layout
function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="h-16 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto h-full px-4 flex items-center">
          <Skeleton className="h-8 w-32 bg-gray-200 dark:bg-gray-700" />
          <div className="ml-auto flex space-x-4">
            <Skeleton className="h-9 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-9 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </main>
    </div>
  );
}

// Global application metadata
export const metadata = generateMetadata({
  title: "Tubarrio.pe - Descubre todos los servicios de tu zona",
  description: "Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio. La plataforma que conecta negocios y clientes en tu comunidad.",
  image: "/images/hero_3.webp",
  url: "/",
  type: "website",
  keywords: [
    "directorio comercial",
    "negocios locales",
    "servicios",
    "restaurantes",
    "abarrotes",
    "lavanderías",
    "panaderías",
    "emprendimientos",
    "tu barrio",
  ],
});



interface RootLayoutProps {
  children: any;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, orientation=portrait" />
        <link rel="manifest" href="/manifest.json" />
        {/* Prevenir inyección de estilos por extensiones */}
        <meta name="theme-color" content="#ffffff" />
        <JsonLd
          type="LocalBusiness"
          data={{
            name: "TuBarrio.pe",
            description: "Plataforma que conecta negocios locales con su comunidad, ofreciendo un directorio completo de servicios en tu barrio.",
            url: SITE_URL,
            logo: `${SITE_URL}/images/logo.png`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Lima',
              addressLocality: 'Lima',
              addressRegion: 'Lima',
              postalCode: '15001',
              addressCountry: 'PE',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '-12.0464',
              longitude: '-77.0428',
            },
            telephone: "+51999999999",
            openingHours: "Mo-Sa 09:00-18:00",
            sameAs: [
              'https://www.facebook.com/tubarriope',
              'https://www.instagram.com/tubarriope',
            ]
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              -webkit-tap-highlight-color: transparent;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `
        }} />

      </head>
      <body className={`${GeistSans.className} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <AnalyticsInitializer />
            <PromoBar />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
