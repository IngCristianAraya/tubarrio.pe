// Script para probar el login del admin
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testAdminLogin() {
  try {
    console.log('🔍 Probando login del admin...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    // Credenciales de prueba
    const email = 'test@revistadigital.com';
    const password = 'Test123456!';
    
    console.log(`📧 Intentando login con: ${email}`);
    
    // Intentar login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Login exitoso!');
    console.log('👤 Usuario:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });
    
    // Obtener token para verificar claims
    const idTokenResult = await user.getIdTokenResult();
    console.log('🔑 Claims:', idTokenResult.claims);
    
  } catch (error) {
    console.error('❌ Error en el login:', error.code, error.message);
  }
}

testAdminLogin();