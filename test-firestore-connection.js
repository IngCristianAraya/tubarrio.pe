// Script para probar la conexión con Firestore
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc, connectFirestoreEmulator } = require('firebase/firestore');

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
  console.log('🔥 Iniciando prueba de conexión con Firestore...');
  
  try {
    // Inicializar Firebase
    console.log('📱 Inicializando Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado correctamente');
    
    // Inicializar Firestore
    console.log('🗄️ Inicializando Firestore...');
    const db = getFirestore(app);
    console.log('✅ Firestore inicializado correctamente');
    
    // Probar lectura de una colección
    console.log('📖 Probando lectura de colección "services"...');
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    
    console.log(`✅ Conexión exitosa! Encontrados ${snapshot.size} documentos en la colección "services"`);
    
    // Mostrar algunos documentos como ejemplo
    if (snapshot.size > 0) {
      console.log('📋 Primeros 3 documentos:');
      let count = 0;
      snapshot.forEach((doc) => {
        if (count < 3) {
          const data = doc.data();
          console.log(`  - ${doc.id}: ${data.name || data.title || 'Sin nombre'}`);
          count++;
        }
      });
    }
    
    // Probar lectura de estadísticas
    console.log('\n📊 Probando lectura de estadísticas...');
    try {
      const statsRef = collection(db, 'stats');
      const statsSnapshot = await getDocs(statsRef);
      console.log(`✅ Estadísticas: ${statsSnapshot.size} documentos encontrados`);
    } catch (statsError) {
      console.log('⚠️ Error al leer estadísticas:', statsError.message);
    }
    
    console.log('\n🎉 Todas las pruebas de conexión completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la conexión con Firestore:');
    console.error('Código de error:', error.code);
    console.error('Mensaje:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Sugerencias para error de permisos:');
      console.log('1. Verificar las reglas de Firestore');
      console.log('2. Asegurarse de que las reglas permitan lectura pública');
    } else if (error.code === 'unavailable') {
      console.log('\n💡 Sugerencias para error de disponibilidad:');
      console.log('1. Verificar conexión a internet');
      console.log('2. Verificar que el proyecto Firebase esté activo');
    } else if (error.message.includes('400')) {
      console.log('\n💡 Sugerencias para error 400:');
      console.log('1. Verificar configuración de Firebase');
      console.log('2. Verificar que el dominio esté autorizado');
      console.log('3. Verificar que el proyecto ID sea correcto');
    }
    
    console.log('\nStack trace completo:');
    console.error(error);
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testFirestoreConnection()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script falló:', error);
      process.exit(1);
    });
}

module.exports = { testFirestoreConnection };