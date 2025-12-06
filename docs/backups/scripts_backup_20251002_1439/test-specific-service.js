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

async function testSpecificService() {
  try {
    console.log('🔍 Probando servicio específico: MGC Dental Health\n');
    
    const doc = await db.collection('services').doc('mgc-dental-health').get();
    if (doc.exists) {
      const data = doc.data();
      
      console.log('📋 Datos del servicio:');
      console.log(`   Nombre: ${data.name}`);
      console.log(`   Coordenadas: ${JSON.stringify(data.coordenadas)}`);
      console.log(`   Dirección completa: "${data.direccion_completa}"`);
      console.log(`   Dirección original: "${data.address}"`);
      console.log(`   Barrio: "${data.neighborhood}"`);
      
      // Simular la lógica del componente ServiceMap
      function getMapUrl(service) {
        if (service.coordenadas && service.coordenadas.lat && service.coordenadas.lng) {
          const { lat, lng } = service.coordenadas;
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaQzuU17R8&q=${lat},${lng}&zoom=16`;
        }
        
        if (service.direccion_completa) {
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaQzuU17R8&q=${encodeURIComponent(service.direccion_completa)}&zoom=16`;
        }
        
        if (service.address) {
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaQzuU17R8&q=${encodeURIComponent(service.address)}&zoom=16`;
        }
        
        if (service.neighborhood) {
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaQzuU17R8&q=${encodeURIComponent(service.neighborhood)}&zoom=16`;
        }
        
        return null;
      }
      
      const mapUrl = getMapUrl(data);
      console.log(`\n🗺️ URL del mapa generada:`);
      console.log(`   ${mapUrl}`);
      
      if (mapUrl) {
        console.log(`\n✅ URL generada correctamente`);
        console.log(`\n🔗 Para probar manualmente, visita:`);
        console.log(`   http://localhost:3000/servicio/mgc-dental-health`);
      } else {
        console.log(`\n❌ No se pudo generar URL del mapa`);
      }
      
      // Verificar otros servicios para comparar
      console.log(`\n📊 Comparando con otros servicios...`);
      const snapshot = await db.collection('services').limit(3).get();
      snapshot.forEach(doc => {
        if (doc.id !== 'mgc-dental-health') {
          const otherData = doc.data();
          const otherMapUrl = getMapUrl(otherData);
          console.log(`\n   ${otherData.name}:`);
          console.log(`     Coordenadas: ${JSON.stringify(otherData.coordenadas)}`);
          console.log(`     URL: ${otherMapUrl ? '✅ Generada' : '❌ No generada'}`);
        }
      });
      
    } else {
      console.log('❌ Servicio no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSpecificService().then(() => process.exit(0));