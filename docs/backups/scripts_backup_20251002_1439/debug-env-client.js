// Script para verificar variables de entorno en el cliente
console.log('=== DEBUG VARIABLES DE ENTORNO ===');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
console.log('NEXT_PUBLIC_FIRESTORE_READS_ENABLED:', process.env.NEXT_PUBLIC_FIRESTORE_READS_ENABLED);

// Verificar si las variables están definidas
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars);
} else {
  console.log('✅ Todas las variables de entorno están configuradas');
}

// Intentar inicializar Firebase manualmente
try {
  const { initializeFirebase } = require('./src/lib/firebase/config');
  console.log('🔥 Intentando inicializar Firebase...');
  initializeFirebase().then(result => {
    console.log('✅ Firebase inicializado:', result);
  }).catch(error => {
    console.error('❌ Error inicializando Firebase:', error);
  });
} catch (error) {
  console.error('❌ Error importando Firebase config:', error);
}