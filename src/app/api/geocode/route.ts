import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

type GeocodePayload = {
  address: string;
  countryCode?: string; // e.g., 'pe'
  save?: boolean;
  serviceId?: string; // if save=true, update this service row
};

// Nominatim API base
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function POST(req: NextRequest) {
  try {
    // Rate limit (más estricto: 10 req/min)
    const limiter = rateLimit({ windowMs: 60_000, max: 10 });
    const limited = limiter(req);
    if (limited) return limited;

    const body = (await req.json()) as GeocodePayload;
    const address = (body.address || '').trim();
    const countryCode = (body.countryCode || process.env.NEXT_PUBLIC_COUNTRY || 'pe').trim();
    const save = body.save === true;
    const serviceId = (body.serviceId || '').trim();

    if (!address) {
      return NextResponse.json({ error: 'address requerido' }, { status: 400 });
    }

    // Construir query hacia Nominatim
    const params = new URLSearchParams({
      format: 'json',
      q: address,
      addressdetails: '1',
      limit: '1',
      countrycodes: countryCode,
    });

    const url = `${NOMINATIM_URL}?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'tubarrio.pe/1.0 (contacto@tubarrio.pe)',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Error Nominatim', details: text }, { status: 502 });
    }
    const json = await res.json();
    const item = Array.isArray(json) ? json[0] : null;
    if (!item) {
      return NextResponse.json({ error: 'Sin resultados para la dirección' }, { status: 404 });
    }

    const latitude = Number(item.lat);
    const longitude = Number(item.lon);
    const display_name = String(item.display_name || address);

    // Si save=true y hay serviceId, actualizamos Supabase
    let updated: any | null = null;
    if (save && serviceId) {
      const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        return NextResponse.json({ error: 'Variables de entorno Supabase faltantes' }, { status: 500 });
      }
      // @ts-ignore
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(url, key);
      const now = new Date().toISOString();
      const patch: any = {
        latitude,
        longitude,
        updatedAt: now,
      };
      // Si la dirección local es breve, podemos normalizarla, pero no sobrescribir address si ya la usas en UI
      if (!patch.address && typeof display_name === 'string') {
        patch.addressNormalized = display_name;
      }
      const { data, error } = await supabase
        .from('services')
        .update(patch)
        .eq('id', serviceId)
        .select('id, latitude, longitude');
      if (error) {
        return NextResponse.json({ error: 'Error actualizando servicio', details: error.message }, { status: 500 });
      }
      updated = (data || [])[0] || null;
    }

    return NextResponse.json({
      latitude,
      longitude,
      display_name,
      updated,
    });
  } catch (err) {
    console.error('❌ Error en /api/geocode:', err);
    return NextResponse.json(
      { error: 'Error en geocodificación', details: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}