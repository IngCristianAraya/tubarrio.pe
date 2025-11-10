import { NextResponse } from 'next/server';

// Endpoint de administración basado en Supabase
// Devuelve conteos y una muestra de servicios para el país configurado
export async function GET() {
  try {
    const { getSupabaseClient } = await import('@/lib/supabase/client');
    const supabase = await getSupabaseClient();

    const country = (process.env.NEXT_PUBLIC_COUNTRY || 'pe').trim();
    console.log('🚀 Consultando servicios (Supabase) para país:', country);

    // Selección básica con filtro por país
    const { data, error } = await supabase
      .from('services')
      .select('id, name, active, category, country')
      .eq('country', country);

    if (error) {
      throw error;
    }

    const allServices = Array.isArray(data) ? data : [];
    const activeServices = allServices.filter((s) => s.active !== false);
    const inactiveServices = allServices.filter((s) => s.active === false);

    console.log(`📊 Total: ${allServices.length} | Activos: ${activeServices.length} | Inactivos: ${inactiveServices.length}`);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      method: 'Supabase',
      country,
      total: allServices.length,
      active: activeServices.length,
      inactive: inactiveServices.length,
      allServices: allServices.slice(0, 5),
      activeServices: activeServices.slice(0, 5),
      inactiveServices: inactiveServices.slice(0, 5),
      success: true
    });
  } catch (error) {
    console.error('❌ Error en /api/services-admin:', error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Error al consultar servicios (Supabase)',
        details: detail,
        env: {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
          NEXT_PUBLIC_COUNTRY: process.env.NEXT_PUBLIC_COUNTRY || 'NOT SET'
        }
      },
      { status: 500 }
    );
  }
}