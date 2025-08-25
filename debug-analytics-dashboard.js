// Script de diagnóstico específico para el dashboard de analytics
// Ejecutar en la consola del navegador en la página /admin

console.log('🔍 DIAGNÓSTICO DEL DASHBOARD DE ANALYTICS');
console.log('============================================');

const debugAnalyticsDashboard = async () => {
  try {
    console.log('1. 📊 Verificando datos en Firestore...');
    
    // Importar Firebase
    const { db } = await import('./src/lib/firebase/config.js');
    const { collection, getDocs, query, where, orderBy, limit } = await import('firebase/firestore');
    
    if (!db) {
      console.error('❌ Base de datos no inicializada');
      return;
    }
    
    console.log('✅ Base de datos conectada');
    
    // Verificar todos los documentos en la colección analytics
    console.log('2. 📋 Obteniendo todos los eventos...');
    const analyticsRef = collection(db, 'analytics');
    const allDocsQuery = query(analyticsRef, orderBy('timestamp', 'desc'), limit(50));
    const allSnapshot = await getDocs(allDocsQuery);
    
    console.log(`📈 Total de eventos encontrados: ${allSnapshot.size}`);
    
    if (allSnapshot.size === 0) {
      console.log('⚠️ No hay eventos en la colección analytics');
      console.log('💡 Solución: Crear algunos eventos de prueba primero');
      return;
    }
    
    // Mostrar algunos eventos de ejemplo
    console.log('📋 Primeros 10 eventos:');
    allSnapshot.docs.slice(0, 10).forEach((doc, index) => {
      const data = doc.data();
      const timestamp = data.timestamp;
      let timestampStr = 'Invalid timestamp';
      
      try {
        if (timestamp && typeof timestamp.toDate === 'function') {
          timestampStr = timestamp.toDate().toISOString();
        } else if (timestamp instanceof Date) {
          timestampStr = timestamp.toISOString();
        } else {
          timestampStr = `${timestamp} (${typeof timestamp})`;
        }
      } catch (e) {
        timestampStr = `Error: ${e.message}`;
      }
      
      console.log(`  ${index + 1}. ${data.type} | ${data.page || data.serviceId || 'N/A'} | ${timestampStr}`);
    });
    
    // Probar la consulta con filtro de fecha (como lo hace getMetrics)
    console.log('\n3. 🔍 Probando consulta con filtro de fecha (últimos 30 días)...');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    console.log(`📅 Fecha de inicio: ${startDate.toISOString()}`);
    
    const filteredQuery = query(
      analyticsRef,
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'desc')
    );
    
    try {
      const filteredSnapshot = await getDocs(filteredQuery);
      console.log(`📊 Eventos en los últimos 30 días: ${filteredSnapshot.size}`);
      
      if (filteredSnapshot.size === 0) {
        console.log('⚠️ No hay eventos en los últimos 30 días');
        console.log('💡 Posibles causas:');
        console.log('   - Los eventos son más antiguos de 30 días');
        console.log('   - Hay un problema con el formato de timestamp');
        console.log('   - Los eventos no se están guardando correctamente');
        
        // Verificar el timestamp del evento más reciente
        if (allSnapshot.size > 0) {
          const mostRecent = allSnapshot.docs[0].data();
          const recentTimestamp = mostRecent.timestamp;
          
          console.log('\n🕐 Analizando timestamp del evento más reciente:');
          console.log(`   Tipo: ${typeof recentTimestamp}`);
          console.log(`   Valor: ${recentTimestamp}`);
          
          if (recentTimestamp && typeof recentTimestamp.toDate === 'function') {
            const date = recentTimestamp.toDate();
            console.log(`   Fecha convertida: ${date.toISOString()}`);
            console.log(`   Días desde hoy: ${Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))}`);
          }
        }
      } else {
        console.log('✅ Eventos encontrados en el rango de fecha');
        
        // Calcular métricas como lo hace el dashboard
        const events = filteredSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp
          };
        });
        
        const metrics = {
          totalPageViews: events.filter(e => e.type === 'page_view').length,
          totalServiceClicks: events.filter(e => e.type === 'service_click').length,
          totalContactClicks: events.filter(e => e.type === 'whatsapp_click' || e.type === 'phone_click').length,
          whatsappClicks: events.filter(e => e.type === 'whatsapp_click').length,
          phoneClicks: events.filter(e => e.type === 'phone_click').length
        };
        
        console.log('\n📊 MÉTRICAS CALCULADAS:');
        console.log(`   📄 Vistas de página: ${metrics.totalPageViews}`);
        console.log(`   🎯 Clics en servicios: ${metrics.totalServiceClicks}`);
        console.log(`   📞 Contactos totales: ${metrics.totalContactClicks}`);
        console.log(`   💬 WhatsApp: ${metrics.whatsappClicks}`);
        console.log(`   📱 Teléfono: ${metrics.phoneClicks}`);
        
        if (metrics.totalPageViews === 0 && metrics.totalServiceClicks === 0 && metrics.totalContactClicks === 0) {
          console.log('⚠️ Todas las métricas están en 0');
          console.log('💡 Esto podría explicar por qué el dashboard no muestra datos');
        }
      }
    } catch (queryError) {
      console.error('❌ Error en la consulta con filtro de fecha:', queryError);
      console.log('💡 Esto podría ser el problema principal del dashboard');
      
      if (queryError.message.includes('index')) {
        console.log('🔧 SOLUCIÓN: Necesitas crear un índice compuesto en Firestore');
        console.log('   1. Ve a Firebase Console > Firestore > Indexes');
        console.log('   2. Crea un índice para la colección "analytics"');
        console.log('   3. Campos: timestamp (Ascending), __name__ (Ascending)');
      }
    }
    
    // Verificar el contexto de React
    console.log('\n4. ⚛️ Verificando contexto de React...');
    
    // Buscar elementos del dashboard
    const dashboardElements = {
      loadingText: document.querySelector('*:contains("Cargando estadísticas")')?.textContent,
      analyticsCards: document.querySelectorAll('[class*="metric"], [class*="card"]').length,
      errorMessages: document.querySelectorAll('[class*="error"]').length
    };
    
    console.log('🔍 Elementos del dashboard encontrados:');
    console.log(`   📝 Texto de carga: ${dashboardElements.loadingText ? 'Sí' : 'No'}`);
    console.log(`   📊 Tarjetas/elementos: ${dashboardElements.analyticsCards}`);
    console.log(`   ❌ Mensajes de error: ${dashboardElements.errorMessages}`);
    
    console.log('\n🎉 DIAGNÓSTICO COMPLETADO');
    console.log('========================');
    
    if (allSnapshot.size === 0) {
      console.log('🔧 ACCIÓN REQUERIDA: Crear eventos de prueba');
      console.log('   Usa el script test-analytics.js para crear eventos');
    } else if (filteredSnapshot && filteredSnapshot.size === 0) {
      console.log('🔧 ACCIÓN REQUERIDA: Verificar filtro de fechas');
      console.log('   Los eventos existen pero no están en el rango de 30 días');
    } else {
      console.log('✅ Los datos están disponibles');
      console.log('🔧 ACCIÓN REQUERIDA: Verificar el componente React');
      console.log('   El problema podría estar en el frontend, no en los datos');
    }
    
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que estés en la página /admin');
    console.log('2. Verificar la conexión a Firebase');
    console.log('3. Verificar los permisos de Firestore');
    console.log('4. Revisar la consola por otros errores');
  }
};

