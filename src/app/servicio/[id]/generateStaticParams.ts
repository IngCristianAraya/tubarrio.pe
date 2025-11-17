// Supabase-based static params generation for service pages
import { getSupabaseClient } from '@/lib/supabase/client';
import { getCountry } from '@/lib/featureFlags';

export async function generateStaticParams() {
  try {
    const supabase = await getSupabaseClient();
    const country = getCountry();
    let qb = supabase
      .from('services')
      .select('id, slug, active, country')
      .eq('active', true);
    if (country) qb = qb.eq('country', country);
    const { data, error } = await qb;
    if (error) throw error;

    // Mapear slugs o ids para generar rutas estáticas
    const paths = (data || []).map((row: any) => ({
      id: row.slug || (row.id?.toString?.() ?? row.id),
    }));

    console.log(`Generating static paths for ${paths.length} services`);
    return paths;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
