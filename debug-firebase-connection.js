// Script de diagnóstico para verificar la conexión con Firebase
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, getDocs, connectFirestoreEmulator } = require('firebase/firestore');
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

async function diagnosticarFirebase() {
  console.log('🔍 === DIAGNÓSTICO DE FIREBASE ===\n');
  
  // 1. Verificar variables de entorno
  console.log('📋 1. Variables de entorno:');
  console.log('   NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configurado' : '❌ No configurado');
  console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Configurado' : '❌ No configurado');
  console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Configurado' : '❌ No configurado');
  console.log('   NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Configurado' : '❌ No configurado');
  console.log('   NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE || 'No configurado');
  console.log('');
  
  // 2. Verificar configuración
  console.log('⚙️ 2. Configuración de Firebase:');
  console.log('   Configuración completa:', JSON.stringify(firebaseConfig, null, 2));
  console.log('');
  
  // 3. Verificar si Firebase está deshabilitado
  if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true') {
    console.log('🚫 Firebase está deshabilitado por configuración');
    return;
  }
  
  try {
    // 4. Inicializar Firebase
    console.log('🚀 3. Inicializando Firebase...');
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('   ✅ Firebase app inicializada correctamente');
    } else {
      app = getApps()[0];
      console.log('   ✅ Firebase app ya existía');
    }
    
    // 5. Inicializar Firestore
    console.log('\n🗄️ 4. Inicializando Firestore...');
    const db = getFirestore(app);
    console.log('   ✅ Firestore inicializado correctamente');
    
    // 6. Probar conexión con una consulta simple
    console.log('\n🔗 5. Probando conexión con Firestore...');
    const servicesRef = collection(db, 'services');
    
    console.log('   📡 Realizando consulta de prueba...');
    const snapshot = await getDocs(servicesRef);
    
    console.log(`   ✅ Conexión exitosa! Documentos encontrados: ${snapshot.size}`);
    
    if (snapshot.size > 0) {
      console.log('   📄 Primeros 3 documentos:');
      let count = 0;
      snapshot.forEach((doc) => {
        if (count < 3) {
          const data = doc.data();
          console.log(`     - ${doc.id}: ${data.name || data.title || 'Sin nombre'}`);
          count++;
        }
      });
    }
    
    console.log('\n🎉 === DIAGNÓSTICO COMPLETADO EXITOSAMENTE ===');
    
  } catch (error) {
    console.error('\n❌ === ERROR EN EL DIAGNÓSTICO ===');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code || 'No disponible');
    
    if (error.code) {
      console.log('\n🔧 Posibles soluciones:');
      switch (error.code) {
        case 'permission-denied':
          console.log('   - Verificar reglas de Firestore');
          console.log('   - Verificar autenticación');
          break;
        case 'unavailable':
          console.log('   - Verificar conexión a internet');
          console.log('   - Verificar estado de Firebase');
          break;
        case 'invalid-argument':
          console.log('   - Verificar configuración de Firebase');
          console.log('   - Verificar variables de entorno');
          break;
        default:
          console.log('   - Verificar configuración general');
          console.log('   - Revisar documentación de Firebase');
      }
    }
    
    console.error('\nStack trace completo:');
    console.error(error);
  }
}

// Ejecutar diagnóstico
diagnosticarFirebase().catch(console.error);