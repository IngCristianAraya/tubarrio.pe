// Script para verificar las variables de entorno actuales
console.log('=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===');
console.log('');

// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: '.env.local' });

console.log('Variables críticas de Firebase:');
console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
console.log('NEXT_PUBLIC_FIRESTORE_READS_ENABLED:', process.env.NEXT_PUBLIC_FIRESTORE_READS_ENABLED);
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado');
console.log('');

if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'false') {
  console.log('✅ Firebase HABILITADO - Debería cargar datos reales');
} else {
  console.log('❌ Firebase DESHABILITADO - Cargará datos mock');
}

console.log('');
console.log('=== FIN VERIFICACIÓN ===');