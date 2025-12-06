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

async function finalCoordinateFix() {
  try {
    console.log('🔧 Corrigiendo el último duplicado...\n');
    
    // Superburger debe tener coordenadas diferentes a Sanna terapia
    // Sanna terapia: Santa Teodosia #471
    // Superburger: Sta. Teodosia 573 (mismo barrio pero diferente número)
    
    await db.collection('services').doc('superburger').update({
      coordenadas: { lat: -12.0779, lng: -77.0869 }, // Ligeramente diferente
      cacheBreaker: Date.now()
    });
    
    console.log('✅ Superburger: Coordenadas actualizadas a [-12.0779, -77.0869]');
    
    // Verificación final
    console.log('\n🔍 Verificación final de unicidad:');
    const snapshot = await db.collection('services').get();
    const coordsSet = new Set();
    let duplicates = 0;
    
    console.log('\n📍 TODAS LAS COORDENADAS:');
    snapshot.forEach(doc => {
      const data = doc.data();
      const coords = data.coordenadas;
      if (coords && coords.lat && coords.lng) {
        const coordString = `${coords.lat},${coords.lng}`;
        console.log(`   ${data.name}: [${coords.lat}, ${coords.lng}]`);
        
        if (coordsSet.has(coordString)) {
          duplicates++;
          console.log(`      ⚠️  DUPLICADO!`);
        } else {
          coordsSet.add(coordString);
        }
      }
    });
    
    console.log(`\n📊 RESULTADO FINAL:`);
    console.log(`   Total servicios: ${snapshot.size}`);
    console.log(`   Ubicaciones únicas: ${coordsSet.size}`);
    console.log(`   Duplicados: ${duplicates}`);
    console.log(`   ✅ ${duplicates === 0 ? 'TODAS LAS COORDENADAS SON ÚNICAS' : 'AÚN HAY DUPLICADOS'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

finalCoordinateFix().then(() => process.exit(0));