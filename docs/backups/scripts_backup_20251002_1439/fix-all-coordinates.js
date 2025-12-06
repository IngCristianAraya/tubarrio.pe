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

// Mapeo manual de coordenadas precisas basado en direcciones conocidas de San Miguel
const coordinatesMap = {
  // Calles principales de San Miguel - Zona Pando
  'santa nicerata': [-12.0776, -77.0865],
  'santa teodosia': [-12.0780, -77.0870],
  'santa mariana': [-12.0785, -77.0875],
  'santa paula': [-12.0775, -77.0860],
  
  // Avenidas principales
  'avenida universitaria': [-12.0850, -77.0950], // San Miguel - Universitaria
  'cafe tacuba': [-12.0790, -77.0880], // Zona comercial San Miguel
  
  // Coordenadas por zona/barrio
  'pando 3ra etapa': [-12.0780, -77.0870],
  'pando 3ra etaoa': [-12.0780, -77.0870], // Typo corregido
  'lima centro': [-12.0464, -77.0428], // Mantener para servicios sin dirección específica
};

function getCoordinatesForAddress(address, fullAddress, zone, neighborhood) {
  // Normalizar texto para búsqueda
  const normalize = (text) => text ? text.toLowerCase().trim() : '';
  
  const normalizedAddress = normalize(address);
  const normalizedFullAddress = normalize(fullAddress);
  const normalizedZone = normalize(zone);
  const normalizedNeighborhood = normalize(neighborhood);
  
  // Buscar por calle específica en la dirección
  for (const [street, coords] of Object.entries(coordinatesMap)) {
    if (normalizedAddress.includes(street) || normalizedFullAddress.includes(street)) {
      return coords;
    }
  }
  
  // Buscar por zona o barrio
  if (normalizedZone && coordinatesMap[normalizedZone]) {
    return coordinatesMap[normalizedZone];
  }
  
  if (normalizedNeighborhood && coordinatesMap[normalizedNeighborhood]) {
    return coordinatesMap[normalizedNeighborhood];
  }
  
  // Si no encuentra coincidencia específica, usar coordenadas de Lima Centro
  return coordinatesMap['lima centro'];
}

async function fixAllCoordinates() {
  try {
    console.log('🔧 Iniciando corrección masiva de coordenadas...\n');
    
    const snapshot = await db.collection('services').get();
    const updates = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const serviceId = doc.id;
      
      // Obtener coordenadas precisas
      const newCoords = getCoordinatesForAddress(
        data.address,
        data.direccion_completa,
        data.zona,
        data.neighborhood
      );
      
      // Preparar actualización
      const updateData = {
        coordenadas: newCoords,
        // Agregar timestamp para invalidar cache
        lastCoordinateUpdate: admin.firestore.FieldValue.serverTimestamp(),
        cacheBreaker: Date.now()
      };
      
      // Mejorar dirección completa si es necesaria
      if (!data.direccion_completa || data.direccion_completa === 'Lima, Lima, Perú') {
        if (data.address) {
          updateData.direccion_completa = `${data.address}, San Miguel, Lima, Perú`;
        }
      }
      
      updates.push({
        id: serviceId,
        name: data.name,
        oldCoords: data.coordenadas,
        newCoords: newCoords,
        address: data.address,
        updateData: updateData
      });
    }
    
    console.log(`📋 Preparando actualización de ${updates.length} servicios:\n`);
    
    // Mostrar preview de cambios
    updates.forEach((update, index) => {
      console.log(`${index + 1}. ${update.name}`);
      console.log(`   ID: ${update.id}`);
      console.log(`   Dirección: ${update.address}`);
      console.log(`   Coordenadas anteriores: ${JSON.stringify(update.oldCoords)}`);
      console.log(`   Coordenadas nuevas: ${JSON.stringify(update.newCoords)}`);
      console.log('   ---');
    });
    
    console.log('\n🚀 Ejecutando actualizaciones...\n');
    
    // Ejecutar actualizaciones en lotes
    const batch = db.batch();
    let batchCount = 0;
    
    for (const update of updates) {
      const docRef = db.collection('services').doc(update.id);
      batch.update(docRef, update.updateData);
      batchCount++;
      
      // Ejecutar lote cada 500 operaciones (límite de Firestore)
      if (batchCount >= 500) {
        await batch.commit();
        console.log(`✅ Lote de ${batchCount} actualizaciones completado`);
        batchCount = 0;
      }
    }
    
    // Ejecutar lote final si hay operaciones pendientes
    if (batchCount > 0) {
      await batch.commit();
      console.log(`✅ Lote final de ${batchCount} actualizaciones completado`);
    }
    
    console.log(`\n🎉 ¡Corrección completada exitosamente!`);
    console.log(`   Total de servicios actualizados: ${updates.length}`);
    console.log(`   Todos los servicios ahora tienen coordenadas más precisas`);
    
    // Generar URLs de muestra para verificación
    console.log('\n🗺️ URLs de verificación (primeros 5 servicios):');
    updates.slice(0, 5).forEach((update, index) => {
      const [lat, lng] = update.newCoords;
      console.log(`${index + 1}. ${update.name}: https://www.google.com/maps?q=${lat},${lng}`);
    });
    
  } catch (error) {
    console.error('❌ Error al corregir coordenadas:', error);
  }
}

fixAllCoordinates().then(() => {
  console.log('\n🎯 Proceso completado. Refresca el navegador para ver los cambios.');
  process.exit(0);
});