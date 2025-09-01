// Script para capturar logs de la consola del navegador
// Ejecutar en la consola del navegador en http://localhost:3000/todos-los-servicios

console.log('🔍 === CAPTURANDO LOGS DE DEPURACIÓN ===');

// Función para mostrar información detallada
function showDetailedDebug() {
  console.log('\n🔍 === INFORMACIÓN DETALLADA ===');
  
  // Variables de entorno
  console.log('\n📋 VARIABLES DE ENTORNO:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', !!window.process?.env?.NEXT_PUBLIC_FIREBASE_API_KEY || 'No disponible en cliente');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', window.process?.env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No disponible en cliente');
  console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', window.process?.env?.NEXT_PUBLIC_DISABLE_FIREBASE || 'No disponible en cliente');
  
  // Verificar si hay datos en localStorage
  console.log('\n💾 ALMACENAMIENTO LOCAL:');
  const localStorageKeys = Object.keys(localStorage);
  console.log('Claves en localStorage:', localStorageKeys);
  
  localStorageKeys.forEach(key => {
    if (key.includes('service') || key.includes('firebase')) {
      console.log(`${key}:`, localStorage.getItem(key));
    }
  });
  
  // Verificar sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log('Claves en sessionStorage:', sessionStorageKeys);
  
  sessionStorageKeys.forEach(key => {
    if (key.includes('service') || key.includes('firebase')) {
      console.log(`${key}:`, sessionStorage.getItem(key));
    }
  });
  
  // Verificar el estado del componente de debug
  console.log('\n🧩 COMPONENTE DEBUG:');
  const debugElement = document.querySelector('[data-debug-info]');
  if (debugElement) {
    console.log('Elemento de debug encontrado:', debugElement);
  } else {
    console.log('Elemento de debug NO encontrado');
  }
  
  // Verificar si hay errores en la consola
  console.log('\n❌ ERRORES RECIENTES:');
  console.log('Revisa arriba en la consola para ver los logs de depuración del componente SimpleDebug');
}

// Ejecutar inmediatamente
showDetailedDebug();

// También ejecutar después de un pequeño delay para capturar logs asíncronos
setTimeout(() => {
  console.log('\n🔄 === SEGUNDA VERIFICACIÓN (después de 2 segundos) ===');
  showDetailedDebug();
}, 2000);

console.log('\n✅ Script de captura ejecutado. Revisa los logs arriba.');
console.log('💡 Si no ves los logs de "DEPURACIÓN FIREBASE COMPLETA", el componente puede no estar ejecutándose.');