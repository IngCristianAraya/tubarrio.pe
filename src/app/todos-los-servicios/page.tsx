'use client';

import dynamic from 'next/dynamic';
import ClientOnlyTodosLosServicios from '@/components/ClientOnlyTodosLosServicios';

// Dynamically import HeroCarousel with no SSR to avoid hydration issues
const HeroCarousel = dynamic(() => import('@/components/HeroCarousel'), { ssr: false });

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className="w-full">
        <HeroCarousel />
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <ClientOnlyTodosLosServicios />
      </div>
    </div>
  );
}
