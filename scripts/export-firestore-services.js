// Exporta la colección 'services' de Firestore a JSON y CSV
// Uso (PowerShell en Windows):
// $env:FIREBASE_PROJECT_ID="<project_id>"; $env:FIREBASE_CLIENT_EMAIL="<client_email>"; $env:FIREBASE_PRIVATE_KEY="<private_key>"; node scripts/export-firestore-services.js
// Alternativa: colocar un archivo firebase-admin.json en la raíz (con credenciales de servicio) y ejecutar: node scripts/export-firestore-services.js

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

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
        // ignore parse errors
      }
    }
  }
  return env;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function initFirebaseAdmin() {
  // Cargar env desde proceso y archivos .env/.env.local
  const env = readEnvFallback();
  const projectId = env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  let privateKey = env.FIREBASE_PRIVATE_KEY;

  // Si no hay env, intentar con archivo firebase-admin.json en la raíz
  if (!projectId || !clientEmail || !privateKey) {
    const credPath = path.join(process.cwd(), 'firebase-admin.json');
    if (fs.existsSync(credPath)) {
      const serviceAccount = require(credPath);
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
        });
      }
      return admin.firestore();
    }
    throw new Error('Faltan credenciales de Firebase Admin. Define env (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) o coloca firebase-admin.json en la raíz.');
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

function toISO(val) {
  try {
    if (!val) return null;
    if (typeof val?.toDate === 'function') return val.toDate().toISOString();
    if (val instanceof Date) return val.toISOString();
    return null;
  } catch {
    return null;
  }
}

function normalizeService(docId, data) {
  // Unificar tags
  const tags = Array.isArray(data?.tags)
    ? data.tags
    : Array.isArray(data?.tag)
    ? data.tag
    : [];

  // Normalizar imágenes
  let images = Array.isArray(data?.images) ? data.images : [];
  if (!images?.length && typeof data?.image === 'string' && data.image.trim() !== '') {
    images = [data.image];
  }

  const createdAtISO = toISO(data?.createdAt);
  const updatedAtISO = toISO(data?.updatedAt);

  const neighborhood = data?.neighborhood || data?.barrio || null;

  return {
    id: docId,
    slug: data?.slug || docId,
    name: data?.name || data?.title || 'Servicio',
    description: data?.description || null,
    category: data?.category || null,
    categorySlug: data?.categorySlug || null,
    neighborhood,
    address: data?.address || null,
    district: data?.district || null,
    phone: data?.phone || null,
    whatsapp: data?.whatsapp || null,
    email: data?.email || null,
    website: data?.website || null,
    image: typeof data?.image === 'string' ? data.image : null,
    images,
    rating: typeof data?.rating === 'number' ? data.rating : 0,
    reviewCount: typeof data?.reviewCount === 'number' ? data.reviewCount : null,
    featured: !!data?.featured,
    active: data?.active !== undefined ? !!data.active : true,
    userId: data?.userId || null,
    hours: data?.hours || data?.horario || null,
    contactUrl: data?.contactUrl || null,
    detailsUrl: data?.detailsUrl || null,
    social: data?.social || null,
    tags,
    createdAt: createdAtISO,
    updatedAt: updatedAtISO,
    // Mantener cualquier otro campo original por compatibilidad
    _raw: data,
  };
}

function toCSV(rows, columns) {
  const escape = (val) => {
    if (val === null || val === undefined) return '';
    const s = typeof val === 'string' ? val : JSON.stringify(val);
    // Escapar comillas dobles y envolver en comillas
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const header = columns.join(',');
  const lines = rows.map((row) => columns.map((c) => escape(row[c])).join(','));
  return [header, ...lines].join('\n');
}

async function main() {
  console.log('🚀 Exportando servicios desde Firestore...');
  const db = initFirebaseAdmin();
  const outDir = path.join(process.cwd(), 'exports');
  ensureDir(outDir);

  // Leer colección principal
  const snapshot = await db.collection('services').get();
  console.log(`📊 Documentos en 'services': ${snapshot.size}`);
  if (snapshot.empty) {
    console.log('ℹ️ No hay documentos en la colección services.');
  }

  const rawRows = [];
  const normalizedRows = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    rawRows.push({ id: doc.id, ...data });
    normalizedRows.push(normalizeService(doc.id, data));
  });

  // Escribir JSON raw y normalizado
  const rawPath = path.join(outDir, 'services_raw.json');
  const normPath = path.join(outDir, 'services_normalized.json');
  fs.writeFileSync(rawPath, JSON.stringify(rawRows, null, 2), 'utf-8');
  fs.writeFileSync(normPath, JSON.stringify(normalizedRows, null, 2), 'utf-8');
  console.log(`✅ JSON exportado:
  - ${rawPath}
  - ${normPath}`);

  // CSV con columnas seleccionadas (compatibles con Supabase)
  const columns = [
    'id',
    'slug',
    'name',
    'description',
    'category',
    'categorySlug',
    'neighborhood',
    'district',
    'address',
    'phone',
    'whatsapp',
    'email',
    'website',
    'image',
    'images', // se serializa como JSON en el CSV
    'rating',
    'reviewCount',
    'featured',
    'active',
    'createdAt',
    'updatedAt',
  ];
  const csv = toCSV(normalizedRows, columns);
  const csvPath = path.join(outDir, 'services.csv');
  fs.writeFileSync(csvPath, csv, 'utf-8');
  console.log(`✅ CSV exportado:
  - ${csvPath}`);

  console.log('\n📌 Siguiente paso sugerido: importar services_normalized.json o services.csv a Supabase.');
  console.log('   - Para inserción directa: usa scripts/migrate_firebase_to_supabase.js');
  console.log('   - Para CSV masivo: \copy en el SQL editor de Supabase y mapea columnas.');
}

main().catch((e) => {
  console.error('❌ Error en la exportación:', e);
  process.exit(1);
});