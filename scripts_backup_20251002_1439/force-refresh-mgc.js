// Script para forzar actualización de datos de MGC Dental Health y evitar problemas de caché

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

async function forceRefreshMGC() {
  try {
    console.log('🔄 Forzando actualización de MGC Dental Health...');
    
    // Obtener datos actuales
    const doc = await db.collection('services').doc('mgc-dental-health').get();
    if (!doc.exists) {
      console.log('❌ Servicio no encontrado');
      return;
    }

    const currentData = doc.data();
    console.log('📋 Datos actuales:');
    console.log('   Nombre:', currentData.name);
    console.log('   Dirección:', currentData.address);
    console.log('   Dirección completa:', currentData.direccion_completa);
    console.log('   Coordenadas:', currentData.coordenadas);
    console.log('   Zona:', currentData.zona);
    console.log('   Barrio:', currentData.neighborhood);

    // Agregar timestamp para forzar actualización
    const updateData = {
      ...currentData,
      address: "Santa Nicerata 372",
      direccion_completa: "Santa Nicerata 372, Lima, Perú",
      coordenadas: {
        lat: -12.0432,
        lng: -77.0282
      },
      zona: "Lima Centro",
      neighborhood: "Lima Centro",
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      cacheBreaker: Date.now() // Para romper cualquier caché
    };

    await db.collection('services').doc('mgc-dental-health').set(updateData, { merge: true });
    
    console.log('✅ Datos actualizados con timestamp para romper caché');
    
    // Verificar la actualización
    const updatedDoc = await db.collection('services').doc('mgc-dental-health').get();
    const updatedData = updatedDoc.data();
    
    console.log('\n📋 Datos después de la actualización:');
    console.log('   Nombre:', updatedData.name);
    console.log('   Dirección:', updatedData.address);
    console.log('   Dirección completa:', updatedData.direccion_completa);
    console.log('   Coordenadas:', updatedData.coordenadas);
    console.log('   Zona:', updatedData.zona);
    console.log('   Barrio:', updatedData.neighborhood);
    console.log('   Cache Breaker:', updatedData.cacheBreaker);
    
    // Generar URLs para verificar
    const { lat, lng } = updatedData.coordenadas;
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    
    console.log('\n🗺️  URLs generadas:');
    console.log('   Mapa normal:', mapUrl);
    console.log('   Mapa embebido:', embedUrl);
    
    console.log('\n✅ Actualización completada. Refresca el navegador para ver los cambios.');
    
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
  }
}

forceRefreshMGC().then(() => process.exit(0));