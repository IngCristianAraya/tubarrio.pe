// Seed de servicios a Supabase usando service role
// Uso (PowerShell en Windows):
// $env:SUPABASE_URL="https://xxxxx.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."; npm run seed:supabase

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function readEnvFallback() {
  const env = { ...process.env };
  const root = process.cwd();
  const candidates = ['.env', '.env.local'];
  for (const file of candidates) {
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
      } catch (e) {
        // ignore
      }
    }
  }
  return env;
}

function getEnv() {
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY; // no usar en frontend
  const seedCountry = (env.SEED_COUNTRY || env.NEXT_PUBLIC_COUNTRY || '').trim().toLowerCase();
  if (!url || !key) {
    console.error('\n❌ Faltan variables de entorno para seed:');
    console.error('   SUPABASE_URL o NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY (service role)');
    console.error('\nSolución: define estas variables y vuelve a ejecutar.');
    process.exit(1);
  }
  if (!seedCountry || !/^[a-z]{2}$/.test(seedCountry)) {
    console.error('\n❌ Falta país para seed o no es válido (ej: pe, cl, us).');
    console.error('   Define SEED_COUNTRY (recomendado) o NEXT_PUBLIC_COUNTRY con un código de 2 letras.');
    process.exit(1);
  }
  return { url, key, seedCountry };
}

function loadLocalServices() {
  const files = [
    path.join(process.cwd(), 'services.json'),
    path.join(process.cwd(), 'services_standardized.json'),
    path.join(process.cwd(), 'services_updated.json'),
    path.join(process.cwd(), 'services_backup.json'),
  ];

  const all = [];
  for (const f of files) {
    if (fs.existsSync(f)) {
      try {
        const raw = JSON.parse(fs.readFileSync(f, 'utf-8'));
        if (Array.isArray(raw)) {
          all.push(...raw);
        } else if (raw && Array.isArray(raw.services)) {
          all.push(...raw.services);
        }
      } catch (e) {
        // skip parse errors per file
      }
    }
  }
  return all;
}

function normalizeService(item) {
  const tags = Array.isArray(item.tags)
    ? item.tags
    : Array.isArray(item.tag)
    ? item.tag
    : [];

  const images = item.images
    ? item.images
    : item.image
    ? { main: item.image }
    : null;

  return {
    name: item.name || item.title || 'Servicio',
    category: item.category || null,
    categorySlug: item.categorySlug || null,
    description: item.description || null,
    images: images,
    rating: item.rating || 4.2,
    neighborhood: item.neighborhood || item.barrio || (item.location && item.location.barrio) || null,
    district: item.district || (item.location && item.location.district) || null,
    active: item.active !== undefined ? !!item.active : true,
    tags: tags,
  };
}

function pruneNulls(row) {
  const pruned = { ...row };
  Object.keys(pruned).forEach((k) => {
    const v = pruned[k];
    if (v === null || v === undefined) {
      delete pruned[k];
    }
  });
  return pruned;
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

function dedupeServices(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = slugify(item.name || item.title || item.slug || JSON.stringify(item));
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

async function main() {
  const { url, key, seedCountry } = getEnv();
  const supabase = createClient(url, key);

  // Verificar si la tabla existe (select simple)
  const test = await supabase.from('services').select('id').limit(1);
  if (test.error && (test.error.code === '42P01' || /relation .* does not exist/i.test(test.error.message))) {
    console.error('\n❌ La tabla public.services no existe.');
    console.error('   Ejecuta scripts/supabase_setup.sql en el SQL Editor de Supabase y reintenta.');
    process.exit(1);
  }

  const local = dedupeServices(loadLocalServices());
  let rows = [];
  if (local.length) {
    rows = local.map(normalizeService).filter((r) => !!r.name);
    console.log(`📦 Preparando inserción de ${rows.length} filas desde archivos locales combinados.`);
  } else {
    rows = [
      {
        name: 'Ejemplo Servicio',
        category: 'Peluquería',
        description: 'Servicio de prueba',
        rating: 4.7,
        neighborhood: 'Miraflores',
        district: 'Lima',
        active: true,
        tags: ['corte', 'barbería'],
        images: { main: 'https://example.com/image.jpg' },
      },
    ];
    console.log('📦 Sin archivos locales válidos. Insertando 1 registro de ejemplo.');
  }

  const rowsWithCountry = rows.map((r) => pruneNulls({ ...r, country: seedCountry }));
  const { data, error } = await supabase.from('services').insert(rowsWithCountry).select('id, name, country');
  if (error) {
    console.error('❌ Error insertando datos:', error);
    process.exit(1);
  }
  console.log(`✅ Insertadas ${data.length} filas.`);
  data.forEach((r) => console.log(`   - ${r.id}: ${r.name}`));
}

main().catch((e) => {
  console.error('❌ Error inesperado en seed:', e);
  process.exit(1);
});