import { NextRequest, NextResponse } from 'next/server';

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
  // @ts-ignore
  const modPromise = import('@supabase/supabase-js');
  return modPromise.then(({ createClient }) => createClient(url, key));
}

// GET - Obtener servicio específico por ID o slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseAnon();
    const country = (process.env.NEXT_PUBLIC_COUNTRY || 'pe').trim();
    const targetId = params.id;
    console.log('📖 Consultando servicio (Supabase):', targetId, 'country=', country);

    let qb = supabase
      .from('services')
      .select('*')
      .or(`id.eq.${targetId},slug.eq.${targetId}`)
      .limit(1);
    if (country) qb = qb.eq('country', country);
    const { data, error } = await qb;
    if (error) throw error;
    const row = (data || [])[0];
    if (!row) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (error) {
    console.error('❌ Error al obtener servicio:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar servicio específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServer();
    const id = params.id;
    const body = await request.json();
    const now = new Date().toISOString();
    const patch = { ...body, updatedAt: now } as any;
    const { data, error } = await supabase.from('services').update(patch).eq('id', id).select('*');
    if (error) throw error;
    const updated = (data || [])[0];
    if (!updated) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServer();
    const id = params.id;
    const { data, error } = await supabase.from('services').delete().eq('id', id).select('id');
    if (error) throw error;
    return NextResponse.json({ message: 'Servicio eliminado correctamente', id });
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}