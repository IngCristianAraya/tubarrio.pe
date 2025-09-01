// Script para probar Firebase en producción
const https = require('https');

// Función para hacer una petición HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testFirebaseProduction() {
  console.log('=== PRUEBA DE FIREBASE EN PRODUCCIÓN ===\n');
  
  try {
    // Probar la página principal
    console.log('1. Probando página principal...');
    const mainPage = await makeRequest('https://www.tubarrio.pe');
    console.log(`   Status: ${mainPage.statusCode}`);
    
    // Buscar errores de Firebase en el HTML
    const hasFirebaseErrors = mainPage.data.includes('FirebaseError') || 
                             mainPage.data.includes('Firebase no está disponible');
    
    if (hasFirebaseErrors) {
      console.log('   ❌ Se detectaron errores de Firebase en la página');
    } else {
      console.log('   ✅ No se detectaron errores de Firebase en el HTML inicial');
    }
    
    // Probar API de servicios
    console.log('\n2. Probando API de servicios...');
    const servicesApi = await makeRequest('https://www.tubarrio.pe/api/services');
    console.log(`   Status: ${servicesApi.statusCode}`);
    
    if (servicesApi.statusCode === 200) {
      try {
        const services = JSON.parse(servicesApi.data);
        console.log(`   ✅ API de servicios funcionando - ${services.length} servicios encontrados`);
      } catch (e) {
        console.log('   ⚠️  API responde pero no es JSON válido');
      }
    } else {
      console.log('   ❌ API de servicios no responde correctamente');
    }
    
    // Probar API de fallback
    console.log('\n3. Probando API de fallback...');
    const fallbackApi = await makeRequest('https://www.tubarrio.pe/api/services-fallback');
    console.log(`   Status: ${fallbackApi.statusCode}`);
    
    if (fallbackApi.statusCode === 200) {
      try {
        const fallbackServices = JSON.parse(fallbackApi.data);
        console.log(`   ✅ API de fallback funcionando - ${fallbackServices.length} servicios mock`);
      } catch (e) {
        console.log('   ⚠️  API de fallback responde pero no es JSON válido');
      }
    } else {
      console.log('   ❌ API de fallback no responde correctamente');
    }
    
    console.log('\n=== RESUMEN ===');
    console.log('✅ Prueba completada. Revisa los resultados arriba.');
    console.log('\nPara una prueba más detallada, abre https://www.tubarrio.pe en el navegador');
    console.log('y revisa la consola del desarrollador para errores de Firebase.');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  }
}

testFirebaseProduction();