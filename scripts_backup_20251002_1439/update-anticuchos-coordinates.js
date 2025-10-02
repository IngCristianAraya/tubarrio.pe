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

async function updateAntichucosCoordinates() {
  try {
    console.log('🔄 Actualizando coordenadas de Anticuchos Bran...');
    
    // Coordenadas correctas obtenidas de Google Maps
    const correctCoordinates = [-12.0660658, -77.0776155];
    
    // Verificar datos actuales
    const doc = await db.collection('services').doc('anticuchos-bran').get();
    if (doc.exists) {
      const currentData = doc.data();
      console.log('📋 Datos actuales:');
      console.log('   Coordenadas actuales:', currentData.coordenadas);
      console.log('   Dirección:', currentData.address);
      
      // Actualizar con las coordenadas correctas
      await db.collection('services').doc('anticuchos-bran').update({
        coordenadas: correctCoordinates,
        cacheBreaker: Date.now() // Para forzar actualización del cache
      });
      
      console.log('✅ Coordenadas actualizadas exitosamente:');
      console.log('   Nuevas coordenadas:', correctCoordinates);
      console.log('   Latitud:', correctCoordinates[0]);
      console.log('   Longitud:', correctCoordinates[1]);
      
      // Verificar la actualización
      const updatedDoc = await db.collection('services').doc('anticuchos-bran').get();
      const updatedData = updatedDoc.data();
      console.log('🔍 Verificación post-actualización:');
      console.log('   Coordenadas verificadas:', updatedData.coordenadas);
      console.log('   Cache breaker:', updatedData.cacheBreaker);
      
      // Generar URL del mapa para verificar
      const [lat, lng] = correctCoordinates;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=16`;
      console.log('🗺️  Nueva URL del mapa:', mapUrl);
      
    } else {
      console.log('❌ Servicio "anticuchos-bran" no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error al actualizar coordenadas:', error);
  }
}

updateAntichucosCoordinates().then(() => {
  console.log('🏁 Proceso completado');
  process.exit(0);
});