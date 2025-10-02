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

// Simular la función getMapUrl del componente ServiceMap
function getMapUrl(service) {
  console.log(`\n🔍 Procesando servicio: ${service.name}`);
  console.log(`   Coordenadas recibidas:`, service.coordenadas);
  console.log(`   Tipo de coordenadas:`, typeof service.coordenadas);
  console.log(`   Es objeto:`, typeof service.coordenadas === 'object' && service.coordenadas !== null);
  
  // Verificar si tiene coordenadas válidas
  if (service.coordenadas && service.coordenadas.lat && service.coordenadas.lng) {
    const { lat, lng } = service.coordenadas;
    console.log(`   ✅ Coordenadas válidas encontradas: lat=${lat}, lng=${lng}`);
    const url = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1ses!2spe!4v1234567890123!5m2!1ses!2spe`;
    console.log(`   🗺️  URL generada: ${url.substring(0, 100)}...`);
    return url;
  }
  
  console.log(`   ❌ No se encontraron coordenadas válidas`);
  
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

async function debugServiceMapData() {
  try {
    console.log('🔍 Verificando datos que llegan al componente ServiceMap...\n');
    
    // Obtener algunos servicios para probar
    const snapshot = await db.collection('services').limit(5).get();
    
    console.log('📊 Análisis de datos de servicios:');
    console.log('=====================================');
    
    let servicesWithCoords = 0;
    let servicesWithoutCoords = 0;
    const urlsGenerated = [];
    
    snapshot.forEach(doc => {
      const service = { id: doc.id, ...doc.data() };
      
      // Simular el procesamiento del componente ServiceMap
      const mapUrl = getMapUrl(service);
      
      if (service.coordenadas && service.coordenadas.lat && service.coordenadas.lng) {
        servicesWithCoords++;
      } else {
        servicesWithoutCoords++;
      }
      
      if (mapUrl) {
        urlsGenerated.push({
          service: service.name,
          url: mapUrl,
          usedCoordinates: !!(service.coordenadas && service.coordenadas.lat && service.coordenadas.lng)
        });
      }
    });
    
    console.log('\n📈 Resumen del análisis:');
    console.log(`   Servicios con coordenadas válidas: ${servicesWithCoords}`);
    console.log(`   Servicios sin coordenadas válidas: ${servicesWithoutCoords}`);
    console.log(`   URLs generadas: ${urlsGenerated.length}`);
    
    console.log('\n🗺️  URLs generadas:');
    urlsGenerated.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.service}`);
      console.log(`      Usa coordenadas: ${item.usedCoordinates ? '✅' : '❌'}`);
      console.log(`      URL: ${item.url.substring(0, 80)}...`);
    });
    
    // Verificar si todas las URLs son iguales (problema detectado)
    const uniqueUrls = [...new Set(urlsGenerated.map(item => item.url))];
    console.log(`\n🚨 Verificación de duplicados:`);
    console.log(`   URLs únicas generadas: ${uniqueUrls.length}`);
    console.log(`   Total de servicios: ${urlsGenerated.length}`);
    
    if (uniqueUrls.length < urlsGenerated.length) {
      console.log(`   ⚠️  PROBLEMA DETECTADO: Hay URLs duplicadas!`);
      
      // Mostrar qué URLs se repiten
      const urlCounts = {};
      urlsGenerated.forEach(item => {
        urlCounts[item.url] = (urlCounts[item.url] || 0) + 1;
      });
      
      console.log(`\n📋 URLs duplicadas:`);
      Object.entries(urlCounts).forEach(([url, count]) => {
        if (count > 1) {
          console.log(`   ${count} servicios usan: ${url.substring(0, 80)}...`);
        }
      });
    } else {
      console.log(`   ✅ Todas las URLs son únicas`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugServiceMapData().then(() => process.exit(0));