// Script para importar servicios a Firestore desde un JSON
// 1. Instala las dependencias: npm install firebase-admin
// 2. Coloca tu archivo services.json en la raíz del proyecto
// 3. Descarga tu archivo de credenciales de Firebase (serviceAccountKey.json) desde la consola de Firebase
// 4. Ejecuta el script: node import_services_to_firestore.js

const admin = require('firebase-admin');
const fs = require('fs');

// Cambia la ruta al archivo de tu clave de servicio
const serviceAccount = require('./tubarriope-7ed1d-firebase-adminsdk-fbsvc-ac9410401d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Lee los servicios desde el archivo JSON
const services = JSON.parse(fs.readFileSync('./services.json', 'utf8'));

async function importServices() {
  const batch = db.batch();
  services.forEach(service => {
    const docRef = db.collection('services').doc(service.id);
    batch.set(docRef, service);
  });
  await batch.commit();
  console.log('Importación completa.');
}

importServices().catch(console.error);
