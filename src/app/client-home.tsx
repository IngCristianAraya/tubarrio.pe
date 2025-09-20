'use client';

import dynamic from 'next/dynamic';
import { SITE_URL } from '@/lib/constants';
import { SocialMeta } from '@/components/seo/SocialMeta';

// Cargar el componente de cliente dinámicamente
const ClientHomePage = dynamic(() => import('./client-page'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white">
      <div className="h-[70vh] bg-gray-100 animate-pulse"></div>
    </div>
  )
});

export default function ClientHome() {
  return (
    <>
      <SocialMeta 
        title="TuBarrio.pe - Descubre todos los servicios de tu zona"
        description="Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio."
        image="/images/og-image.jpg"
        url={SITE_URL}
      />
      <ClientHomePage />
    </>
  );
}
