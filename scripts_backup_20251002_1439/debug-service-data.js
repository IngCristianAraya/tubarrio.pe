const admin = require('firebase-admin');
const fs = require('fs');

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

async function debugServiceData() {
  try {
    const docRef = db.collection('servicios').doc('barbarinastore');
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      
      console.log('=== ANÁLISIS DETALLADO DE CAMPOS ===');
      console.log('address:', JSON.stringify(data.address));
      console.log('address type:', typeof data.address);
      console.log('address length:', data.address ? data.address.length : 'N/A');
      console.log('address trimmed:', data.address ? JSON.stringify(data.address.trim()) : 'N/A');
      console.log('');
      
      console.log('reference:', JSON.stringify(data.reference));
      console.log('reference type:', typeof data.reference);
      console.log('reference === "NO DEFINIDO":', data.reference === 'NO DEFINIDO');
      console.log('');
      
      console.log('location:', JSON.stringify(data.location));
      console.log('location type:', typeof data.location);
      console.log('');
      
      console.log('=== CONDICIONES DE RENDERIZADO ===');
      const hasAddress = !!(data.address && data.address.trim() !== '');
      const hasValidReference = !!(data.reference && data.reference !== 'NO DEFINIDO' && data.reference.trim() !== '');
      const shouldShowLocation = (!data.address || data.address.trim() === '') && !!data.location;
      
      console.log('hasAddress:', hasAddress);
      console.log('hasValidReference:', hasValidReference);
      console.log('shouldShowLocation:', shouldShowLocation);
      
      console.log('');
      console.log('=== QUÉ DEBERÍA MOSTRARSE ===');
      if (hasAddress) {
        console.log('✅ Debería mostrar address:', data.address);
      }
      if (hasValidReference) {
        console.log('✅ Debería mostrar reference:', data.reference);
      }
      if (shouldShowLocation) {
        console.log('✅ Debería mostrar location:', data.location);
      }
      
      if (!hasAddress && !hasValidReference && !shouldShowLocation) {
        console.log('❌ No debería mostrar nada en ubicación');
      }
      
    } else {
      console.log('❌ Documento no encontrado');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugServiceData();