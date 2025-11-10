import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDataSource } from '@/lib/featureFlags';

type RawServiceData = { id: string; data: any };

async function fetchAllFromFirebase(): Promise<RawServiceData[]> {
  const firestore = db.instance;
  const servicesRef = collection(firestore, 'services');
  const servicesSnapshot = await getDocs(servicesRef);
  return servicesSnapshot.docs.map((d) => ({ id: d.id, data: d.data() }));
}

async function fetchByIdFromFirebase(id: string): Promise<RawServiceData | null> {
  const firestore = db.instance;
  const docRef = doc(firestore, 'services', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, data: docSnap.data() };
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
      // Si la fuente es Supabase, NO hacer fallback a Firebase
      return supa;
    } catch (err) {
      console.error('[servicesRepository] ❌ Error consultando Supabase:', err);
      throw err;
    }
  }
  return fetchAllFromFirebase();
}

export async function fetchServiceById(id: string): Promise<RawServiceData | null> {
  const source = getDataSource();
  if (source === 'supabase') {
    try {
      const supa = await fetchByIdFromSupabase(id);
      // Si la fuente es Supabase, NO hacer fallback a Firebase
      return supa;
    } catch (err) {
      console.error('Error consultando Supabase por ID:', err);
      throw err;
    }
  }
  return fetchByIdFromFirebase(id);
}