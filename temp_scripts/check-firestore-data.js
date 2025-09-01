// Script para verificar datos en Firestore
require('dotenv').config({ path: '.env.local' });

const admin = require('firebase-admin');

// Configurar Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

console.log('Configuración Firebase:');
console.log('Project ID:', serviceAccount.projectId);
console.log('Client Email:', serviceAccount.clientEmail);
console.log('Private Key presente:', !!serviceAccount.privateKey);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const db = admin.firestore();
  
  console.log('\n🔍 Verificando datos en Firestore...');
  
  db.collection('services')
    .limit(10)
    .get()
    .then(snapshot => {
      console.log(`\n📊 Total de servicios encontrados: ${snapshot.size}`);
      
      if (snapshot.size > 0) {
        console.log('\n📋 Primeros servicios:');
        snapshot.forEach((doc, index) => {
          const data = doc.data();
          console.log(`${index + 1}. ID: ${doc.id}`);
          console.log(`   Nombre: ${data.name || 'Sin nombre'}`);
          console.log(`   Categoría: ${data.category || 'Sin categoría'}`);
          console.log(`   Activo: ${data.active !== false ? 'Sí' : 'No'}`);
          console.log(`   Rating: ${data.rating || 'Sin rating'}`);
          console.log('---');
        });
      } else {
        console.log('❌ No se encontraron servicios en la colección');
      }
      
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error consultando Firestore:', error);
      process.exit(1);
    });
    
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
  process.exit(1);
}

// Timeout de seguridad
setTimeout(() => {
  console.log('⏰ Timeout - cerrando script');
  process.exit(0);
}, 10000);