// Script simple para probar las correcciones en ServiceHeader
const http = require('http');

async function testServicePage() {
  console.log('🔍 Probando la página de servicio de prueba...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/servicio/servicio-de-prueba',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Código de respuesta: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          console.log('✅ La página se carga correctamente');
          
          // Verificar que contiene elementos esperados
          const checks = [
            { name: 'ServiceHeader component', test: data.includes('ServiceHeader') || data.includes('service-header') },
            { name: 'Imagen placeholder', test: data.includes('placeholder-service.jpg') || data.includes('placeholder') },
            { name: 'Sección de ubicación', test: data.includes('Ubicación') || data.includes('location') },
            { name: 'Estructura HTML válida', test: data.includes('<html') && data.includes('</html>') },
            { name: 'Scripts de Next.js', test: data.includes('_next') }
          ];
          
          console.log('\n🔍 Verificaciones:');
          checks.forEach(check => {
            const status = check.test ? '✅' : '❌';
            console.log(`  ${status} ${check.name}`);
          });
          
          const allPassed = checks.every(check => check.test);
          console.log(`\n${allPassed ? '✅' : '❌'} Resultado general: ${allPassed ? 'EXITOSO' : 'FALLÓ'}`);
          
        } else {
          console.log(`❌ Error: La página devolvió código ${res.statusCode}`);
        }
        
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.error('❌ Error de conexión:', err.message);
      console.log('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3001');
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      console.error('❌ Timeout: La solicitud tardó más de 10 segundos');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

// Ejecutar la prueba
testServicePage().catch(console.error);