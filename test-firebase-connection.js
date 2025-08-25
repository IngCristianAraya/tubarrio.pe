// Script para probar la conexión a Firebase usando SDK del cliente
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tubarriope-7ed1d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tubarriope-7ed1d.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirebaseConnection() {
  try {
    console.log('🔥 Iniciando prueba de conexión a Firebase...');
    console.log('📋 Configuración:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Faltante',
      appId: firebaseConfig.appId ? '✅ Configurado' : '❌ Faltante'
    });

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase inicializado correctamente');

    // Probar conexión con la colección 'servicios'
    console.log('\n🔍 Consultando colección "servicios"...');
    const servicesRef = collection(db, 'servicios');
    const snapshot = await getDocs(servicesRef);
    
    console.log(`📊 Documentos encontrados: ${snapshot.docs.length}`);
    
    if (snapshot.docs.length > 0) {
      console.log('\n📄 Primeros 3 servicios encontrados:');
      snapshot.docs.slice(0, 3).forEach((docSnap, index) => {
        const data = docSnap.data();
        console.log(`  ${index + 1}. ID: ${docSnap.id}`);
        console.log(`     Nombre: ${data.name || 'Sin nombre'}`);
        console.log(`     Dirección: ${data.address || 'Sin dirección'}`);
        console.log(`     Ubicación: ${data.location || 'Sin ubicación'}`);
        console.log(`     Activo: ${data.active}`);
        console.log('     ---');
      });
    } else {
      console.log('⚠️  No se encontraron documentos en la colección "servicios"');
    }
    
    // Buscar específicamente BarbarinaStore
    console.log('\n🔍 Buscando BarbarinaStore específicamente...');
    const barbarinaRef = doc(db, 'servicios', 'barbarinastore');
    const barbarinaDoc = await getDoc(barbarinaRef);
    
    if (barbarinaDoc.exists()) {
      const data = barbarinaDoc.data();
      console.log('✅ BarbarinaStore encontrado:');
      console.log(`   Nombre: ${data.name}`);
      console.log(`   Dirección: ${data.address}`);
      console.log(`   Ubicación: ${data.location}`);
      console.log(`   Referencia: ${data.reference}`);
      console.log(`   Activo: ${data.active}`);
    } else {
      console.log('❌ BarbarinaStore no encontrado');
    }
    
    console.log('\n✅ Prueba de conexión completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error('🔧 Detalles del error:', error);
    
    if (error.message.includes('API key')) {
      console.log('💡 Sugerencia: Verifica la API key de Firebase');
    } else if (error.message.includes('permission')) {
      console.log('💡 Sugerencia: Verifica los permisos de Firestore');
    } else if (error.message.includes('network')) {
      console.log('💡 Sugerencia: Verifica la conexión a internet');
    }
  }
}

// Ejecutar la prueba
testFirebaseConnection().then(() => {
  console.log('\n🏁 Script finalizado');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});