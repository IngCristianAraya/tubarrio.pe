// Script de diagnóstico de Firebase para Node.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando diagnóstico de Firebase desde Node.js...');

// 1. Verificar archivo .env.local
function checkEnvFile() {
  console.log('\n📋 Verificando archivo .env.local:');
  
  const envPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const regex = new RegExp(`^${varName}=(.+)$`, 'm');
    const match = envContent.match(regex);
    
    if (match && match[1] && match[1].trim() !== '') {
      console.log(`✅ ${varName}: ${match[1].substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: No encontrada o vacía`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// 2. Verificar configuración de Firebase
function checkFirebaseConfig() {
  console.log('\n🔧 Verificando configuración de Firebase:');
  
  try {
    // Cargar variables de entorno
    require('dotenv').config({ path: '.env.local' });
    
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    console.log('📊 Configuración actual:');
    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        console.log(`  ${key}: ${value.substring(0, 20)}...`);
      } else {
        console.log(`  ${key}: ❌ No definido`);
      }
    });
    
    return config;
  } catch (error) {
    console.log('❌ Error al cargar configuración:', error.message);
    return null;
  }
}

// 3. Verificar archivo de configuración de Firebase
function checkFirebaseConfigFile() {
  console.log('\n📁 Verificando archivo de configuración:');
  
  const configPath = path.join(__dirname, 'src', 'lib', 'firebase', 'config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ Archivo config.ts no encontrado');
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Verificar importaciones
  if (configContent.includes('initializeApp') && configContent.includes('getFirestore')) {
    console.log('✅ Importaciones de Firebase correctas');
  } else {
    console.log('❌ Importaciones de Firebase incorrectas');
  }
  
  // Verificar si hay configuración del emulador
  if (configContent.includes('connectFirestoreEmulator')) {
    console.log('✅ Configuración del emulador presente');
  } else {
    console.log('⚠️ Configuración del emulador no encontrada');
  }
  
  return true;
}

// 4. Verificar dependencias de Firebase
function checkFirebaseDependencies() {
  console.log('\n📦 Verificando dependencias de Firebase:');
  
  const packagePath = path.join(__dirname, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json no encontrado');
    return false;
  }
  
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = { ...packageContent.dependencies, ...packageContent.devDependencies };
  
  const firebaseDeps = Object.keys(dependencies).filter(dep => dep.includes('firebase'));
  
  if (firebaseDeps.length > 0) {
    console.log('✅ Dependencias de Firebase encontradas:');
    firebaseDeps.forEach(dep => {
      console.log(`  ${dep}: ${dependencies[dep]}`);
    });
  } else {
    console.log('❌ No se encontraron dependencias de Firebase');
  }
  
  return firebaseDeps.length > 0;
}

// 5. Generar recomendaciones
function generateRecommendations(envValid, configValid, depsValid) {
  console.log('\n💡 Recomendaciones:');
  
  if (!envValid) {
    console.log('🔧 1. Verificar y completar variables de entorno en .env.local');
  }
  
  if (!configValid) {
    console.log('🔧 2. Verificar archivo de configuración de Firebase');
  }
  
  if (!depsValid) {
    console.log('🔧 3. Instalar dependencias de Firebase: npm install firebase');
  }
  
  console.log('🔧 4. Para errores 400 en producción:');
  console.log('   - Verificar que el dominio esté autorizado en Firebase Console');
  console.log('   - Verificar que las reglas de Firestore permitan las operaciones');
  console.log('   - Limpiar caché del navegador');
  console.log('   - Verificar que el proyecto Firebase no esté suspendido');
}

// Ejecutar diagnóstico completo
function runDiagnostic() {
  console.log('🚀 Ejecutando diagnóstico completo de Firebase...\n');
  
  const envValid = checkEnvFile();
  const config = checkFirebaseConfig();
  const configFileValid = checkFirebaseConfigFile();
  const depsValid = checkFirebaseDependencies();
  
  generateRecommendations(envValid, !!config, depsValid);
  
  console.log('\n✅ Diagnóstico completado.');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runDiagnostic();
}

module.exports = { runDiagnostic };