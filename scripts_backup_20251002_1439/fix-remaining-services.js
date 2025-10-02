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

async function fixRemainingServices() {
  try {
    console.log('🔧 Corrigiendo servicios restantes...\n');
    
    const snapshot = await db.collection('services').get();
    
    // Primero, identificar los IDs reales de los servicios faltantes
    console.log('📋 IDs reales de todos los servicios:');
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   "${doc.id}" -> ${data.name}`);
    });
    
    console.log('\n🔧 Actualizando servicios faltantes:');
    
    // Actualizar "Lácteos y Embutidos A&C"
    const lacteosDoc = snapshot.docs.find(doc => doc.data().name === 'Lácteos y Embutidos A&C');
    if (lacteosDoc) {
      await db.collection('services').doc(lacteosDoc.id).update({
        coordenadas: { lat: -12.0788, lng: -77.0878 },
        cacheBreaker: Date.now()
      });
      console.log(`✅ ${lacteosDoc.data().name}: Coordenadas actualizadas`);
    }
    
    // Actualizar "Sanna terapia"
    const sannaDoc = snapshot.docs.find(doc => doc.data().name === 'Sanna terapia');
    if (sannaDoc) {
      await db.collection('services').doc(sannaDoc.id).update({
        coordenadas: { lat: -12.0780, lng: -77.0870 },
        cacheBreaker: Date.now()
      });
      console.log(`✅ ${sannaDoc.data().name}: Coordenadas actualizadas`);
    }
    
    // Verificar duplicados restantes y corregirlos
    const verifySnapshot = await db.collection('services').get();
    const coordsMap = new Map();
    
    verifySnapshot.forEach(doc => {
      const data = doc.data();
      const coords = data.coordenadas;
      if (coords && coords.lat && coords.lng) {
        const coordString = `${coords.lat},${coords.lng}`;
        if (coordsMap.has(coordString)) {
          coordsMap.get(coordString).push({ id: doc.id, name: data.name });
        } else {
          coordsMap.set(coordString, [{ id: doc.id, name: data.name }]);
        }
      }
    });
    
    console.log('\n🔍 Corrigiendo duplicados restantes:');
    for (const [coords, services] of coordsMap.entries()) {
      if (services.length > 1) {
        console.log(`   Duplicado en ${coords}:`);
        for (let i = 1; i < services.length; i++) {
          const service = services[i];
          const [lat, lng] = coords.split(',').map(Number);
          const newCoords = {
            lat: lat + (i * 0.0002), // Pequeño offset para cada duplicado
            lng: lng + (i * 0.0002)
          };
          
          await db.collection('services').doc(service.id).update({
            coordenadas: newCoords,
            cacheBreaker: Date.now()
          });
          
          console.log(`      ${service.name}: Movido a [${newCoords.lat}, ${newCoords.lng}]`);
        }
      }
    }
    
    console.log('\n✅ Todos los servicios ahora tienen coordenadas únicas.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixRemainingServices().then(() => process.exit(0));