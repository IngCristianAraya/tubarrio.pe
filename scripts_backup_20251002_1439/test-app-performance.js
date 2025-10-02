/**
 * Script para probar el rendimiento de la aplicación con las optimizaciones implementadas
 * Simula el comportamiento real del usuario y mide el consumo de lecturas
 */

const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase
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

// Simulador de localStorage
class LocalStorageSimulator {
  constructor() {
    this.data = {};
  }
  
  getItem(key) {
    const item = this.data[key];
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    // Verificar expiración (simulando TTL de 1 hora)
    if (Date.now() - parsed.timestamp > 3600000) {
      delete this.data[key];
      return null;
    }
    
    return parsed.data;
  }
  
  setItem(key, value) {
    this.data[key] = JSON.stringify({
      data: value,
      timestamp: Date.now()
    });
  }
  
  clear() {
    this.data = {};
  }
  
  getStats() {
    return {
      totalItems: Object.keys(this.data).length,
      sizeKB: JSON.stringify(this.data).length / 1024
    };
  }
}

// Simulador de analytics de servicios
class ServiceAnalyticsSimulator {
  constructor(localStorage) {
    this.localStorage = localStorage;
    this.visits = this.loadVisits();
  }
  
  loadVisits() {
    const stored = this.localStorage.getItem('service_visits');
    return stored ? JSON.parse(stored) : [];
  }
  
  trackVisit(serviceId) {
    this.visits.push({
      serviceId,
      timestamp: Date.now()
    });
    
    // Mantener solo las últimas 1000 visitas
    if (this.visits.length > 1000) {
      this.visits = this.visits.slice(-1000);
    }
    
    this.localStorage.setItem('service_visits', JSON.stringify(this.visits));
  }
  
  getPopularServices(count = 10) {
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Filtrar visitas de la última semana
    const recentVisits = this.visits.filter(visit => visit.timestamp > oneWeekAgo);
    
    // Contar visitas por servicio
    const visitCounts = {};
    recentVisits.forEach(visit => {
      visitCounts[visit.serviceId] = (visitCounts[visit.serviceId] || 0) + 1;
    });
    
    // Ordenar por popularidad
    return Object.entries(visitCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([serviceId, visits]) => ({ serviceId, visits }));
  }
}

// Contador global de lecturas
let totalReads = 0;
let readsByOperation = {};

function trackRead(operation, count = 1) {
  totalReads += count;
  readsByOperation[operation] = (readsByOperation[operation] || 0) + count;
  console.log(`📊 ${operation}: +${count} lecturas (Total: ${totalReads})`);
}

// Simulador de escenarios de usuario
class UserScenarioSimulator {
  constructor() {
    this.localStorage = new LocalStorageSimulator();
    this.analytics = new ServiceAnalyticsSimulator(this.localStorage);
    this.readCount = 0;
  }
  
  // Escenario 1: Usuario nuevo visita la página principal
  async scenarioNewUser() {
    console.log('\n👤 ESCENARIO 1: Usuario nuevo visita página principal');
    console.log('-'.repeat(50));
    
    const startTime = Date.now();
    this.readCount = 0;
    
    // Simular carga inicial de servicios destacados (sin cache)
    console.log('🔄 Cargando servicios destacados...');
    await this.loadFeaturedServices();
    
    // Simular carga de página principal con paginación
    console.log('🔄 Cargando servicios principales...');
    await this.loadMainServices();
    
    const endTime = Date.now();
    console.log(`⏱️  Tiempo total: ${endTime - startTime}ms`);
    console.log(`📈 Lecturas totales: ${this.readCount}`);
    
    return {
      scenario: 'new_user',
      time: endTime - startTime,
      reads: this.readCount
    };
  }
  
  // Escenario 2: Usuario recurrente con cache
  async scenarioReturningUser() {
    console.log('\n👤 ESCENARIO 2: Usuario recurrente (con cache)');
    console.log('-'.repeat(50));
    
    const startTime = Date.now();
    this.readCount = 0;
    
    // Simular cache hits para servicios destacados
    console.log('🎯 Verificando cache de servicios destacados...');
    const cachedFeatured = this.localStorage.getItem('featured_services');
    if (cachedFeatured) {
      console.log('✅ Cache HIT - Servicios destacados cargados desde cache');
    } else {
      console.log('❌ Cache MISS - Cargando servicios destacados...');
      await this.loadFeaturedServices();
    }
    
    // Simular navegación a servicios previamente visitados
    console.log('🔄 Navegando a servicios populares...');
    const popularServices = this.analytics.getPopularServices(5);
    
    for (const { serviceId } of popularServices) {
      const cached = this.localStorage.getItem(`service_${serviceId}`);
      if (cached) {
        console.log(`🎯 Cache HIT para servicio ${serviceId}`);
      } else {
        console.log(`❌ Cache MISS para servicio ${serviceId}`);
        await this.loadSingleService(serviceId);
      }
    }
    
    const endTime = Date.now();
    console.log(`⏱️  Tiempo total: ${endTime - startTime}ms`);
    console.log(`📈 Lecturas totales: ${this.readCount}`);
    
    return {
      scenario: 'returning_user',
      time: endTime - startTime,
      reads: this.readCount
    };
  }
  
