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

async function verifyMGCData() {
  try {
    console.log('🔍 Verificando datos actuales de MGC Dental Health...\n');
    
    const doc = await db.collection('services').doc('mgc-dental-health').get();
    
    if (!doc.exists) {
      console.log('❌ Servicio no encontrado');
      return;
    }
    
    const data = doc.data();
    
    console.log('📋 DATOS ACTUALES:');
    console.log('================');
    console.log('🏷️  ID:', doc.id);
    console.log('📝 Nombre:', data.nombre || data.name || 'No definido');
    console.log('📍 Dirección:', data.direccion || 'No definida');
    console.log('🗺️  Dirección completa:', data.direccion_completa || 'No definida');
    console.log('📌 Coordenadas:', data.coordenadas || 'No definidas');
    console.log('🏘️  Zona:', data.zona || 'No definida');
    console.log('🏠 Barrio:', data.neighborhood || 'No definido');
    
    // Verificar si las coordenadas son las correctas
    if (data.coordenadas) {
      const { lat, lng } = data.coordenadas;
      console.log('\n🎯 VERIFICACIÓN DE COORDENADAS:');
      console.log('===============================');
      console.log(`Latitud: ${lat}`);
      console.log(`Longitud: ${lng}`);
      
      // Coordenadas esperadas para Santa Nicerata 372, Lima
      const expectedLat = -12.0432;
      const expectedLng = -77.0282;
      
      const latMatch = Math.abs(lat - expectedLat) < 0.001;
      const lngMatch = Math.abs(lng - expectedLng) < 0.001;
      
      if (latMatch && lngMatch) {
        console.log('✅ Las coordenadas coinciden con Santa Nicerata 372, Lima');
      } else {
        console.log('❌ Las coordenadas NO coinciden con Santa Nicerata 372, Lima');
        console.log(`   Esperadas: ${expectedLat}, ${expectedLng}`);
        console.log(`   Actuales:  ${lat}, ${lng}`);
      }
    }
    
    // Generar URL del mapa para verificar
    if (data.coordenadas) {
      const { lat, lng } = data.coordenadas;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
      console.log('\n🗺️  URL DEL MAPA GENERADA:');
      console.log('=========================');
      console.log(mapUrl);
    }
    
  } catch (error) {
    console.error('❌ Error al verificar datos:', error);
  } finally {
    process.exit(0);
  }
}

verifyMGCData();