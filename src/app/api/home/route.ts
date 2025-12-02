import { NextResponse } from 'next/server';

type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  serviceCount: number;
};

export async function GET(request: Request) {
  try {
    const { getSupabaseClient } = await import('@/lib/supabase/client');
    const supabase = await getSupabaseClient();

    // Opcional: parámetros para enriquecer resultados
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const radiusKm = url.searchParams.get('radiusKm');

    // Traer servicios activos
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .limit(500);

    if (error) throw error;
    const rows = (data || []) as any[];

    // Helpers de normalización para derivar slugs cuando falte categorySlug
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
    const deriveSlug = (row: any): { slug: string; name: string } => {
      const rawSlug: string | undefined = row.categorySlug || row.category_slug;
      const name: string = row.category || 'Otros';
      if (rawSlug && typeof rawSlug === 'string' && rawSlug.trim()) {
        return { slug: rawSlug, name };
      }
      const guess = normalize(name);
      const canonical = aliasToCanonical[guess];
      const fallback = guess ? guess.replace(/\s+/g, '-') : 'otros';
      return { slug: canonical || fallback, name };
    };

    // Calcular categorías y conteos
    const categoryMap = new Map<string, HomeCategory>();
    for (const row of rows) {
      const { slug, name } = deriveSlug(row);
      const existing = categoryMap.get(slug);
      if (existing) {
        existing.serviceCount += 1;
      } else {
        categoryMap.set(slug, {
          id: slug,
          name,
          slug,
          icon: '📍', // placeholder; el icono real puede resolverse en el cliente
          serviceCount: 1,
        });
      }
    }

    const categories = Array.from(categoryMap.values())
      .sort((a, b) => b.serviceCount - a.serviceCount)
      .slice(0, 12);

    // Agrupar servicios por categoría y ordenar por featured/rating/fecha
    const servicesByCategory: Record<string, any[]> = {};
    for (const row of rows) {
      const { slug } = deriveSlug(row);
      if (!servicesByCategory[slug]) servicesByCategory[slug] = [];
      servicesByCategory[slug].push(row);
    }
    Object.keys(servicesByCategory).forEach((slug) => {
      servicesByCategory[slug] = servicesByCategory[slug]
        .sort((a, b) => {
          // Orden: featured desc, rating desc, createdAt desc
          const fA = a.featured ? 1 : 0;
          const fB = b.featured ? 1 : 0;
          if (fB !== fA) return fB - fA;
          const rA = a.rating || 0;
          const rB = b.rating || 0;
          if (rB !== rA) return rB - rA;
          const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dB - dA;
        })
        .slice(0, 8);
    });

    // En el futuro, si hay lat/lon, se puede enriquecer con servicios cercanos
    // sin duplicar lógica, delegando a /api/services/recommended.
    const nearbyMeta = lat && lon ? { lat, lon, radiusKm } : undefined;

    return NextResponse.json({ categories, servicesByCategory, nearbyMeta });
  } catch (err: any) {
    console.error('[api/home] Error:', err);
    return NextResponse.json(
      { error: 'Failed to load home data' },
      { status: 500 }
    );
  }
}
