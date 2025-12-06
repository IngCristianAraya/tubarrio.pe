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

async function finalVerification() {
  try {
    console.log('🔍 Verificación final de todos los servicios...\n');
    
    const snapshot = await db.collection('services').get();
    let totalServices = 0;
    let servicesWithCoordinates = 0;
    let servicesInSanMiguel = 0;
    
    console.log('📋 Estado de todos los servicios:');
    console.log('=' .repeat(60));
    
    snapshot.forEach(doc => {
      const data = doc.data();
      totalServices++;
      
      if (data.coordenadas && data.coordenadas.lat && data.coordenadas.lng) {
        servicesWithCoordinates++;
        
        const status = data.zona === 'San Miguel' ? '🟢 SAN MIGUEL' : '🟡 OTRA ZONA';
        if (data.zona === 'San Miguel') servicesInSanMiguel++;
        
        console.log(`${status} ${data.name}`);
        console.log(`   📍 Coordenadas: (${data.coordenadas.lat}, ${data.coordenadas.lng})`);
        console.log(`   🏠 Dirección: ${data.direccion_completa || 'No especificada'}`);
        console.log(`   🗺️ Zona: ${data.zona || 'No especificada'}`);
        console.log(`   🏛️ Distrito: ${data.district || 'No especificado'}`);
        console.log('');
      } else {
        console.log(`🔴 SIN COORDENADAS ${data.name}`);
        console.log('');
      }
    });
    
    console.log('=' .repeat(60));
    console.log('📊 RESUMEN FINAL:');
    console.log(`   Total de servicios: ${totalServices}`);
    console.log(`   Con coordenadas válidas: ${servicesWithCoordinates}`);
    console.log(`   En San Miguel: ${servicesInSanMiguel}`);
    console.log(`   En otras zonas: ${servicesWithCoordinates - servicesInSanMiguel}`);
    console.log(`   Sin coordenadas: ${totalServices - servicesWithCoordinates}`);
    
    if (servicesWithCoordinates === totalServices) {
      console.log('\n🎉 ¡ÉXITO! Todos los servicios tienen coordenadas válidas.');
    } else {
      console.log(`\n⚠️ ATENCIÓN: ${totalServices - servicesWithCoordinates} servicios sin coordenadas.`);
    }
    
    // URLs de prueba para los primeros 3 servicios
    console.log('\n🔗 URLs de prueba para Google Maps:');
    let count = 0;
    snapshot.forEach(doc => {
      if (count < 3) {
        const data = doc.data();
        if (data.coordenadas) {
          const { lat, lng } = data.coordenadas;
          console.log(`   ${data.name}: https://www.google.com/maps?q=${lat},${lng}`);
          count++;
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

finalVerification().then(() => process.exit(0));