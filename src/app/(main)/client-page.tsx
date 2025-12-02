'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { sampleCategories, sampleServices } from '@/mocks';
import { Category } from '@/types/service';
import NearbyGrid from '@/components/home/NearbyGrid';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { Service } from '@/types/service';
import { featuredBanners } from '@/mocks/featuredBanners';
import FeaturedBannersCarousel from '@/components/home/FeaturedBannersCarousel';
import CategoryChips from '@/components/home/CategoryChips';


// Cargar componentes dinámicamente
const CategorySection = dynamic(
  () => import('@/components/home/CategorySection'),
  {
    ssr: false,
    loading: () => (
      <div className="mb-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="h-40 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
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
  const [nearbyServices, setNearbyServices] = useState<Service[]>([]);
  const geo = useGeolocation({ enableHighAccuracy: false });
  const allowSamples = process.env.NEXT_PUBLIC_HOME_ALLOW_SAMPLES === 'true';

  useEffect(() => {
    setMounted(true);

    // Mapeo de emojis por slug desde los samples (para consistencia visual)
    const emojiBySlug = new Map<string, string>(
      sampleCategories.map((c) => [c.slug, c.emoji])
    );

    // Intentar cargar datos reales desde /api/home; fallback a samples si falla
    const loadHome = async () => {
      try {
        const res = await fetch('/api/home', { cache: 'no-store' });
        if (!res.ok) throw new Error('Home API error');
        const json = await res.json();

        const apiCategories = (json.categories || []) as Array<any>;
        const rawApiServicesByCategory = (json.servicesByCategory || {}) as Record<string, any[]>;

        // Normalización y alias de categorías para mapear correctamente y filtrar
        const normalize = (text: string) =>
          (text || '')
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, ' ');
        const aliasToCanonical: Record<string, string> = {
          'restaurantes y menus': 'restaurantes-y-menus',
          'restaurantes': 'restaurantes-y-menus',
          'comida rapida': 'comida-rapida',
          'abarrotes': 'abarrotes',
          'lavanderias': 'lavanderias',
          'servicios generales': 'servicios-generales',
          'servicios profesionales': 'servicios-profesionales',
          'peluquerias': 'peluquerias',
        };
        const resolveCanonicalSlug = (item: any): string => {
          const rawSlug = item?.categorySlug || item?.category_slug || '';
          const guess = normalize(rawSlug || item?.category || item?.categoryName || '');
          const canonical = aliasToCanonical[guess] || rawSlug || guess;
          return canonical || '';
        };

        if (!allowSamples) {
          // Modo estricto: usar SOLO datos de la API
          const adapted: Category[] = apiCategories.map((c: any) => ({
            id: c.id || c.slug,
            name: c.name,
            slug: c.slug,
            icon: emojiBySlug.get(c.slug) || c.icon || '🏷️',
            emoji: emojiBySlug.get(c.slug) || c.icon || '🏷️',
            serviceCount: c.serviceCount || (rawApiServicesByCategory[c.slug]?.length || 0),
          }))
            .sort((a, b) => (b.serviceCount || 0) - (a.serviceCount || 0));
          setCategories(adapted);

          const deduped: Record<string, any[]> = {};
          for (const slug of Object.keys(rawApiServicesByCategory)) {
            const list = (rawApiServicesByCategory[slug] || []).filter((s) => resolveCanonicalSlug(s) === slug);
            const seen = new Set<string>();
            const unique = [] as any[];
            for (const s of list) {
              const key = (s.id?.toString?.() || s.slug || '') as string;
              if (!key) continue;
              if (seen.has(key)) continue;
              seen.add(key);
              unique.push(s);
            }
            deduped[slug] = unique.slice(0, 8);
          }
          setServicesByCategory(deduped);
        } else {
          // Modo flexible: mantener categorías de muestra y rellenar con API cuando exista
          const normalize = (text: string) =>
            (text || '')
              .toLowerCase()
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, ' ');
          const aliasToCanonical: Record<string, string> = {
            'restaurantes y menus': 'restaurantes-y-menus',
            'restaurantes': 'restaurantes-y-menus',
            'comida rapida': 'comida-rapida',
            'abarrotes': 'abarrotes',
            'lavanderias': 'lavanderias',
            'servicios generales': 'servicios-generales',
            'servicios profesionales': 'servicios-profesionales',
            'peluquerias': 'peluquerias',
          };
          const bySlug = new Map<string, Category>();
          for (const c of sampleCategories) {
            bySlug.set(c.slug, c);
          }
          const remappedServicesByCategory: Record<string, any[]> = {};
          for (const slug of Object.keys(rawApiServicesByCategory)) {
            const firstItem = rawApiServicesByCategory[slug][0];
            const nameGuess = normalize(firstItem?.category || firstItem?.categoryName || slug);
            const canonical = aliasToCanonical[nameGuess] || slug;
            const targetSlug = bySlug.has(canonical) ? canonical : slug;
            if (!remappedServicesByCategory[targetSlug]) remappedServicesByCategory[targetSlug] = [];
            remappedServicesByCategory[targetSlug] = remappedServicesByCategory[targetSlug].concat(
              rawApiServicesByCategory[slug]
            );
          }
          for (const c of apiCategories) {
            const nameKey = normalize(c.name || c.slug);
            const canonical = aliasToCanonical[nameKey] || c.slug;
            if (!bySlug.has(canonical)) continue;
            const base = bySlug.get(canonical)!;
            bySlug.set(canonical, {
              ...base,
              id: c.id || base.id,
              name: base.name,
              slug: base.slug,
              icon: base.icon,
              emoji: base.emoji,
              serviceCount:
                c.serviceCount || (remappedServicesByCategory[canonical]?.length || base.serviceCount || 0),
            });
          }
          const categoriesUnion: Category[] = Array.from(bySlug.values());
          setCategories(categoriesUnion);
          const finalByCategory: Record<string, any[]> = {};
          for (const c of categoriesUnion) {
            const slug = c.slug;
            const apiList = (remappedServicesByCategory[slug] || []).filter((s) => resolveCanonicalSlug(s) === slug);
            const src = apiList.length > 0 ? apiList : (sampleServices[slug] || []);
            const seen = new Set<string>();
            const unique = [] as any[];
            for (const s of src) {
              const key = (s.id?.toString?.() || s.slug || '') as string;
              if (!key) continue;
              if (seen.has(key)) continue;
              seen.add(key);
              unique.push(s);
            }
            finalByCategory[slug] = unique.slice(0, 8);
          }
          setServicesByCategory(finalByCategory);
        }
      } catch (err) {
        // Fallback
        if (allowSamples) {
          setCategories(sampleCategories);
          setServicesByCategory(sampleServices);
        } else {
          setCategories([]);
          setServicesByCategory({});
        }
      }
    };

    loadHome();
  }, []);

  // Cargar cercanos si hay geolocalización
  useEffect(() => {
    const fetchNearby = async () => {
      if (!geo.latitude || !geo.longitude) return;
      const radiusKm = Number(localStorage.getItem('tb_radius_km') || 3);
      try {
        const qs = new URLSearchParams({
          lat: String(geo.latitude),
          lon: String(geo.longitude),
          radiusKm: String(radiusKm),
        }).toString();
        const res = await fetch(`/api/services/recommended?${qs}`, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const items = Array.isArray(json?.services) ? json.services : [];
        // De-duplicar por id/slug
        const seen = new Set<string>();
        const unique = [] as Service[];
        for (const s of items) {
          const key = (s.id?.toString?.() || s.slug || '') as string;
          if (!key) continue;
          if (seen.has(key)) continue;
          seen.add(key);
          unique.push(s);
        }
        setNearbyServices(unique);
      } catch (e) {
        // Silenciar errores, sección es opcional
      }
    };
    fetchNearby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.latitude, geo.longitude]);

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

      {/* Filtros rápidos por categoría (móvil) - reubicado a la sección de Explora */}

      {/* Cercanos (si disponibles) */}
      {nearbyServices.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-2 md:pb-4">
          <NearbyGrid services={nearbyServices} title="Cerca de ti" />
        </div>
      )}

      {/* ✅ CARRUSEL DE BANNERS DESTACADOS - Sin espaciado superior */}
      <FeaturedBannersCarousel banners={featuredBanners} interval={5000} />

      {/* Container sin padding superior para eliminar espacio con banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-12">

        {/* ✅ CATEGORIES GRID - Optimizado para móvil */}
        <div className="mb-8 md:mb-12 mt-0">
          <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-8 text-center mt-0 pt-0 md:mt-8 md:pt-8">🔎 Explora por categoría</h2>

          {/* Vista móvil: Chips horizontales (como barra superior) */}
          <CategoryChips categories={categories} variant="embedded" />

          {/* Vista desktop: Grid normal */}
          <div className="hidden md:grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`/servicios?categoria=${category.slug}`}
                className="group flex flex-col items-center text-center hover:opacity-90 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow">
                  <span className="text-3xl">{category.emoji}</span>
                </div>
                <h3 className="font-medium text-gray-800 text-base">{category.name}</h3>
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
