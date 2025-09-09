// Script para diagnosticar la carga de servicios desde Firebase
console.log('🔍 DIAGNÓSTICO: Verificando carga de servicios desde Firebase');

// 1. Verificar estado de Firebase
if (typeof window !== 'undefined') {
  console.log('📱 Ejecutándose en el navegador');
  
  // Verificar variables de entorno
  console.log('🔧 Variables de entorno:');
  console.log('  NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado');
  console.log('  NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('  NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
  
  // Verificar contexto de servicios
  setTimeout(() => {
    console.log('🔍 Verificando contexto de servicios...');
    
    // Buscar el contexto en el DOM
    const servicesElements = document.querySelectorAll('[data-testid="service-card"], .service-card, [class*="service"]');
    console.log('📊 Elementos de servicios encontrados:', servicesElements.length);
    
    // Verificar si hay datos mock o reales
    const mockIndicators = document.querySelectorAll('[data-mock="true"], .mock-data');
    console.log('🎭 Indicadores de datos mock:', mockIndicators.length);
    
    // Verificar localStorage
    const cachedServices = localStorage.getItem('services_cache');
    if (cachedServices) {
      try {
        const parsed = JSON.parse(cachedServices);
        console.log('💾 Servicios en cache:', parsed.length);
      } catch (e) {
        console.log('💾 Error al parsear cache:', e.message);
      }
    } else {
      console.log('💾 No hay servicios en cache');
    }
    
    // Verificar estado del contexto si está disponible
    if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      console.log('⚛️ React detectado, intentando acceder al contexto...');
    }
    
  }, 2000);
  
} else {
  console.log('🖥️ Ejecutándose en el servidor');
}

// 2. Función para verificar Firebase directamente
function checkFirebaseConnection() {
  console.log('🔥 Verificando conexión a Firebase...');
  
  // Intentar importar Firebase
  import('/src/lib/firebase/config.js').then(firebase => {
    console.log('✅ Firebase config cargado:', !!firebase.db);
    
    if (firebase.db) {
      // Intentar una consulta simple
      import('firebase/firestore').then(firestore => {
        const { collection, getDocs } = firestore;
        
        getDocs(collection(firebase.db, 'services'))
          .then(snapshot => {
            console.log('🎉 ÉXITO: Servicios cargados desde Firebase:', snapshot.size);
            snapshot.forEach(doc => {
              console.log('  📄 Servicio:', doc.id, doc.data().name);
            });
          })
          .catch(error => {
            console.error('❌ Error al cargar servicios:', error);
          });
      });
    }
  }).catch(error => {
    console.error('❌ Error al cargar Firebase config:', error);
  });
}

// Ejecutar verificación después de 3 segundos
setTimeout(checkFirebaseConnection, 3000);

console.log('🚀 Script de diagnóstico iniciado. Resultados en 3 segundos...');