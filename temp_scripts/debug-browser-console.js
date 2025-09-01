// Script para ejecutar en la consola del navegador
// Copiar y pegar en la consola del navegador en http://localhost:3000/todos-los-servicios

console.log('=== DEBUG FIREBASE EN NAVEGADOR ===');
console.log('Variables de entorno:');
console.log('  NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('  NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('  NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);

// Verificar si Firebase está disponible globalmente
console.log('\nFirebase global:');
console.log('  window.firebase:', typeof window.firebase);
console.log('  window.db:', typeof window.db);

// Verificar localStorage
console.log('\nLocalStorage:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.includes('services') || key.includes('featured') || key.includes('cache'))) {
    console.log(`  ${key}:`, localStorage.getItem(key)?.substring(0, 100) + '...');
  }
}

// Verificar sessionStorage
console.log('\nSessionStorage:');
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key && (key.includes('services') || key.includes('featured') || key.includes('cache'))) {
    console.log(`  ${key}:`, sessionStorage.getItem(key)?.substring(0, 100) + '...');
  }
}

console.log('\n=== FIN DEBUG ===');