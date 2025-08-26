// Script para diagnosticar Firebase en el cliente
console.log('🔍 Diagnóstico de Firebase en el cliente');

// 1. Verificar si Firebase está disponible
if (typeof window !== 'undefined') {
  console.log('✅ Ejecutándose en el navegador');
  
  // 2. Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configurado' : '❌ Faltante');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No configurado');
  console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE || 'No configurado');
  
  // 3. Verificar si Firebase está inicializado
  try {
    const { db } = require('./src/lib/firebase/config');
    console.log('🔥 Estado de Firebase:');
    console.log('db:', db ? '✅ Inicializado' : '❌ No inicializado');
    
    if (db) {
      console.log('📱 App name:', db.app?.name || 'default');
      console.log('🏗️ Project ID:', db.app?.options?.projectId || 'No disponible');
    }
  } catch (error) {
    console.error('❌ Error al importar Firebase config:', error);
  }
  
  // 4. Verificar si hay errores de red
  console.log('🌐 Probando conectividad básica...');
  fetch('https://firestore.googleapis.com/', { mode: 'no-cors' })
    .then(() => console.log('✅ Conectividad a Firebase: OK'))
    .catch((error) => console.log('❌ Problemas de conectividad:', error));
    
} else {
  console.log('❌ No se está ejecutando en el navegador');
}

console.log('🏁 Diagnóstico completado');