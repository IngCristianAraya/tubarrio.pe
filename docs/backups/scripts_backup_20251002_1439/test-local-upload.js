// Script para probar la subida de imágenes local
// Ejecutar: node test-local-upload.js

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

console.log('🖼️ Probando subida de imágenes local...');
console.log('');

async function testLocalUpload() {
  try {
    // Buscar una imagen de prueba
    const testImagePaths = [
      path.join(__dirname, 'public', 'images', 'placeholder.jpg'),
      path.join(__dirname, 'public', 'images', 'placeholder-business.jpg'),
      path.join(__dirname, 'public', 'images', 'hero_001.webp')
    ];

    let testImagePath = null;
    for (const imagePath of testImagePaths) {
      if (fs.existsSync(imagePath)) {
        testImagePath = imagePath;
        break;
      }
    }

    if (!testImagePath) {
      console.log('❌ No se encontró ninguna imagen de prueba');
      console.log('   Coloca una imagen en public/images/ para probar');
      return;
    }

    console.log(`📸 Usando imagen de prueba: ${path.basename(testImagePath)}`);

    // Leer archivo
    const imageBuffer = fs.readFileSync(testImagePath);
    console.log(`📊 Tamaño del archivo: ${(imageBuffer.length / 1024).toFixed(2)} KB`);

    // Crear FormData
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: path.basename(testImagePath),
      contentType: 'image/jpeg'
    });

    console.log('🚀 Enviando imagen al endpoint...');

    // Hacer petición al endpoint
    const response = await fetch('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Imagen subida exitosamente');
      console.log('🔗 URL de la imagen:', result.imageUrl);
      console.log('📁 Nombre del archivo:', result.fileName);
      
      // Verificar que el archivo existe
      const uploadedFilePath = path.join(__dirname, 'public', result.imageUrl);
      if (fs.existsSync(uploadedFilePath)) {
        console.log('✅ Archivo guardado correctamente en:', uploadedFilePath);
      } else {
        console.log('❌ Archivo no encontrado en:', uploadedFilePath);
      }
      
      console.log('');
      console.log('🎉 ¡Prueba exitosa!');
      console.log('   La subida de imágenes local está funcionando');
      console.log('   Ahora puedes probar el formulario en el admin panel');
      
    } else {
      console.log('❌ Error en la respuesta:', result.error || 'Error desconocido');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.log('');
    console.log('🔧 Posibles soluciones:');
    console.log('1. Asegúrate de que el servidor esté corriendo (npm run dev)');
    console.log('2. Verifica que el endpoint /api/upload-image esté disponible');
    console.log('3. Revisa los permisos de escritura en public/uploads/');
  }
}

// Verificar que el servidor esté corriendo
fetch('http://localhost:3000')
  .then(() => {
    console.log('✅ Servidor detectado en http://localhost:3000');
    console.log('');
    testLocalUpload();
  })
  .catch(() => {
    console.log('❌ Servidor no detectado en http://localhost:3000');
    console.log('   Ejecuta "npm run dev" primero');
  });