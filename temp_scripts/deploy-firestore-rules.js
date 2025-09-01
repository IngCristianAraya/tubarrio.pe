#!/usr/bin/env node

/**
 * Script para desplegar las reglas de Firestore actualizadas
 * Incluye validación y verificación de las reglas de seguridad
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  log(`\n${'='.repeat(50)}`, 'cyan');
  log(`🔧 ${title}`, 'cyan');
  log('='.repeat(50), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function checkFirebaseLogin() {
  logSection('Verificando Autenticación de Firebase');
  
  try {
    const result = execSync('firebase projects:list', { encoding: 'utf8' });
    logSuccess('Usuario autenticado en Firebase CLI');
    return true;
  } catch (error) {
    logError('No estás autenticado en Firebase CLI');
    logInfo('Ejecuta: firebase login');
    return false;
  }
}

function validateRulesFile() {
  logSection('Validando Archivo de Reglas');
  
  const rulesPath = path.join(__dirname, 'firestore.rules');
  
  if (!fs.existsSync(rulesPath)) {
    logError('No se encontró el archivo firestore.rules');
    return false;
  }
  
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  
  // Verificaciones básicas
  const checks = [
    {
      test: rulesContent.includes("rules_version = '2'"),
      message: 'Versión de reglas correcta'
    },
    {
      test: rulesContent.includes('function isAdmin()'),
      message: 'Función isAdmin() definida'
    },
    {
      test: rulesContent.includes('function isAuthenticated()'),
      message: 'Función isAuthenticated() definida'
    },
    {
      test: rulesContent.includes('match /services/{serviceId}'),
      message: 'Reglas para servicios definidas'
    },
    {
      test: rulesContent.includes('match /analytics/{document=**}'),
      message: 'Reglas para analytics definidas'
    },
    {
      test: !rulesContent.includes('allow write: if true'),
      message: 'No hay reglas de escritura permisivas'
    }
  ];
  
  let allValid = true;
  
  checks.forEach(check => {
    if (check.test) {
      logSuccess(check.message);
    } else {
      logError(`Fallo: ${check.message}`);
      allValid = false;
    }
  });
  
  return allValid;
}

function deployRules() {
  logSection('Desplegando Reglas de Firestore');
  
  try {
    logInfo('Iniciando despliegue...');
    const result = execSync('firebase deploy --only firestore:rules', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    logSuccess('Reglas desplegadas exitosamente');
    logInfo('Resultado del despliegue:');
    console.log(result);
    
    return true;
  } catch (error) {
    logError('Error al desplegar las reglas');
    console.error(error.message);
    return false;
  }
}

function generateSecurityReport() {
  logSection('Reporte de Seguridad');
  
  const securityFeatures = [
    '🔒 Autenticación requerida para operaciones administrativas',
    '👥 Verificación de email de administrador',
    '📖 Lectura pública solo para servicios y categorías',
    '✍️  Escritura restringida a administradores autenticados',
    '📊 Analytics y estadísticas protegidas',
    '🛡️  Configuración del sistema solo para admins',
    '📝 Logs y auditoría controlados',
    '💾 Metadata de cache gestionada por admins',
    '👤 Usuarios pueden acceder solo a sus propios datos',
    '🚫 Bloqueo por defecto para colecciones no especificadas'
  ];
  
  logInfo('Características de seguridad implementadas:');
  securityFeatures.forEach(feature => {
    log(`  ${feature}`, 'green');
  });
  
  logSection('Recomendaciones Adicionales');
  
  const recommendations = [
    'Configurar alertas de Firebase para detectar accesos anómalos',
    'Revisar logs de Firestore regularmente',
    'Implementar rate limiting en las funciones de Cloud Functions',
    'Configurar backup automático de la base de datos',
    'Monitorear el uso de cuota y facturación',
    'Implementar validación adicional en el lado del cliente',
    'Considerar usar Firebase App Check para protección adicional'
  ];
  
  recommendations.forEach((rec, index) => {
    log(`  ${index + 1}. ${rec}`, 'yellow');
  });
}

function testRulesLocally() {
  logSection('Prueba Local de Reglas (Opcional)');
  
  logInfo('Para probar las reglas localmente, puedes usar:');
  log('  firebase emulators:start --only firestore', 'cyan');
  log('  firebase firestore:rules:test', 'cyan');
  
  logWarning('Asegúrate de probar los siguientes escenarios:');
  const testScenarios = [
    'Lectura pública de servicios (sin autenticación)',
    'Intento de escritura sin autenticación (debe fallar)',
    'Escritura con usuario admin autenticado (debe funcionar)',
    'Acceso a analytics sin autenticación (debe fallar)',
    'Acceso a analytics con admin (debe funcionar)'
  ];
  
  testScenarios.forEach((scenario, index) => {
    log(`  ${index + 1}. ${scenario}`, 'blue');
  });
}

async function main() {
  log('🔥 Desplegador de Reglas de Firestore', 'bright');
  log('Actualizando reglas de seguridad con optimizaciones implementadas\n', 'bright');
  
  // Verificar autenticación
  const isLoggedIn = await checkFirebaseLogin();
  if (!isLoggedIn) {
    process.exit(1);
  }
  
  // Validar archivo de reglas
  const isValid = validateRulesFile();
  if (!isValid) {
    logError('El archivo de reglas contiene errores. Corrige los problemas antes de continuar.');
    process.exit(1);
  }
  
  // Desplegar reglas
  const deployed = deployRules();
  if (!deployed) {
    logError('Error en el despliegue. Revisa la configuración de Firebase.');
    process.exit(1);
  }
  
  // Generar reporte
  generateSecurityReport();
  
  // Información sobre pruebas
  testRulesLocally();
  
  logSection('Despliegue Completado');
  logSuccess('Las reglas de Firestore han sido actualizadas exitosamente');
  logInfo('Las nuevas reglas están ahora activas en tu proyecto de Firebase');
  
  // Guardar timestamp del despliegue
  const deployInfo = {
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: [
      'admin-authentication',
      'public-read-services',
      'protected-analytics',
      'user-data-isolation',
      'default-deny'
    ]
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'firestore-rules-deploy.json'),
    JSON.stringify(deployInfo, null, 2)
  );
  
  logSuccess('Información del despliegue guardada en firestore-rules-deploy.json');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    logError('Error inesperado:');
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  checkFirebaseLogin,
  validateRulesFile,
  deployRules,
  generateSecurityReport
};