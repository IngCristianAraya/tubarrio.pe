const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running postinstall script...');

// Función para ejecutar comandos con manejo de errores mejorado
const runCommand = (command, description) => {
  console.log(`\n🔧 ${description}...`);
  console.log(`$ ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    return false;
  }
};

// Función para eliminar directorios de manera segura
const removeDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Removing directory: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};

try {
  // 1. Limpiar todo lo relacionado con sharp e ipx
  console.log('\n🧹 Cleaning up...');
  removeDirectory(path.join(process.cwd(), 'node_modules/sharp'));
  removeDirectory(path.join(process.cwd(), 'node_modules/ipx'));
  removeDirectory(path.join(process.cwd(), 'node_modules/.cache'));
  removeDirectory(path.join(process.cwd(), 'node_modules/.vite'));
  
  // 2. Limpiar caché de npm
  runCommand('npm cache clean --force', 'Cleaning npm cache');
  
  // 3. Forzar la instalación de sharp con la versión específica
  runCommand('npm install sharp@0.34.4 --no-save --force --ignore-scripts=false', 'Installing sharp@0.34.4');
  
  // 4. Reconstruir sharp
  runCommand('npm rebuild sharp --build-from-source', 'Rebuilding sharp');
  
  // 5. Instalar ipx
  runCommand('npm install ipx@3.1.1 --no-save --force', 'Installing ipx@3.1.1');
  
  // 6. Reconstruir ipx
  runCommand('npm rebuild ipx --build-from-source', 'Rebuilding ipx');
  
  console.log('\n🎉 Postinstall script completed successfully!');
} catch (error) {
  console.error('\n❌ Postinstall script failed with error:', error);
  process.exit(1);
}
