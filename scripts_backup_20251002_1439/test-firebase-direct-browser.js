// Test directo de Firebase en el navegador
// Ejecutar en la consola del navegador

console.log('🔥 Iniciando test directo de Firebase...');

// Verificar si Firebase está disponible
if (typeof window !== 'undefined' && window.firebase) {
  console.log('✅ Firebase global disponible');
} else {
  console.log('❌ Firebase global NO disponible');
}

// Test de importación dinámica
try {
  import('/src/lib/firebase/config.js').then(module => {
    console.log('✅ Módulo Firebase importado:', module);
    
    const { db } = module;
    if (db) {
      console.log('✅ Firestore db disponible:', db);
      
      // Test de consulta
      import('firebase/firestore').then(firestoreModule => {
        const { collection, getDocs } = firestoreModule;
        
        console.log('🔍 Consultando servicios...');
        const servicesRef = collection(db, 'services');
        
        getDocs(servicesRef)
          .then(snapshot => {
            console.log('✅ Servicios obtenidos:', snapshot.size);
            snapshot.docs.slice(0, 3).forEach(doc => {
              console.log('📄 Servicio:', doc.id, doc.data().name);
            });
          })
          .catch(error => {
            console.error('❌ Error consultando servicios:', error);
          });
      });
    } else {
      console.log('❌ Firestore db NO disponible');
    }
  }).catch(error => {
    console.error('❌ Error importando Firebase config:', error);
  });
} catch (error) {
  console.error('❌ Error en test de Firebase:', error);
}

// Verificar variables de entorno
console.log('🔍 Variables de entorno:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process?.env?.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Definida' : 'No definida');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process?.env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Definida' : 'No definida');
console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', process?.env?.NEXT_PUBLIC_DISABLE_FIREBASE);