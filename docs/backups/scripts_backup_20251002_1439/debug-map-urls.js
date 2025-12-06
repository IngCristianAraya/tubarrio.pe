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

// Función para generar URL del mapa (copiada del componente ServiceMap)
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

async function debugMapUrls() {
  try {
    console.log('🔍 Verificando URLs de Google Maps...\n');
    
    const snapshot = await db.collection('services').get();
    
    // Verificar algunos servicios específicos
    const testServices = ['mgc-dental-health', 'agente-bcp', 'anticuchos-bran'];
    
    for (const serviceId of testServices) {
      const doc = await db.collection('services').doc(serviceId).get();
      if (doc.exists) {
        const data = doc.data();
        console.log(`🔧 ${data.name}:`);
        console.log(`   ID: ${serviceId}`);
        console.log(`   Coordenadas: ${JSON.stringify(data.coordenadas)}`);
        console.log(`   Dirección completa: "${data.direccion_completa}"`);
        
        const mapUrl = getMapUrl(data);
        console.log(`   URL del mapa: ${mapUrl}`);
        
        if (mapUrl) {
          console.log(`   ✅ URL generada correctamente`);
        } else {
          console.log(`   ❌ No se pudo generar URL`);
        }
        console.log('');
      }
    }
    
    // Verificar todos los servicios para detectar problemas
    console.log('📊 RESUMEN DE TODOS LOS SERVICIOS:');
    let withCoords = 0;
    let withoutCoords = 0;
    let withUrls = 0;
    let withoutUrls = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const hasCoords = data.coordenadas && data.coordenadas.lat && data.coordenadas.lng;
      const mapUrl = getMapUrl(data);
      
      if (hasCoords) {
        withCoords++;
      } else {
        withoutCoords++;
      }
      
      if (mapUrl) {
        withUrls++;
      } else {
        withoutUrls++;
        console.log(`   ❌ ${data.name}: Sin URL de mapa`);
      }
    });
    
    console.log(`\n📈 ESTADÍSTICAS:`);
    console.log(`   Servicios con coordenadas: ${withCoords}`);
    console.log(`   Servicios sin coordenadas: ${withoutCoords}`);
    console.log(`   Servicios con URL de mapa: ${withUrls}`);
    console.log(`   Servicios sin URL de mapa: ${withoutUrls}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugMapUrls().then(() => process.exit(0));