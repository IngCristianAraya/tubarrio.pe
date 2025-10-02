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

async function fixAllAddresses() {
  try {
    console.log('🔧 Mejorando todas las direcciones para seguir el formato de MGC...\n');
    
    const snapshot = await db.collection('services').get();
    let updatedCount = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Saltar MGC que ya está perfecto
      if (doc.id === 'mgc-dental-health') {
        console.log(`✅ ${data.name}: Ya tiene formato perfecto`);
        continue;
      }
      
      const currentAddress = data.direccion_completa || '';
      const baseAddress = data.address || '';
      let newAddress = '';
      
      // Mejorar direcciones según el tipo
      if (currentAddress === 'Lima, Lima, Perú' || currentAddress.includes('Lima, Lima, Perú')) {
        // Direcciones genéricas - usar la dirección base si existe
        if (baseAddress && baseAddress !== 'Lima, Lima, Perú') {
          newAddress = `${baseAddress}, San Miguel, Lima, Perú`;
        } else {
          // Si no hay dirección base, usar el nombre del servicio como referencia
          newAddress = `${data.name}, San Miguel, Lima, Perú`;
        }
      } else if (!currentAddress.includes('San Miguel') && !currentAddress.includes('Lima, Perú')) {
        // Direcciones incompletas - agregar distrito y país
        newAddress = `${currentAddress}, San Miguel, Lima, Perú`;
      } else {
        // Direcciones que ya están bien
        console.log(`✅ ${data.name}: Dirección ya está bien`);
        continue;
      }
      
      // Actualizar en Firebase
      await db.collection('services').doc(doc.id).update({
        direccion_completa: newAddress,
        zona: 'San Miguel',
        district: 'San Miguel',
        cacheBreaker: Date.now()
      });
      
      console.log(`🔧 ${data.name}:`);
      console.log(`   Antes: "${currentAddress}"`);
      console.log(`   Después: "${newAddress}"`);
      console.log('');
      
      updatedCount++;
    }
    
    console.log(`\n✅ Proceso completado. ${updatedCount} servicios actualizados.`);
    
    // Verificar algunos servicios actualizados
    console.log('\n🔍 Verificando servicios actualizados:');
    const verifyServices = ['agente-bcp', 'carniceria-el-buen-corte', 'anticuchos-bran'];
    
    for (const serviceId of verifyServices) {
      const doc = await db.collection('services').doc(serviceId).get();
      if (doc.exists) {
        const data = doc.data();
        console.log(`   ${data.name}: "${data.direccion_completa}"`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAllAddresses().then(() => process.exit(0));