'use client';

import ClientOnlyTodosLosServicios from '@/components/ClientOnlyTodosLosServicios';
import FeaturedBannersCarousel from '@/components/home/FeaturedBannersCarousel';
import { featuredBanners } from '@/mocks/featuredBanners';

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section - Same as home page */}
      <FeaturedBannersCarousel banners={featuredBanners} interval={3000} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <ClientOnlyTodosLosServicios />
      </div>
    </main>
  );
}
