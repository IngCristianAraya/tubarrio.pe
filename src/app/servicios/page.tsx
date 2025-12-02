export const dynamic = 'force-dynamic';
import React from 'react';
import ClientOnlyTodosLosServicios from '@/components/ClientOnlyTodosLosServicios';
import FeaturedBannersCarousel from '@/components/home/FeaturedBannersCarousel';
import { featuredBanners } from '@/mocks/featuredBanners';
import dynamicImport from 'next/dynamic';

const Header = dynamicImport(() => import('@/components/Header'), { ssr: false });
const Footer = dynamicImport(() => import('@/components/Footer'), { ssr: false });
const MobileBottomNav = dynamicImport(() => import('@/components/ui/MobileBottomNav'), { ssr: false });

export default function ServiciosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        {/* Hero Carousel Section - Same as home page */}
        <FeaturedBannersCarousel banners={featuredBanners} interval={3000} />
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