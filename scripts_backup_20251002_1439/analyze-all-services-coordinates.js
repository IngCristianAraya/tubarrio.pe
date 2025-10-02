const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Inicializar Firebase Admin
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

async function analyzeAllServicesCoordinates() {
  try {
    console.log('🔍 Analizando coordenadas de todos los servicios...\n');
    
    const snapshot = await db.collection('services').get();
    const services = [];
    const problematicServices = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const service = {
        id: doc.id,
        name: data.name,
        address: data.address,
        direccion_completa: data.direccion_completa,
        coordenadas: data.coordenadas,
        zona: data.zona,
        neighborhood: data.neighborhood
      };
      
      services.push(service);
      
      // Identificar servicios con coordenadas problemáticas
      if (!data.coordenadas || 
          !Array.isArray(data.coordenadas) || 
          data.coordenadas.length !== 2 ||
          data.coordenadas[0] === 0 || 
          data.coordenadas[1] === 0 ||
          // Coordenadas muy genéricas de Lima Centro
          (data.coordenadas[0] > -12.05 && data.coordenadas[0] < -12.04 && 
           data.coordenadas[1] > -77.04 && data.coordenadas[1] < -77.02)) {
        problematicServices.push(service);
      }
    });
    
    console.log(`📊 RESUMEN GENERAL:`);
    console.log(`   Total de servicios: ${services.length}`);
    console.log(`   Servicios con coordenadas problemáticas: ${problematicServices.length}`);
    console.log(`   Servicios con coordenadas aparentemente correctas: ${services.length - problematicServices.length}\n`);
    
    console.log('🚨 SERVICIOS QUE NECESITAN CORRECCIÓN:\n');
    problematicServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   ID: ${service.id}`);
      console.log(`   Dirección: ${service.address}`);
      console.log(`   Dirección completa: ${service.direccion_completa}`);
      console.log(`   Coordenadas actuales: ${JSON.stringify(service.coordenadas)}`);
      console.log(`   Zona: ${service.zona}`);
      console.log(`   Barrio: ${service.neighborhood}`);
      console.log('   ---');
    });
    
    console.log('\n✅ SERVICIOS CON COORDENADAS APARENTEMENTE CORRECTAS:\n');
    const goodServices = services.filter(s => !problematicServices.includes(s));
    goodServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   Coordenadas: ${JSON.stringify(service.coordenadas)}`);
      console.log(`   Dirección: ${service.direccion_completa || service.address}`);
      console.log('   ---');
    });
    
    // Guardar lista de servicios problemáticos para procesamiento posterior
    const fs = require('fs');
    fs.writeFileSync('services-to-fix.json', JSON.stringify(problematicServices, null, 2));
    console.log('\n💾 Lista de servicios problemáticos guardada en: services-to-fix.json');
    
  } catch (error) {
    console.error('❌ Error al analizar servicios:', error);
  }
}

analyzeAllServicesCoordinates().then(() => {
  console.log('\n🎯 Análisis completado. Revisa los resultados arriba.');
  process.exit(0);
});