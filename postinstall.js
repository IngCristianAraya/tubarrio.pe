const { execSync } = require('child_process');

console.log('🚀 Running simplified postinstall script...');

try {
  // Limpiar caché de npm
  console.log('\n🔧 Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // Instalar sharp con configuración específica
  console.log('\n🔧 Installing sharp with platform-specific settings...');
  execSync('npm install sharp@0.32.6 --no-save --force --ignore-scripts=false', { stdio: 'inherit' });
  
  // Reconstruir sharp
  console.log('\n🔧 Rebuilding sharp...');
  execSync('npm rebuild sharp --build-from-source', { stdio: 'inherit' });
  
  console.log('\n🎉 Postinstall script completed successfully!');
} catch (error) {
  console.error('\n❌ Postinstall script failed with error:', error);
  process.exit(1);
}
