export const dynamic = 'force-dynamic';
import React from 'react';
import ClientOnlyTodosLosServicios from '@/components/ClientOnlyTodosLosServicios';
import dynamicImport from 'next/dynamic';
const FeaturedBannersCarousel = dynamicImport(() => import('@/components/home/FeaturedBannersCarousel'), { ssr: false });
import { featuredBanners } from '@/mocks/featuredBanners';
import { generateMetadata as buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Servicios locales',
  description: 'Explora servicios cerca de ti: restaurantes, profesionales, tecnología y más en TuBarrio.pe.',
  url: '/servicios',
  image: '/images/og-image.jpg',
  type: 'website',
  keywords: ['servicios', 'directorio', 'restaurantes', 'profesionales', 'tecnología'],
});

const Header = dynamicImport(() => import('@/components/Header'), { ssr: false });
const Footer = dynamicImport(() => import('@/components/Footer'), { ssr: false });
const MobileBottomNav = dynamicImport(() => import('@/components/ui/MobileBottomNav'), { ssr: false });

export default function ServiciosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        {/* Hero Carousel Section - Lazy-loaded to reduce render-blocking CSS */}
        <div className="cv-auto">
          <FeaturedBannersCarousel banners={featuredBanners} interval={3000} />
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <ClientOnlyTodosLosServicios />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
