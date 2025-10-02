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

async function debugCoordinates() {
  try {
    console.log('🔍 Verificando formato de coordenadas...\n');
    
    // Verificar MGC específicamente
    const mgcDoc = await db.collection('services').doc('mgc-dental-health').get();
    if (mgcDoc.exists) {
      const mgcData = mgcDoc.data();
      console.log('📋 MGC Dental Health:');
      console.log('   Coordenadas raw:', mgcData.coordenadas);
      console.log('   Tipo:', typeof mgcData.coordenadas);
      console.log('   Es array:', Array.isArray(mgcData.coordenadas));
      console.log('   Es objeto:', typeof mgcData.coordenadas === 'object' && !Array.isArray(mgcData.coordenadas));
      
      if (mgcData.coordenadas) {
        console.log('   Lat:', mgcData.coordenadas.lat);
        console.log('   Lng:', mgcData.coordenadas.lng);
        console.log('   Lat tipo:', typeof mgcData.coordenadas.lat);
        console.log('   Lng tipo:', typeof mgcData.coordenadas.lng);
      }
      console.log('');
    }
    
    // Verificar otros servicios
    const snapshot = await db.collection('services').limit(3).get();
    console.log('📊 Otros servicios:');
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   ${data.name}:`);
      console.log(`     Coordenadas: ${JSON.stringify(data.coordenadas)}`);
      console.log(`     Tipo: ${typeof data.coordenadas}`);
      if (data.coordenadas) {
        console.log(`     Lat: ${data.coordenadas.lat} (${typeof data.coordenadas.lat})`);
        console.log(`     Lng: ${data.coordenadas.lng} (${typeof data.coordenadas.lng})`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugCoordinates().then(() => process.exit(0));