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

// Nueva función getMapUrl corregida
function getMapUrl(service) {
  console.log(`\n🔍 Procesando servicio: ${service.name}`);
  
  // Prioridad: coordenadas > dirección completa > dirección existente > barrio
  if (service.coordenadas && service.coordenadas.lat && service.coordenadas.lng) {
    const { lat, lng } = service.coordenadas;
    console.log(`   ✅ Coordenadas: lat=${lat}, lng=${lng}`);
    // Usar URL simple que funciona sin API key y con coordenadas dinámicas
    const url = `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=16`;
    console.log(`   🗺️  URL generada: ${url}`);
    return url;
  }
  
  if (service.direccion_completa) {
    console.log(`   📍 Usando dirección completa: ${service.direccion_completa}`);
    const query = encodeURIComponent(service.direccion_completa);
    const url = `https://www.google.com/maps?q=${query}&output=embed`;
    console.log(`   🗺️  URL generada: ${url}`);
    return url;
  }
  
  if (service.address) {
    console.log(`   📍 Usando dirección: ${service.address}`);
    const query = encodeURIComponent(service.address);
    const url = `https://www.google.com/maps?q=${query}&output=embed`;
    console.log(`   🗺️  URL generada: ${url}`);
    return url;
  }
  
  if (service.neighborhood) {
    console.log(`   📍 Usando barrio: ${service.neighborhood}`);
    const query = encodeURIComponent(service.neighborhood);
    const url = `https://www.google.com/maps?q=${query}&output=embed`;
    console.log(`   🗺️  URL generada: ${url}`);
    return url;
  }
  
  console.log(`   ❌ No se pudo generar URL del mapa`);
  return null;
}

async function testFixedMapUrls() {
  try {
    console.log('🔍 Probando las URLs corregidas del mapa...\n');
    
    // Obtener algunos servicios específicos para probar
    const testServices = ['mgc-dental-health', 'agente-bcp', 'anticuchos-bran', 'bobocha-bubble-tea-shop'];
    
    console.log('📊 Análisis de URLs corregidas:');
    console.log('=====================================');
    
    const urlsGenerated = [];
    
    for (const serviceId of testServices) {
      const doc = await db.collection('services').doc(serviceId).get();
      if (doc.exists) {
        const service = { id: doc.id, ...doc.data() };
        const mapUrl = getMapUrl(service);
        
        if (mapUrl) {
          urlsGenerated.push({
            service: service.name,
            id: serviceId,
            url: mapUrl,
            coordinates: service.coordenadas
          });
        }
      }
    }
    
    console.log('\n📈 Resumen del análisis:');
    console.log(`   URLs generadas: ${urlsGenerated.length}`);
    
    // Verificar si todas las URLs son diferentes ahora
    const uniqueUrls = [...new Set(urlsGenerated.map(item => item.url))];
    console.log(`\n🚨 Verificación de duplicados:`);
    console.log(`   URLs únicas generadas: ${uniqueUrls.length}`);
    console.log(`   Total de servicios: ${urlsGenerated.length}`);
    
    if (uniqueUrls.length === urlsGenerated.length) {
      console.log(`   ✅ PROBLEMA RESUELTO: Todas las URLs son únicas!`);
    } else {
      console.log(`   ⚠️  PROBLEMA PERSISTE: Hay URLs duplicadas!`);
    }
    
    console.log('\n🗺️  URLs generadas (corregidas):');
    urlsGenerated.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.service} (${item.id})`);
      console.log(`      Coordenadas: lat=${item.coordinates.lat}, lng=${item.coordinates.lng}`);
      console.log(`      URL: ${item.url}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFixedMapUrls().then(() => process.exit(0));