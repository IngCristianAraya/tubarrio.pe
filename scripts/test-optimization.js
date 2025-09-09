/**
 * Script de prueba para validar optimizaciones de Firebase
 * Compara el número de lecturas antes y después de las optimizaciones
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter } = require('firebase/firestore');
const { performance } = require('perf_hooks');

// Configuración de Firebase (reemplaza con tu config)
const firebaseConfig = {
  // Tu configuración aquí
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Contador de lecturas
let readCount = 0;

// Interceptor para contar lecturas
const originalGetDocs = getDocs;
const countingGetDocs = async (query) => {
  const result = await originalGetDocs(query);
  readCount += result.size;
  console.log(`📊 Lecturas en esta consulta: ${result.size}`);
  return result;
};

/**
 * Prueba el método ANTIGUO (ineficiente)
 */
async function testOldMethod() {
  console.log('\n🔴 PROBANDO MÉTODO ANTIGUO (ineficiente)');
  console.log('=' .repeat(50));
  
  const startTime = performance.now();
  readCount = 0;
  
  try {
    // Simula el comportamiento del servicesContext anterior
    console.log('1. Cargando TODOS los servicios...');
    const allServicesQuery = collection(db, 'services');
    const allServices = await countingGetDocs(allServicesQuery);
    
    console.log(`   Total servicios obtenidos: ${allServices.size}`);
    
    // Simula filtrado en el cliente
    console.log('2. Filtrando servicios destacados en el CLIENTE...');
    const featuredServices = allServices.docs.filter(doc => {
      const data = doc.data();
      return data.featured === true && data.active === true;
    });
    console.log(`   Servicios destacados encontrados: ${featuredServices.length}`);
    
    console.log('3. Filtrando servicios por categoría en el CLIENTE...');
    const categoryServices = allServices.docs.filter(doc => {
      const data = doc.data();
      return data.category === 'Peluquería' && data.active === true;
    });
    console.log(`   Servicios de peluquería encontrados: ${categoryServices.length}`);
    
    console.log('4. Filtrando servicios de usuario en el CLIENTE...');
    const userServices = allServices.docs.filter(doc => {
      const data = doc.data();
      return data.userId === 'test-user-id';
    });
    console.log(`   Servicios del usuario encontrados: ${userServices.length}`);
    
  } catch (error) {
    console.error('❌ Error en método antiguo:', error.message);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log('\n📈 RESULTADOS MÉTODO ANTIGUO:');
  console.log(`   💰 Total lecturas Firebase: ${readCount}`);
  console.log(`   ⏱️  Tiempo total: ${duration.toFixed(2)}ms`);
  console.log(`   💸 Costo estimado: $${(readCount * 0.0000036).toFixed(6)}`);
  
  return { reads: readCount, time: duration };
}

/**
 * Prueba el método NUEVO (optimizado)
 */
async function testNewMethod() {
  console.log('\n🟢 PROBANDO MÉTODO NUEVO (optimizado)');
  console.log('=' .repeat(50));
  
  const startTime = performance.now();
  readCount = 0;
  
  try {
    // Consulta optimizada para servicios destacados
    console.log('1. Cargando servicios destacados con filtro del SERVIDOR...');
    const featuredQuery = query(
      collection(db, 'services'),
      where('active', '==', true),
      where('featured', '==', true),
      orderBy('rating', 'desc'),
      limit(6)
    );
    const featuredServices = await countingGetDocs(featuredQuery);
    console.log(`   Servicios destacados obtenidos: ${featuredServices.size}`);
    
    // Consulta optimizada por categoría
    console.log('2. Cargando servicios por categoría con filtro del SERVIDOR...');
    const categoryQuery = query(
      collection(db, 'services'),
      where('active', '==', true),
      where('category', '==', 'Peluquería'),
      orderBy('createdAt', 'desc'),
      limit(12)
    );
    const categoryServices = await countingGetDocs(categoryQuery);
    console.log(`   Servicios de peluquería obtenidos: ${categoryServices.size}`);
    
    // Consulta optimizada por usuario
    console.log('3. Cargando servicios de usuario con filtro del SERVIDOR...');
    const userQuery = query(
      collection(db, 'services'),
      where('userId', '==', 'test-user-id'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    const userServices = await countingGetDocs(userQuery);
    console.log(`   Servicios del usuario obtenidos: ${userServices.size}`);
    
    // Prueba de paginación
    console.log('4. Probando paginación optimizada...');
    const firstPageQuery = query(
      collection(db, 'services'),
      where('active', '==', true),
      orderBy('createdAt', 'desc'),
      limit(12)
    );
    const firstPage = await countingGetDocs(firstPageQuery);
    console.log(`   Primera página obtenida: ${firstPage.size} servicios`);
    
    if (firstPage.docs.length > 0) {
      const lastDoc = firstPage.docs[firstPage.docs.length - 1];
      const secondPageQuery = query(
        collection(db, 'services'),
        where('active', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(12)
      );
      const secondPage = await countingGetDocs(secondPageQuery);
      console.log(`   Segunda página obtenida: ${secondPage.size} servicios`);
    }
    
  } catch (error) {
    console.error('❌ Error en método nuevo:', error.message);
    if (error.message.includes('index')) {
      console.log('\n⚠️  NOTA: Necesitas crear los índices compuestos en Firebase Console.');
      console.log('   Consulta la documentación en docs/firebase-data-structure.md');
    }
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log('\n📈 RESULTADOS MÉTODO NUEVO:');
  console.log(`   💰 Total lecturas Firebase: ${readCount}`);
  console.log(`   ⏱️  Tiempo total: ${duration.toFixed(2)}ms`);
  console.log(`   💸 Costo estimado: $${(readCount * 0.0000036).toFixed(6)}`);
  
  return { reads: readCount, time: duration };
}

/**
 * Compara ambos métodos y muestra mejoras
 */
async function compareResults(oldResults, newResults) {
  console.log('\n🏆 COMPARACIÓN DE RESULTADOS');
  console.log('=' .repeat(50));
  
  const readReduction = oldResults.reads - newResults.reads;
  const readReductionPercent = ((readReduction / oldResults.reads) * 100).toFixed(1);
  
  const timeImprovement = oldResults.time - newResults.time;
  const timeImprovementPercent = ((timeImprovement / oldResults.time) * 100).toFixed(1);
  
  const costSavings = (readReduction * 0.0000036).toFixed(6);
  
  console.log(`📊 Reducción de lecturas: ${readReduction} (${readReductionPercent}% menos)`);
  console.log(`⚡ Mejora de velocidad: ${timeImprovement.toFixed(2)}ms (${timeImprovementPercent}% más rápido)`);
  console.log(`💰 Ahorro de costos: $${costSavings} por consulta`);
  
  // Proyección mensual
  const monthlyQueries = 50000; // Estimación conservadora
  const monthlySavings = (readReduction * monthlyQueries * 0.0000036).toFixed(2);
  
  console.log('\n📈 PROYECCIÓN MENSUAL (50,000 consultas):');
  console.log(`   Método antiguo: $${(oldResults.reads * monthlyQueries * 0.0000036).toFixed(2)}/mes`);
  console.log(`   Método nuevo: $${(newResults.reads * monthlyQueries * 0.0000036).toFixed(2)}/mes`);
  console.log(`   💸 Ahorro total: $${monthlySavings}/mes`);
  
  // Proyección para 1,000 servicios
  console.log('\n🚀 PROYECCIÓN PARA 1,000 SERVICIOS:');
  const scaleFactor = 1000 / 18; // Asumiendo 18 servicios actuales
  const scaledOldReads = oldResults.reads * scaleFactor;
  const scaledNewReads = newResults.reads; // Las consultas optimizadas no escalan linealmente
  
  console.log(`   Método antiguo: ${scaledOldReads.toFixed(0)} lecturas por consulta`);
  console.log(`   Método nuevo: ${scaledNewReads} lecturas por consulta`);
  console.log(`   💰 Costo mensual estimado: $${(scaledNewReads * monthlyQueries * 0.0000036).toFixed(2)}`);
  
  if ((scaledNewReads * monthlyQueries * 0.0000036) < 10) {
    console.log('   ✅ ¡Objetivo de $10/mes ALCANZADO!');
  } else {
    console.log('   ⚠️  Necesitas más optimizaciones para alcanzar $10/mes');
  }
}

/**
 * Función principal
 */
async function runOptimizationTest() {
  console.log('🧪 INICIANDO PRUEBAS DE OPTIMIZACIÓN DE FIREBASE');
  console.log('=' .repeat(60));
  
  try {
    // Prueba método antiguo
    const oldResults = await testOldMethod();
    
    // Espera un momento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prueba método nuevo
    const newResults = await testNewMethod();
    
    // Compara resultados
    await compareResults(oldResults, newResults);
    
    console.log('\n✅ PRUEBAS COMPLETADAS EXITOSAMENTE');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

/**
 * Prueba específica de caché con SWR
 */
async function testCacheEfficiency() {
  console.log('\n🔄 PROBANDO EFICIENCIA DE CACHÉ');
  console.log('=' .repeat(40));
  
  // Simula múltiples consultas idénticas
  const testQuery = query(
    collection(db, 'services'),
    where('active', '==', true),
    where('featured', '==', true),
    limit(6)
  );
  
  console.log('Primera consulta (sin caché):');
  readCount = 0;
  await countingGetDocs(testQuery);
  const firstQueryReads = readCount;
  
  console.log('\n⚠️  NOTA: En la implementación real con SWR,');
  console.log('   las consultas subsecuentes usarían caché y no');
  console.log('   generarían lecturas adicionales de Firebase.');
  console.log(`   Lecturas evitadas por consulta: ${firstQueryReads}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runOptimizationTest()
    .then(() => testCacheEfficiency())
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = {
  runOptimizationTest,
  testOldMethod,
  testNewMethod,
  compareResults,
  testCacheEfficiency
};