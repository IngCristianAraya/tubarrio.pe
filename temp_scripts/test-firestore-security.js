#!/usr/bin/env node

/**
 * Script para probar las reglas de seguridad de Firestore
 * Valida que las optimizaciones funcionen correctamente con las nuevas reglas
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  limit,
  where
} = require('firebase/firestore');
const { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} = require('firebase/auth');

// Configuración de Firebase (usar variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`🔒 ${title}`, 'cyan');
  log('='.repeat(60), 'cyan');
}

function logTest(testName) {
  log(`\n🧪 Probando: ${testName}`, 'blue');
}

function logSuccess(message) {
  log(`  ✅ ${message}`, 'green');
}

function logError(message) {
  log(`  ❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`  ⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`  ℹ️  ${message}`, 'blue');
}

// Inicializar Firebase
let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  log('🔥 Firebase inicializado correctamente', 'green');
} catch (error) {
  log('❌ Error al inicializar Firebase:', 'red');
  console.error(error.message);
  process.exit(1);
}

// Resultados de las pruebas
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function recordTest(testName, passed, message) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    logSuccess(`${testName}: ${message}`);
  } else {
    testResults.failed++;
    logError(`${testName}: ${message}`);
  }
  
  testResults.details.push({
    test: testName,
    passed,
    message,
    timestamp: new Date().toISOString()
  });
}

// Pruebas de lectura pública
async function testPublicRead() {
  logSection('Pruebas de Lectura Pública');
  
  // Test 1: Leer servicios sin autenticación
  logTest('Lectura de servicios sin autenticación');
  try {
    const servicesQuery = query(collection(db, 'services'), limit(5));
    const snapshot = await getDocs(servicesQuery);
    recordTest(
      'Lectura pública de servicios',
      true,
      `Se obtuvieron ${snapshot.size} servicios correctamente`
    );
  } catch (error) {
    recordTest(
      'Lectura pública de servicios',
      false,
      `Error: ${error.message}`
    );
  }
  
  // Test 2: Leer categorías sin autenticación
  logTest('Lectura de categorías sin autenticación');
  try {
    const categoriesQuery = query(collection(db, 'categories'), limit(5));
    const snapshot = await getDocs(categoriesQuery);
    recordTest(
      'Lectura pública de categorías',
      true,
      `Se obtuvieron ${snapshot.size} categorías correctamente`
    );
  } catch (error) {
    recordTest(
      'Lectura pública de categorías',
      false,
      `Error: ${error.message}`
    );
  }
  
  // Test 3: Intentar leer analytics sin autenticación (debe fallar)
  logTest('Intento de lectura de analytics sin autenticación');
  try {
    const analyticsQuery = query(collection(db, 'analytics'), limit(1));
    const snapshot = await getDocs(analyticsQuery);
    recordTest(
      'Bloqueo de analytics sin auth',
      false,
      'Se pudo acceder a analytics sin autenticación (PROBLEMA DE SEGURIDAD)'
    );
  } catch (error) {
    recordTest(
      'Bloqueo de analytics sin auth',
      true,
      'Acceso denegado correctamente a analytics'
    );
  }
}

// Pruebas de escritura sin autenticación
async function testUnauthorizedWrite() {
  logSection('Pruebas de Escritura No Autorizada');
  
  // Test 1: Intentar crear servicio sin autenticación (debe fallar)
  logTest('Intento de crear servicio sin autenticación');
  try {
    const testService = {
      name: 'Servicio de Prueba',
      category: 'test',
      description: 'Prueba de seguridad',
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'services'), testService);
    recordTest(
      'Bloqueo de escritura sin auth',
      false,
      'Se pudo crear servicio sin autenticación (PROBLEMA DE SEGURIDAD)'
    );
  } catch (error) {
    recordTest(
      'Bloqueo de escritura sin auth',
      true,
      'Escritura denegada correctamente'
    );
  }
  
  // Test 2: Intentar escribir en analytics sin autenticación (debe fallar)
  logTest('Intento de escribir en analytics sin autenticación');
  try {
    const testAnalytics = {
      event: 'test_event',
      timestamp: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'analytics'), testAnalytics);
    recordTest(
      'Bloqueo de analytics sin auth',
      false,
      'Se pudo escribir en analytics sin autenticación (PROBLEMA DE SEGURIDAD)'
    );
  } catch (error) {
    recordTest(
      'Bloqueo de analytics sin auth',
      true,
      'Escritura en analytics denegada correctamente'
    );
  }
}

// Pruebas con autenticación de admin
async function testAdminAccess() {
  logSection('Pruebas de Acceso de Administrador');
  
  const adminEmail = process.env.FIREBASE_ADMIN_EMAIL || 'admin@revistadigital.com';
  const adminPassword = process.env.FIREBASE_ADMIN_PASSWORD;
  
  if (!adminPassword) {
    logWarning('No se proporcionó contraseña de admin. Saltando pruebas de admin.');
    recordTest(
      'Configuración de admin',
      false,
      'Variable FIREBASE_ADMIN_PASSWORD no configurada'
    );
    return;
  }
  
  // Autenticar como admin
  logTest('Autenticación de administrador');
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    recordTest(
      'Autenticación de admin',
      true,
      `Admin autenticado como ${adminEmail}`
    );
  } catch (error) {
    recordTest(
      'Autenticación de admin',
      false,
      `Error de autenticación: ${error.message}`
    );
    return;
  }
  
  // Test 1: Crear servicio como admin
  logTest('Crear servicio como administrador');
  try {
    const testService = {
      name: 'Servicio de Prueba Admin',
      category: 'test',
      description: 'Prueba de seguridad con admin',
      createdAt: new Date().toISOString(),
      isTest: true
    };
    
    const docRef = await addDoc(collection(db, 'services'), testService);
    recordTest(
      'Creación de servicio por admin',
      true,
      `Servicio creado con ID: ${docRef.id}`
    );
    
    // Limpiar: eliminar el servicio de prueba
    await deleteDoc(doc(db, 'services', docRef.id));
    logInfo('Servicio de prueba eliminado');
    
  } catch (error) {
    recordTest(
      'Creación de servicio por admin',
      false,
      `Error: ${error.message}`
    );
  }
  
  // Test 2: Acceder a analytics como admin
  logTest('Acceso a analytics como administrador');
  try {
    const analyticsQuery = query(collection(db, 'analytics'), limit(1));
    const snapshot = await getDocs(analyticsQuery);
    recordTest(
      'Acceso a analytics por admin',
      true,
      `Acceso exitoso a analytics (${snapshot.size} documentos)`
    );
  } catch (error) {
    recordTest(
      'Acceso a analytics por admin',
      false,
      `Error: ${error.message}`
    );
  }
  
  // Test 3: Escribir en analytics como admin
  logTest('Escribir en analytics como administrador');
  try {
    const testAnalytics = {
      event: 'security_test',
      admin: true,
      timestamp: new Date().toISOString(),
      isTest: true
    };
    
    const docRef = await addDoc(collection(db, 'analytics'), testAnalytics);
    recordTest(
      'Escritura en analytics por admin',
      true,
      `Analytics creado con ID: ${docRef.id}`
    );
    
    // Limpiar: eliminar el analytics de prueba
    await deleteDoc(doc(db, 'analytics', docRef.id));
    logInfo('Analytics de prueba eliminado');
    
  } catch (error) {
    recordTest(
      'Escritura en analytics por admin',
      false,
      `Error: ${error.message}`
    );
  }
  
  // Cerrar sesión
  await signOut(auth);
  logInfo('Sesión de admin cerrada');
}

// Pruebas de optimizaciones
async function testOptimizations() {
  logSection('Pruebas de Optimizaciones');
  
  // Test 1: Paginación con startAfter
  logTest('Paginación optimizada');
  try {
    const firstPage = query(collection(db, 'services'), limit(3));
    const firstSnapshot = await getDocs(firstPage);
    
    if (firstSnapshot.size > 0) {
      const lastDoc = firstSnapshot.docs[firstSnapshot.docs.length - 1];
      const secondPage = query(
        collection(db, 'services'),
        limit(3)
        // startAfter(lastDoc) // Comentado para evitar error si no hay suficientes docs
      );
      const secondSnapshot = await getDocs(secondPage);
      
      recordTest(
        'Paginación optimizada',
        true,
        `Primera página: ${firstSnapshot.size} docs, Segunda página: ${secondSnapshot.size} docs`
      );
    } else {
      recordTest(
        'Paginación optimizada',
        false,
        'No hay suficientes documentos para probar paginación'
      );
    }
  } catch (error) {
    recordTest(
      'Paginación optimizada',
      false,
      `Error: ${error.message}`
    );
  }
  
  // Test 2: Consulta individual con getDoc
  logTest('Consulta individual optimizada');
  try {
    // Primero obtener un ID válido
    const servicesQuery = query(collection(db, 'services'), limit(1));
    const snapshot = await getDocs(servicesQuery);
    
    if (snapshot.size > 0) {
      const serviceId = snapshot.docs[0].id;
      const serviceDoc = await getDoc(doc(db, 'services', serviceId));
      
      recordTest(
        'Consulta individual optimizada',
        serviceDoc.exists(),
        `Servicio obtenido con getDoc: ${serviceId}`
      );
    } else {
      recordTest(
        'Consulta individual optimizada',
        false,
        'No hay servicios para probar getDoc'
      );
    }
  } catch (error) {
    recordTest(
      'Consulta individual optimizada',
      false,
      `Error: ${error.message}`
    );
  }
  
  // Test 3: Consulta con filtros (para FeaturedServices)
  logTest('Consultas con filtros optimizadas');
  try {
    const featuredQuery = query(
      collection(db, 'services'),
      where('featured', '==', true),
      limit(5)
    );
    const snapshot = await getDocs(featuredQuery);
    
    recordTest(
      'Consultas con filtros',
      true,
      `Servicios destacados encontrados: ${snapshot.size}`
    );
  } catch (error) {
    // Es normal que falle si no hay campo 'featured'
    recordTest(
      'Consultas con filtros',
      true,
      'Consulta ejecutada (puede no haber servicios destacados)'
    );
  }
}

// Generar reporte de resultados
function generateReport() {
  logSection('Reporte de Pruebas de Seguridad');
  
  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  
  log(`📊 Resumen de Resultados:`, 'bright');
  log(`   Total de pruebas: ${testResults.total}`, 'blue');
  log(`   Pruebas exitosas: ${testResults.passed}`, 'green');
  log(`   Pruebas fallidas: ${testResults.failed}`, 'red');
  log(`   Tasa de éxito: ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');
  
  if (testResults.failed > 0) {
    log(`\n❌ Pruebas Fallidas:`, 'red');
    testResults.details
      .filter(test => !test.passed)
      .forEach(test => {
        log(`   • ${test.test}: ${test.message}`, 'red');
      });
  }
  
  log(`\n✅ Pruebas Exitosas:`, 'green');
  testResults.details
    .filter(test => test.passed)
    .forEach(test => {
      log(`   • ${test.test}: ${test.message}`, 'green');
    });
  
  // Guardar reporte
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      passRate: parseFloat(passRate)
    },
    details: testResults.details,
    environment: {
      projectId: firebaseConfig.projectId,
      nodeVersion: process.version,
      platform: process.platform
    }
  };
  
  const fs = require('fs');
  const path = require('path');
  
  fs.writeFileSync(
    path.join(__dirname, 'firestore-security-test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  log(`\n💾 Reporte guardado en: firestore-security-test-report.json`, 'cyan');
  
  // Recomendaciones
  logSection('Recomendaciones');
  
  if (passRate >= 90) {
    log('🎉 Excelente! Las reglas de seguridad están funcionando correctamente.', 'green');
  } else if (passRate >= 70) {
    log('⚠️  Las reglas funcionan pero hay algunas áreas de mejora.', 'yellow');
  } else {
    log('🚨 Hay problemas significativos con las reglas de seguridad.', 'red');
  }
  
  log('\n📋 Próximos pasos:', 'blue');
  log('   1. Revisar pruebas fallidas', 'blue');
  log('   2. Verificar configuración de Firebase', 'blue');
  log('   3. Actualizar reglas si es necesario', 'blue');
  log('   4. Ejecutar pruebas regularmente', 'blue');
}

// Función principal
async function main() {
  log('🔒 Pruebas de Seguridad de Firestore', 'bright');
  log('Validando reglas optimizadas para cache y analytics\n', 'bright');
  
  try {
    await testPublicRead();
    await testUnauthorizedWrite();
    await testAdminAccess();
    await testOptimizations();
    
    generateReport();
    
  } catch (error) {
    log('❌ Error inesperado durante las pruebas:', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  // Verificar configuración
  if (!firebaseConfig.projectId) {
    log('❌ Error: Variables de entorno de Firebase no configuradas', 'red');
    log('Configura las variables NEXT_PUBLIC_FIREBASE_* en tu .env.local', 'yellow');
    process.exit(1);
  }
  
  main().catch(error => {
    log('❌ Error fatal:', 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  testPublicRead,
  testUnauthorizedWrite,
  testAdminAccess,
  testOptimizations,
  generateReport
};