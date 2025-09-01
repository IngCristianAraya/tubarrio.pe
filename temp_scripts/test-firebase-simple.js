// Test simple de Firebase
require('dotenv').config({ path: '.env.local' });

console.log('=== TEST FIREBASE SIMPLE ===');

// Verificar variables de entorno
console.log('Variables de entorno:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

try {
  // Importar Firebase
  const { initializeApp } = require('firebase/app');
  const { getFirestore } = require('firebase/firestore');
  
  console.log('\n✅ Firebase modules imported successfully');
  
  // Configuración
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
  console.log('\nConfiguración Firebase:');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Auth Domain:', firebaseConfig.authDomain);
  
  // Inicializar app
  const app = initializeApp(firebaseConfig);
  console.log('\n✅ Firebase app initialized:', app.name);
  
  // Inicializar Firestore
  const db = getFirestore(app);
  console.log('✅ Firestore initialized:', db.app.name);
  
  console.log('\n🎉 Firebase test completed successfully!');
  
} catch (error) {
  console.error('❌ Error in Firebase test:', error.message);
  console.error('Stack:', error.stack);
}