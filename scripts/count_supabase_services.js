// Cuenta filas en public.services
// Uso: node scripts/count_supabase_services.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function readEnvFallback() {
  const env = { ...process.env };
  const root = process.cwd();
  for (const file of ['.env', '.env.local']) {
    const p = path.join(root, file);
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf-8');
        content.split(/\r?\n/).forEach((line) => {
          const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
          if (m) {
            const key = m[1];
            let val = m[2].trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (!env[key]) env[key] = val;
          }
        });
      } catch {}
    }
  }
  return env;
}

async function main() {
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const argCountry = (process.argv[2] || '').trim().toLowerCase();
  const envCountry = (env.COUNTRY || env.SEED_COUNTRY || env.NEXT_PUBLIC_COUNTRY || '').trim().toLowerCase();
  const country = argCountry || envCountry;
  if (!url || !key) {
    console.error('❌ Faltan SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  let qb = supabase.from('services').select('id');
  if (country) {
    qb = qb.eq('country', country);
  }
  const { data, error } = await qb;
  if (error) {
    console.error('❌ Error consultando servicios:', error.message);
    process.exit(1);
  }
  if (country) {
    console.log(`📊 Servicios en Supabase para país '${country}': ${data?.length ?? 0}`);
  } else {
    console.log(`📊 Total de servicios en Supabase: ${data?.length ?? 0}`);
    console.log('ℹ️ Pasa un país como argumento para filtrar: node scripts/count_supabase_services.js pe');
  }
}

main().catch((e) => {
  console.error('❌ Error inesperado:', e);
  process.exit(1);
});