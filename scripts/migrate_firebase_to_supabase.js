// Migra todos los servicios desde Firebase (Firestore) hacia Supabase
// Usa variables de entorno ya presentes en .env.local
// Uso (PowerShell en Windows):
// $env:SUPABASE_URL="https://xxxxx.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."; node scripts/migrate_firebase_to_supabase.js
// O con npm: npm run migrate:firebase-to-supabase

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
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
      } catch (e) {}
    }
  }
  return env;
}

function getFirebaseAdmin() {
  const env = readEnvFallback();
  const projectId = env.FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  let privateKey = env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    console.error('\n❌ Faltan variables de entorno Firebase:');
    console.error('   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    console.error('   Revisa d:\\revistadigital\\revistadigital-next - copia\\.env.local');
    process.exit(1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }
  return admin.firestore();
}

function getSupabase() {
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('\n❌ Faltan variables de entorno Supabase:');
    console.error('   SUPABASE_URL o NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY (service role)');
    process.exit(1);
  }
  return createClient(url, key);
}

function pruneNulls(row) {
  const pruned = { ...row };
  Object.keys(pruned).forEach((k) => {
    const v = pruned[k];
    if (v === null || v === undefined) delete pruned[k];
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

function normalizeService(data) {
  const tags = Array.isArray(data.tags)
    ? data.tags
    : Array.isArray(data.tag)
    ? data.tag
    : [];

  const images = data.images
    ? data.images
    : data.image
    ? { main: data.image }
    : null;

  return {
    name: data.name || data.title || 'Servicio',
    category: data.category || null,
    categorySlug: data.categorySlug || null,
    description: data.description || null,
    images: images,
    rating: data.rating || 4.2,
    neighborhood: data.neighborhood || data.barrio || (data.location && data.location.barrio) || null,
    district: data.district || (data.location && data.location.district) || null,
    active: data.active !== undefined ? !!data.active : true,
    tags: tags,
  };
}

function getSeedCountry() {
  const env = readEnvFallback();
  const seedCountry = (env.SEED_COUNTRY || env.NEXT_PUBLIC_COUNTRY || '').trim().toLowerCase();
  if (!seedCountry || !/^[a-z]{2}$/.test(seedCountry)) {
    console.error('\n❌ Falta SEED_COUNTRY o NEXT_PUBLIC_COUNTRY válido (ej: pe, cl, us).');
    console.error('   Define SEED_COUNTRY para establecer el país de los servicios migrados.');
    process.exit(1);
  }
  return seedCountry;
}

async function main() {
  console.log('🚀 Iniciando migración Firebase → Supabase');
  const db = getFirebaseAdmin();
  const supabase = getSupabase();
  const seedCountry = getSeedCountry();

  // Verificar tabla en Supabase
  const test = await supabase.from('services').select('id').limit(1);
  if (test.error && (test.error.code === '42P01' || /relation .* does not exist/i.test(test.error.message))) {
    console.error('\n❌ La tabla public.services no existe en Supabase.');
    console.error('   Ejecuta scripts/supabase_setup.sql en el SQL Editor y reintenta.');
    process.exit(1);
  }

  // Obtener todos los documentos de Firestore
  const snap = await db.collection('services').get();
  console.log(`📊 Servicios en Firebase: ${snap.size}`);
  if (snap.empty) {
    console.log('ℹ️ No hay servicios en Firebase para migrar.');
    process.exit(0);
  }

  // Obtener nombres existentes en Supabase para evitar duplicados
  const existing = await supabase.from('services').select('name');
  const existingNames = new Set(
    (existing.data || []).map((r) => (r.name || '').toLowerCase().trim())
  );

  const toInsert = [];
  snap.forEach((doc) => {
    const data = doc.data();
    const norm = normalizeService(data);
    norm.country = seedCountry;
    const key = (norm.name || '').toLowerCase().trim();
    if (!key || existingNames.has(key)) return; // saltar si ya existe por nombre
    toInsert.push(pruneNulls(norm));
  });

  if (!toInsert.length) {
    console.log('✨ No hay nuevos servicios para insertar en Supabase (evitamos duplicados por nombre).');
    process.exit(0);
  }

  console.log(`📦 Preparando inserción de ${toInsert.length} nuevos servicios en Supabase.`);

  // Insertar en chunks para seguridad
  const chunkSize = 100;
  let insertedTotal = 0;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('services')
      .insert(chunk)
      .select('id, name');
    if (error) {
      console.error('❌ Error insertando chunk:', error);
      process.exit(1);
    }
    insertedTotal += data.length;
    data.forEach((r) => console.log(`   + ${r.id}: ${r.name}`));
  }

  console.log(`✅ Migración completada. Insertadas ${insertedTotal} filas nuevas en Supabase.`);
}

main().catch((e) => {
  console.error('❌ Error inesperado en la migración:', e);
  process.exit(1);
});