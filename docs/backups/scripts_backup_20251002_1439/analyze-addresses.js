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

async function analyzeAddresses() {
  try {
    console.log('🔍 Analizando direcciones completas de todos los servicios...\n');
    
    const snapshot = await db.collection('services').get();
    
    console.log('✅ MGC Dental Health (EJEMPLO PERFECTO):');
    const mgcDoc = await db.collection('services').doc('mgc-dental-health').get();
    if (mgcDoc.exists) {
      const mgcData = mgcDoc.data();
      console.log(`   Dirección completa: "${mgcData.direccion_completa}"`);
      console.log(`   Address: "${mgcData.address}"`);
      console.log(`   Zona: "${mgcData.zona}"`);
      console.log(`   District: "${mgcData.district}"`);
    }
    console.log('');
    
    console.log('❌ OTROS SERVICIOS (NECESITAN MEJORA):');
    let genericCount = 0;
    let incompleteCount = 0;
    let goodCount = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (doc.id !== 'mgc-dental-health') {
        const direccionCompleta = data.direccion_completa || '';
        const address = data.address || '';
        
        // Clasificar direcciones
        if (direccionCompleta === 'Lima, Lima, Perú' || direccionCompleta.includes('Lima, Lima, Perú')) {
          console.log(`   🔴 ${data.name}: "${direccionCompleta}" (GENÉRICA)`);
          genericCount++;
        } else if (!direccionCompleta.includes('San Miguel') && !direccionCompleta.includes('Lima, Perú')) {
          console.log(`   🟡 ${data.name}: "${direccionCompleta}" (INCOMPLETA)`);
          incompleteCount++;
        } else {
          console.log(`   🟢 ${data.name}: "${direccionCompleta}" (BUENA)`);
          goodCount++;
        }
      }
    });
    
    console.log('\n📊 RESUMEN:');
    console.log(`   🔴 Direcciones genéricas: ${genericCount}`);
    console.log(`   🟡 Direcciones incompletas: ${incompleteCount}`);
    console.log(`   🟢 Direcciones buenas: ${goodCount + 1}`); // +1 por MGC
    console.log(`   📍 Total servicios: ${snapshot.size}`);
    
    console.log('\n💡 FORMATO OBJETIVO (como MGC):');
    console.log('   "Dirección específica, San Miguel, Lima, Perú"');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeAddresses().then(() => process.exit(0));