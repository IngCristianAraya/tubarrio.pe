console.log('🔍 === DIAGNÓSTICO FINAL DE FIREBASE ===');

// 1. Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('- NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE || 'undefined');
console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'undefined');
console.log('- NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'NOT SET');

// 2. Verificar si estamos en el cliente
console.log('🌐 Entorno:', typeof window !== 'undefined' ? 'Cliente' : 'Servidor');

// 3. Verificar Firebase
try {
  const { db } = await import('/src/lib/firebase/config.js');
  console.log('🔥 Firebase db disponible:', !!db);
  
  if (db) {
    console.log('✅ Firebase inicializado correctamente');
  } else {
    console.log('❌ Firebase db es null');
  }
} catch (error) {
  console.log('❌ Error al importar Firebase:', error.message);
}

// 4. Verificar datos en la página
setTimeout(() => {
  const serviceCards = document.querySelectorAll('[data-service-id]');
  console.log('📊 Servicios encontrados en la página:', serviceCards.length);
  
  if (serviceCards.length > 0) {
    const firstService = serviceCards[0];
    const serviceId = firstService.getAttribute('data-service-id');
    console.log('🔍 Primer servicio ID:', serviceId);
    
    // Los IDs de mock suelen ser números simples, los de Firebase son strings complejos
    if (serviceId && serviceId.length > 10) {
      console.log('✅ Parece ser datos reales de Firebase (ID complejo)');
    } else {
      console.log('⚠️ Parece ser datos mock (ID simple)');
    }
  } else {
    console.log('❌ No se encontraron servicios en la página');
  }
}, 2000);

console.log('🔍 === FIN DEL DIAGNÓSTICO ===');