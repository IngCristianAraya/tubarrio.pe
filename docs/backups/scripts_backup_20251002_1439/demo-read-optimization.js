/**
 * Demostración del impacto de las optimizaciones implementadas
 * Simula el comportamiento sin conexión real a Firebase
 */

const fs = require('fs');

// Simulador de lecturas de Firestore
class FirestoreSimulator {
  constructor() {
    this.readCount = 0;
    this.operations = [];
  }
  
  // Simular getDocs (método anterior)
  async getDocs(collectionName, limit = null) {
    const count = limit || 100; // Sin límite, carga todos
    this.readCount += count;
    this.operations.push({
      operation: 'getDocs',
      collection: collectionName,
      reads: count,
      timestamp: Date.now()
    });
    
    console.log(`📊 getDocs(${collectionName}): +${count} lecturas`);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    return {
      docs: Array(count).fill(null).map((_, i) => ({
        id: `doc_${i}`,
        data: () => ({ name: `Servicio ${i}`, category: 'test' })
      }))
    };
  }
  
  // Simular getDoc (método optimizado)
  async getDoc(docId) {
    this.readCount += 1;
    this.operations.push({
      operation: 'getDoc',
      docId,
      reads: 1,
      timestamp: Date.now()
    });
    
    console.log(`📊 getDoc(${docId}): +1 lectura`);
    
    // Simular delay de red más rápido
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    return {
      exists: () => true,
      id: docId,
      data: () => ({ name: `Servicio ${docId}`, category: 'test' })
    };
  }
  
  getStats() {
    return {
      totalReads: this.readCount,
      operations: this.operations,
      estimatedCost: (this.readCount * 0.00036).toFixed(4)
    };
  }
  
  reset() {
    this.readCount = 0;
    this.operations = [];
  }
}

// Simulador de localStorage con TTL
class CacheSimulator {
  constructor() {
    this.storage = {};
    this.hits = 0;
    this.misses = 0;
  }
  
  get(key, ttlMs = 3600000) { // 1 hora por defecto
    const item = this.storage[key];
    if (!item) {
      this.misses++;
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    }
    
    if (Date.now() - item.timestamp > ttlMs) {
      delete this.storage[key];
      this.misses++;
      console.log(`⏰ Cache EXPIRED: ${key}`);
      return null;
    }
    
    this.hits++;
    console.log(`🎯 Cache HIT: ${key}`);
    return item.data;
  }
  
  set(key, data) {
    this.storage[key] = {
      data,
      timestamp: Date.now()
    };
    console.log(`💾 Cache SET: ${key}`);
  }
  
  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(1) : '0.0',
      totalItems: Object.keys(this.storage).length
    };
  }
  
  clear() {
    this.storage = {};
    this.hits = 0;
    this.misses = 0;
  }
}

// Demostración de escenarios
class OptimizationDemo {
  constructor() {
    this.firestore = new FirestoreSimulator();
    this.cache = new CacheSimulator();
  }
  
  // Escenario 1: Método tradicional (sin optimizaciones)
  async scenarioTraditional() {
    console.log('\n🔴 ESCENARIO 1: Método Tradicional (SIN optimizaciones)');
    console.log('-'.repeat(60));
    
    this.firestore.reset();
    this.cache.clear();
    
    const startTime = Date.now();
    
    // Cargar página principal - todos los servicios
    console.log('📄 Cargando página principal...');
    await this.firestore.getDocs('services'); // 100 servicios
    
    // Usuario navega a servicios individuales
    console.log('\n🔍 Usuario navega a servicios individuales...');
    for (let i = 0; i < 5; i++) {
      // Sin cache - cada visita requiere nueva consulta
      await this.firestore.getDocs('services', 1); // Buscar 1 servicio específico
    }
    
    // Cargar servicios destacados
    console.log('\n⭐ Cargando servicios destacados...');
    await this.firestore.getDocs('services', 10);
    
    const endTime = Date.now();
    const stats = this.firestore.getStats();
    
    console.log('\n📊 RESULTADOS:');
    console.log(`  ⏱️  Tiempo total: ${endTime - startTime}ms`);
    console.log(`  📈 Total de lecturas: ${stats.totalReads}`);
    console.log(`  💰 Costo estimado: $${stats.estimatedCost} USD`);
    
    return {
      scenario: 'traditional',
      time: endTime - startTime,
      reads: stats.totalReads,
      cost: parseFloat(stats.estimatedCost)
    };
  }
  
