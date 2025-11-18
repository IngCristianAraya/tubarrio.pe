import { NextRequest, NextResponse } from 'next/server';

// Helpers Supabase
async function getSupabaseAnon() {
  const { getSupabaseClient } = await import('@/lib/supabase/client');
  return getSupabaseClient();
}

function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

// POST /api/services/nearby
// Intenta usar PostGIS via RPC (negocios_cercanos). Si falla, hace fallback a Haversine en Node.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lat = body?.lat;
    const lon = body?.lon;
    const radiusKm = isFiniteNumber(body?.radiusKm) ? body.radiusKm : 5;

    if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) {
      return NextResponse.json({ error: 'lat y lon deben ser números válidos' }, { status: 400 });
    }
    // límites razonables de radio
    const r = Math.min(Math.max(radiusKm, 0.5), 50);

    const supabase = await getSupabaseAnon();

    // Intentar PostGIS RPC primero
    try {
      const { data, error } = await supabase.rpc('negocios_cercanos', {
        lat,
        lon,
        max_dist_km: r,
      });
      if (error) throw error;

      const rows = Array.isArray(data) ? data : [];
      // Calcular distancia en km usando ST_Distance sería ideal en SQL; aquí fallback rápido por Haversine si no viene
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const haversineKm = (aLat: number, aLon: number, bLat: number, bLon: number) => {
        const R = 6371;
        const dLat = toRad(bLat - aLat);
        const dLon = toRad(bLon - aLon);
        const aa = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
        return R * c;
      };

      const items = rows
        .filter((r: any) => r.active !== false)
        .map((r: any) => {
          let distanceKm: number | undefined = undefined;
          if (isFiniteNumber(r.latitude) && isFiniteNumber(r.longitude)) {
            distanceKm = haversineKm(lat, lon, r.latitude, r.longitude);
          }
          return {
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
            distanceKm,
          };
        });

      return NextResponse.json({ items, radiusKm: r, method: 'postgis' });
    } catch (rpcErr) {
      // Fallback: Haversine en Node sobre dataset filtrado
      const { getCountry } = await import('@/lib/featureFlags');
      const country = getCountry();

      let qb = supabase
        .from('services')
        .select('*')
        .eq('active', true);
      if (country) qb = qb.eq('country', country);

      // Requerimos lat/lon para el cálculo
      qb = qb.not('latitude', 'is', null).not('longitude', 'is', null).limit(500);
      const { data, error } = await qb;
      if (error) throw error;
      const rows = Array.isArray(data) ? data : [];

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const haversineKm = (aLat: number, aLon: number, bLat: number, bLon: number) => {
        const R = 6371;
        const dLat = toRad(bLat - aLat);
        const dLon = toRad(bLon - aLon);
        const aa = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
        return R * c;
      };

      const items = rows
        .map((r: any) => ({
          row: r,
          distanceKm: haversineKm(lat, lon, r.latitude, r.longitude),
        }))
        .filter(({ distanceKm }) => distanceKm <= r)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .map(({ row, distanceKm }) => ({
          id: row.id?.toString?.() || row.id,
          slug: row.slug,
          name: row.name,
          description: row.description,
          category: row.category,
          categorySlug: row.categorySlug || row.category_slug,
          image: row.image,
          images: row.images || [],
          rating: row.rating || 0,
          whatsapp: row.whatsapp,
          phone: row.phone,
          district: row.district,
          neighborhood: row.neighborhood || row.barrio,
          tags: row.tags || [],
          publico_objetivo: row.publico_objetivo,
          distanceKm,
        }));

      return NextResponse.json({ items, radiusKm: r, method: 'haversine' });
    }
  } catch (err) {
    console.error('❌ Error en /api/services/nearby:', err);
    return NextResponse.json(
      { error: 'Error en nearby', details: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}