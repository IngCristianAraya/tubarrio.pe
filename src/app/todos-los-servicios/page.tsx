'use client';

import ClientOnlyTodosLosServicios from '@/components/ClientOnlyTodosLosServicios';
import dynamic from 'next/dynamic';
const FeaturedBannersCarousel = dynamic(() => import('@/components/home/FeaturedBannersCarousel'), { ssr: false });
import { featuredBanners } from '@/mocks/featuredBanners';

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section - Lazy-loaded to reduce render-blocking CSS */}
      <div className="cv-auto">
        <FeaturedBannersCarousel banners={featuredBanners} interval={3000} />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <ClientOnlyTodosLosServicios />
      </div>
    </main>
  );
}