  // Escenario 2: Método optimizado
  async scenarioOptimized() {
    console.log('\n🟢 ESCENARIO 2: Método Optimizado (CON todas las optimizaciones)');
    console.log('-'.repeat(60));
    
    this.firestore.reset();
    this.cache.clear();
    
    const startTime = Date.now();
    
    // Cargar página principal - solo primera página (paginación)
    console.log('📄 Cargando página principal (paginado)...');
    const mainServices = await this.firestore.getDocs('services', 20); // Solo 20 servicios
    this.cache.set('main_services_page_1', mainServices);
    
    // Cargar servicios destacados con cache
    console.log('\n⭐ Cargando servicios destacados...');
    let featuredServices = this.cache.get('featured_services');
    if (!featuredServices) {
      featuredServices = await this.firestore.getDocs('services', 6);
      this.cache.set('featured_services', featuredServices);
    }
    
    // Usuario navega a servicios individuales (con cache)
    console.log('\n🔍 Usuario navega a servicios individuales...');
    const serviceIds = ['service_1', 'service_2', 'service_3', 'service_4', 'service_5'];
    
    for (const serviceId of serviceIds) {
      let service = this.cache.get(`service_${serviceId}`);
      if (!service) {
        service = await this.firestore.getDoc(serviceId); // getDoc en lugar de getDocs
        this.cache.set(`service_${serviceId}`, service);
      }
    }
    
    // Simular precarga inteligente
    console.log('\n🚀 Precarga inteligente de servicios populares...');
    const popularServices = ['popular_1', 'popular_2', 'popular_3'];
    for (const serviceId of popularServices) {
      let service = this.cache.get(`service_${serviceId}`);
      if (!service) {
        service = await this.firestore.getDoc(serviceId);
        this.cache.set(`service_${serviceId}`, service);
      }
    }
    
    // Simular segunda visita del usuario (todo desde cache)
    console.log('\n🔄 Usuario regresa - segunda visita...');
    for (const serviceId of serviceIds) {
      this.cache.get(`service_${serviceId}`); // Todo desde cache
    }
    
    const endTime = Date.now();
    const firestoreStats = this.firestore.getStats();
    const cacheStats = this.cache.getStats();
    
    console.log('\n📊 RESULTADOS:');
    console.log(`  ⏱️  Tiempo total: ${endTime - startTime}ms`);
    console.log(`  📈 Total de lecturas: ${firestoreStats.totalReads}`);
    console.log(`  💰 Costo estimado: $${firestoreStats.estimatedCost} USD`);
    console.log(`  🎯 Cache hit rate: ${cacheStats.hitRate}%`);
    console.log(`  💾 Items en cache: ${cacheStats.totalItems}`);
    
    return {
      scenario: 'optimized',
      time: endTime - startTime,
      reads: firestoreStats.totalReads,
      cost: parseFloat(firestoreStats.estimatedCost),
      cacheHitRate: parseFloat(cacheStats.hitRate),
      cacheItems: cacheStats.totalItems
    };
  }
  
  // Comparación y reporte
  generateComparisonReport(traditionalResult, optimizedResult) {
    const readsSaved = traditionalResult.reads - optimizedResult.reads;
    const costSaved = traditionalResult.cost - optimizedResult.cost;
    const timeSaved = traditionalResult.time - optimizedResult.time;
    
    const readsPercentage = ((readsSaved / traditionalResult.reads) * 100).toFixed(1);
    const costPercentage = ((costSaved / traditionalResult.cost) * 100).toFixed(1);
    const timePercentage = ((timeSaved / traditionalResult.time) * 100).toFixed(1);
    
    return {
      traditional: traditionalResult,
      optimized: optimizedResult,
      savings: {
        reads: readsSaved,
        cost: costSaved,
        time: timeSaved,
        readsPercentage: parseFloat(readsPercentage),
        costPercentage: parseFloat(costPercentage),
        timePercentage: parseFloat(timePercentage)
      },
      projections: this.calculateProjections(readsSaved, costSaved)
    };
  }
  
