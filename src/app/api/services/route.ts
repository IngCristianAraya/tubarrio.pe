import { NextRequest, NextResponse } from 'next/server';

// Supabase helpers
async function getSupabaseAnon() {
  const { getSupabaseClient } = await import('@/lib/supabase/client');
  return getSupabaseClient();
}

function getSupabaseServer() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase env vars for writes: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  // Dynamic import to avoid build-time failures if module is not installed
  // @ts-ignore
  const modPromise = import('@supabase/supabase-js');
  return modPromise.then(({ createClient }) => createClient(url, key));
}

// GET - Obtener todos los servicios (filtrados por país y activos)
export async function GET() {
  try {
    const supabase = await getSupabaseAnon();
    const country = (process.env.NEXT_PUBLIC_COUNTRY || 'pe').trim();
    console.log('📖 Consultando servicios (Supabase) country=', country);

    let qb = supabase.from('services').select('*').order('name', { ascending: true });
    if (country) qb = qb.eq('country', country);
    const { data, error } = await qb;
    if (error) throw error;

    const services = (data || []).filter((row: any) => row.active !== false);
    console.log(`✅ Encontrados ${services.length} servicios activos`);
    return NextResponse.json(services);
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const country = (process.env.NEXT_PUBLIC_COUNTRY || 'pe').trim();
    const supabase = await getSupabaseServer();

    const now = new Date().toISOString();
    const row = {
      name: body.name || 'Servicio sin nombre',
      description: body.description || '',
      category: body.category || 'General',
      location: body.location || '',
      address: body.address || '',
      reference: body.reference || '',
      image: body.image || '',
      images: body.images || [],
      active: body.active !== false,
      featured: body.featured || false,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      createdAt: now,
      updatedAt: now,
      country
    } as any;

    const { data, error } = await supabase.from('services').insert(row).select('*');
    if (error) throw error;
    const inserted = (data || [])[0];
    console.log(`✅ Servicio creado: ${inserted?.id || '(sin id)'}`);
    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error('❌ Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar servicio existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID del servicio requerido' }, { status: 400 });
    }
    const supabase = await getSupabaseServer();
    const now = new Date().toISOString();
    const patch = { ...updateData, updatedAt: now } as any;
    const { data, error } = await supabase.from('services').update(patch).eq('id', id).select('*');
    if (error) throw error;
    const updated = (data || [])[0];
    console.log(`✅ Servicio ${id} actualizado`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID del servicio requerido' }, { status: 400 });
    }
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('services').delete().eq('id', id).select('id');
    if (error) throw error;
    console.log(`✅ Servicio ${id} eliminado`);
    return NextResponse.json({ message: 'Servicio eliminado correctamente', id });
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}