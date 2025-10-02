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

async function quickCheck() {
  try {
    console.log('🔍 Verificación rápida de coordenadas...\n');
    
    // Verificar MGC específicamente
    const mgcDoc = await db.collection('services').doc('mgc-dental-health').get();
    if (mgcDoc.exists) {
      const mgcData = mgcDoc.data();
      console.log('📋 MGC Dental Health:');
      console.log('   Coordenadas:', JSON.stringify(mgcData.coordenadas));
      console.log('   Tipo:', typeof mgcData.coordenadas);
      console.log('   Es array:', Array.isArray(mgcData.coordenadas));
      
      // Verificar si el formato cambió
      if (Array.isArray(mgcData.coordenadas)) {
        console.log('   ✅ Formato array: [lat, lng]');
        console.log('   Valores:', mgcData.coordenadas[0], mgcData.coordenadas[1]);
      } else if (mgcData.coordenadas && typeof mgcData.coordenadas === 'object') {
        console.log('   ⚠️ Formato objeto: {lat, lng}');
        console.log('   Valores:', mgcData.coordenadas.lat, mgcData.coordenadas.lng);
      } else {
        console.log('   ❌ Formato desconocido');
      }
      console.log('');
    } else {
      console.log('❌ MGC Dental Health no encontrado');
    }
    
    // Verificar otros servicios
    const snapshot = await db.collection('services').limit(3).get();
    console.log('📊 Otros servicios:');
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   ${data.name}:`);
      console.log(`     Coordenadas: ${JSON.stringify(data.coordenadas)}`);
      console.log(`     Tipo: ${typeof data.coordenadas}, Array: ${Array.isArray(data.coordenadas)}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

quickCheck().then(() => {
  console.log('\n🎯 Verificación completada');
  process.exit(0);
});