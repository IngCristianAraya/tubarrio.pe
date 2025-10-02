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

async function compareServices() {
  try {
    console.log('🔍 Comparando MGC Dental Health con otros servicios...\n');
    
    // Obtener MGC Dental Health
    const mgcDoc = await db.collection('services').doc('mgc-dental-health').get();
    const mgcData = mgcDoc.exists ? mgcDoc.data() : null;
    
    if (!mgcData) {
      console.log('❌ MGC Dental Health no encontrado');
      return;
    }
    
    console.log('✅ MGC Dental Health (FUNCIONA):');
    console.log('   Coordenadas:', JSON.stringify(mgcData.coordenadas));
    console.log('   Dirección completa:', mgcData.direccion_completa);
    console.log('   Address:', mgcData.address);
    console.log('   Neighborhood:', mgcData.neighborhood);
    console.log('   District:', mgcData.district);
    console.log('   Zona:', mgcData.zona);
    console.log('');
    
    // Obtener otros servicios
    const snapshot = await db.collection('services').limit(10).get();
    console.log('❌ Otros servicios (NO FUNCIONAN):');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (doc.id !== 'mgc-dental-health') {
        console.log(`   ${data.name}:`);
        console.log(`     Coordenadas: ${JSON.stringify(data.coordenadas)}`);
        console.log(`     Dirección completa: ${data.direccion_completa || 'undefined'}`);
        console.log(`     Address: ${data.address || 'undefined'}`);
        console.log(`     Neighborhood: ${data.neighborhood || 'undefined'}`);
        console.log(`     District: ${data.district || 'undefined'}`);
        console.log(`     Zona: ${data.zona || 'undefined'}`);
        console.log('');
      }
    });
    
    // Análisis de diferencias
    console.log('📊 ANÁLISIS DE DIFERENCIAS:');
    console.log('1. Coordenadas de MGC:', mgcData.coordenadas);
    console.log('2. ¿Tiene dirección completa MGC?', !!mgcData.direccion_completa);
    console.log('3. ¿Tiene zona MGC?', !!mgcData.zona);
    console.log('4. ¿Tiene distrito MGC?', !!mgcData.district);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

compareServices().then(() => process.exit(0));