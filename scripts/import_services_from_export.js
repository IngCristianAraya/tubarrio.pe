// Importa servicios desde exports/services_normalized.json a Supabase
// Usa slugs como IDs de texto y rellena columna slug
// Uso: node scripts/import_services_from_export.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

function pruneNulls(row) {
  const pruned = { ...row };
  Object.keys(pruned).forEach((k) => {
    const v = pruned[k];
    if (v === null || v === undefined) delete pruned[k];
  });
  return pruned;
}

async function main() {
  console.log('🚀 Importando servicios desde exports/services_normalized.json → Supabase');
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ Faltan SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  const filePath = path.join(process.cwd(), 'exports', 'services_normalized.json');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ No existe: ${filePath}`);
    console.error('   Ejecuta primero: npm run export:firebase-services');
    process.exit(1);
  }
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log('ℹ️ No hay filas para importar.');
    process.exit(0);
  }

  // Verificar tabla
  const test = await supabase.from('services').select('id').limit(1);
  if (test.error && (test.error.code === '42P01' || /relation .* does not exist/i.test(test.error.message))) {
    console.error('\n❌ La tabla public.services no existe. Ejecuta scripts/supabase_setup.sql.');
    process.exit(1);
  }

  // Construir upserts con id=slug, asegurando unicidad con sufijos
  const used = new Set();
  const toUpsert = rows.map((r) => {
    const base = (r.slug && r.slug.trim()) || slugify(r.name || r.id || '');
    let unique = base;
    let counter = 2;
    while (used.has(unique)) {
      unique = `${base}-${counter}`;
      counter += 1;
    }
    used.add(unique);

    const row = pruneNulls({
      id: unique,
      slug: unique,
      name: r.name,
      category: r.category || null,
      categorySlug: r.categorySlug || null,
      description: r.description || null,
      image: r.image || (Array.isArray(r.images) && r.images.length ? r.images[0] : null),
      images: Array.isArray(r.images) ? r.images : (r.images ? [r.images] : []),
      address: r.address || null,
      phone: r.phone || null,
      whatsapp: r.whatsapp || null,
      email: r.email || null,
      website: r.website || null,
      socialMedia: r.socialMedia || (r._raw && r._raw.socialMedia) || null,
      contactUrl: r.contactUrl || null,
      detailsUrl: r.detailsUrl || null,
      hours: r.hours || r.horario || null,
      social: r.social || r.socialMedia || (r._raw && r._raw.socialMedia) || null,
      rating: typeof r.rating === 'number' ? r.rating : null,
      reviewCount: typeof r.reviewCount === 'number' ? r.reviewCount : null,
      featured: r.featured !== undefined ? !!r.featured : null,
      neighborhood: r.neighborhood || r.barrio || null,
      district: r.district || null,
      location: r.location || (r._raw && r._raw.location) || null,
      reference: r.reference || (r._raw && r._raw.reference) || null,
      conditions: Array.isArray(r.conditions)
        ? r.conditions
        : (Array.isArray(r._raw?.conditions) ? r._raw.conditions : null),
      active: r.active !== undefined ? !!r.active : true,
      userId: r.userId || null,
      createdAt: r.createdAt || null,
      updatedAt: r.updatedAt || null,
      tags: Array.isArray(r.tags) ? r.tags : Array.isArray(r.tag) ? r.tag : [],
    });
    return row;
  });

  // Upsert en chunks, clave primaria id
  const chunkSize = 100;
  let upserted = 0;
  for (let i = 0; i < toUpsert.length; i += chunkSize) {
    const chunk = toUpsert.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('services')
      .upsert(chunk, { onConflict: 'id' })
      .select('id, name');
    if (error) {
      console.error('❌ Error en upsert:', error.message);
      process.exit(1);
    }
    upserted += data.length;
    data.forEach((r) => console.log(`   ✓ ${r.id}: ${r.name}`));
  }

  console.log(`✅ Importación completada. Filas upsertadas: ${upserted}`);
}

main().catch((e) => {
  console.error('❌ Error inesperado:', e);
  process.exit(1);
});