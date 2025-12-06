// Script de diagnóstico para Firebase en entorno local (Node.js)
// Ejecutar con: node debug-firebase-local.js

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO FIREBASE - ENTORNO LOCAL');
console.log('======================================');

// 1. Verificar archivo .env.local
console.log('\n📋 ARCHIVO .env.local:');
const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env.local encontrado');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('\n🔑 Variables encontradas:');
  const firebaseVars = envLines.filter(line => line.includes('FIREBASE'));
  
  if (firebaseVars.length > 0) {
    firebaseVars.forEach(line => {
      const [key, value] = line.split('=');
      const maskedValue = value ? value.substring(0, 10) + '...' : 'undefined';
      console.log(`✅ ${key}: ${maskedValue}`);
    });
  } else {
    console.log('❌ No se encontraron variables FIREBASE en .env.local');
  }
  
  // Verificar otras variables importantes
  const otherVars = ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_DISABLE_FIREBASE', 'NODE_ENV'];
  console.log('\n🌐 Otras variables:');
  otherVars.forEach(varName => {
    const line = envLines.find(l => l.startsWith(varName));
    if (line) {
      const [key, value] = line.split('=');
      console.log(`✅ ${key}: ${value}`);
    } else {
      console.log(`❌ ${varName}: no encontrada`);
    }
  });
  
} else {
  console.log('❌ Archivo .env.local NO encontrado');
}

// 2. Verificar configuración de Firebase
console.log('\n🔧 CONFIGURACIÓN FIREBASE:');
const configPath = path.join(__dirname, 'src', 'lib', 'firebase', 'config.ts');

if (fs.existsSync(configPath)) {
  console.log('✅ Archivo de configuración encontrado');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Verificar estructura de configuración
  const hasApiKey = configContent.includes('NEXT_PUBLIC_FIREBASE_API_KEY');
  const hasAuthDomain = configContent.includes('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  const hasProjectId = configContent.includes('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  const hasAppId = configContent.includes('NEXT_PUBLIC_FIREBASE_APP_ID');
  
  console.log('📋 Estructura de configuración:');
  console.log(`${hasApiKey ? '✅' : '❌'} API Key configurada`);
  console.log(`${hasAuthDomain ? '✅' : '❌'} Auth Domain configurada`);
  console.log(`${hasProjectId ? '✅' : '❌'} Project ID configurada`);
  console.log(`${hasAppId ? '✅' : '❌'} App ID configurada`);
  
  // Verificar fallback de Project ID
  const hasFallback = configContent.includes("'tubarriope-7ed1d'");
  console.log(`${hasFallback ? '✅' : '❌'} Fallback Project ID presente`);
  
} else {
  console.log('❌ Archivo de configuración NO encontrado');
}

// 3. Verificar reglas de Firestore
console.log('\n🛡️ REGLAS DE FIRESTORE:');
const rulesPath = path.join(__dirname, 'firestore.rules');

if (fs.existsSync(rulesPath)) {
  console.log('✅ Archivo firestore.rules encontrado');
  
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  
  // Verificar permisos
  const allowRead = rulesContent.includes('allow read: if true');
  const allowWrite = rulesContent.includes('allow write: if true');
  
  console.log(`${allowRead ? '✅' : '❌'} Lectura permitida`);
  console.log(`${allowWrite ? '✅' : '❌'} Escritura permitida`);
  
  if (allowRead && allowWrite) {
    console.log('⚠️ ADVERTENCIA: Reglas muy permisivas (solo para desarrollo)');
  }
  
} else {
  console.log('❌ Archivo firestore.rules NO encontrado');
}

// 4. Verificar package.json y dependencias
console.log('\n📦 DEPENDENCIAS:');
const packagePath = path.join(__dirname, 'package.json');

if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const firebaseDeps = Object.keys(packageContent.dependencies || {})
    .filter(dep => dep.includes('firebase'));
  
  if (firebaseDeps.length > 0) {
    console.log('✅ Dependencias Firebase encontradas:');
    firebaseDeps.forEach(dep => {
      console.log(`  📦 ${dep}: ${packageContent.dependencies[dep]}`);
    });
  } else {
    console.log('❌ No se encontraron dependencias Firebase');
  }
} else {
  console.log('❌ package.json NO encontrado');
}

// 5. Verificar servidor de desarrollo
console.log('\n🚀 SERVIDOR DE DESARROLLO:');
const { exec } = require('child_process');

exec('netstat -ano | findstr :3000', (error, stdout, stderr) => {
  if (stdout && stdout.trim()) {
    console.log('✅ Servidor en puerto 3000 detectado');
    console.log('🌐 URL local: http://localhost:3000');
  } else {
    console.log('❌ No se detectó servidor en puerto 3000');
    console.log('💡 Ejecuta: npm run dev');
  }
});

// 6. Resumen y recomendaciones
console.log('\n📝 PRÓXIMOS PASOS:');
console.log('1. Verificar que todas las variables estén en .env.local');
console.log('2. Ejecutar npm run dev si no está corriendo');
console.log('3. Abrir http://localhost:3000 en el navegador');
console.log('4. Ejecutar debug-firebase-production-issue.js en la consola del navegador');
console.log('5. Comparar resultados con producción');

console.log('\n🔗 COMANDOS ÚTILES:');
console.log('- Verificar servidor: netstat -ano | findstr :3000');
console.log('- Iniciar servidor: npm run dev');
console.log('- Ver logs: npm run dev --verbose');

console.log('\n✅ Diagnóstico local completado');