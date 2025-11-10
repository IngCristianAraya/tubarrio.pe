// Migra servicios desde Firestore (Firebase) hacia Supabase
// Uso (PowerShell en Windows):
// $env:SUPABASE_URL="https://xxxxx.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."; node scripts/migrate_firestore_to_supabase.js
// O con npm: npm run migrate:from-firebase (si tienes las env en .env/.env.local)

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
      } catch (e) {
        // ignore
      }
    }
  }
  return env;
}

function getSupabaseEnv() {
  const env = readEnvFallback();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY; // usar solo en backend
  if (!url || !key) {
    console.error('\n❌ Faltan variables de entorno para Supabase:');
    console.error('   SUPABASE_URL o NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY (service role)');
    process.exit(1);
  }
  return { url, key };
}

function initFirebaseAdmin() {
  const env = readEnvFallback();
  const projectId = env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  let privateKey = env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    console.error('\n❌ Faltan credenciales de Firebase Admin (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).');
    console.error('   Completa estas variables en .env.local o usa setup-admin.js.');
    process.exit(1);
  }
  // Reemplazar \n por saltos reales si vienen en una sola línea
  privateKey = privateKey.replace(/\\n/g, '\n');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  }
  return admin.firestore();
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
    if (v === null || v === undefined) {
      delete pruned[k];
    }
  });
  return pruned;
}

function toSupabaseRow(data) {
  const name = data.name || data.title || 'Servicio';
  const category = data.category || null;
  const categorySlug = category ? slugify(category) : null;
  const images = data.images
    ? data.images
    : data.image
    ? { main: data.image }
    : null;
  const tags = Array.isArray(data.tags)
    ? data.tags
    : Array.isArray(data.tag)
    ? data.tag
    : [];

  return pruneNulls({
    name,
    category,
    categorySlug,
    description: data.description || null,
    images,
    rating: data.rating || 4.2,
    neighborhood: data.barrio || (data.location && data.location.barrio) || null,
    district: data.district || (data.location && data.location.district) || null,
    active: data.active !== undefined ? !!data.active : true,
    tags,
  });
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
  console.log('🚀 Iniciando migración desde Firebase hacia Supabase...');
  const db = initFirebaseAdmin();
  const { url, key } = getSupabaseEnv();
  const supabase = createClient(url, key);
  const seedCountry = getSeedCountry();

  // Verificar tabla en Supabase
  const test = await supabase.from('services').select('id').limit(1);
  if (test.error && (test.error.code === '42P01' || /relation .* does not exist/i.test(test.error.message))) {
    console.error('\n❌ La tabla public.services no existe.');
    console.error('   Ejecuta scripts/supabase_setup.sql en el SQL Editor de Supabase y reintenta.');
    process.exit(1);
  }

  // Cargar existentes para evitar duplicados (por nombre)
  const existing = await supabase.from('services').select('name');
  if (existing.error) {
    console.error('❌ Error leyendo servicios existentes en Supabase:', existing.error);
    process.exit(1);
  }
  const existingNames = new Set((existing.data || []).map((r) => slugify(r.name)));

  // Leer todos los documentos de Firestore
  const snapshot = await db.collection('services').get();
  if (snapshot.empty) {
    console.log('ℹ️ No hay servicios en Firestore. Nada que migrar.');
    process.exit(0);
  }
  console.log(`📊 Encontrados ${snapshot.docs.length} servicios en Firestore.`);

  const toInsert = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const nameSlug = slugify(data.name || data.title || doc.id);
    if (existingNames.has(nameSlug)) {
      continue; // ya existe por nombre
    }
    toInsert.push({ ...toSupabaseRow(data), country: seedCountry });
  }

  if (!toInsert.length) {
    console.log('✨ No hay nuevos servicios para insertar en Supabase.');
    process.exit(0);
  }

  console.log(`📦 Preparando inserción de ${toInsert.length} filas nuevas.`);
  const { data, error } = await supabase.from('services').insert(toInsert).select('id, name');
  if (error) {
    console.error('❌ Error insertando en Supabase:', error);
    process.exit(1);
  }
  console.log(`✅ Insertadas ${data.length} filas.`);
  data.forEach((r) => console.log(`   - ${r.id}: ${r.name}`));
}

main().catch((e) => {
  console.error('❌ Error inesperado en migración:', e);
  process.exit(1);
});