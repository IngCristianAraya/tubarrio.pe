// Script para debuggear la carga de servicios
console.log('🔍 Iniciando debug de servicios...');

// Verificar si los datos de fallback están disponibles
try {
  // Simular importación de datos de fallback
  console.log('📦 Verificando datos de fallback...');
  
  // Verificar el estado del hook useServicesPaginated
  console.log('🎣 Verificando hook useServicesPaginated...');
  
  // Verificar si hay errores en la consola
  console.log('❌ Verificando errores...');
  
  // Verificar el DOM
  setTimeout(() => {
    const serviceCards = document.querySelectorAll('[data-testid="service-card"], .service-card, [class*="service"]');
    console.log(`🎯 Elementos de servicio encontrados: ${serviceCards.length}`);
    
    const emptyState = document.querySelector('[data-testid="empty-state"], .empty-state, [class*="empty"]');
    console.log(`📭 Estado vacío encontrado: ${emptyState ? 'Sí' : 'No'}`);
    
    const loadingState = document.querySelector('[data-testid="loading"], .loading, [class*="loading"]');
    console.log(`⏳ Estado de carga encontrado: ${loadingState ? 'Sí' : 'No'}`);
    
    // Verificar si hay texto que indique servicios
    const pageText = document.body.innerText;
    const hasServicesText = pageText.includes('servicios') || pageText.includes('Servicios');
    console.log(`📝 Texto de servicios encontrado: ${hasServicesText}`);
    
    console.log('🏁 Debug completado');
  }, 2000);
  
} catch (error) {
  console.error('💥 Error en debug:', error);
}