// Script de diagnóstico para problemas de Firebase en producción
// Ejecutar en el navegador en la página de producción

console.log('🔍 DIAGNÓSTICO FIREBASE - PRODUCCIÓN');
console.log('=====================================');

// 1. Verificar variables de entorno
console.log('\n📋 VARIABLES DE ENTORNO:');
const envVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DISABLE_FIREBASE: process.env.NEXT_PUBLIC_DISABLE_FIREBASE,
  NODE_ENV: process.env.NODE_ENV
};

Object.entries(envVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = value ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : 'undefined';
  console.log(`${status} ${key}: ${displayValue}`);
});

// 2. Verificar configuración de Firebase
console.log('\n🔧 CONFIGURACIÓN FIREBASE:');
try {
  // Intentar importar la configuración
  import('./src/lib/firebase/config.js').then(({ firebaseApp, db }) => {
    console.log('✅ Módulo Firebase importado correctamente');
    console.log('📱 Firebase App:', firebaseApp ? '✅ Inicializada' : '❌ No inicializada');
    console.log('🗄️ Firestore DB:', db ? '✅ Conectada' : '❌ No conectada');
    
    if (firebaseApp) {
      console.log('🔑 Project ID:', firebaseApp.options.projectId);
      console.log('🌐 Auth Domain:', firebaseApp.options.authDomain);
    }
    
    // 3. Probar conexión a Firestore
    if (db) {
      console.log('\n🧪 PRUEBA DE CONEXIÓN FIRESTORE:');
      
      // Importar funciones de Firestore
      import('firebase/firestore').then(({ collection, getDocs, limit, query }) => {
        // Intentar leer servicios
        const servicesRef = collection(db, 'services');
        const q = query(servicesRef, limit(1));
        
        getDocs(q)
          .then((snapshot) => {
            console.log('✅ Conexión Firestore exitosa');
            console.log(`📊 Documentos encontrados: ${snapshot.size}`);
            
            if (!snapshot.empty) {
              const firstDoc = snapshot.docs[0];
              console.log('📄 Primer documento ID:', firstDoc.id);
              console.log('📋 Datos del documento:', firstDoc.data());
            }
          })
          .catch((error) => {
            console.error('❌ Error al conectar con Firestore:', error);
            console.error('🔍 Código de error:', error.code);
            console.error('💬 Mensaje:', error.message);
            
            // Diagnóstico específico por tipo de error
            if (error.code === 'permission-denied') {
              console.log('\n🚫 PROBLEMA DE PERMISOS:');
              console.log('- Verificar reglas de Firestore');
              console.log('- Comprobar autenticación si es requerida');
            } else if (error.code === 'unavailable') {
              console.log('\n🌐 PROBLEMA DE CONECTIVIDAD:');
              console.log('- Verificar conexión a internet');
              console.log('- Comprobar configuración de red');
            } else if (error.code === 'invalid-argument') {
              console.log('\n⚙️ PROBLEMA DE CONFIGURACIÓN:');
              console.log('- Verificar variables de entorno');
              console.log('- Comprobar configuración de Firebase');
            }
          });
      }).catch((error) => {
        console.error('❌ Error al importar funciones de Firestore:', error);
      });
    }
  }).catch((error) => {
    console.error('❌ Error al importar configuración Firebase:', error);
  });
} catch (error) {
  console.error('❌ Error general:', error);
}

// 4. Información del entorno
console.log('\n🌍 INFORMACIÓN DEL ENTORNO:');
console.log('🌐 URL actual:', window.location.href);
console.log('🏠 Origen:', window.location.origin);
console.log('🔧 User Agent:', navigator.userAgent);
console.log('⏰ Timestamp:', new Date().toISOString());

// 5. Verificar errores en consola
console.log('\n📝 INSTRUCCIONES:');
console.log('1. Ejecuta este script en la consola del navegador');
console.log('2. Revisa todos los mensajes de error');
console.log('3. Compara con el entorno local');
console.log('4. Verifica la pestaña Network para errores de red');
console.log('5. Revisa los logs de Vercel para errores de build');

// 6. Función para comparar con local
window.compareWithLocal = function() {
  console.log('\n🔄 COMPARACIÓN CON ENTORNO LOCAL:');
  console.log('Ejecuta el mismo script en localhost:3000 y compara:');
  console.log('- Variables de entorno');
  console.log('- Estado de inicialización de Firebase');
  console.log('- Respuesta de Firestore');
  console.log('- Errores específicos');
};

console.log('\n💡 TIP: Ejecuta compareWithLocal() para obtener instrucciones de comparación');