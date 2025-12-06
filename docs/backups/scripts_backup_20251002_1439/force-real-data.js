// Script para forzar la carga de datos reales desde Firebase
'use client';

// Limpiar localStorage
if (typeof window !== 'undefined') {
  console.log('🧹 Limpiando cache del navegador...');
  
  // Limpiar localStorage relacionado con servicios
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('services') || key.includes('featured') || key.includes('cache'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Eliminado: ${key}`);
  });
  
  // Limpiar sessionStorage
  sessionStorage.clear();
  console.log('🗑️ SessionStorage limpiado');
  
  // Forzar recarga de la página
  console.log('🔄 Forzando recarga de la página...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}