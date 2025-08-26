// Script para verificar el servicio de prueba a través del API
const https = require('https');
const http = require('http');

async function checkServiceViaAPI() {
  try {
    console.log('🔍 Verificando servicio de prueba a través del API...');
    
    // Función para hacer petición HTTP
    const makeRequest = (url) => {
      return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              const jsonData = JSON.parse(data);
              resolve({ status: res.statusCode, data: jsonData });
            } catch (error) {
              resolve({ status: res.statusCode, data: data });
            }
          });
        }).on('error', (error) => {
          reject(error);
        });
      });
    };
    
    // Verificar servicios en producción
    console.log('\n📡 Consultando API de producción...');
    const prodResponse = await makeRequest('https://www.tubarrio.pe/api/services');
    console.log('Status:', prodResponse.status);
    
    if (prodResponse.status === 200 && Array.isArray(prodResponse.data)) {
      console.log('✅ API funcionando, servicios encontrados:', prodResponse.data.length);
      
      // Buscar servicio de prueba
      const testService = prodResponse.data.find(service => 
        service.name && service.name.toLowerCase().includes('prueba')
      );
      
      if (testService) {
        console.log('\n🎯 Servicio de prueba encontrado:');
        console.log('  - ID:', testService.id);
        console.log('  - Nombre:', testService.name);
        console.log('  - Descripción:', testService.description);
        console.log('  - Dirección (address):', testService.address);
        console.log('  - Referencia (reference):', testService.reference);
        console.log('  - Location:', testService.location);
        console.log('  - Imagen principal:', testService.image);
        console.log('  - Imágenes array:', testService.images);
        console.log('  - Activo:', testService.active);
        
        console.log('\n🔍 Análisis de problemas:');
        
        // Problema 1: Imágenes
        if (!testService.image || testService.image === 'none' || testService.image === '') {
          console.log('❌ PROBLEMA: Imagen principal no válida');
        } else {
          console.log('✅ Imagen principal OK');
        }
        
        if (!testService.images || testService.images.length === 0 || testService.images[0] === 'none') {
          console.log('❌ PROBLEMA: Array de imágenes vacío o inválido');
        } else {
          console.log('✅ Array de imágenes OK');
        }
        
        // Problema 2: Dirección y referencia
        console.log('\n📍 Análisis de ubicación:');
        console.log('  - address:', testService.address || 'NO DEFINIDO');
        console.log('  - reference:', testService.reference || 'NO DEFINIDO');
        console.log('  - location:', testService.location || 'NO DEFINIDO');
        
        if (testService.address && testService.reference) {
          if (testService.address === testService.reference) {
            console.log('❌ PROBLEMA: address y reference son iguales');
          } else {
            console.log('✅ address y reference son diferentes');
          }
        }
        
      } else {
        console.log('❌ No se encontró servicio de prueba');
        
        // Mostrar algunos servicios para referencia
        console.log('\n📋 Primeros 5 servicios disponibles:');
        prodResponse.data.slice(0, 5).forEach((service, index) => {
          console.log(`  ${index + 1}. ${service.name} (ID: ${service.id})`);
        });
      }
    } else {
      console.log('❌ Error en API o respuesta inválida');
      console.log('Respuesta:', prodResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkServiceViaAPI();