// Script para verificar las reglas de Firestore y la conectividad
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function checkFirestoreRules() {
  console.log('🔍 === VERIFICACIÓN DE REGLAS DE FIRESTORE ===\n');
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase inicializado correctamente');
    console.log('📋 Project ID:', firebaseConfig.projectId);
    console.log('');
    
    // Probar lectura de la colección services
    console.log('🔍 Probando lectura de colección "services"...');
    try {
      const servicesRef = collection(db, 'services');
      const snapshot = await getDocs(servicesRef);
      console.log(`✅ Lectura exitosa: ${snapshot.size} documentos encontrados`);
      
      if (snapshot.size > 0) {
        console.log('📄 Primeros 3 documentos:');
        let count = 0;
        snapshot.forEach((doc) => {
          if (count < 3) {
            const data = doc.data();
            console.log(`   - ${doc.id}: ${data.name || data.title || 'Sin nombre'}`);
            console.log(`     Activo: ${data.active}`);
            console.log(`     Categoría: ${data.category}`);
            count++;
          }
        });
      }
    } catch (error) {
      console.error('❌ Error al leer colección services:', error.code, error.message);
      
      if (error.code === 'permission-denied') {
        console.log('\n🚨 PROBLEMA DE PERMISOS DETECTADO');
        console.log('Las reglas de Firestore están bloqueando el acceso.');
        console.log('\n📝 Reglas recomendadas para desarrollo:');
        console.log('rules_version = \'2\';');
        console.log('service cloud.firestore {');
        console.log('  match /databases/{database}/documents {');
        console.log('    match /{document=**} {');
        console.log('      allow read, write: if true; // SOLO PARA DESARROLLO');
        console.log('    }');
        console.log('  }');
        console.log('}');
        console.log('\n⚠️  IMPORTANTE: Cambiar estas reglas en producción por seguridad');
      }
    }
    
    // Probar lectura de un documento específico
    console.log('\n🔍 Probando lectura de documento específico...');
    try {
      const docRef = doc(db, 'services', 'agente-bcp');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('✅ Documento específico leído correctamente');
        console.log('📄 Datos:', docSnap.data().name || 'Sin nombre');
      } else {
        console.log('⚠️  Documento específico no existe');
      }
    } catch (error) {
      console.error('❌ Error al leer documento específico:', error.code, error.message);
    }
    
    console.log('\n🎉 === VERIFICACIÓN COMPLETADA ===');
    
  } catch (error) {
    console.error('\n❌ === ERROR GENERAL ===');
    console.error('Tipo:', error.constructor.name);
    console.error('Código:', error.code || 'No disponible');
    console.error('Mensaje:', error.message);
    console.error('\nStack:', error.stack);
  }
}

// Ejecutar verificación
checkFirestoreRules().catch(console.error);