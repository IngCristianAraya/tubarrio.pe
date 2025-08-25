// Script de diagnóstico para problemas de Firebase en Vercel
// Ejecutar en la consola del navegador en el sitio de producción

console.log('🔍 DIAGNÓSTICO DE FIREBASE EN VERCEL');
console.log('=====================================');

// Función para verificar variables de entorno
const checkEnvironmentVariables = () => {
  console.log('\n1. 📋 VERIFICANDO VARIABLES DE ENTORNO...');
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missingVars = [];
  const presentVars = [];
  
  requiredVars.forEach(varName => {
    // En el cliente, las variables NEXT_PUBLIC_ están disponibles en process.env
    const value = process.env[varName];
    if (!value || value === 'undefined') {
      missingVars.push(varName);
      console.log(`❌ ${varName}: NO CONFIGURADA`);
    } else {
      presentVars.push(varName);
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
    }
  });
  
  console.log(`\n📊 Resumen: ${presentVars.length}/${requiredVars.length} variables configuradas`);
  
  if (missingVars.length > 0) {
    console.log('\n🚨 VARIABLES FALTANTES EN VERCEL:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    return false;
  }
  
  return true;
};

// Función para verificar la inicialización de Firebase
const checkFirebaseInitialization = async () => {
  console.log('\n2. 🔥 VERIFICANDO INICIALIZACIÓN DE FIREBASE...');
  
  try {
    // Verificar si Firebase está disponible globalmente
    if (typeof window !== 'undefined') {
      console.log('✅ Entorno del navegador detectado');
    }
    
    // Intentar importar la configuración de Firebase
    const { db } = await import('./src/lib/firebase/config.js');
    
    if (!db) {
      console.log('❌ Base de datos Firestore no inicializada');
      console.log('💡 Esto indica que Firebase no se pudo conectar');
      return false;
    }
    
    console.log('✅ Firestore inicializado correctamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error al importar configuración de Firebase:', error);
    console.log('💡 Esto puede indicar un problema de configuración');
    return false;
  }
};

// Función para probar conexión a Firestore
const testFirestoreConnection = async () => {
  console.log('\n3. 🔗 PROBANDO CONEXIÓN A FIRESTORE...');
  
  try {
    const { db } = await import('./src/lib/firebase/config.js');
    
    if (!db) {
      console.log('❌ No se puede probar la conexión: Firestore no inicializado');
      return false;
    }
    
    const { collection, getDocs, limit, query } = await import('firebase/firestore');
    
    // Intentar leer una colección (esto probará la conexión)
    const testCollection = collection(db, 'services');
    const testQuery = query(testCollection, limit(1));
    
    console.log('🔄 Intentando conectar a Firestore...');
    const snapshot = await getDocs(testQuery);
    
    console.log('✅ Conexión a Firestore exitosa');
    console.log(`📊 Documentos encontrados: ${snapshot.size}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión a Firestore:', error);
    
    // Analizar el tipo de error
    if (error.code === 'permission-denied') {
      console.log('🔒 Error de permisos: Verificar reglas de Firestore');
    } else if (error.code === 'unavailable') {
      console.log('🌐 Error de red: Verificar conectividad');
    } else if (error.message.includes('auth')) {
      console.log('🔑 Error de autenticación: Verificar configuración de Firebase');
    } else {
      console.log('❓ Error desconocido: Verificar configuración general');
    }
    
    return false;
  }
};

// Función para verificar el dominio autorizado
const checkAuthorizedDomains = () => {
  console.log('\n4. 🌐 VERIFICANDO DOMINIO ACTUAL...');
  
  const currentDomain = window.location.hostname;
  const currentUrl = window.location.origin;
  
  console.log(`🔗 Dominio actual: ${currentDomain}`);
  console.log(`🔗 URL completa: ${currentUrl}`);
  
  // Lista de dominios que deberían estar autorizados
  const expectedDomains = [
    'localhost',
    'tubarrio-pe.vercel.app',
    'tubarriope.com',
    currentDomain
  ];
  
  console.log('\n📋 Dominios que deberían estar autorizados en Firebase:');
  expectedDomains.forEach(domain => {
    console.log(`   - ${domain}`);
  });
  
  if (currentDomain.includes('vercel.app') || currentDomain.includes('localhost')) {
    console.log('✅ Dominio parece válido para desarrollo/producción');
  } else {
    console.log('⚠️ Dominio personalizado detectado - verificar autorización en Firebase');
  }
};

// Función principal de diagnóstico
const runDiagnosis = async () => {
  console.log('🚀 Iniciando diagnóstico completo...\n');
  
  const envCheck = checkEnvironmentVariables();
  const firebaseCheck = await checkFirebaseInitialization();
  const connectionCheck = await testFirestoreConnection();
  checkAuthorizedDomains();
  
  console.log('\n🎯 RESUMEN DEL DIAGNÓSTICO');
  console.log('==========================');
  console.log(`Variables de entorno: ${envCheck ? '✅' : '❌'}`);
  console.log(`Inicialización Firebase: ${firebaseCheck ? '✅' : '❌'}`);
  console.log(`Conexión Firestore: ${connectionCheck ? '✅' : '❌'}`);
  
  if (!envCheck) {
    console.log('\n🔧 SOLUCIÓN PRINCIPAL: CONFIGURAR VARIABLES EN VERCEL');
    console.log('1. Ir a https://vercel.com/dashboard');
    console.log('2. Seleccionar el proyecto');
    console.log('3. Ir a Settings > Environment Variables');
    console.log('4. Agregar todas las variables NEXT_PUBLIC_FIREBASE_*');
    console.log('5. Hacer redeploy del proyecto');
  }
  
  if (envCheck && !firebaseCheck) {
    console.log('\n🔧 PROBLEMA DE CONFIGURACIÓN DE FIREBASE');
    console.log('1. Verificar que las variables de entorno sean correctas');
    console.log('2. Verificar la configuración en src/lib/firebase/config.ts');
    console.log('3. Revisar la consola por errores de inicialización');
  }
  
  if (firebaseCheck && !connectionCheck) {
    console.log('\n🔧 PROBLEMA DE CONEXIÓN O PERMISOS');
    console.log('1. Verificar reglas de Firestore en Firebase Console');
    console.log('2. Verificar que el dominio esté autorizado');
    console.log('3. Verificar conectividad de red');
  }
  
  if (envCheck && firebaseCheck && connectionCheck) {
    console.log('\n🎉 ¡TODO FUNCIONA CORRECTAMENTE!');
    console.log('Firebase está configurado y funcionando en producción.');
  }
};

// Ejecutar diagnóstico automáticamente
runDiagnosis();

// Hacer funciones disponibles globalmente
window.checkFirebaseVercel = runDiagnosis;
window.checkEnvVars = checkEnvironmentVariables;
window.testFirestore = testFirestoreConnection;

console.log('\n💡 FUNCIONES DISPONIBLES:');
console.log('- checkFirebaseVercel(): Ejecutar diagnóstico completo');
console.log('- checkEnvVars(): Verificar solo variables de entorno');
console.log('- testFirestore(): Probar solo conexión a Firestore');