const { execSync } = require('child_process');

console.log('Running postinstall script...');

try {
  // Limpiar caché de npm
  console.log('Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // Forzar la instalación de sharp con la versión específica
  console.log('Installing sharp@0.34.4...');
  execSync('npm install sharp@0.34.4 --no-save --force --ignore-scripts=false', { stdio: 'inherit' });
  
  // Reconstruir sharp
  console.log('Rebuilding sharp...');
  execSync('npm rebuild sharp --build-from-source', { stdio: 'inherit' });
  
  // Reconstruir ipx
  console.log('Rebuilding ipx...');
  execSync('npm rebuild ipx --build-from-source', { stdio: 'inherit' });

  console.log('Postinstall script completed successfully!');
} catch (error) {
  console.error('Postinstall script failed:', error);
  process.exit(1);
}
