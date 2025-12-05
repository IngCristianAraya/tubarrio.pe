// Supabase client factory with dynamic import to avoid build-time dependency
// Requires @supabase/supabase-js and Supabase public env vars

export async function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const supabaseModule = await import('@supabase/supabase-js').catch(() => {
    throw new Error('Module @supabase/supabase-js not installed. Please add it before enabling Supabase.');
  });
  const { createClient } = supabaseModule;
  return createClient(url, anon);
}
