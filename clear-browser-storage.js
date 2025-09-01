// Script para limpiar completamente el almacenamiento del navegador
console.log('🧹 Limpiando almacenamiento del navegador...');

// Limpiar localStorage
try {
  const localStorageKeys = Object.keys(localStorage);
  console.log('📦 localStorage keys encontradas:', localStorageKeys);
  localStorage.clear();
  console.log('✅ localStorage limpiado');
} catch (error) {
  console.error('❌ Error limpiando localStorage:', error);
}

// Limpiar sessionStorage
try {
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log('📦 sessionStorage keys encontradas:', sessionStorageKeys);
  sessionStorage.clear();
  console.log('✅ sessionStorage limpiado');
} catch (error) {
  console.error('❌ Error limpiando sessionStorage:', error);
}

// Limpiar cookies relacionadas con Firebase
try {
  const cookies = document.cookie.split(';');
  console.log('🍪 Cookies encontradas:', cookies.length);
  
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Eliminar cookies relacionadas con Firebase
    if (name.includes('firebase') || name.includes('auth') || name.includes('session')) {
      console.log('🗑️ Eliminando cookie:', name);
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    }
  });
  
  console.log('✅ Cookies de Firebase limpiadas');
} catch (error) {
  console.error('❌ Error limpiando cookies:', error);
}

// Limpiar IndexedDB (usado por Firebase)
try {
  if ('indexedDB' in window) {
    indexedDB.databases().then(databases => {
      console.log('🗄️ IndexedDB databases encontradas:', databases.length);
      
      databases.forEach(db => {
        if (db.name && (db.name.includes('firebase') || db.name.includes('firestore'))) {
          console.log('🗑️ Eliminando IndexedDB:', db.name);
          indexedDB.deleteDatabase(db.name);
        }
      });
      
      console.log('✅ IndexedDB de Firebase limpiado');
    });
  }
} catch (error) {
  console.error('❌ Error limpiando IndexedDB:', error);
}

console.log('🎉 Limpieza completa. Recarga la página para verificar.');
console.log('💡 Ejecuta: window.location.reload() para recargar');