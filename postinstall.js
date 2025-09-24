const { execSync } = require('child_process');

console.log('Running postinstall script...');

try {
  // Forzar la instalación de sharp con la versión específica
  console.log('Installing sharp@0.34.4...');
  execSync('npm install sharp@0.34.4 --no-save --force', { stdio: 'inherit' });
  
  // Reconstruir sharp
  console.log('Rebuilding sharp...');
  execSync('npm rebuild sharp', { stdio: 'inherit' });
  
  console.log('Postinstall script completed successfully!');
} catch (error) {
  console.error('Postinstall script failed:', error);
  process.exit(1);
}
