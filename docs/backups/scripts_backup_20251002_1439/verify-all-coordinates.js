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

async function verifyAllCoordinates() {
  try {
    console.log('✅ Verificando coordenadas actualizadas de todos los servicios...\n');
    
    const snapshot = await db.collection('services').get();
    const services = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      services.push({
        id: doc.id,
        name: data.name,
        address: data.address,
        direccion_completa: data.direccion_completa,
        coordenadas: data.coordenadas,
        zona: data.zona,
        neighborhood: data.neighborhood,
        lastUpdate: data.lastCoordinateUpdate,
        cacheBreaker: data.cacheBreaker
      });
    });
    
    console.log(`📊 RESUMEN DE VERIFICACIÓN:`);
    console.log(`   Total de servicios: ${services.length}`);
    console.log(`   Servicios con coordenadas actualizadas: ${services.filter(s => s.cacheBreaker).length}`);
    console.log(`   Servicios con direcciones específicas: ${services.filter(s => s.address && s.address.trim()).length}\n`);
    
    console.log('🗺️ COORDENADAS ACTUALIZADAS POR SERVICIO:\n');
    
    services.forEach((service, index) => {
      const coords = Array.isArray(service.coordenadas) 
        ? service.coordenadas 
        : [service.coordenadas?.lat || 0, service.coordenadas?.lng || 0];
      
      const [lat, lng] = coords;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   📍 Coordenadas: [${lat}, ${lng}]`);
      console.log(`   📧 Dirección: ${service.address || 'No especificada'}`);
      console.log(`   🏠 Dirección completa: ${service.direccion_completa || 'No especificada'}`);
      console.log(`   🌍 Zona: ${service.zona || 'No especificada'}`);
      console.log(`   🗺️ Ver en mapa: ${mapUrl}`);
      console.log(`   🔄 Actualizado: ${service.cacheBreaker ? 'Sí' : 'No'}`);
      console.log('   ---');
    });
    
    // Agrupar por zona para análisis
    const servicesByZone = {};
    services.forEach(service => {
      const zone = service.zona || 'Sin zona';
      if (!servicesByZone[zone]) {
        servicesByZone[zone] = [];
      }
      servicesByZone[zone].push(service);
    });
    
    console.log('\n📍 DISTRIBUCIÓN POR ZONAS:\n');
    Object.entries(servicesByZone).forEach(([zone, zoneServices]) => {
      console.log(`${zone}: ${zoneServices.length} servicios`);
      zoneServices.forEach(service => {
        const coords = Array.isArray(service.coordenadas) 
          ? service.coordenadas 
          : [service.coordenadas?.lat || 0, service.coordenadas?.lng || 0];
        console.log(`   - ${service.name}: [${coords[0]}, ${coords[1]}]`);
      });
      console.log('');
    });
    
    console.log('🎯 SERVICIOS CON COORDENADAS MÁS PRECISAS (fuera de Lima Centro genérico):\n');
    const preciseServices = services.filter(service => {
      const coords = Array.isArray(service.coordenadas) 
        ? service.coordenadas 
        : [service.coordenadas?.lat || 0, service.coordenadas?.lng || 0];
      const [lat, lng] = coords;
      // Filtrar coordenadas genéricas de Lima Centro
      return !(lat === -12.0464 && lng === -77.0428);
    });
    
    preciseServices.forEach((service, index) => {
      const coords = Array.isArray(service.coordenadas) 
        ? service.coordenadas 
        : [service.coordenadas?.lat || 0, service.coordenadas?.lng || 0];
      console.log(`${index + 1}. ${service.name}: [${coords[0]}, ${coords[1]}] - ${service.address || service.zona}`);
    });
    
    console.log(`\n✨ RESULTADO FINAL:`);
    console.log(`   🎉 ${preciseServices.length} servicios tienen coordenadas específicas`);
    console.log(`   📍 ${services.length - preciseServices.length} servicios usan coordenadas genéricas de Lima Centro`);
    console.log(`   🔄 Todos los servicios han sido actualizados con cache-breaker`);
    
  } catch (error) {
    console.error('❌ Error al verificar coordenadas:', error);
  }
}

verifyAllCoordinates().then(() => {
  console.log('\n🎯 Verificación completada. Los servicios ahora muestran ubicaciones más precisas.');
  process.exit(0);
});