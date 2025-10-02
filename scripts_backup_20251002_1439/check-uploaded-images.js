// Script simple para verificar servicios con imágenes subidas
const fs = require('fs');
const path = require('path');

// Función para verificar si un archivo existe
function checkImageExists(imagePath) {
  const fullPath = path.join(__dirname, 'public', imagePath);
  return fs.existsSync(fullPath);
}

// Función para listar archivos en el directorio de uploads
function listUploadedImages() {
  const uploadsDir = path.join(__dirname, 'public', 'uploads', 'services');
  
  console.log('🔍 Verificando imágenes subidas desde el panel admin...');
  console.log(`📁 Directorio: ${uploadsDir}`);
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ El directorio de uploads no existe');
    return [];
  }
  
  const files = fs.readdirSync(uploadsDir);
  console.log(`📊 Total de archivos encontrados: ${files.length}`);
  
  if (files.length > 0) {
    console.log('\n📷 Imágenes encontradas:');
    files.forEach((file, index) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`  ${index + 1}. ${file} (${sizeKB} KB)`);
    });
  }
  
  return files;
}

// Función para verificar si las imágenes son accesibles vía web
function checkImageAccessibility() {
  const uploadsDir = path.join(__dirname, 'public', 'uploads', 'services');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('\n❌ No se puede verificar accesibilidad - directorio no existe');
    return;
  }
  
  const files = fs.readdirSync(uploadsDir);
  
  console.log('\n🌐 URLs de acceso web:');
  files.forEach((file, index) => {
    const webUrl = `/uploads/services/${file}`;
    console.log(`  ${index + 1}. http://localhost:3000${webUrl}`);
  });
  
  console.log('\n💡 Puedes probar estas URLs en el navegador para verificar que las imágenes se cargan correctamente.');
}

// Función principal
function main() {
  console.log('🚀 Iniciando verificación de imágenes subidas...');
  
  const uploadedImages = listUploadedImages();
  
  if (uploadedImages.length > 0) {
    checkImageAccessibility();
    
    console.log('\n📋 Próximos pasos para diagnosticar:');
    console.log('  1. Verificar que las URLs de las imágenes se cargan en el navegador');
    console.log('  2. Revisar la base de datos Firebase para ver qué servicios usan estas imágenes');
    console.log('  3. Verificar el componente ServiceHeader para ver cómo procesa las imágenes');
    console.log('  4. Comprobar si hay errores en la consola del navegador');
  } else {
    console.log('\n⚠️  No se encontraron imágenes subidas.');
    console.log('   Esto podría indicar que:');
    console.log('   1. No se han creado servicios desde el panel admin');
    console.log('   2. El endpoint de upload no está funcionando');
    console.log('   3. Las imágenes se están guardando en otra ubicación');
  }
}

main();