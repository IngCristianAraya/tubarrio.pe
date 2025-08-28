// Script para debuggear las variables de entorno de Firebase
console.log('=== DEBUG FIREBASE ENVIRONMENT ===');

// Verificar variables de entorno
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('Variables de entorno de Firebase:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ Configurado' : '❌ No configurado'}`);
  if (value) {
    console.log(`  Valor: ${value.substring(0, 20)}...`);
  }
});

console.log('\nOtras variables relevantes:');
console.log(`NEXT_PUBLIC_DISABLE_FIREBASE: ${process.env.NEXT_PUBLIC_DISABLE_FIREBASE || 'No configurado'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Intentar importar y probar Firebase
try {
  console.log('\n=== PROBANDO IMPORTACIÓN DE FIREBASE ===');
  
  // Importar dinámicamente para evitar errores de SSR
  import('./src/lib/firebase/config.js').then(({ app, db }) => {
    console.log('Firebase app:', app ? '✅ Inicializada' : '❌ No inicializada');
    console.log('Firebase db:', db ? '✅ Inicializada' : '❌ No inicializada');
    
    if (app) {
      console.log('Firebase app name:', app.name);
      console.log('Firebase app options:', app.options.projectId);
    }
    
    if (db) {
      console.log('Firestore app:', db.app.name);
    }
  }).catch(error => {
    console.error('❌ Error al importar Firebase config:', error);
  });
  
} catch (error) {
  console.error('❌ Error general:', error);
}