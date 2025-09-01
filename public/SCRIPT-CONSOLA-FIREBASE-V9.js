// Script para resolver permisos de Firestore - Compatible con Firebase v9+
console.log('🔧 INICIANDO SOLUCIÓN FIREBASE V9...');

async function solucionFirestoreV9() {
  try {
    // Intentar acceder a Firebase desde el contexto de la aplicación
    let auth, db;
    
    // Método 1: Buscar en el contexto global de Next.js
    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props) {
      console.log('📱 Detectado contexto Next.js');
    }
    
    // Método 2: Buscar instancias de Firebase en el DOM
    const scripts = Array.from(document.scripts);
    const firebaseScript = scripts.find(s => s.src.includes('firebase'));
    if (firebaseScript) {
      console.log('📦 Firebase script encontrado:', firebaseScript.src);
    }
    
    // Método 3: Intentar acceder directamente a las instancias
    try {
      // Buscar en el contexto de React
      const reactFiber = document.querySelector('#__next')._reactInternalInstance ||
                        document.querySelector('#__next')._reactInternals ||
                        document.querySelector('[data-reactroot]')._reactInternalInstance;
      
      if (reactFiber) {
        console.log('⚛️ Contexto React encontrado');
      }
    } catch (e) {
      console.log('ℹ️ No se pudo acceder al contexto React directamente');
    }
    
    // Método 4: Usar fetch para probar la API directamente
    console.log('🌐 Probando acceso directo a la API...');
    
    try {
      const response = await fetch('/api/services', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API accesible:', data.length || 0, 'servicios');
        
        // Probar escritura a través de la API
        console.log('✏️ Probando escritura vía API...');
        const testService = {
          name: 'Test de Permisos API',
          description: 'Prueba de escritura',
          category: 'test',
          location: 'Test Location',
          contact: {
            phone: '123456789',
            whatsapp: '123456789'
          },
          createdAt: new Date().toISOString()
        };
        
        const createResponse = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testService)
        });
        
        if (createResponse.ok) {
          const createdService = await createResponse.json();
          console.log('✅ Escritura exitosa vía API:', createdService.id);
          
          // Limpiar el servicio de prueba
          const deleteResponse = await fetch(`/api/services/${createdService.id}`, {
            method: 'DELETE'
          });
          
          if (deleteResponse.ok) {
            console.log('✅ Limpieza completada');
            console.log('🎉 SOLUCIÓN EXITOSA - La API funciona correctamente');
            console.log('💡 El problema puede estar en el frontend. Intenta:');
            console.log('   1. Refrescar la página (Ctrl+F5)');
            console.log('   2. Limpiar cache del navegador');
            console.log('   3. Cerrar y abrir el navegador');
          }
        } else {
          const errorData = await createResponse.text();
          console.error('❌ Error en escritura API:', createResponse.status, errorData);
        }
        
      } else {
        console.error('❌ Error en API:', response.status, response.statusText);
      }
    } catch (apiError) {
      console.error('❌ Error de conexión API:', apiError.message);
    }
    
    // Método 5: Limpiar cache específico de Firebase
    console.log('🧹 Limpiando cache de Firebase...');
    
    // Limpiar localStorage
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (key.includes('firebase') || key.includes('firestore') || key.includes('auth')) {
        localStorage.removeItem(key);
        console.log('🗑️ Eliminado de localStorage:', key);
      }
    });
    
    // Limpiar sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorageKeys.forEach(key => {
      if (key.includes('firebase') || key.includes('firestore') || key.includes('auth')) {
        sessionStorage.removeItem(key);
        console.log('🗑️ Eliminado de sessionStorage:', key);
      }
    });
    
    // Método 6: Verificar estado del navegador
    console.log('🔍 Verificando estado del navegador...');
    console.log('   - User Agent:', navigator.userAgent);
    console.log('   - Cookies habilitadas:', navigator.cookieEnabled);
    console.log('   - Online:', navigator.onLine);
    
    // Verificar si hay bloqueadores
    if (navigator.userAgent.includes('Brave')) {
      console.log('🛡️ Navegador Brave detectado');
      console.log('💡 SOLUCIÓN BRAVE:');
      console.log('   1. Clic en el icono del escudo (🛡️) en la barra de direcciones');
      console.log('   2. Desactivar "Shields" para este sitio');
      console.log('   3. Refrescar la página');
    }
    
    console.log('\n📋 RESUMEN DE DIAGNÓSTICO:');
    console.log('   - Firebase v9+ requiere acceso a través de la aplicación');
    console.log('   - Prueba la API directamente si está disponible');
    console.log('   - Cache limpiado');
    console.log('   - Verifica bloqueadores de contenido');
    
  } catch (error) {
    console.error('❌ ERROR GENERAL:', error);
    console.log('\n🔧 SOLUCIONES ALTERNATIVAS:');
    console.log('   1. Refrescar página completamente (Ctrl+Shift+R)');
    console.log('   2. Abrir en ventana de incógnito');
    console.log('   3. Probar en otro navegador');
    console.log('   4. Verificar consola de red para errores de carga');
  }
}

// Ejecutar la solución
solucionFirestoreV9();

// Función adicional para limpiar todo el cache
function limpiarTodoElCache() {
  console.log('🧹 LIMPIEZA COMPLETA DE CACHE...');
  
  // Limpiar todo localStorage
  localStorage.clear();
  console.log('✅ localStorage limpiado');
  
  // Limpiar todo sessionStorage
  sessionStorage.clear();
  console.log('✅ sessionStorage limpiado');
  
  console.log('💡 Ahora refresca la página (Ctrl+F5) y vuelve a hacer login');
}

console.log('\n🔧 COMANDOS DISPONIBLES:');
console.log('   - solucionFirestoreV9() - Ejecutar diagnóstico completo');
console.log('   - limpiarTodoElCache() - Limpiar todo el cache y empezar de cero');