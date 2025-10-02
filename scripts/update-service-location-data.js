/**
 * Script para actualizar servicios con coordenadas y cacheBreaker faltantes
 * 
 * Este script:
 * 1. Analiza qué servicios no tienen coordenadas y/o cacheBreaker
 * 2. Genera coordenadas usando geocoding para direcciones
 * 3. Agrega los campos faltantes a los servicios
 * 
 * Uso:
 * - node scripts/update-service-location-data.js --analyze (solo analizar)
 * - node scripts/update-service-location-data.js --update (actualizar servicios)
 * - node scripts/update-service-location-data.js --update --limit=5 (actualizar máximo 5 servicios)
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase
if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d'
  });
}

const db = admin.firestore();

// Función para generar coordenadas usando geocoding (simulado)
// En producción, usar Google Maps Geocoding API o similar
async function getCoordinatesFromAddress(address, neighborhood, district) {
  // Coordenadas por defecto para Lima, Perú
  const defaultCoordinates = [-12.0464, -77.0428];
  
  if (!address) {
    console.log(`   ⚠️  Sin dirección específica, usando coordenadas por defecto`);
    return defaultCoordinates;
  }

  // Simulación de geocoding - en producción usar API real
  console.log(`   🔍 Generando coordenadas para: ${address}, ${neighborhood || ''}, ${district || ''}`);
  
  // Coordenadas aproximadas por distrito en Lima
  const districtCoordinates = {
    'miraflores': [-12.1197, -77.0282],
    'san isidro': [-12.0969, -77.0378],
    'barranco': [-12.1404, -77.0200],
    'surco': [-12.1391, -76.9938],
    'la molina': [-12.0769, -76.9441],
    'san borja': [-12.1089, -77.0021],
    'chorrillos': [-12.1684, -77.0130],
    'villa el salvador': [-12.2126, -76.9388],
    'callao': [-12.0566, -77.1181],
    'lima': [-12.0464, -77.0428],
    'pueblo libre': [-12.0742, -77.0631],
    'jesus maria': [-12.0742, -77.0631],
    'lince': [-12.0892, -77.0364],
    'magdalena': [-12.0969, -77.0750],
    'san miguel': [-12.0776, -77.0881]
  };

  const districtKey = (district || '').toLowerCase().trim();
  const coordinates = districtCoordinates[districtKey] || defaultCoordinates;
  
  // Agregar pequeña variación aleatoria para evitar coordenadas exactamente iguales
  const lat = coordinates[0] + (Math.random() - 0.5) * 0.01;
  const lng = coordinates[1] + (Math.random() - 0.5) * 0.01;
  
  return [lat, lng];
}

// Función para generar cacheBreaker
function generateCacheBreaker() {
  return Date.now();
}

// Función para analizar servicios
async function analyzeServices() {
  try {
    console.log('🔍 Analizando servicios sin coordenadas y cacheBreaker...\n');
    
    const snapshot = await db.collection('services').get();
    
    if (snapshot.empty) {
      console.log('❌ No se encontraron servicios');
      return { missingCoordinates: [], missingCacheBreaker: [], missingBoth: [] };
    }
    
    let missingCoordinates = [];
    let missingCacheBreaker = [];
    let missingBoth = [];
    let hasAll = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      
      const hasCoordinates = data.coordenadas && Array.isArray(data.coordenadas) && data.coordenadas.length === 2;
      const hasCacheBreaker = data.cacheBreaker && typeof data.cacheBreaker === 'number';
      
      const serviceInfo = {
        id,
        name: data.name,
        address: data.address,
        neighborhood: data.neighborhood,
        district: data.district
      };
      
      if (!hasCoordinates && !hasCacheBreaker) {
        missingBoth.push(serviceInfo);
      } else if (!hasCoordinates) {
        missingCoordinates.push(serviceInfo);
      } else if (!hasCacheBreaker) {
        missingCacheBreaker.push(serviceInfo);
      } else {
        hasAll.push(serviceInfo);
      }
    });
    
    console.log('📊 RESUMEN DEL ANÁLISIS:');
    console.log(`   Total de servicios: ${snapshot.size}`);
    console.log(`   ✅ Con coordenadas y cacheBreaker: ${hasAll.length}`);
    console.log(`   ❌ Sin coordenadas: ${missingCoordinates.length}`);
    console.log(`   ❌ Sin cacheBreaker: ${missingCacheBreaker.length}`);
    console.log(`   ❌ Sin ambos campos: ${missingBoth.length}`);
    console.log('');
    
    if (missingBoth.length > 0) {
      console.log('🚨 SERVICIOS SIN COORDENADAS NI CACHEBREAKER:');
      missingBoth.slice(0, 10).forEach(service => {
        console.log(`   - ${service.name} (${service.id})`);
        console.log(`     Dirección: ${service.address || 'No especificada'}`);
        console.log(`     Distrito: ${service.district || 'No especificado'}`);
      });
      if (missingBoth.length > 10) {
        console.log(`   ... y ${missingBoth.length - 10} más`);
      }
      console.log('');
    }
    
    if (missingCoordinates.length > 0) {
      console.log('📍 SERVICIOS SIN COORDENADAS:');
      missingCoordinates.slice(0, 5).forEach(service => {
        console.log(`   - ${service.name} (${service.id})`);
        console.log(`     Dirección: ${service.address || 'No especificada'}`);
      });
      if (missingCoordinates.length > 5) {
        console.log(`   ... y ${missingCoordinates.length - 5} más`);
      }
      console.log('');
    }
    
    if (missingCacheBreaker.length > 0) {
      console.log('🔄 SERVICIOS SIN CACHEBREAKER:');
      missingCacheBreaker.slice(0, 5).forEach(service => {
        console.log(`   - ${service.name} (${service.id})`);
      });
      if (missingCacheBreaker.length > 5) {
        console.log(`   ... y ${missingCacheBreaker.length - 5} más`);
      }
    }
    
    return { missingCoordinates, missingCacheBreaker, missingBoth };
    
  } catch (error) {
    console.error('❌ Error en análisis:', error);
    throw error;
  }
}

// Función para actualizar servicios
async function updateServices(limit = null) {
  try {
    console.log('🔄 Iniciando actualización de servicios...\n');
    
    const analysis = await analyzeServices();
    
    // Combinar todos los servicios que necesitan actualización
    const servicesToUpdate = [
      ...analysis.missingBoth,
      ...analysis.missingCoordinates,
      ...analysis.missingCacheBreaker
    ];
    
    if (servicesToUpdate.length === 0) {
      console.log('✅ Todos los servicios ya tienen coordenadas y cacheBreaker');
      return;
    }
    
    const servicesToProcess = limit ? servicesToUpdate.slice(0, limit) : servicesToUpdate;
    
    console.log(`🚀 Actualizando ${servicesToProcess.length} servicios...\n`);
    
    let updated = 0;
    let errors = 0;
    
    for (const service of servicesToProcess) {
      try {
        console.log(`📝 Procesando: ${service.name} (${service.id})`);
        
        // Obtener datos actuales del servicio
        const serviceDoc = await db.collection('services').doc(service.id).get();
        const currentData = serviceDoc.data();
        
        const updates = {};
        
        // Generar coordenadas si no las tiene
        if (!currentData.coordenadas || !Array.isArray(currentData.coordenadas) || currentData.coordenadas.length !== 2) {
          const coordinates = await getCoordinatesFromAddress(
            currentData.address,
            currentData.neighborhood,
            currentData.district
          );
          updates.coordenadas = coordinates;
          console.log(`   📍 Coordenadas generadas: [${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}]`);
        }
        
        // Generar cacheBreaker si no lo tiene
        if (!currentData.cacheBreaker || typeof currentData.cacheBreaker !== 'number') {
          updates.cacheBreaker = generateCacheBreaker();
          console.log(`   🔄 CacheBreaker generado: ${updates.cacheBreaker}`);
        }
        
        // Actualizar el servicio
        if (Object.keys(updates).length > 0) {
          await db.collection('services').doc(service.id).update(updates);
          updated++;
          console.log(`   ✅ Servicio actualizado exitosamente\n`);
        } else {
          console.log(`   ℹ️  Servicio ya tiene todos los campos necesarios\n`);
        }
        
        // Pausa pequeña para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`   ❌ Error actualizando ${service.name}:`, error.message);
        errors++;
      }
    }
    
    console.log('📊 RESUMEN DE ACTUALIZACIÓN:');
    console.log(`   ✅ Servicios actualizados: ${updated}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📝 Total procesados: ${servicesToProcess.length}`);
    
  } catch (error) {
    console.error('❌ Error en actualización:', error);
    throw error;
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const isAnalyzeOnly = args.includes('--analyze');
  const isUpdate = args.includes('--update');
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;
  
  try {
    if (isUpdate) {
      await updateServices(limit);
    } else {
      await analyzeServices();
      
      if (!isAnalyzeOnly) {
        console.log('\n💡 OPCIONES DISPONIBLES:');
        console.log('   node scripts/update-service-location-data.js --analyze    (solo analizar)');
        console.log('   node scripts/update-service-location-data.js --update     (actualizar todos)');
        console.log('   node scripts/update-service-location-data.js --update --limit=5  (actualizar máximo 5)');
      }
    }
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  analyzeServices,
  updateServices,
  getCoordinatesFromAddress,
  generateCacheBreaker
};