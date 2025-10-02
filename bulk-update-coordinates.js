const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

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

async function bulkUpdateCoordinates() {
  try {
    console.log('🔄 Iniciando actualización masiva de coordenadas...\n');
    
    // Leer el archivo con las coordenadas correctas
    if (!fs.existsSync('services-coordinates-updated.json')) {
      console.log('❌ Archivo "services-coordinates-updated.json" no encontrado');
      console.log('📝 Debes crear este archivo basado en "services-coordinates-template.json"');
      console.log('💡 Llena los campos "correct_lat" y "correct_lng" con las coordenadas correctas');
      return;
    }
    
    const servicesData = JSON.parse(fs.readFileSync('services-coordinates-updated.json', 'utf8'));
    
    // Filtrar solo los servicios que tienen coordenadas correctas definidas
    const servicesToUpdate = servicesData.filter(service => 
      service.correct_lat !== null && 
      service.correct_lng !== null &&
      typeof service.correct_lat === 'number' &&
      typeof service.correct_lng === 'number'
    );
    
    console.log(`📊 Servicios a actualizar: ${servicesToUpdate.length} de ${servicesData.length} total\n`);
    
    if (servicesToUpdate.length === 0) {
      console.log('⚠️  No hay servicios con coordenadas correctas definidas');
      return;
    }
    
    // Actualizar cada servicio
    const batch = db.batch();
    let updateCount = 0;
    
    for (const service of servicesToUpdate) {
      const serviceRef = db.collection('services').doc(service.id);
      
      // Verificar que el servicio existe
      const doc = await serviceRef.get();
      if (!doc.exists) {
        console.log(`⚠️  Servicio "${service.name}" (${service.id}) no encontrado, saltando...`);
        continue;
      }
      
      // Preparar las nuevas coordenadas en formato array
      const newCoordinates = [service.correct_lat, service.correct_lng];
      
      batch.update(serviceRef, {
        coordenadas: newCoordinates,
        cacheBreaker: Date.now()
      });
      
      updateCount++;
      console.log(`✅ ${updateCount}. ${service.name}`);
      console.log(`   Coordenadas: [${service.correct_lat}, ${service.correct_lng}]`);
      console.log(`   Dirección: ${service.address}`);
      
      if (service.notes) {
        console.log(`   Notas: ${service.notes}`);
      }
      console.log('');
    }
    
    // Ejecutar todas las actualizaciones
    if (updateCount > 0) {
      console.log(`🚀 Ejecutando actualización de ${updateCount} servicios...`);
      await batch.commit();
      console.log('✅ Actualización masiva completada exitosamente!');
      
      // Crear reporte de actualización
      const report = {
        timestamp: new Date().toISOString(),
        updated_services: updateCount,
        total_services: servicesData.length,
        services: servicesToUpdate.map(s => ({
          id: s.id,
          name: s.name,
          new_coordinates: [s.correct_lat, s.correct_lng],
          notes: s.notes
        }))
      };
      
      fs.writeFileSync('coordinates-update-report.json', JSON.stringify(report, null, 2));
      console.log('📄 Reporte guardado en "coordinates-update-report.json"');
      
    } else {
      console.log('❌ No se pudo actualizar ningún servicio');
    }
    
  } catch (error) {
    console.error('❌ Error en actualización masiva:', error);
  }
}

bulkUpdateCoordinates().then(() => {
  console.log('🏁 Proceso completado');
  process.exit(0);
});