'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { sampleCategories, sampleServices } from '@/mocks';
import { Category } from '@/types/service';
import { featuredBanners } from '@/mocks/featuredBanners';
import FeaturedBannersCarousel from '@/components/home/FeaturedBannersCarousel';

// Cargar componentes dinámicamente
const CategorySection = dynamic(
  () => import('@/components/home/CategorySection'),
  { ssr: false, loading: () => <div>Loading categories...</div> }
);

const UnifiedHero = dynamic(
  () => import('@/components/UnifiedHero'),
  {
    ssr: false,
    loading: () => <div className="h-[70vh] bg-gray-100 animate-pulse"></div>
  }
);


export default function ClientHomePage() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, any>>({});

  useEffect(() => {
    setMounted(true);
    setCategories(sampleCategories);
    setServicesByCategory(sampleServices);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-[70vh] bg-gray-100 animate-pulse"></div>
        <div className="container mx-auto px-4 py-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-12">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
        {mounted && <UnifiedHero />}
      
      {/* ✅ CARRUSEL DE BANNERS DESTACADOS */}
      <FeaturedBannersCarousel banners={featuredBanners} interval={5000} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">

        {/* ✅ CATEGORIES GRID */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-orange-500 mb-8 text-center">🔎 Explora por categoría</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {categories.map((category) => (
              <a 
                key={category.slug} 
                href={`/todos-los-servicios?categoria=${category.slug}`}
                className="group flex flex-col items-center text-center hover:opacity-90 transition-opacity"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow">
                  <span className="text-2xl md:text-3xl">{category.emoji}</span>
                </div>
                <h3 className="font-medium text-gray-800 text-sm md:text-base">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{category.serviceCount} lugares</p>
              </a>
            ))}
          </div>
        </div>
        
        {/* ✅ CATEGORY SECTIONS */}
        {categories.map((category: Category) => (
          <div key={category.id} className="mb-12">
            <CategorySection 
              category={category} 
              services={servicesByCategory[category.slug] || []} 
            />
          </div>
))}
      </div>
    </main>
  );
}