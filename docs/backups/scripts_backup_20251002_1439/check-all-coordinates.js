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

async function checkAllCoordinates() {
  try {
    console.log('🔍 Verificando coordenadas específicas de cada servicio...\n');
    
    const snapshot = await db.collection('services').get();
    const coordinatesMap = new Map();
    
    console.log('📍 COORDENADAS POR SERVICIO:');
    snapshot.forEach(doc => {
      const data = doc.data();
      const coords = data.coordenadas;
      
      if (coords && coords.lat && coords.lng) {
        const coordString = `${coords.lat},${coords.lng}`;
        console.log(`   ${data.name}: [${coords.lat}, ${coords.lng}]`);
        
        // Contar cuántos servicios tienen las mismas coordenadas
        if (coordinatesMap.has(coordString)) {
          coordinatesMap.get(coordString).push(data.name);
        } else {
          coordinatesMap.set(coordString, [data.name]);
        }
      } else {
        console.log(`   ❌ ${data.name}: Sin coordenadas válidas`);
      }
    });
    
    console.log('\n🚨 COORDENADAS DUPLICADAS:');
    let duplicatesFound = false;
    coordinatesMap.forEach((services, coords) => {
      if (services.length > 1) {
        console.log(`   📍 ${coords}:`);
        services.forEach(service => {
          console.log(`      - ${service}`);
        });
        console.log('');
        duplicatesFound = true;
      }
    });
    
    if (!duplicatesFound) {
      console.log('   ✅ No se encontraron coordenadas duplicadas');
    }
    
    console.log('\n📊 RESUMEN:');
    console.log(`   Total servicios: ${snapshot.size}`);
    console.log(`   Ubicaciones únicas: ${coordinatesMap.size}`);
    console.log(`   Servicios con coordenadas duplicadas: ${duplicatesFound ? 'SÍ' : 'NO'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllCoordinates().then(() => process.exit(0));