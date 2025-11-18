import { NextRequest, NextResponse } from 'next/server';
import { getCountry } from '@/lib/featureFlags';
import { rateLimit } from '@/lib/rateLimit';

// Utilidad Haversine para calcular distancia en km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type RecommendPayload = {
  lat?: number;
  lon?: number;
  radiusKm?: number; // default 5
  tags?: string[];
  publico_objetivo?: string;
  district?: string;
};

export async function POST(req: NextRequest) {
  try {
    // Rate limit básico por IP+path
    const limiter = rateLimit({ windowMs: 60_000, max: 30 });
    const limited = limiter(req);
    if (limited) return limited;

    const body = (await req.json()) as RecommendPayload;
    const lat = typeof body.lat === 'number' ? body.lat : undefined;
    const lon = typeof body.lon === 'number' ? body.lon : undefined;
    const radiusKmRaw = typeof body.radiusKm === 'number' ? body.radiusKm : 5;
    const radiusKm = Math.min(Math.max(radiusKmRaw, 0.5), 50);
    const tags = Array.isArray(body.tags) ? body.tags.filter(Boolean).slice(0, 20) : [];
    const publico = (body.publico_objetivo || '').trim();
    const district = (body.district || '').trim();

    if ((lat == null || lon == null) && !district) {
      return NextResponse.json(
        { error: 'Se requiere lat/lon o district para recomendaciones.' },
        { status: 400 }
      );
    }

    // Validaciones de rango para lat/lon si fueron provistas
    if (lat != null && (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90)) {
      return NextResponse.json({ error: 'lat fuera de rango (-90 a 90)' }, { status: 400 });
    }
    if (lon != null && (typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180)) {
      return NextResponse.json({ error: 'lon fuera de rango (-180 a 180)' }, { status: 400 });
    }

    const { getSupabaseClient } = await import('@/lib/supabase/client');
    const supabase = await getSupabaseClient();
    const country = getCountry();

    let qb = supabase
      .from('services')
      .select('*')
      .eq('active', true);
    if (country) qb = qb.eq('country', country);
    // Si tenemos district sin lat/lon, filtrar por district y saltar distancia
    if (district) {
      qb = qb.eq('district', district);
    }

    // Para cálculo de distancia, requerimos lat/lon almacenados
    if (lat != null && lon != null) {
      qb = qb.not('latitude', 'is', null).not('longitude', 'is', null);
    }

    // Limitar resultados base para performance
    qb = qb.order('createdAt', { ascending: false }).limit(500);

    const { data, error } = await qb;
    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];

    // Mapear y calcular distancia si aplica
    const withDistance = rows.map((row: any) => {
      const rLat = Number(row.latitude);
      const rLon = Number(row.longitude);
      let distanceKm: number | null = null;
      if (lat != null && lon != null && !Number.isNaN(rLat) && !Number.isNaN(rLon)) {
        distanceKm = haversineKm(lat, lon, rLat, rLon);
      }
      return {
        ...row,
        distanceKm,
      };
    });

    // Filtrar por radio si tenemos distancia
    const filtered = (lat != null && lon != null)
      ? withDistance.filter((r) => typeof r.distanceKm === 'number' && (r.distanceKm as number) <= radiusKm)
      : withDistance;

    // Relevancia simple: distancia primero, luego match de tags y público objetivo
    const normTags = tags.map(t => t.trim().toLowerCase());
    const score = (r: any) => {
      const d = typeof r.distanceKm === 'number' ? (r.distanceKm as number) : Number.POSITIVE_INFINITY;
      let s = d; // menor es mejor
      const svcTags: string[] = Array.isArray(r.tags) ? r.tags : [];
      const tagMatch = normTags.length > 0 && svcTags.some((t) => normTags.includes(String(t).toLowerCase()));
      if (tagMatch) s -= 0.5; // pequeño impulso por tags
      if (publico && typeof r.publico_objetivo === 'string' && r.publico_objetivo.trim() === publico) {
        s -= 0.2; // impulso menor por público objetivo
      }
      return s;
    };

    const sorted = filtered.sort((a, b) => score(a) - score(b));

    // Proyectar sólo campos públicos necesarios para las tarjetas
    const result = sorted.map((r) => ({
      id: r.id?.toString?.() || r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      category: r.category,
      categorySlug: r.categorySlug || r.category_slug,
      image: r.image,
      images: r.images || [],
      rating: r.rating || 0,
      whatsapp: r.whatsapp,
      phone: r.phone,
      district: r.district,
      neighborhood: r.neighborhood || r.barrio,
      tags: r.tags || [],
      publico_objetivo: r.publico_objetivo,
      distanceKm: r.distanceKm,
    }));

    return NextResponse.json({
      count: result.length,
      radiusKm,
      country,
      district: district || null,
      items: result,
    });
  } catch (err) {
    console.error('❌ Error en /api/services/recommended:', err);
    return NextResponse.json(
      { error: 'Error en recomendaciones', details: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}