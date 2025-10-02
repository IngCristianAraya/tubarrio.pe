// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getAuth, onAuthStateChanged } = require('firebase/auth');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('🔍 Verificando configuración de Firebase...');
console.log('API Key:', firebaseConfig.apiKey ? 'CONFIGURADO' : 'NO CONFIGURADO');
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('Project ID:', firebaseConfig.projectId);

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase inicializado correctamente');
  
  // Verificar estado de autenticación
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('👤 Usuario autenticado encontrado:');
      console.log('  - Email:', user.email);
      console.log('  - UID:', user.uid);
      
      try {
        const tokenResult = await user.getIdTokenResult();
        console.log('  - Claims admin:', !!tokenResult.claims.admin);
        console.log('  - Todas las claims:', tokenResult.claims);
      } catch (error) {
        console.log('  - Error obteniendo claims:', error.message);
      }
    } else {
      console.log('❌ No hay usuario autenticado');
    }
    
    process.exit(0);
  });
  
  // Timeout para evitar que el script se cuelgue
  setTimeout(() => {
    console.log('⏰ Timeout - cerrando script');
    process.exit(1);
  }, 5000);
  
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error.message);
  process.exit(1);
}