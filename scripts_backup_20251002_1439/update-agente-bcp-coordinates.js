const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Inicializar Firebase Admin
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

async function updateAgenteBCPCoordinates() {
  try {
    console.log('🔍 Actualizando coordenadas para Agente BCP...\n');
    
    // Coordenadas extraídas del enlace de Google Maps
    const correctCoordinates = [-12.063458, -77.0776606];
    const serviceId = 'agente-bcp';
    
    // Verificar datos actuales
    console.log('📋 Verificando datos actuales...');
    const docRef = db.collection('services').doc(serviceId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log('❌ Servicio no encontrado');
      return;
    }
    
    const currentData = doc.data();
    console.log('   Nombre:', currentData.name);
    console.log('   Dirección:', currentData.address);
    console.log('   Coordenadas actuales:', JSON.stringify(currentData.coordenadas));
    console.log('   Coordenadas correctas:', JSON.stringify(correctCoordinates));
    
    // Actualizar coordenadas
    console.log('\n🔄 Actualizando coordenadas...');
    await docRef.update({
      coordenadas: correctCoordinates,
      cacheBreaker: Date.now() // Para forzar actualización del mapa
    });
    
    console.log('✅ Coordenadas actualizadas exitosamente');
    
    // Verificar actualización
    console.log('\n🔍 Verificando actualización...');
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
    
    console.log('   Coordenadas después de actualización:', JSON.stringify(updatedData.coordenadas));
    console.log('   Cache breaker:', updatedData.cacheBreaker);
    
    // Generar URL del mapa
    const mapUrl = `https://www.google.com/maps?q=${correctCoordinates[0]},${correctCoordinates[1]}`;
    console.log('   Nueva URL del mapa:', mapUrl);
    
    console.log('\n🎉 Actualización completada para Agente BCP');
    
  } catch (error) {
    console.error('❌ Error al actualizar coordenadas:', error);
  }
}

// Ejecutar actualización
updateAgenteBCPCoordinates().then(() => {
  console.log('\n✨ Proceso completado');
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});