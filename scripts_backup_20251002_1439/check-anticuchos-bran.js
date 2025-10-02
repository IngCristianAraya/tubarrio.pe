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

async function checkAnticuchosBran() {
  try {
    console.log('🔍 Verificando datos del servicio Anticuchos Bran...\n');
    
    const doc = await db.collection('services').doc('anticuchos-bran').get();
    if (doc.exists) {
      const data = doc.data();
      
      console.log('📋 Datos actuales de Anticuchos Bran:');
      console.log('=====================================');
      console.log('   ID:', doc.id);
      console.log('   Nombre:', data.name);
      console.log('   Dirección original:', data.address);
      console.log('   Dirección completa:', data.direccion_completa);
      console.log('   Coordenadas actuales:', data.coordenadas);
      console.log('   Zona:', data.zona);
      console.log('   Barrio:', data.neighborhood);
      console.log('');
      
      // Dirección real reportada por el usuario
      const direccionReal = "Avenida Universitaria 1625, San Miguel, Lima, Perú";
      console.log('📍 Dirección real reportada:');
      console.log('   ', direccionReal);
      console.log('');
      
      // Comparar direcciones
      console.log('🔍 Comparación de direcciones:');
      console.log('   Dirección en BD (address):', data.address);
      console.log('   Dirección en BD (completa):', data.direccion_completa);
      console.log('   Dirección real:', direccionReal);
      console.log('');
      
      // Analizar coordenadas actuales
      if (data.coordenadas) {
        const { lat, lng } = data.coordenadas;
        console.log('🗺️  Coordenadas actuales:');
        console.log('   Latitud:', lat);
        console.log('   Longitud:', lng);
        console.log('   URL del mapa actual:', `https://www.google.com/maps?q=${lat},${lng}`);
        console.log('');
        
        // Generar URL para la dirección real
        const direccionEncoded = encodeURIComponent(direccionReal);
        console.log('🎯 URL para la dirección real:');
        console.log('   ', `https://www.google.com/maps?q=${direccionEncoded}`);
        console.log('');
        
        // Verificar si las direcciones coinciden
        const direccionBD = data.direccion_completa || data.address || '';
        const coincide = direccionBD.toLowerCase().includes('universitaria') && 
                        direccionBD.toLowerCase().includes('san miguel');
        
        console.log('⚠️  Análisis de coincidencia:');
        console.log('   ¿La dirección en BD menciona "Universitaria"?', direccionBD.toLowerCase().includes('universitaria'));
        console.log('   ¿La dirección en BD menciona "San Miguel"?', direccionBD.toLowerCase().includes('san miguel'));
        console.log('   ¿Coincide con la dirección real?', coincide ? '✅ SÍ' : '❌ NO');
        
        if (!coincide) {
          console.log('');
          console.log('🚨 PROBLEMA DETECTADO:');
          console.log('   Las coordenadas actuales NO corresponden a la dirección real.');
          console.log('   Se necesita actualizar las coordenadas para:');
          console.log('   ', direccionReal);
        }
      } else {
        console.log('❌ No se encontraron coordenadas para este servicio');
      }
      
    } else {
      console.log('❌ Servicio "anticuchos-bran" no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAnticuchosBran().then(() => process.exit(0));