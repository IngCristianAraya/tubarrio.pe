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

async function fixCoordinatesFormat() {
  try {
    console.log('🔧 Corrigiendo formato de coordenadas...\n');
    
    const snapshot = await db.collection('services').get();
    let updatedCount = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Si las coordenadas están en formato array, convertir a objeto
      if (data.coordenadas && Array.isArray(data.coordenadas) && data.coordenadas.length === 2) {
        const [lat, lng] = data.coordenadas;
        
        const updatedData = {
          ...data,
          coordenadas: {
            lat: lat,
            lng: lng
          },
          lastUpdated: new Date().toISOString()
        };
        
        await doc.ref.update(updatedData);
        console.log(`✅ ${data.name}: [${lat}, ${lng}] → {lat: ${lat}, lng: ${lng}}`);
        updatedCount++;
      } else if (data.coordenadas && typeof data.coordenadas === 'object' && !Array.isArray(data.coordenadas)) {
        console.log(`✓ ${data.name}: Ya tiene formato correcto`);
      } else {
        console.log(`⚠️ ${data.name}: Sin coordenadas válidas`);
      }
    }
    
    console.log(`\n🎉 Proceso completado. ${updatedCount} servicios actualizados.`);
    
    // Verificar algunos servicios después de la actualización
    console.log('\n🔍 Verificando servicios actualizados:');
    const mgcDoc = await db.collection('services').doc('mgc-dental-health').get();
    if (mgcDoc.exists) {
      const mgcData = mgcDoc.data();
      console.log(`   MGC Dental Health: ${JSON.stringify(mgcData.coordenadas)}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixCoordinatesFormat().then(() => process.exit(0));