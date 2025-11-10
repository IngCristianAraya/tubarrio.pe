// Convierte IDs existentes (UUID/texto) a slugs basados en el nombre
// Uso: node scripts/convert_supabase_ids_to_slugs.js

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

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🚀 Convirtiendo IDs existentes a slugs (texto)');
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ Faltan SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  // Leer todos los servicios
  const { data: services, error } = await supabase
    .from('services')
    .select('id, name, slug')
    .limit(10000);
  if (error) {
    console.error('❌ Error leyendo servicios:', error.message);
    process.exit(1);
  }

  const used = new Set();
  // Pre-cargar slugs ya existentes
  for (const s of services) {
    if (s.slug) used.add(s.slug);
  }

  let updated = 0;
  for (const s of services) {
    const desired = slugify(s.name || s.id || '');
    if (!desired) continue;

    let unique = desired;
    let counter = 2;
    while (used.has(unique)) {
      unique = `${desired}-${counter}`;
      counter += 1;
    }

    // Si ya coincide id con el slug deseado y slug está ok, saltar
    if (s.id === unique && s.slug === unique) {
      continue;
    }

    // Actualizar fila: id y slug al valor único
    const { error: upErr } = await supabase
      .from('services')
      .update({ id: unique, slug: unique })
      .eq('id', s.id);
    if (upErr) {
      console.error(`❌ Error actualizando ${s.id} -> ${unique}:`, upErr.message);
      process.exit(1);
    }
    used.add(unique);
    updated += 1;
    console.log(`   ✓ ${s.id} -> ${unique}`);
  }

  console.log(`✅ Conversión completada. Filas actualizadas: ${updated}`);
}

main().catch((e) => {
  console.error('❌ Error inesperado:', e);
  process.exit(1);
});