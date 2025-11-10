// Consulta socialMedia y social para un slug específico en Supabase
// Uso: node scripts/query_supabase_social.js creciendo-digital
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const root = process.cwd();
  const envLocal = path.join(root, '.env.local');
  const env = {};
  if (fs.existsSync(envLocal)) {
    const parsed = dotenv.config({ path: envLocal }).parsed || {};
    Object.assign(env, parsed);
  }
  // fallback to process.env
  return { ...env, ...process.env };
}

async function main() {
  const slug = process.argv[2] || 'creciendo-digital';
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log(`🔎 Consultando public.services por slug='${slug}'`);
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, social, socialMedia')
    .eq('slug', slug)
    .limit(1);
  if (error) {
    console.error('❌ Error en consulta:', error.message);
    process.exit(1);
  }
  const row = (data || [])[0];
  if (!row) {
    console.log('ℹ️ No se encontró el servicio.');
    return;
  }
  console.log('✅ Resultado:', JSON.stringify(row, null, 2));
}

main().catch((e) => {
  console.error('❌ Error inesperado:', e);
  process.exit(1);
});