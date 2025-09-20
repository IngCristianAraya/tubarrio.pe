'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { sampleCategories, sampleServices } from '@/mocks';
import { Category } from '@/types/service';

// Cargar componentes dinámicamente
const CategorySection = dynamic(
  () => import('@/components/CategorySection'),
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
    // Cargar datos iniciales
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
    <main className="min-h-screen bg-white">
      <UnifiedHero />
      
      <div className="container mx-auto px-4 py-12">
        {categories.map((category) => (
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
