// Script de diagnóstico mejorado para Analytics
// Ejecutar en la consola del navegador después de abrir la aplicación

console.log('🔍 DIAGNÓSTICO DE ANALYTICS - VERSIÓN 2');
console.log('==========================================');

// Función para probar el tracking manual
const testAnalyticsTracking = async () => {
  try {
    console.log('1. 🧪 Probando tracking manual...');
    
    // Verificar si el contexto de Analytics está disponible
    const analyticsContext = window.React?.useContext || null;
    if (!analyticsContext) {
      console.log('⚠️ React context no disponible directamente');
    }
    
    // Probar importación directa de Firebase
    console.log('2. 🔥 Verificando Firebase...');
    
    // Importar dinámicamente la configuración de Firebase
    const { db } = await import('./src/lib/firebase/config.js');
    
    if (!db) {
      console.error('❌ Base de datos no inicializada');
      return false;
    }
    
    console.log('✅ Base de datos inicializada correctamente');
    
    // Importar funciones de Firestore
    const { collection, addDoc, getDocs, query, orderBy, limit } = await import('firebase/firestore');
    
    console.log('3. 📊 Verificando colección analytics...');
    
    // Verificar si la colección analytics existe y tiene datos
    const analyticsRef = collection(db, 'analytics');
    const q = query(analyticsRef, orderBy('timestamp', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    
    console.log(`📈 Eventos encontrados: ${snapshot.size}`);
    
    if (snapshot.size > 0) {
      console.log('📋 Últimos eventos registrados:');
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate?.() || data.timestamp;
        console.log(`  ${index + 1}. ${data.type} | ${data.page || data.serviceId || 'N/A'} | ${timestamp}`);
      });
    } else {
      console.log('⚠️ No se encontraron eventos en la colección analytics');
    }
    
    console.log('4. 🧪 Creando evento de prueba...');
    
    // Crear un evento de prueba
    const testEvent = {
      type: 'page_view',
      page: '/test-diagnostico-' + Date.now(),
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };
    
    const docRef = await addDoc(analyticsRef, testEvent);
    console.log('✅ Evento de prueba creado con ID:', docRef.id);
    
    // Verificar que el evento se guardó
    const newSnapshot = await getDocs(q);
    console.log(`📈 Eventos después de la prueba: ${newSnapshot.size}`);
    
    console.log('\n🎉 DIAGNÓSTICO COMPLETADO');
    console.log('=========================');
    console.log('✅ Firebase: Funcionando');
    console.log('✅ Firestore: Funcionando');
    console.log('✅ Colección analytics: Accesible');
    console.log('✅ Escritura de eventos: Funcionando');
    
    if (snapshot.size === 0) {
      console.log('\n⚠️ POSIBLES CAUSAS DE FALTA DE DATOS:');
      console.log('1. El PageTracker no se está ejecutando automáticamente');
      console.log('2. Las páginas visitadas no están siendo tracked');
      console.log('3. Hay un error silencioso en el AnalyticsContext');
      console.log('4. El rango de fechas en el dashboard no incluye eventos recientes');
      
      console.log('\n🔧 SOLUCIONES RECOMENDADAS:');
      console.log('1. Usar el botón de prueba en la esquina inferior derecha');
      console.log('2. Navegar entre páginas para generar eventos automáticos');
      console.log('3. Verificar la consola por errores de JavaScript');
      console.log('4. Revisar el dashboard con un rango de fechas más amplio');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que las variables de entorno de Firebase estén configuradas');
    console.log('2. Comprobar la conexión a internet');
    console.log('3. Verificar los permisos de Firestore en Firebase Console');
    console.log('4. Revisar si hay bloqueadores de contenido activos');
    return false;
  }
};

// Función para verificar el estado del contexto de Analytics
const checkAnalyticsContext = () => {
  console.log('\n🔍 VERIFICANDO CONTEXTO DE ANALYTICS...');
  
  // Buscar elementos que indiquen que el contexto está funcionando
  const testButton = document.querySelector('[class*="Analytics"]') || 
                    document.querySelector('button:contains("Test")');
  
  if (testButton) {
    console.log('✅ Botón de prueba encontrado en la página');
  } else {
    console.log('⚠️ Botón de prueba no encontrado');
  }
  
  // Verificar si hay errores en la consola
  const errors = window.console.error.toString();
  console.log('📝 Verificar errores de consola manualmente');
};

// Ejecutar diagnóstico
console.log('🚀 Iniciando diagnóstico automático...');
testAnalyticsTracking().then(() => {
  checkAnalyticsContext();
  console.log('\n📋 INSTRUCCIONES ADICIONALES:');
  console.log('1. Si ves el botón "🧪 Analytics Test Panel" en la esquina inferior derecha, úsalo para hacer pruebas');
  console.log('2. Navega a /admin para ver el dashboard de analytics');
  console.log('3. Si no hay datos, usa los botones de prueba y luego recarga el dashboard');
  console.log('4. Verifica que el rango de fechas en el dashboard incluya hoy');
});

// Función auxiliar para usar desde la consola
window.testAnalytics = testAnalyticsTracking;
window.checkContext = checkAnalyticsContext;

console.log('\n💡 FUNCIONES DISPONIBLES:');
console.log('- testAnalytics(): Ejecutar diagnóstico completo');
console.log('- checkContext(): Verificar contexto de Analytics');