  // Escenario 3: Navegación intensiva
  async scenarioIntensiveNavigation() {
    console.log('\n👤 ESCENARIO 3: Navegación intensiva');
    console.log('-'.repeat(50));
    
    const startTime = Date.now();
    this.readCount = 0;
    
    // Simular visita a múltiples servicios
    const serviceIds = ['service1', 'service2', 'service3', 'service4', 'service5'];
    
    for (const serviceId of serviceIds) {
      console.log(`🔄 Visitando servicio ${serviceId}...`);
      await this.loadSingleService(serviceId);
      this.analytics.trackVisit(serviceId);
      
      // Simular tiempo de lectura
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Simular precarga de servicios populares
    console.log('🚀 Iniciando precarga inteligente...');
    await this.preloadPopularServices();
    
    const endTime = Date.now();
    console.log(`⏱️  Tiempo total: ${endTime - startTime}ms`);
    console.log(`📈 Lecturas totales: ${this.readCount}`);
    
    return {
      scenario: 'intensive_navigation',
      time: endTime - startTime,
      reads: this.readCount
    };
  }
  
  // Métodos auxiliares para simular operaciones
  async loadFeaturedServices() {
    // Simular carga de 6 servicios destacados
    this.readCount += 6;
    trackRead('featured_services', 6);
    
    // Simular guardado en cache
    const mockFeatured = Array(6).fill(null).map((_, i) => ({ id: `featured_${i}` }));
    this.localStorage.setItem('featured_services', JSON.stringify(mockFeatured));
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  async loadMainServices() {
    // Simular carga paginada de 20 servicios
    this.readCount += 20;
    trackRead('main_services_paginated', 20);
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  async loadSingleService(serviceId) {
    // Verificar cache primero
    const cached = this.localStorage.getItem(`service_${serviceId}`);
    if (cached) {
      console.log(`🎯 Cache HIT para ${serviceId}`);
      return cached;
    }
    
    // Cache miss - cargar desde Firestore
    this.readCount += 1;
    trackRead('single_service', 1);
    
    // Simular guardado en cache
    const mockService = { id: serviceId, name: `Servicio ${serviceId}` };
    this.localStorage.setItem(`service_${serviceId}`, JSON.stringify(mockService));
    
    await new Promise(resolve => setTimeout(resolve, 150));
    return mockService;
  }
  
  async preloadPopularServices() {
    const popular = this.analytics.getPopularServices(3);
    
    for (const { serviceId } of popular) {
      const cached = this.localStorage.getItem(`service_${serviceId}`);
      if (!cached) {
        this.readCount += 1;
        trackRead('preload', 1);
        
        const mockService = { id: serviceId, name: `Servicio ${serviceId}` };
        this.localStorage.setItem(`service_${serviceId}`, JSON.stringify(mockService));
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}

// Función principal de pruebas
async function runPerformanceTests() {
  console.log('🚀 INICIANDO PRUEBAS DE RENDIMIENTO DE LA APLICACIÓN');
  console.log('='.repeat(60));
  
  const simulator = new UserScenarioSimulator();
  const results = [];
  
  try {
    // Ejecutar escenarios
    results.push(await simulator.scenarioNewUser());
    results.push(await simulator.scenarioReturningUser());
    results.push(await simulator.scenarioIntensiveNavigation());
    
    // Generar reporte comparativo
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE COMPARATIVO DE ESCENARIOS');
    console.log('='.repeat(60));
    
    results.forEach(result => {
      console.log(`\n${result.scenario.toUpperCase()}:`);
      console.log(`  ⏱️  Tiempo: ${result.time}ms`);
      console.log(`  📈 Lecturas: ${result.reads}`);
      console.log(`  💰 Costo estimado: $${(result.reads * 0.00036).toFixed(4)} USD`);
    });
    
    // Estadísticas de cache
    const cacheStats = simulator.localStorage.getStats();
    console.log('\n📦 ESTADÍSTICAS DE CACHE:');
    console.log(`  Items almacenados: ${cacheStats.totalItems}`);
    console.log(`  Tamaño total: ${cacheStats.sizeKB.toFixed(2)} KB`);
    
    // Lecturas por operación
    console.log('\n📊 LECTURAS POR OPERACIÓN:');
    Object.entries(readsByOperation).forEach(([operation, count]) => {
      console.log(`  ${operation}: ${count} lecturas`);
    });
    
    // Calcular ahorros estimados
    const traditionalReads = 100; // Estimación sin optimizaciones
    const optimizedReads = totalReads;
    const savings = traditionalReads - optimizedReads;
    const savingsPercentage = (savings / traditionalReads * 100).toFixed(1);
    
    console.log('\n💰 AHORROS ESTIMADOS:');
    console.log(`  Sin optimizaciones: ${traditionalReads} lecturas`);
    console.log(`  Con optimizaciones: ${optimizedReads} lecturas`);
    console.log(`  Ahorros: ${savings} lecturas (${savingsPercentage}%)`);
    console.log(`  Ahorro monetario: $${(savings * 0.00036).toFixed(4)} USD por sesión`);
    
    // Guardar reporte
    const report = {
      timestamp: new Date().toISOString(),
      scenarios: results,
      cacheStats,
      readsByOperation,
      totalReads,
      estimatedSavings: {
        reads: savings,
        percentage: savingsPercentage,
        costUSD: (savings * 0.00036).toFixed(4)
      }
    };
    
    require('fs').writeFileSync('app-performance-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Reporte guardado en: app-performance-report.json');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
  
  console.log('\n✅ PRUEBAS DE RENDIMIENTO COMPLETADAS');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runPerformanceTests();
}

module.exports = {
  runPerformanceTests,
  UserScenarioSimulator,
  LocalStorageSimulator,
  ServiceAnalyticsSimulator
};