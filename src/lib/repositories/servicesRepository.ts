import { getDataSource } from '@/lib/featureFlags';
import { filterFallbackServices, getFallbackServiceById } from '@/lib/fallback';

type RawServiceData = { id: string; data: any };

// Fallback (local JSON) helpers
async function fetchAllFromFallback(): Promise<RawServiceData[]> {
  const items = filterFallbackServices({});
  return items.map((row: any) => ({ id: row.id, data: row }));
}

async function fetchByIdFromFallback(id: string): Promise<RawServiceData | null> {
  const row = getFallbackServiceById(id);
  if (!row) return null;
  return { id: row.id, data: row };
}

async function fetchAllFromSupabase(): Promise<RawServiceData[]> {
  const { getSupabaseClient } = await import('@/lib/supabase/client');
  const supabase = await getSupabaseClient();
  console.log('[servicesRepository] 📡 Consultando Supabase: public.services (active = true)');
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true);
  if (error) throw error;
  console.log(`[servicesRepository] ✅ Supabase devolvió ${data?.length || 0} filas activas`);
  return (data || []).map((row: any) => ({ id: row.id || row.uid || String(row.id), data: row }));
}

async function fetchByIdFromSupabase(id: string): Promise<RawServiceData | null> {
  const { getSupabaseClient } = await import('@/lib/supabase/client');
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from('services').select('*').eq('id', id).limit(1);
  if (error) throw error;
  const row = (data || [])[0];
  if (!row) return null;
  return { id: row.id || String(id), data: row };
}

export async function fetchAllServiceData(): Promise<RawServiceData[]> {
  const source = getDataSource();
  console.log(`[servicesRepository] 🔧 Origen de datos configurado: ${source}`);
  if (source === 'supabase') {
    try {
      const supa = await fetchAllFromSupabase();
      return supa;
    } catch (err) {
      console.error('[servicesRepository] ❌ Error consultando Supabase:', err);
      // Fallback local si Supabase falla
      const fallback = await fetchAllFromFallback();
      console.warn(`[servicesRepository] ↪️ Usando fallback local: ${fallback.length} elementos`);
      return fallback;
    }
  }
  // Si la fuente no es Supabase, usar fallback local
  return fetchAllFromFallback();
}

export async function fetchServiceById(id: string): Promise<RawServiceData | null> {
  const source = getDataSource();
  if (source === 'supabase') {
    try {
      const supa = await fetchByIdFromSupabase(id);
      return supa;
    } catch (err) {
      console.error('Error consultando Supabase por ID:', err);
      // Fallback local si Supabase falla
      const fallback = await fetchByIdFromFallback(id);
      if (fallback) {
        console.warn('[servicesRepository] ↪️ Usando fallback local por ID');
      }
      return fallback;
    }
  }
  // Si la fuente no es Supabase, usar fallback local
  return fetchByIdFromFallback(id);
}