// Script para probar la conexión a Firestore y verificar datos
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, connectFirestoreEmulator } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirestoreConnection() {
  try {
    console.log('🔥 Iniciando prueba de conexión a Firestore...');
    console.log('📋 Configuración:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Faltante'
    });

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase inicializado correctamente');

    // Probar conexión obteniendo servicios
    console.log('🔍 Consultando colección "services"...');
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    
    console.log(`📊 Documentos encontrados: ${snapshot.docs.length}`);
    
    if (snapshot.docs.length > 0) {
      console.log('📄 Primeros 3 documentos:');
      snapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`  ${index + 1}. ID: ${doc.id}`);
        console.log(`     Nombre: ${data.name || 'Sin nombre'}`);
        console.log(`     Categoría: ${data.category || 'Sin categoría'}`);
        console.log(`     Rating: ${data.rating || 'Sin rating'}`);
        console.log('     ---');
      });
    } else {
      console.log('⚠️  No se encontraron documentos en la colección "services"');
      console.log('💡 Sugerencias:');
      console.log('   1. Verifica que la colección "services" existe en Firestore');
      console.log('   2. Asegúrate de que hay documentos en la colección');
      console.log('   3. Verifica los permisos de lectura en las reglas de Firestore');
    }

    console.log('✅ Prueba completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error('🔧 Detalles del error:', error);
    
    if (error.code) {
      console.log('📋 Código de error:', error.code);
      
      switch (error.code) {
        case 'permission-denied':
          console.log('💡 Solución: Verifica las reglas de seguridad de Firestore');
          break;
        case 'unavailable':
          console.log('💡 Solución: Verifica tu conexión a internet y la configuración de red');
          break;
        case 'unauthenticated':
          console.log('💡 Solución: Verifica la configuración de autenticación');
          break;
        default:
          console.log('💡 Revisa la documentación de Firebase para más información');
      }
    }
  }
}

// Ejecutar la prueba
testFirestoreConnection();