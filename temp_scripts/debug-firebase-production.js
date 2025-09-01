// Script de diagnóstico para Firebase en producción
// Ejecutar en la consola del navegador en el sitio de producción

console.log('🔍 Iniciando diagnóstico de Firebase en producción...');

// 1. Verificar variables de entorno
function checkEnvironmentVariables() {
  console.log('\n📋 Verificando variables de entorno:');
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  requiredVars.forEach(varName => {
    const value = window.location.hostname === 'localhost' 
      ? process?.env?.[varName] 
      : 'Variable no accesible en producción';
    console.log(`${varName}: ${value ? '✅ Configurada' : '❌ Faltante'}`);
  });
}

// 2. Verificar inicialización de Firebase
function checkFirebaseInitialization() {
  console.log('\n🔥 Verificando inicialización de Firebase:');
  
  try {
    // Verificar si Firebase está disponible globalmente
    if (typeof firebase !== 'undefined') {
      console.log('✅ Firebase SDK cargado');
      console.log('📱 Apps inicializadas:', firebase.apps?.length || 0);
    } else {
      console.log('❌ Firebase SDK no encontrado globalmente');
    }
    
    // Verificar Firestore
    if (window.db) {
      console.log('✅ Firestore inicializado');
      console.log('🏗️ Firestore app:', window.db.app?.name || 'default');
    } else {
      console.log('❌ Firestore no inicializado');
    }
  } catch (error) {
    console.error('❌ Error verificando Firebase:', error);
  }
}

// 3. Verificar conectividad de red
function checkNetworkConnectivity() {
  console.log('\n🌐 Verificando conectividad de red:');
  
  // Test de conectividad básica
  fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' })
    .then(() => console.log('✅ Conectividad a internet: OK'))
    .catch(() => console.log('❌ Problemas de conectividad a internet'));
    
  // Test específico de Firebase
  fetch('https://firestore.googleapis.com/', { mode: 'no-cors' })
    .then(() => console.log('✅ Conectividad a Firebase: OK'))
    .catch(() => console.log('❌ Problemas de conectividad a Firebase'));
}

// 4. Verificar configuración de dominio
function checkDomainConfiguration() {
  console.log('\n🌍 Verificando configuración de dominio:');
  
  const currentDomain = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const currentPort = window.location.port;
  
  console.log(`🏠 Dominio actual: ${currentDomain}`);
  console.log(`🔒 Protocolo: ${currentProtocol}`);
  console.log(`🚪 Puerto: ${currentPort || 'default'}`);
  
  // Verificar si es localhost
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
    console.log('⚠️ Ejecutándose en localhost - algunos errores son normales');
  } else {
    console.log('🌐 Ejecutándose en producción');
  }
}

// 5. Verificar errores de consola
function checkConsoleErrors() {
  console.log('\n🚨 Monitoreando errores de consola:');
  
  // Capturar errores futuros
  const originalError = console.error;
  console.error = function(...args) {
    if (args.some(arg => 
      typeof arg === 'string' && 
      (arg.includes('firebase') || arg.includes('firestore') || arg.includes('400'))
    )) {
      console.log('🔴 Error relacionado con Firebase detectado:', ...args);
    }
    originalError.apply(console, args);
  };
  
  console.log('✅ Monitor de errores activado');
}

// 6. Test de operación básica de Firestore
function testFirestoreOperation() {
  console.log('\n🧪 Probando operación básica de Firestore:');
  
  if (!window.db) {
    console.log('❌ No se puede probar - Firestore no inicializado');
    return;
  }
  
  try {
    // Intentar una operación simple
    const testCollection = window.db.collection('test');
    console.log('✅ Colección de prueba creada');
    
    // Intentar obtener documentos (esto puede fallar con 400 si hay problemas)
    testCollection.limit(1).get()
      .then(() => console.log('✅ Consulta de prueba exitosa'))
      .catch(error => {
        console.log('❌ Error en consulta de prueba:', error.code, error.message);
        if (error.code === 'permission-denied') {
          console.log('💡 Sugerencia: Verificar reglas de Firestore');
        } else if (error.message.includes('400')) {
          console.log('💡 Sugerencia: Problema de configuración o conectividad');
        }
      });
  } catch (error) {
    console.log('❌ Error configurando prueba:', error);
  }
}

// 7. Función principal
function runDiagnostic() {
  console.log('🚀 Ejecutando diagnóstico completo de Firebase...');
  
  checkEnvironmentVariables();
  checkFirebaseInitialization();
  checkNetworkConnectivity();
  checkDomainConfiguration();
  checkConsoleErrors();
  
  // Esperar un poco antes de probar Firestore
  setTimeout(() => {
    testFirestoreOperation();
    
    console.log('\n✅ Diagnóstico completado.');
    console.log('💡 Si ves errores 400 persistentes, verifica:');
    console.log('   1. Variables de entorno en la plataforma de hosting');
    console.log('   2. Dominios autorizados en Firebase Console');
    console.log('   3. Reglas de Firestore');
    console.log('   4. Estado del proyecto Firebase');
  }, 2000);
}

// Ejecutar automáticamente
runDiagnostic();

// Exportar funciones para uso manual
window.firebaseDiagnostic = {
  runDiagnostic,
  checkEnvironmentVariables,
  checkFirebaseInitialization,
  checkNetworkConnectivity,
  checkDomainConfiguration,
  testFirestoreOperation
};

console.log('\n🛠️ Funciones disponibles en window.firebaseDiagnostic');