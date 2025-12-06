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

async function checkMGCService() {
  try {
    console.log('🔍 Verificando datos de MGC Dental Health...\n');
    
    const doc = await db.collection('services').doc('mgc-dental-health').get();
    if (doc.exists) {
      const data = doc.data();
      console.log('📋 Datos actuales de MGC Dental Health:');
      console.log('   📝 Nombre:', data.name);
      console.log('   🏠 Dirección original:', data.address);
      console.log('   📍 Dirección completa:', data.direccion_completa);
      console.log('   🗺️  Coordenadas:', data.coordenadas);
      console.log('   🏘️  Zona:', data.zona);
      console.log('   🏙️  Barrio:', data.neighborhood);
      
      console.log('\n🔍 Análisis:');
      if (data.direccion_completa && data.direccion_completa.includes('Av. Larco 345')) {
        console.log('   ❌ La dirección completa está incorrecta (Av. Larco 345)');
        console.log('   ✅ Debería ser: Santa Nicerata 372');
      }
      
      if (data.coordenadas) {
        console.log('   📍 Coordenadas actuales:', `${data.coordenadas.lat}, ${data.coordenadas.lng}`);
        console.log('   🔄 Necesitan actualizarse para Santa Nicerata 372');
      }
    } else {
      console.log('❌ Servicio MGC Dental Health no encontrado');
    }
  } catch (error) {
    console.error('❌ Error al verificar servicio:', error);
  }
}

checkMGCService().then(() => process.exit(0));