import React from 'react';
import ClientOnlyTodosLosServicios from '@/components/ClientOnlyTodosLosServicios';
import FeaturedBannersCarousel from '@/components/home/FeaturedBannersCarousel';
import { featuredBanners } from '@/mocks/featuredBanners';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Hero Carousel Section - Same as home page */}
      <FeaturedBannersCarousel banners={featuredBanners} interval={3000} />
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <ClientOnlyTodosLosServicios />
        </div>
      </main>
      <Footer />
    </div>
  );
}