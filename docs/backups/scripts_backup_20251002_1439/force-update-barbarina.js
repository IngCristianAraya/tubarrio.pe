require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Verificar si ya está inicializado
if (!admin.apps.length) {
  try {
    // Intentar cargar el archivo de credenciales
    const serviceAccount = require('./tubarriope-7ed1d-firebase-adminsdk-fbsvc-ac9410401d.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'tubarriope-7ed1d'
    });
  } catch (error) {
    console.log('No se pudo cargar el archivo de credenciales, usando configuración por defecto');
    admin.initializeApp({
      projectId: 'tubarriope-7ed1d'
    });
  }
}

const db = admin.firestore();

async function forceUpdateBarbarina() {
  try {
    const docRef = db.collection('servicios').doc('barbarinastore');
    
    // Actualizar solo el timestamp para forzar una actualización
    await docRef.update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      // Asegurar que address esté correctamente establecido
      address: 'Santa paula 470'
    });
    
    console.log('✅ Servicio BarbarinaStore actualizado exitosamente');
    
    // Verificar los datos actualizados
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      console.log('\n=== DATOS ACTUALIZADOS ===');
      console.log('Address:', data.address);
      console.log('Reference:', data.reference);
      console.log('Location:', data.location);
      console.log('UpdatedAt:', data.updatedAt);
    }
    
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
  }
}

forceUpdateBarbarina();