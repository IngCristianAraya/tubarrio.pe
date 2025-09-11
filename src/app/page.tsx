import dynamic from 'next/dynamic';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';
import { SocialMeta } from '@/components/seo/SocialMeta';
import { SITE_URL } from '@/lib/constants';
import { MapPin } from 'lucide-react';

// Importaciones dinámicas con carga perezosa para componentes que pueden ser renderizados en el servidor
const Header = dynamic(() => import('@/components/Header'), {
  loading: () => <header className="h-16 bg-white shadow-sm"></header>,
  ssr: true
});

const UnifiedHero = dynamic(() => import('@/components/UnifiedHero'), {
  loading: () => <div className="h-[70vh] bg-gray-100 animate-pulse"></div>,
  ssr: true
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <footer className="h-20 bg-gray-800"></footer>,
  ssr: true
});



// Importamos directamente el componente cliente
import ClientComponents from '../components/ClientComponents';

// Generate metadata for better SEO
export async function generateMetadata() {
  return generateSeoMetadata({
    title: 'Tubarrio.pe - Descubre todos los servicios de tu zona',
    description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio. La plataforma digital que conecta negocios y clientes.',
    url: '/',
    type: 'website',
  });
}

// Página de inicio
export default function Home() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Metadata */}
      <SocialMeta 
        title="TuBarrio.pe - Descubre todos los servicios de tu zona"
        description="Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio. La plataforma digital que conecta negocios y clientes."
        image="/images/og-image.jpg"
        url={SITE_URL}
        type="website"
        tags={['servicios locales', 'negocios cercanos', 'directorio comercial']}
      />
      
      {/* Structured Data for Homepage */}
      <LocalBusinessJsonLd
        name="TuBarrio.pe"
        description="Plataforma que conecta negocios locales con su comunidad, ofreciendo un directorio completo de servicios en tu barrio."
        url={SITE_URL}
        logo={`${SITE_URL}/images/logo.png`}
        address={{
          streetAddress: 'Lima',
          addressLocality: 'Lima',
          addressRegion: 'Lima',
          postalCode: '15001',
          addressCountry: 'PE',
        }}
        geo={{
          latitude: '-12.0464',
          longitude: '-77.0428',
        }}
        telephone="+51999999999"
        openingHours="Mo-Sa 09:00-18:00"
        priceRange="$$"
        sameAs={[
          'https://www.facebook.com/tubarriope',
          'https://www.instagram.com/tubarriope',
        ]}
      />
      
      {/* Header (Navbar) */}
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <UnifiedHero 
          variant="home"
          title={
            <>
              <span className="text-gray-800">Explora los negocios de </span>
              <span className="text-orange-500">tu barrio</span>
            </>
          }
          subtitle="Encuentra los mejores servicios locales cerca de ti"
          backgroundImage="/images/prueba_yasmin_hd.webp"
        >
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">
              <span className="inline-flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                Actualmente cubriendo: Pando y alrededores
              </span>
            </p>
          </div>
        </UnifiedHero>
        
        {/* Componentes del cliente que necesitan interactividad del navegador */}
        <ClientComponents />
      </main>

      <Footer />

    </div>
  );
}