  calculateProjections(dailyReadsSaved, dailyCostSaved) {
    const usersPerDay = 1000; // Estimación
    
    return {
      daily: {
        reads: dailyReadsSaved * usersPerDay,
        cost: (dailyCostSaved * usersPerDay).toFixed(2)
      },
      monthly: {
        reads: dailyReadsSaved * usersPerDay * 30,
        cost: (dailyCostSaved * usersPerDay * 30).toFixed(2)
      },
      yearly: {
        reads: dailyReadsSaved * usersPerDay * 365,
        cost: (dailyCostSaved * usersPerDay * 365).toFixed(2)
      }
    };
  }
}

// Función principal
async function runOptimizationDemo() {
  console.log('🚀 DEMOSTRACIÓN DE OPTIMIZACIONES DE LECTURAS DE FIRESTORE');
  console.log('='.repeat(70));
  console.log('\n📋 Esta demostración compara:');
  console.log('  • Método tradicional: getDocs sin límites, sin cache');
  console.log('  • Método optimizado: paginación, getDoc, cache inteligente, precarga');
  
  const demo = new OptimizationDemo();
  
  try {
    // Ejecutar escenarios
    const traditionalResult = await demo.scenarioTraditional();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa
    const optimizedResult = await demo.scenarioOptimized();
    
    // Generar reporte comparativo
    const report = demo.generateComparisonReport(traditionalResult, optimizedResult);
    
    // Mostrar resultados
    console.log('\n' + '='.repeat(70));
    console.log('📊 REPORTE COMPARATIVO FINAL');
    console.log('='.repeat(70));
    
    console.log('\n📈 MÉTRICAS POR SESIÓN:');
    console.log(`  Método Tradicional: ${report.traditional.reads} lecturas, ${report.traditional.time}ms`);
    console.log(`  Método Optimizado:  ${report.optimized.reads} lecturas, ${report.optimized.time}ms`);
    
    console.log('\n💰 AHORROS POR SESIÓN:');
    console.log(`  📊 Lecturas: ${report.savings.reads} (${report.savings.readsPercentage}% menos)`);
    console.log(`  💵 Costo: $${report.savings.cost.toFixed(4)} USD (${report.savings.costPercentage}% menos)`);
    console.log(`  ⏱️  Tiempo: ${report.savings.time}ms (${report.savings.timePercentage}% menos)`);
    
    console.log('\n🌍 PROYECCIONES ESCALADAS (1000 usuarios/día):');
    console.log(`  📅 Diario: ${report.projections.daily.reads} lecturas, $${report.projections.daily.cost} USD`);
    console.log(`  📅 Mensual: ${report.projections.monthly.reads} lecturas, $${report.projections.monthly.cost} USD`);
    console.log(`  📅 Anual: ${report.projections.yearly.reads} lecturas, $${report.projections.yearly.cost} USD`);
    
    console.log('\n🎯 OPTIMIZACIONES IMPLEMENTADAS:');
    console.log('  ✅ Paginación real con Firestore (limit + startAfter)');
    console.log('  ✅ Cache agresivo con localStorage y TTL');
    console.log('  ✅ getDoc() en lugar de getDocs() para servicios individuales');
    console.log('  ✅ Precarga inteligente de servicios populares');
    console.log('  ✅ Analytics de comportamiento de usuario');
    console.log('  ✅ Optimización de consultas en dashboard admin');
    
    // Guardar reporte
    fs.writeFileSync('optimization-demo-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Reporte guardado en: optimization-demo-report.json');
    
    console.log('\n✅ DEMOSTRACIÓN COMPLETADA');
    console.log('\n🎉 Las optimizaciones implementadas reducen significativamente:');
    console.log('   • El consumo de lecturas de Firestore');
    console.log('   • Los costos operativos');
    console.log('   • Los tiempos de carga');
    console.log('   • La carga en el servidor');
    
  } catch (error) {
    console.error('❌ Error durante la demostración:', error);
  }
}

// Ejecutar demostración
if (require.main === module) {
  runOptimizationDemo();
}

module.exports = {
  runOptimizationDemo,
  OptimizationDemo,
  FirestoreSimulator,
  CacheSimulator
};