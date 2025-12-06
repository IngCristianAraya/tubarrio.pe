/**
 * Script para agregar coordenadas de ejemplo a los servicios existentes
 * Esto permitirá que el componente ServiceMap muestre mapas reales
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

// Coordenadas de ejemplo para diferentes distritos de Lima
const sampleCoordinates = {
  'miraflores': { lat: -12.1191, lng: -77.0282 },
  'san-isidro': { lat: -12.0969, lng: -77.0378 },
  'barranco': { lat: -12.1404, lng: -77.0200 },
  'surco': { lat: -12.1356, lng: -76.9936 },
  'la-molina': { lat: -12.0792, lng: -76.9447 },
  'san-borja': { lat: -12.1089, lng: -77.0011 },
  'pueblo-libre': { lat: -12.0742, lng: -77.0636 },
  'magdalena': { lat: -12.0969, lng: -77.0742 },
  'jesus-maria': { lat: -12.0742, lng: -77.0478 },
  'lince': { lat: -12.0856, lng: -77.0378 },
  'lima-centro': { lat: -12.0464, lng: -77.0428 },
  'default': { lat: -12.0464, lng: -77.0428 } // Centro de Lima por defecto
};

// Direcciones completas de ejemplo
const sampleAddresses = {
  'mgc-dental-health': {
    coordenadas: { lat: -12.1191, lng: -77.0282 },
    direccion_completa: 'Av. Larco 345, Miraflores, Lima, Perú',
    zona: 'Miraflores Centro'
  }
};

async function addCoordinatesToServices() {
  try {
    console.log('🗺️  Iniciando proceso de agregar coordenadas a servicios...');
    
    // Obtener todos los servicios
    const servicesSnapshot = await db.collection('services').get();
    
    if (servicesSnapshot.empty) {
      console.log('❌ No se encontraron servicios en la base de datos');
      return;
    }

    console.log(`📍 Encontrados ${servicesSnapshot.size} servicios`);
    
    let updatedCount = 0;
    
    for (const doc of servicesSnapshot.docs) {
      const serviceData = doc.data();
      const serviceId = doc.id;
      
      console.log(`\n🔄 Procesando servicio: ${serviceData.name || serviceId}`);
      
      // Verificar si ya tiene coordenadas
      if (serviceData.coordenadas) {
        console.log(`   ✅ Ya tiene coordenadas: ${serviceData.coordenadas.lat}, ${serviceData.coordenadas.lng}`);
        continue;
      }
      
      let updateData = {};
      
      // Usar coordenadas específicas si están definidas
      if (sampleAddresses[serviceId]) {
        updateData = sampleAddresses[serviceId];
        console.log(`   📍 Usando coordenadas específicas para ${serviceId}`);
      } else {
        // Intentar determinar coordenadas basadas en el barrio/distrito
        let coordinates = sampleCoordinates.default;
        
        if (serviceData.neighborhood) {
          const neighborhood = serviceData.neighborhood.toLowerCase();
          for (const [key, coords] of Object.entries(sampleCoordinates)) {
            if (neighborhood.includes(key) || key.includes(neighborhood)) {
              coordinates = coords;
              break;
            }
          }
        }
        
        updateData = {
          coordenadas: coordinates,
          direccion_completa: serviceData.address || `${serviceData.neighborhood || 'Lima'}, Lima, Perú`,
          zona: serviceData.neighborhood || 'Lima Centro'
        };
        
        console.log(`   📍 Usando coordenadas basadas en ubicación: ${coordinates.lat}, ${coordinates.lng}`);
      }
      
      // Actualizar el servicio
      await doc.ref.update(updateData);
      updatedCount++;
      
      console.log(`   ✅ Servicio actualizado con coordenadas y dirección`);
    }
    
    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Servicios actualizados: ${updatedCount}`);
    console.log(`📊 Servicios que ya tenían coordenadas: ${servicesSnapshot.size - updatedCount}`);
    
  } catch (error) {
    console.error('❌ Error al agregar coordenadas:', error);
  }
}

// Ejecutar el script
addCoordinatesToServices()
  .then(() => {
    console.log('\n✅ Script ejecutado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  });