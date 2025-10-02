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

// Coordenadas específicas de San Miguel (cerca de MGC Dental Health)
const SAN_MIGUEL_COORDINATES = {
  lat: -12.0776,
  lng: -77.0865
};

// Coordenadas genéricas de Lima Centro que necesitan ser actualizadas
const GENERIC_LIMA_COORDINATES = {
  lat: -12.0464,
  lng: -77.0428
};

async function fixGenericCoordinates() {
  try {
    console.log('🔧 Actualizando coordenadas genéricas a San Miguel...\n');
    
    const snapshot = await db.collection('services').get();
    let updatedCount = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Verificar si tiene coordenadas genéricas de Lima Centro
      if (data.coordenadas && 
          data.coordenadas.lat === GENERIC_LIMA_COORDINATES.lat && 
          data.coordenadas.lng === GENERIC_LIMA_COORDINATES.lng) {
        
        const updatedData = {
          coordenadas: SAN_MIGUEL_COORDINATES,
          zona: 'San Miguel',
          district: 'San Miguel',
          direccion_completa: data.direccion_completa || `${data.address || data.name}, San Miguel, Lima, Perú`,
          lastUpdated: new Date().toISOString(),
          cacheBreaker: Date.now()
        };
        
        await doc.ref.update(updatedData);
        console.log(`✅ ${data.name}: Lima Centro → San Miguel (${SAN_MIGUEL_COORDINATES.lat}, ${SAN_MIGUEL_COORDINATES.lng})`);
        updatedCount++;
      } else if (data.coordenadas) {
        console.log(`✓ ${data.name}: Ya tiene coordenadas específicas (${data.coordenadas.lat}, ${data.coordenadas.lng})`);
      } else {
        console.log(`⚠️ ${data.name}: Sin coordenadas`);
      }
    }
    
    console.log(`\n🎉 Proceso completado. ${updatedCount} servicios actualizados a San Miguel.`);
    
    // Verificar algunos servicios después de la actualización
    console.log('\n🔍 Verificando servicios actualizados:');
    const verifySnapshot = await db.collection('services').limit(5).get();
    verifySnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   ${data.name}: ${JSON.stringify(data.coordenadas)} - ${data.zona || 'Sin zona'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixGenericCoordinates().then(() => process.exit(0));