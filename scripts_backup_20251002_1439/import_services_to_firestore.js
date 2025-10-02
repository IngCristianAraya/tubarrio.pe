// Script para importar servicios a Firestore con soporte para múltiples imágenes locales
// 1. Instala las dependencias: npm install firebase-admin
// 2. Coloca tu archivo services.json en la raíz del proyecto
// 3. Descarga tu archivo de credenciales de Firebase (serviceAccountKey.json) desde la consola de Firebase
// 4. Coloca las imágenes en /public/images/[id-servicio]/imagen.jpg
// 5. Ejecuta el script: node import_services_to_firestore.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Configuración de Firebase
const serviceAccount = require('./tubarriope-7ed1d-firebase-adminsdk-fbsvc-ac9410401d.json');

// Inicializar la aplicación de administración de Firebase
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Función para verificar si existe una imagen local
function getLocalImagePath(serviceId, imageName) {
  const imagePath = path.join('public', 'images', serviceId, imageName);
  return fs.existsSync(imagePath) ? `/images/${serviceId}/${imageName}` : null;
}

// Función para procesar un servicio
async function processService(service) {
  console.log(`\n📝 Procesando servicio: ${service.name} (${service.id})`);
  
  // Procesar imágenes locales si existen
  if (service.localImages && service.localImages.length > 0) {
    console.log(`📷 Procesando ${service.localImages.length} imágenes locales...`);
    
    const imageUrls = [];
    
    for (let i = 0; i < service.localImages.length; i++) {
      const imageName = path.basename(service.localImages[i]);
      const imageUrl = getLocalImagePath(service.id, imageName);
      
      if (imageUrl) {
        console.log(`✅ Imagen encontrada: ${imageUrl}`);
        imageUrls.push(imageUrl);
      } else {
        console.warn(`⚠️  No se encontró la imagen: ${service.localImages[i]}`);
      }
    }
    
    // Actualizar el servicio con las rutas de las imágenes
    if (imageUrls.length > 0) {
      service.images = imageUrls;
      // La primera imagen será la imagen principal
      service.image = imageUrls[0];
    } else {
      console.warn(`⚠️  No se encontraron imágenes para ${service.name}`);
    }
  }
  
  // Asegurar que siempre exista el campo images
  if (!service.images) {
    service.images = [];
  }
  
  // Agregar metadatos del plan
  service.plan = service.images.length > 1 ? 'premium' : 'básico';
  service.lastUpdated = admin.firestore.FieldValue.serverTimestamp();
  
  // Asegurar que el ID del servicio esté en minúsculas
  if (service.id) {
    service.id = service.id.toLowerCase();
  }
  
  return service;
}

// Función principal de importación
async function importServices() {
  try {
    // Leer el archivo JSON
    const services = JSON.parse(fs.readFileSync('./services.json', 'utf8'));
    
    // Procesar cada servicio
    for (const service of services) {
      try {
        console.log(`\n📝 Procesando servicio: ${service.name} (${service.id})`);
        const processedService = await processService(service);
        await db.collection('services').doc(service.id).set(processedService, { merge: true });
        console.log(`✅ Servicio ${service.id} actualizado correctamente`);
      } catch (error) {
        console.error(`❌ Error procesando ${service.id}:`, error.message);
      }
    }
    
    console.log('\n🎉 ¡Importación completada con éxito!');
  } catch (error) {
    console.error('❌ Error en la importación:', error);
  } finally {
    // Cerrar la conexión
    process.exit(0);
  }
}

// Ejecutar la importación
importServices();
