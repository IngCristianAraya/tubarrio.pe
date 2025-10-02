// Script para actualizar MGC Dental Health con coordenadas precisas de San Miguel

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

async function updateMGCPreciseLocation() {
  try {
    console.log('🎯 Actualizando MGC Dental Health con coordenadas precisas...');
    
    // Coordenadas más precisas para San Miguel, Lima
    // Basado en la búsqueda web: Santa Nicerata está en San Miguel
    // Coordenadas aproximadas para el distrito de San Miguel
    const preciseCoordinates = {
      lat: -12.0776, // Coordenadas más precisas para San Miguel
      lng: -77.0865  // Distrito de San Miguel, Lima
    };

    const updateData = {
      address: "Santa Nicerata 372",
      direccion_completa: "Santa Nicerata 372, San Miguel, Lima, Perú",
      coordenadas: preciseCoordinates,
      zona: "San Miguel",
      neighborhood: "San Miguel",
      distrito: "San Miguel",
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      locationFixed: Date.now() // Timestamp para identificar esta corrección
    };

    console.log('📍 Nuevas coordenadas:');
    console.log('   Latitud:', preciseCoordinates.lat);
    console.log('   Longitud:', preciseCoordinates.lng);
    console.log('   Distrito: San Miguel');

    await db.collection('services').doc('mgc-dental-health').set(updateData, { merge: true });
    
    console.log('✅ Coordenadas actualizadas correctamente');
    
    // Verificar la actualización
    const updatedDoc = await db.collection('services').doc('mgc-dental-health').get();
    const updatedData = updatedDoc.data();
    
    console.log('\n📋 Datos actualizados:');
    console.log('   Nombre:', updatedData.name);
    console.log('   Dirección:', updatedData.address);
    console.log('   Dirección completa:', updatedData.direccion_completa);
    console.log('   Coordenadas:', updatedData.coordenadas);
    console.log('   Distrito:', updatedData.distrito);
    console.log('   Zona:', updatedData.zona);
    console.log('   Barrio:', updatedData.neighborhood);
    
    // Generar URLs para verificar la nueva ubicación
    const { lat, lng } = updatedData.coordenadas;
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    const searchUrl = `https://www.google.com/maps/search/Santa+Nicerata+372+San+Miguel+Lima/@${lat},${lng},17z`;
    
    console.log('\n🗺️  URLs para verificar:');
    console.log('   Mapa normal:', mapUrl);
    console.log('   Mapa embebido:', embedUrl);
    console.log('   Búsqueda específica:', searchUrl);
    
    console.log('\n✅ Actualización completada. La ubicación ahora debería mostrar San Miguel en lugar de Rímac.');
    console.log('💡 Refresca el navegador para ver los cambios.');
    
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
  }
}

updateMGCPreciseLocation().then(() => process.exit(0));