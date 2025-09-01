// Script para verificar variables de entorno del cliente
console.log('🔍 Variables de entorno del cliente:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'No configurado');
console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE || 'No configurado');

// Verificar si estamos en el cliente
if (typeof window !== 'undefined') {
  console.log('🌐 Ejecutándose en el cliente');
  
  // Importar y verificar Firebase
  import('./src/lib/firebase/config.js').then(firebase => {
    console.log('🔥 Firebase config importado:', !!firebase);
    console.log('🔥 Firebase app:', !!firebase.app);
    console.log('🔥 Firebase db:', !!firebase.db);
  }).catch(err => {
    console.error('❌ Error importando Firebase:', err);
  });
} else {
  console.log('🖥️ Ejecutándose en el servidor');
}