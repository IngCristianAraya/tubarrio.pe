#!/usr/bin/env node

/**
 * Script para verificar el estado del despliegue en Vercel
 * y la configuración de variables de entorno
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function checkDeployment() {
  console.log('🔍 Verificador de Despliegue en Vercel\n');
  
  // Solicitar URL de Vercel
  const vercelUrl = await new Promise((resolve) => {
    rl.question('Ingresa la URL de tu aplicación en Vercel (ej: https://tu-app.vercel.app): ', resolve);
  });
  
  if (!vercelUrl.startsWith('http')) {
    console.log('❌ URL inválida. Debe comenzar con https://');
    rl.close();
    return;
  }
  
  console.log(`\n🌐 Verificando: ${vercelUrl}\n`);
  
  try {
    // 1. Verificar que la aplicación esté funcionando
    console.log('1️⃣ Verificando que la aplicación esté en línea...');
    const homeResponse = await makeRequest(vercelUrl);
    console.log('✅ Aplicación accesible\n');
    
    // 2. Verificar variables de entorno
    console.log('2️⃣ Verificando variables de entorno...');
    const envUrl = `${vercelUrl}/api/debug-env`;
    const envResponse = await makeRequest(envUrl);
    
    if (envResponse.error) {
      console.log('❌ Error al verificar variables de entorno:', envResponse.error);
      rl.close();
      return;
    }
    
    // Verificar variables críticas de Firebase
    const criticalVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];
    
    console.log('\n📋 Estado de Variables Críticas:');
    let allConfigured = true;
    
    criticalVars.forEach(varName => {
      const isConfigured = envResponse[varName] && envResponse[varName].value;
      console.log(`${isConfigured ? '✅' : '❌'} ${varName}: ${isConfigured ? 'Configurada' : 'FALTANTE'}`);
      if (!isConfigured) allConfigured = false;
    });
    
    console.log('\n📋 Variables Adicionales:');
    const additionalVars = ['NEXT_PUBLIC_WHATSAPP_NUMBER', 'NEXT_PUBLIC_SITE_URL'];
    additionalVars.forEach(varName => {
      const isConfigured = envResponse[varName] && envResponse[varName].value;
      console.log(`${isConfigured ? '✅' : '⚠️'} ${varName}: ${isConfigured ? 'Configurada' : 'Opcional'}`);
    });
    
    // 3. Diagnóstico final
    console.log('\n🎯 DIAGNÓSTICO:');
    if (allConfigured) {
      console.log('✅ Todas las variables críticas están configuradas');
      console.log('✅ La aplicación debería conectarse a Firestore correctamente');
      console.log('\n🔗 Prueba acceder a: ' + vercelUrl + '/todos-los-servicios');
    } else {
      console.log('❌ PROBLEMA IDENTIFICADO: Variables de entorno faltantes');
      console.log('\n🛠️ SOLUCIÓN:');
      console.log('1. Ve a Vercel Dashboard > Tu Proyecto > Settings > Environment Variables');
      console.log('2. Agrega las variables marcadas como FALTANTE');
      console.log('3. Haz un redeploy de la aplicación');
      console.log('4. Ejecuta este script nuevamente para verificar');
      console.log('\n📖 Consulta: VERCEL-DEPLOYMENT-GUIDE.md para instrucciones detalladas');
    }
    
  } catch (error) {
    console.log('❌ Error al verificar el despliegue:', error.message);
    console.log('\n🔍 Posibles causas:');
    console.log('- La URL no es correcta');
    console.log('- La aplicación no está desplegada');
    console.log('- Problemas de red');
  }
  
  rl.close();
}

checkDeployment().catch(console.error);