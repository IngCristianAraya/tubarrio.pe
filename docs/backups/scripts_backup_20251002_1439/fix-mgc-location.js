/**
 * Script para corregir la ubicación de MGC Dental Health
 * Dirección correcta: Santa Nicerata 372
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Configuración de Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tubarriope-7ed1d",
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tubarriope-7ed1d"
  });
}

const db = admin.firestore();

async function fixMGCLocation() {
  try {
    console.log('🔧 Corrigiendo ubicación de MGC Dental Health...\n');
    
    // Datos correctos para Santa Nicerata 372
    // Coordenadas aproximadas para Santa Nicerata 372, Lima (zona céntrica)
    const correctData = {
      address: 'Santa Nicerata 372',
      direccion_completa: 'Santa Nicerata 372, Lima, Perú',
      coordenadas: {
        lat: -12.0464, // Coordenadas del centro de Lima (aproximadas)
        lng: -77.0428
      },
      zona: 'Lima Centro',
      neighborhood: 'Lima Centro'
    };
    
    console.log('📍 Datos que se van a actualizar:');
    console.log('   🏠 Dirección:', correctData.address);
    console.log('   📍 Dirección completa:', correctData.direccion_completa);
    console.log('   🗺️  Coordenadas:', `${correctData.coordenadas.lat}, ${correctData.coordenadas.lng}`);
    console.log('   🏘️  Zona:', correctData.zona);
    console.log('   🏙️  Barrio:', correctData.neighborhood);
    
    // Actualizar el servicio
    await db.collection('services').doc('mgc-dental-health').update(correctData);
    
    console.log('\n✅ MGC Dental Health actualizado exitosamente!');
    console.log('🎯 La ubicación ahora muestra: Santa Nicerata 372, Lima, Perú');
    
    // Verificar la actualización
    console.log('\n🔍 Verificando actualización...');
    const updatedDoc = await db.collection('services').doc('mgc-dental-health').get();
    if (updatedDoc.exists) {
      const data = updatedDoc.data();
      console.log('✅ Verificación exitosa:');
      console.log('   📍 Nueva dirección completa:', data.direccion_completa);
      console.log('   🗺️  Nuevas coordenadas:', data.coordenadas);
    }
    
  } catch (error) {
    console.error('❌ Error al actualizar MGC Dental Health:', error);
  }
}

// Ejecutar el script
fixMGCLocation()
  .then(() => {
    console.log('\n🎉 Script ejecutado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  });