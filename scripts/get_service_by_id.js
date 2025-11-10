// Obtiene un servicio por id (slug) desde Supabase y muestra campos clave
// Uso: node scripts/get_service_by_id.js <id>

const { createClient } = require('@supabase/supabase-js');

function readEnvFallback() {
  const fs = require('fs');
  const path = require('path');
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
  const id = process.argv[2] || 'anticucheria-angie-corazon';
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ Faltan SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ Error consultando servicio:', error.message);
    process.exit(1);
  }

  if (!data) {
    console.log(`ℹ️ No se encontró el servicio con id: ${id}`);
    return;
  }

  console.log('✅ Servicio encontrado');
  console.log('id:', data.id);
  console.log('name:', data.name);
  console.log('image:', data.image);
  console.log('images:', Array.isArray(data.images) ? data.images : data.images);
  console.log('address:', data.address);
  console.log('phone:', data.phone);
  console.log('whatsapp:', data.whatsapp);
  console.log('hours:', data.hours);
  console.log('contactUrl:', data.contactUrl);
  console.log('detailsUrl:', data.detailsUrl);
  console.log('tags:', data.tags);
}

main().catch((e) => {
  console.error('❌ Error inesperado:', e);
  process.exit(1);
});