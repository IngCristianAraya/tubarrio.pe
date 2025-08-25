// Script para ejecutar en la consola del navegador para forzar recarga de servicios
// Abrir http://localhost:3000 y pegar este código en la consola del navegador

console.log('🔄 Forzando recarga de servicios...');

// Limpiar localStorage si existe
if (typeof localStorage !== 'undefined') {
  localStorage.clear();
  console.log('✅ localStorage limpiado');
}

// Limpiar sessionStorage si existe
if (typeof sessionStorage !== 'undefined') {
  sessionStorage.clear();
  console.log('✅ sessionStorage limpiado');
}

// Recargar la página
console.log('🔄 Recargando página...');
window.location.reload(true);