// Script para probar el diagnóstico de variables de entorno en Vercel
const https = require('https');
const http = require('http');

// URL de la API de diagnóstico
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/debug-env`
  : 'http://localhost:3000/api/debug-env';

console.log('🔍 Probando diagnóstico de variables de entorno...');
console.log('URL:', API_URL);
console.log('================================================');

// Función para hacer la petición HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, parseError: error.message });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Ejecutar la prueba
async function runTest() {
  try {
    console.log('📡 Haciendo petición a la API...');
    const response = await makeRequest(API_URL);
    
    console.log('📊 RESULTADO:');
    console.log('Status:', response.status);
    
    if (response.parseError) {
      console.log('❌ Error parseando JSON:', response.parseError);
      console.log('Raw response:', response.data);
      return;
    }
    
    const { adminAnalysis, serviceAccountTest, summary } = response.data;
    
    console.log('\n🔧 ANÁLISIS FIREBASE ADMIN SDK:');
    if (adminAnalysis) {
      Object.entries(adminAnalysis).forEach(([key, value]) => {
        const status = value.exists ? '✅' : '❌';
        const info = value.exists 
          ? `${value.type} (${value.length} chars)${value.isEmpty ? ' - VACÍA' : ''}` 
          : 'NO_CONFIGURADA';
        console.log(`${status} ${key}: ${info}`);
      });
    }
    
    console.log('\n🧪 TEST SERVICE ACCOUNT:');
    if (serviceAccountTest) {
      if (serviceAccountTest.success) {
        console.log('✅ Service Account Object creado exitosamente');
        console.log('  - projectId:', serviceAccountTest.projectId.isString && !serviceAccountTest.projectId.isEmpty ? '✅ Válido' : '❌ Inválido');
        console.log('  - clientEmail:', serviceAccountTest.clientEmail.isString && !serviceAccountTest.clientEmail.isEmpty ? '✅ Válido' : '❌ Inválido');
        console.log('  - privateKey:', serviceAccountTest.privateKey.isString && !serviceAccountTest.privateKey.isEmpty ? '✅ Válido' : '❌ Inválido');
      } else {
        console.log('❌ Error creando Service Account Object:', serviceAccountTest.error);
      }
    }
    
    console.log('\n📈 RESUMEN:');
    if (summary) {
      console.log(`Variables Admin configuradas: ${summary.adminVarsConfigured}/${summary.adminVarsTotal}`);
      console.log(`Variables totales configuradas: ${summary.configuredVars}/${summary.totalVars}`);
      console.log(`Variables con problemas: ${summary.varsWithIssues}`);
    }
    
    // Mostrar el JSON completo si hay errores
    if (response.status !== 200 || (summary && summary.adminVarsConfigured < 3)) {
      console.log('\n🔍 RESPUESTA COMPLETA:');
      console.log(JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando la prueba:', error.message);
  }
}

// Ejecutar
runTest();

// También mostrar variables de entorno locales para comparar
console.log('\n🏠 VARIABLES LOCALES (para comparación):');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Configurada' : '❌ No configurada');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Configurada' : '❌ No configurada');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Configurada' : '❌ No configurada');