// Script para verificar los datos del servicio de prueba
const fs = require('fs');
const https = require('https');
const http = require('http');

// Función para hacer una petición HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Error parsing JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Función principal
async function checkTestService() {
  try {
    console.log('🔍 Verificando el servicio de prueba...');
    
    // Hacer petición a la API local para obtener el servicio
    const apiUrl = 'http://localhost:3000/api/services/servicio-de-prueba';
    console.log(`📡 Consultando: ${apiUrl}`);
    
    const serviceData = await makeRequest(apiUrl);
    
    console.log('\n📋 Datos del servicio de prueba:');
    console.log(`  🏷️  Nombre: ${serviceData.name}`);
    console.log(`  🆔 ID: ${serviceData.id}`);
    
    // Verificar imagen principal
    if (serviceData.image) {
      console.log(`\n📷 Imagen principal:`);
      console.log(`  URL: ${serviceData.image}`);
      console.log(`  Tipo: ${serviceData.image.startsWith('/uploads/services/') ? 'Subida desde admin' : 'Externa'}`);
    } else {
      console.log('\n❌ No tiene imagen principal');
    }
    
    // Verificar array de imágenes
    if (serviceData.images && serviceData.images.length > 0) {
      console.log(`\n🖼️  Array de imágenes (${serviceData.images.length}):`);
      serviceData.images.forEach((img, index) => {
        const isUploaded = img.startsWith('/uploads/services/');
        const isValid = img && img !== 'none' && img !== '' && img !== 'null' && img !== 'undefined' && !img.includes('invalid') && (img.startsWith('http') || img.startsWith('/'));
        console.log(`  ${index + 1}. ${img}`);
        console.log(`     - Tipo: ${isUploaded ? 'Subida desde admin' : 'Externa'}`);
        console.log(`     - Válida: ${isValid ? 'Sí' : 'No'}`);
      });
    } else {
      console.log('\n❌ No tiene array de imágenes o está vacío');
    }
    
    // Simular la lógica del componente ServiceHeader
    console.log('\n🔧 Simulando lógica del componente ServiceHeader:');
    
    const isValidImage = (imageUrl) => {
      return imageUrl && 
             imageUrl !== 'none' && 
             imageUrl !== '' && 
             imageUrl !== 'null' && 
             imageUrl !== 'undefined' &&
             !imageUrl.includes('invalid') &&
             (imageUrl.startsWith('http') || imageUrl.startsWith('/'));
    };
    
    const validImages = serviceData.images && serviceData.images.length > 0 
      ? serviceData.images.filter(isValidImage)
      : serviceData.image && isValidImage(serviceData.image)
        ? [serviceData.image]
        : [];
        
    const finalImages = validImages.length > 0 
      ? validImages 
      : ['/images/placeholder-service.jpg'];
    
    console.log(`  📊 Imágenes válidas encontradas: ${validImages.length}`);
    console.log(`  🖼️  Imágenes finales que se mostrarán:`);
    finalImages.forEach((img, index) => {
      console.log(`    ${index + 1}. ${img}`);
    });
    
    if (finalImages.length === 1 && finalImages[0] === '/images/placeholder-service.jpg') {
      console.log('\n⚠️  PROBLEMA IDENTIFICADO: Se está usando la imagen placeholder');
      console.log('   Esto significa que no se encontraron imágenes válidas.');
      
      if (serviceData.images && serviceData.images.length > 0) {
        console.log('\n🔍 Analizando por qué las imágenes no son válidas:');
        serviceData.images.forEach((img, index) => {
          console.log(`\n  Imagen ${index + 1}: ${img}`);
          console.log(`    - Existe: ${img ? 'Sí' : 'No'}`);
          console.log(`    - No es 'none': ${img !== 'none'}`);
          console.log(`    - No está vacía: ${img !== ''}`);
          console.log(`    - No es 'null': ${img !== 'null'}`);
          console.log(`    - No es 'undefined': ${img !== 'undefined'}`);
          console.log(`    - No contiene 'invalid': ${!img.includes('invalid')}`);
          console.log(`    - Empieza con http o /: ${img.startsWith('http') || img.startsWith('/')}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('  1. El servidor de desarrollo esté ejecutándose (npm run dev)');
    console.log('  2. El servicio "servicio-de-prueba" exista en Firebase');
    console.log('  3. La API esté funcionando correctamente');
  }
}

checkTestService();