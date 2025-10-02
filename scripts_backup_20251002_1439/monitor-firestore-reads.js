// Script para monitorear lecturas de Firestore en la página de todos los servicios
// Ejecutar en la consola del navegador después de abrir http://localhost:3000/todos-los-servicios

console.log('🔍 MONITOR DE LECTURAS FIRESTORE - TODOS LOS SERVICIOS');
console.log('=======================================================');

// Contador global de lecturas
let firestoreReadCount = 0;
let queryDetails = [];
let startTime = Date.now();

// Interceptar las llamadas a Firestore
const originalGetDocs = window.firebase?.firestore?.getDocs;
const originalQuery = window.firebase?.firestore?.query;

// Función para interceptar getDocs
function interceptFirestoreReads() {
  // Intentar interceptar a través de la importación dinámica
  const interceptGetDocs = async () => {
    try {
      const { getDocs } = await import('firebase/firestore');
      const originalGetDocs = getDocs;
      
      // Reemplazar getDocs con nuestra versión que cuenta
      window.firebase = window.firebase || {};
      window.firebase.firestore = window.firebase.firestore || {};
      window.firebase.firestore.getDocs = async function(query) {
        const startQueryTime = Date.now();
        firestoreReadCount++;
        
        console.log(`📊 LECTURA #${firestoreReadCount} - Iniciando consulta...`);
        
        try {
          const result = await originalGetDocs(query);
          const docsRead = result.size;
          const queryTime = Date.now() - startQueryTime;
          
          queryDetails.push({
            queryNumber: firestoreReadCount,
            docsRead: docsRead,
            queryTime: queryTime,
            timestamp: new Date().toLocaleTimeString()
          });
          
          console.log(`✅ LECTURA #${firestoreReadCount} completada:`);
          console.log(`   📄 Documentos leídos: ${docsRead}`);
          console.log(`   ⏱️ Tiempo: ${queryTime}ms`);
          console.log(`   🕐 Hora: ${new Date().toLocaleTimeString()}`);
          
          return result;
        } catch (error) {
          console.error(`❌ Error en LECTURA #${firestoreReadCount}:`, error);
          throw error;
        }
      };
      
      console.log('✅ Interceptor de Firestore configurado correctamente');
    } catch (error) {
      console.warn('⚠️ No se pudo configurar el interceptor:', error);
    }
  };
  
  interceptGetDocs();
}

// Función para mostrar estadísticas
function showReadStats() {
  const totalTime = Date.now() - startTime;
  const totalDocs = queryDetails.reduce((sum, query) => sum + query.docsRead, 0);
  
  console.log('\n📈 ESTADÍSTICAS DE LECTURAS FIRESTORE');
  console.log('=====================================');
  console.log(`🔢 Total de consultas: ${firestoreReadCount}`);
  console.log(`📄 Total de documentos leídos: ${totalDocs}`);
  console.log(`⏱️ Tiempo total de monitoreo: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`📊 Promedio docs por consulta: ${totalDocs > 0 ? (totalDocs / firestoreReadCount).toFixed(1) : 0}`);
  
  if (queryDetails.length > 0) {
    console.log('\n📋 DETALLE DE CONSULTAS:');
    queryDetails.forEach(query => {
      console.log(`   ${query.queryNumber}. ${query.timestamp} - ${query.docsRead} docs en ${query.queryTime}ms`);
    });
  }
  
  // Análisis de optimización
  console.log('\n🎯 ANÁLISIS DE OPTIMIZACIÓN:');
  if (firestoreReadCount <= 2) {
    console.log('✅ EXCELENTE: Muy pocas consultas, optimización efectiva');
  } else if (firestoreReadCount <= 5) {
    console.log('✅ BUENO: Número razonable de consultas');
  } else if (firestoreReadCount <= 10) {
    console.log('⚠️ MODERADO: Considerar más optimizaciones');
  } else {
    console.log('❌ ALTO: Demasiadas consultas, revisar cache y lógica');
  }
  
  if (totalDocs > 100) {
    console.log('⚠️ ADVERTENCIA: Muchos documentos leídos, verificar límites de consulta');
  }
}

// Función para resetear el contador
function resetReadCounter() {
  firestoreReadCount = 0;
  queryDetails = [];
  startTime = Date.now();
  console.log('🔄 Contador de lecturas reseteado');
}

// Función para monitoreo automático
function startAutoMonitoring() {
  console.log('🚀 Iniciando monitoreo automático...');
  
  // Mostrar estadísticas cada 10 segundos
  const interval = setInterval(() => {
    if (firestoreReadCount > 0) {
      showReadStats();
    }
  }, 10000);
  
  // Detener después de 2 minutos
  setTimeout(() => {
    clearInterval(interval);
    console.log('⏹️ Monitoreo automático finalizado');
    showReadStats();
  }, 120000);
  
  return interval;
}

// Configurar interceptor
interceptFirestoreReads();

// Funciones disponibles globalmente
window.showFirestoreStats = showReadStats;
window.resetFirestoreCounter = resetReadCounter;
window.startFirestoreMonitoring = startAutoMonitoring;

console.log('\n💡 FUNCIONES DISPONIBLES:');
console.log('- showFirestoreStats(): Mostrar estadísticas actuales');
console.log('- resetFirestoreCounter(): Resetear contador');
console.log('- startFirestoreMonitoring(): Iniciar monitoreo automático');

console.log('\n📝 INSTRUCCIONES:');
console.log('1. Navega por la página de todos los servicios');
console.log('2. Usa filtros, paginación, búsqueda');
console.log('3. Ejecuta showFirestoreStats() para ver el consumo');
console.log('4. Compara con las optimizaciones implementadas');

// Iniciar monitoreo automático
startAutoMonitoring();