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

// Coordenadas específicas para cada servicio basadas en sus direcciones reales
const specificCoordinates = {
  'mgc-dental-health': { lat: -12.0776, lng: -77.0865 }, // Santa Nicerata 372 - MANTENER
  'agente-bcp': { lat: -12.0774, lng: -77.0863 }, // Calle Sta Nicerata 334 (cerca de MGC)
  'anticuchos-bran': { lat: -12.0850, lng: -77.0950 }, // Avenida Universitaria 1625
  'bobocha-bubble-tea-shop': { lat: -12.0790, lng: -77.0880 }, // Cafe Tacuba
  'caldo-de-gallina': { lat: -12.0785, lng: -77.0875 }, // Santa Mariana 520
  'carniceria-el-buen-corte': { lat: -12.0780, lng: -77.0870 }, // Genérica San Miguel
  'clock-box': { lat: -12.0782, lng: -77.0872 }, // Genérica San Miguel
  'creciendo-digital': { lat: -12.0775, lng: -77.0860 }, // Santa Paula 471
  'escuela-ads': { lat: -12.0784, lng: -77.0874 }, // Genérica San Miguel
  'imana-tu-vida': { lat: -12.0786, lng: -77.0876 }, // Genérica San Miguel
  'iro-sushi': { lat: -12.0852, lng: -77.0952 }, // Av. Universitaria 1743 (cerca de Anticuchos)
  'lacteos-y-embutidos-ac': { lat: -12.0788, lng: -77.0878 }, // Genérica San Miguel
  'lavanderia-antares': { lat: -12.0790, lng: -77.0880 }, // Genérica San Miguel
  'mercado-don-pedrito': { lat: -12.0792, lng: -77.0882 }, // Los Pinos 339
  'panaderia-el-molino': { lat: -12.0794, lng: -77.0884 }, // Genérica San Miguel
  'panaderia-el-molinos': { lat: -12.0796, lng: -77.0886 }, // Genérica San Miguel
  'peluqueria-estilo': { lat: -12.0798, lng: -77.0888 }, // Genérica San Miguel
  'pizzeria-toscana': { lat: -12.0800, lng: -77.0890 }, // Genérica San Miguel
  'rey-del-shawarma': { lat: -12.0802, lng: -77.0892 }, // Genérica San Miguel
  'sanna-terapia': { lat: -12.0780, lng: -77.0870 }, // Santa Teodosia #471
  'shawarma-el-faraon': { lat: -12.0804, lng: -77.0894 }, // Genérica San Miguel
  'superburger': { lat: -12.0778, lng: -77.0868 } // Sta. Teodosia 573 (cerca de Sanna)
};

async function fixUniqueCoordinates() {
  try {
    console.log('🔧 Asignando coordenadas únicas a cada servicio...\n');
    
    const snapshot = await db.collection('services').get();
    let updatedCount = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const serviceId = doc.id;
      
      // Buscar coordenadas específicas para este servicio
      const newCoords = specificCoordinates[serviceId];
      
      if (newCoords) {
        await db.collection('services').doc(serviceId).update({
          coordenadas: newCoords,
          cacheBreaker: Date.now()
        });
        
        console.log(`🔧 ${data.name}:`);
        console.log(`   Nuevas coordenadas: [${newCoords.lat}, ${newCoords.lng}]`);
        console.log('');
        
        updatedCount++;
      } else {
        console.log(`⚠️  ${data.name}: No se encontraron coordenadas específicas para ID '${serviceId}'`);
      }
    }
    
    console.log(`\n✅ Proceso completado. ${updatedCount} servicios actualizados con coordenadas únicas.`);
    
    // Verificar que ahora todas las coordenadas son únicas
    console.log('\n🔍 Verificando unicidad de coordenadas:');
    const verifySnapshot = await db.collection('services').get();
    const coordsSet = new Set();
    let duplicates = 0;
    
    verifySnapshot.forEach(doc => {
      const data = doc.data();
      const coords = data.coordenadas;
      if (coords && coords.lat && coords.lng) {
        const coordString = `${coords.lat},${coords.lng}`;
        if (coordsSet.has(coordString)) {
          duplicates++;
        } else {
          coordsSet.add(coordString);
        }
      }
    });
    
    console.log(`   Ubicaciones únicas: ${coordsSet.size}`);
    console.log(`   Duplicados encontrados: ${duplicates}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixUniqueCoordinates().then(() => process.exit(0));