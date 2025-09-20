import { SITE_URL } from '@/lib/constants';
import dynamic from 'next/dynamic';

// Import the client component dynamically with SSR disabled
const ClientHome = dynamic(() => import('./client-home'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white">
      <div className="h-[70vh] bg-gray-100 animate-pulse"></div>
    </div>
  )
});

// This is a Server Component
export default function Home() {
  return <ClientHome />;
}

// Server-side metadata
export const metadata = {
  title: 'Tubarrio.pe - Descubre todos los servicios de tu zona',
  description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'TuBarrio.pe - Descubre todos los servicios de tu zona',
    description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio.',
    url: '/',
    siteName: 'TuBarrio.pe',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuBarrio.pe - Descubre todos los servicios de tu zona',
    description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio.',
    images: ['/images/og-image.jpg'],
  },
};
