// Borra todas las filas de public.services en Supabase usando service role
// Uso: node scripts/delete_all_supabase_services.js

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
  console.log('🧹 Eliminando todas las filas de public.services en Supabase...');
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ Faltan SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  // Verificar tabla
  const test = await supabase.from('services').select('id').limit(1);
  if (test.error && (test.error.code === '42P01' || /relation .* does not exist/i.test(test.error.message))) {
    console.error('\n❌ La tabla public.services no existe. Ejecuta scripts/supabase_setup.sql.');
    process.exit(1);
  }

  // Eliminar todas las filas (requiere al menos un filtro; usamos id != null)
  const { data, error } = await supabase
    .from('services')
    .delete()
    .neq('id', null)
    .select('id');
  if (error) {
    console.error('❌ Error eliminando filas:', error.message);
    process.exit(1);
  }

  const count = Array.isArray(data) ? data.length : 0;
  console.log(`✅ Eliminadas ${count} filas de public.services.`);
}

main().catch((e) => {
  console.error('❌ Error inesperado:', e);
  process.exit(1);
});