// Script para probar la inicialización de Firebase en el cliente
console.log('🔍 Iniciando prueba de Firebase...');

// Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);

// Importar configuración de Firebase
try {
  const { db, auth, app } = require('./src/lib/firebase/config.ts');
  
  console.log('🔥 Estado de Firebase:');
  console.log('app:', !!app);
  console.log('db:', !!db);
  console.log('auth:', !!auth);
  
  if (!db) {
    console.error('❌ Firestore no está inicializado');
  } else {
    console.log('✅ Firestore está inicializado correctamente');
  }
  
} catch (error) {
  console.error('❌ Error al importar configuración de Firebase:', error.message);
}

console.log('🏁 Prueba completada.');