/**
 * Script para probar el consumo de lecturas de Firestore
 * Mide las lecturas antes y después de las optimizaciones implementadas
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc, query, limit, startAfter, orderBy } = require('firebase/firestore');
const fs = require('fs');

// Configuración de Firebase (usar variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Contador de lecturas
let readCount = 0;

// Función para simular cache localStorage
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  clear() {
    this.data = {};
  }
};

// Función para incrementar contador de lecturas
function incrementReadCount(operation, count = 1) {
  readCount += count;
  console.log(`📊 ${operation}: +${count} lecturas (Total: ${readCount})`);
}

// Test 1: Cargar todos los servicios (método anterior)
async function testLoadAllServices() {
  console.log('\n🔍 TEST 1: Carga tradicional de todos los servicios');
  const startTime = Date.now();
  
  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    
    incrementReadCount('getDocs(services)', snapshot.size);
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const endTime = Date.now();
    console.log(`✅ Cargados ${services.length} servicios en ${endTime - startTime}ms`);
    console.log(`📈 Total de lecturas: ${readCount}`);
    
    return services;
  } catch (error) {
    console.error('❌ Error en test 1:', error);
    return [];
  }
}

// Test 2: Carga con paginación (método optimizado)
async function testPaginatedLoad() {
  console.log('\n🔍 TEST 2: Carga con paginación optimizada');
  readCount = 0; // Reset contador
  const startTime = Date.now();
  
  try {
    const servicesRef = collection(db, 'services');
    const firstQuery = query(servicesRef, orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(firstQuery);
    
    incrementReadCount('getDocs(paginado)', snapshot.size);
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const endTime = Date.now();
    console.log(`✅ Cargados ${services.length} servicios en ${endTime - startTime}ms`);
    console.log(`📈 Total de lecturas: ${readCount}`);
    
    return { services, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
  } catch (error) {
    console.error('❌ Error en test 2:', error);
    return { services: [], lastDoc: null };
  }
}

// Test 3: Carga de servicio individual con cache
async function testSingleServiceWithCache(serviceId) {
  console.log('\n🔍 TEST 3: Carga de servicio individual con cache');
  readCount = 0; // Reset contador
  
  // Simular cache hit
  const cacheKey = `service_${serviceId}`;
  const cachedService = mockLocalStorage.getItem(cacheKey);
  
  if (cachedService) {
    console.log('🎯 Cache HIT - No se requieren lecturas de Firestore');
    console.log(`📈 Total de lecturas: ${readCount}`);
    return JSON.parse(cachedService);
  }
  
  // Cache miss - cargar desde Firestore
  console.log('❌ Cache MISS - Cargando desde Firestore');
  const startTime = Date.now();
  
  try {
    const serviceRef = doc(db, 'services', serviceId);
    const snapshot = await getDoc(serviceRef);
    
    incrementReadCount('getDoc(single)', 1);
    
    if (snapshot.exists()) {
      const service = { id: snapshot.id, ...snapshot.data() };
      
      // Guardar en cache
      mockLocalStorage.setItem(cacheKey, JSON.stringify(service));
      
      const endTime = Date.now();
      console.log(`✅ Servicio cargado en ${endTime - startTime}ms`);
      console.log(`📈 Total de lecturas: ${readCount}`);
      
      return service;
    } else {
      console.log('❌ Servicio no encontrado');
      return null;
    }
  } catch (error) {
    console.error('❌ Error en test 3:', error);
    return null;
  }
}

// Test 4: Simulación de precarga inteligente
async function testIntelligentPreloading(popularServiceIds) {
  console.log('\n🔍 TEST 4: Precarga inteligente de servicios populares');
  readCount = 0; // Reset contador
  const startTime = Date.now();
  
  const preloadedServices = [];
  
  for (const serviceId of popularServiceIds) {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      const snapshot = await getDoc(serviceRef);
      
      incrementReadCount('getDoc(preload)', 1);
      
      if (snapshot.exists()) {
        const service = { id: snapshot.id, ...snapshot.data() };
        preloadedServices.push(service);
        
        // Simular guardado en cache
        mockLocalStorage.setItem(`service_${serviceId}`, JSON.stringify(service));
      }
      
      // Simular delay entre precargas
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error precargando servicio ${serviceId}:`, error);
    }
  }
  
  const endTime = Date.now();
  console.log(`✅ Precargados ${preloadedServices.length} servicios en ${endTime - startTime}ms`);
  console.log(`📈 Total de lecturas: ${readCount}`);
  
  return preloadedServices;
}

// Test 5: Comparación de rendimiento
async function testPerformanceComparison() {
  console.log('\n🔍 TEST 5: Comparación de rendimiento');
  
  const results = {
    traditional: { reads: 0, time: 0 },
    paginated: { reads: 0, time: 0 },
    cached: { reads: 0, time: 0 },
    preloaded: { reads: 0, time: 0 }
  };
  
  // Test tradicional
  console.log('\n--- Método Tradicional ---');
  const traditionalStart = Date.now();
  readCount = 0;
  await testLoadAllServices();
  results.traditional.reads = readCount;
  results.traditional.time = Date.now() - traditionalStart;
  
  // Test paginado
  console.log('\n--- Método Paginado ---');
  const paginatedStart = Date.now();
  readCount = 0;
  await testPaginatedLoad();
  results.paginated.reads = readCount;
  results.paginated.time = Date.now() - paginatedStart;
  
  // Test con cache
  console.log('\n--- Método con Cache ---');
  const cachedStart = Date.now();
  readCount = 0;
  // Simular múltiples accesos al mismo servicio
  await testSingleServiceWithCache('test-service-1');
  await testSingleServiceWithCache('test-service-1'); // Cache hit
  await testSingleServiceWithCache('test-service-1'); // Cache hit
  results.cached.reads = readCount;
  results.cached.time = Date.now() - cachedStart;
  
  return results;
}

// Función principal
async function runFirestoreReadTests() {
  console.log('🚀 INICIANDO PRUEBAS DE CONSUMO DE LECTURAS DE FIRESTORE\n');
  console.log('=' .repeat(60));
  
  try {
    // Obtener algunos IDs de servicios reales para las pruebas
    const servicesRef = collection(db, 'services');
    const sampleQuery = query(servicesRef, limit(5));
    const sampleSnapshot = await getDocs(sampleQuery);
    const sampleServiceIds = sampleSnapshot.docs.map(doc => doc.id);
    
    console.log(`📋 Servicios de muestra obtenidos: ${sampleServiceIds.length}`);
    
    // Ejecutar todos los tests
    await testLoadAllServices();
    await testPaginatedLoad();
    
    if (sampleServiceIds.length > 0) {
      await testSingleServiceWithCache(sampleServiceIds[0]);
      await testIntelligentPreloading(sampleServiceIds.slice(0, 3));
    }
    
    // Comparación de rendimiento
    const performanceResults = await testPerformanceComparison();
    
    // Generar reporte
    console.log('\n' + '=' .repeat(60));
    console.log('📊 REPORTE DE RESULTADOS');
    console.log('=' .repeat(60));
    
    console.log('\n🔥 COMPARACIÓN DE MÉTODOS:');
    console.log(`Tradicional: ${performanceResults.traditional.reads} lecturas, ${performanceResults.traditional.time}ms`);
    console.log(`Paginado: ${performanceResults.paginated.reads} lecturas, ${performanceResults.paginated.time}ms`);
    console.log(`Con Cache: ${performanceResults.cached.reads} lecturas, ${performanceResults.cached.time}ms`);
    
    // Calcular ahorros
    const readSavings = performanceResults.traditional.reads - performanceResults.paginated.reads;
    const timeSavings = performanceResults.traditional.time - performanceResults.paginated.time;
    
    console.log('\n💰 AHORROS OBTENIDOS:');
    console.log(`Lecturas ahorradas: ${readSavings} (${((readSavings / performanceResults.traditional.reads) * 100).toFixed(1)}%)`);
    console.log(`Tiempo ahorrado: ${timeSavings}ms (${((timeSavings / performanceResults.traditional.time) * 100).toFixed(1)}%)`);
    
    // Guardar reporte en archivo
    const report = {
      timestamp: new Date().toISOString(),
      results: performanceResults,
      savings: {
        reads: readSavings,
        time: timeSavings,
        readPercentage: ((readSavings / performanceResults.traditional.reads) * 100).toFixed(1),
        timePercentage: ((timeSavings / performanceResults.traditional.time) * 100).toFixed(1)
      }
    };
    
    fs.writeFileSync('firestore-reads-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Reporte guardado en: firestore-reads-report.json');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
  
  console.log('\n✅ PRUEBAS COMPLETADAS');
  process.exit(0);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runFirestoreReadTests();
}

module.exports = {
  runFirestoreReadTests,
  testLoadAllServices,
  testPaginatedLoad,
  testSingleServiceWithCache,
  testIntelligentPreloading
};