// Función para crear eventos de prueba si no existen
const createTestEvents = async () => {
  try {
    console.log('🧪 Creando eventos de prueba...');
    
    const { db } = await import('./src/lib/firebase/config.js');
    const { collection, addDoc } = await import('firebase/firestore');
    
    const testEvents = [
      {
        type: 'page_view',
        page: '/test-dashboard-1',
        timestamp: new Date(),
        userAgent: navigator.userAgent
      },
      {
        type: 'page_view',
        page: '/test-dashboard-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
        userAgent: navigator.userAgent
      },
      {
        type: 'service_click',
        serviceId: 'test-service-1',
        serviceName: 'Servicio de Prueba 1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
        userAgent: navigator.userAgent
      },
      {
        type: 'whatsapp_click',
        serviceId: 'test-service-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 horas atrás
        userAgent: navigator.userAgent
      }
    ];
    
    const analyticsRef = collection(db, 'analytics');
    
    for (const event of testEvents) {
      await addDoc(analyticsRef, event);
      console.log(`✅ Evento creado: ${event.type}`);
    }
    
    console.log('🎉 Eventos de prueba creados exitosamente');
    console.log('💡 Ahora recarga la página /admin para ver los datos');
    
  } catch (error) {
    console.error('❌ Error creando eventos de prueba:', error);
  }
};

// Ejecutar diagnóstico automáticamente
console.log('🚀 Iniciando diagnóstico del dashboard...');
debugAnalyticsDashboard();

// Funciones disponibles
window.debugDashboard = debugAnalyticsDashboard;
window.createTestEvents = createTestEvents;

console.log('\n💡 FUNCIONES DISPONIBLES:');
console.log('- debugDashboard(): Ejecutar diagnóstico completo');
console.log('- createTestEvents(): Crear eventos de prueba para el dashboard');