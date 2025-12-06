const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d'
  });
}

const db = admin.firestore();
const fs = require('fs');

async function checkAllServices() {
  try {
    console.log('🔍 Revisando todos los servicios...\n');
    
    const snapshot = await db.collection('services').get();
    const services = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      services.push({
        id: doc.id,
        name: data.name,
        address: data.address,
        direccion_completa: data.direccion_completa,
        coordenadas: data.coordenadas,
        neighborhood: data.neighborhood,
        zona: data.zona
      });
    });
    
    console.log(`📊 Total de servicios encontrados: ${services.length}\n`);
    
    // Mostrar algunos ejemplos
    console.log('📋 Primeros 10 servicios:');
    services.slice(0, 10).forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   ID: ${service.id}`);
      console.log(`   Dirección: ${service.address || service.direccion_completa}`);
      console.log(`   Coordenadas actuales: ${JSON.stringify(service.coordenadas)}`);
      console.log(`   Barrio: ${service.neighborhood}`);
      console.log('');
    });
    
    // Guardar todos los servicios en un archivo JSON para edición manual
    const servicesForUpdate = services.map(service => ({
      id: service.id,
      name: service.name,
      address: service.address || service.direccion_completa,
      neighborhood: service.neighborhood,
      zona: service.zona,
      current_coordinates: service.coordenadas,
      // Campos para llenar manualmente
      correct_lat: null,
      correct_lng: null,
      notes: ""
    }));
    
    fs.writeFileSync('services-coordinates-template.json', JSON.stringify(servicesForUpdate, null, 2));
    
    console.log('✅ Archivo "services-coordinates-template.json" creado');
    console.log('📝 Puedes editar este archivo para agregar las coordenadas correctas');
    console.log('💡 Formato: correct_lat y correct_lng deben ser números decimales');
    console.log('📍 Ejemplo: "correct_lat": -12.0660658, "correct_lng": -77.0776155');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllServices().then(() => {
  console.log('🏁 Revisión completada');
  process.exit(0);
});