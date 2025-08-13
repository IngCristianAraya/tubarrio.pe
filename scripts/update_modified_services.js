// Script para actualizar solo los servicios modificados en Firestore
// 1. Instala las dependencias: npm install firebase-admin
// 2. Ejecuta: node scripts/update_modified_services.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Configuración de Firebase
const serviceAccount = require('../tubarriope-7ed1d-firebase-adminsdk-fbsvc-ac9410401d.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Función para calcular el hash de un objeto (para detectar cambios)
function getObjectHash(obj) {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Función para verificar si existe una imagen local
function getLocalImagePath(serviceId, imageName) {
  const imagePath = path.join('public', 'images', serviceId, imageName);
  return fs.existsSync(imagePath) ? `/images/${serviceId}/${imageName}` : null;
}

// Función para procesar un servicio
async function processService(service) {
  console.log(`📝 Procesando servicio: ${service.name} (${service.id})`);
  
  // Procesar imágenes locales
  if (service.localImages?.length > 0) {
    console.log(`📷 Procesando ${service.localImages.length} imágenes locales...`);
    const imageUrls = [];
    
    for (const img of service.localImages) {
      const imageName = path.basename(img);
      const imageUrl = getLocalImagePath(service.id, imageName);
      
      if (imageUrl) {
        console.log(`✅ Imagen encontrada: ${imageUrl}`);
        imageUrls.push(imageUrl);
      } else {
        console.warn(`⚠️  No se encontró la imagen: ${img}`);
      }
    }
    
    if (imageUrls.length > 0) {
      service.images = imageUrls;
      service.image = imageUrls[0];
    }
  }
  
  // Asegurar campos obligatorios
  service.images = service.images || [];
  service.plan = service.images.length > 1 ? 'premium' : 'básico';
  service.lastUpdated = admin.firestore.FieldValue.serverTimestamp();
  service.id = (service.id || '').toLowerCase();
  
  return service;
}

// Función para verificar si un servicio necesita actualización
async function needsUpdate(serviceId, newService) {
  try {
    const doc = await db.collection('services').doc(serviceId).get();
    if (!doc.exists) return true; // Nuevo servicio
    
    const existing = doc.data();
    const existingHash = getObjectHash({
      ...existing,
      lastUpdated: null, // Excluir campos que siempre cambian
      _hash: null
    });
    
    const newHash = getObjectHash({
      ...newService,
      lastUpdated: null,
      _hash: null
    });
    
    return existingHash !== newHash;
  } catch (error) {
    console.error(`❌ Error verificando ${serviceId}:`, error.message);
    return true; // En caso de error, forzar actualización
  }
}

// Función principal
async function updateModifiedServices() {
  try {
    // Leer servicios del JSON
    const services = JSON.parse(fs.readFileSync('./services.json', 'utf8'));
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    console.log(`\n🔄 Procesando ${services.length} servicios...`);
    
    for (const service of services) {
      try {
        const processedService = await processService(service);
        const serviceId = processedService.id;
        
        if (await needsUpdate(serviceId, processedService)) {
          await db.collection('services').doc(serviceId).set(processedService, { merge: true });
          console.log(`✅ Actualizado: ${service.name} (${serviceId})`);
          updated++;
        } else {
          console.log(`⏭️  Sin cambios: ${service.name}`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error con ${service.id}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`✅ Actualizados: ${updated}`);
    console.log(`⏭️  Sin cambios: ${skipped}`);
    console.log(`❌ Errores: ${errors}`);
    console.log('\n🎉 ¡Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar
updateModifiedServices();
