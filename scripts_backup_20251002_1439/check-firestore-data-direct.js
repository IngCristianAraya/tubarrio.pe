// Script para verificar datos en Firestore directamente
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCyUy8zFbyy0VwYVUZo9TnfDMoMU3eqAUI',
  authDomain: 'tubarriope-7ed1d.firebaseapp.com',
  projectId: 'tubarriope-7ed1d',
  storageBucket: 'tubarriope-7ed1d.appspot.com',
  messagingSenderId: '1097392406942',
  appId: '1:1097392406942:web:aa206fa1542c74c235568f'
};

async function checkFirestoreData() {
  try {
    console.log('🔍 Inicializando Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase inicializado correctamente');
    console.log('🔄 Consultando colección "services"...');
    
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    console.log(`📊 Servicios encontrados: ${servicesSnapshot.docs.length}`);
    
    if (servicesSnapshot.docs.length > 0) {
      console.log('\n📋 Primeros 3 servicios:');
      servicesSnapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`${index + 1}. ${data.name} (${data.category}) - ${data.barrio}`);
      });
    } else {
      console.log('⚠️ No se encontraron servicios en la colección');
      
      // Verificar si existe la colección "servicios" (nombre en español)
      console.log('🔄 Verificando colección "servicios"...');
      const serviciosSnapshot = await getDocs(collection(db, 'servicios'));
      console.log(`📊 Servicios en "servicios": ${serviciosSnapshot.docs.length}`);
      
      if (serviciosSnapshot.docs.length > 0) {
        console.log('\n📋 Primeros 3 servicios de "servicios":');
        serviciosSnapshot.docs.slice(0, 3).forEach((doc, index) => {
          const data = doc.data();
          console.log(`${index + 1}. ${data.name} (${data.category}) - ${data.barrio}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkFirestoreData();