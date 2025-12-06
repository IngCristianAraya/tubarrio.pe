// Script para diagnosticar variables de entorno de Firebase
console.log('=== DIAGNÓSTICO DE VARIABLES DE ENTORNO FIREBASE ===\n');

// Variables del servidor (sin NEXT_PUBLIC_)
const serverVars = {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID
};

// Variables del cliente (con NEXT_PUBLIC_)
const clientVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('Variables del servidor (para API routes):');
Object.entries(serverVars).forEach(([key, value]) => {
  console.log(`${key}: ${value ? '✅ Configurada' : '❌ No configurada'}`);
});

console.log('\nVariables del cliente (para componentes React):');
Object.entries(clientVars).forEach(([key, value]) => {
  console.log(`${key}: ${value ? '✅ Configurada' : '❌ No configurada'}`);
});

console.log('\n=== ANÁLISIS ===');
const serverConfigured = Object.values(serverVars).every(v => v);
const clientConfigured = Object.values(clientVars).every(v => v);

if (serverConfigured && clientConfigured) {
  console.log('✅ Todas las variables están configuradas correctamente');
} else if (serverConfigured && !clientConfigured) {
  console.log('⚠️  Variables del servidor OK, pero faltan variables del cliente (NEXT_PUBLIC_)');
  console.log('   Esto explica por qué Firebase no funciona en el navegador');
} else if (!serverConfigured && clientConfigured) {
  console.log('⚠️  Variables del cliente OK, pero faltan variables del servidor');
  console.log('   Esto explica por qué las API routes no funcionan');
} else {
  console.log('❌ Faltan tanto variables del servidor como del cliente');
}

console.log('\n=== SOLUCIÓN ===');
if (!clientConfigured) {
  console.log('Para solucionar el problema del cliente, ejecuta:');
  console.log('npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY');
  console.log('npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  console.log('npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  console.log('npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  console.log('npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  console.log('npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID');
}