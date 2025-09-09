// Script para debuggear el hook useFirebaseReady en el cliente
console.log('🔍 DEBUG CLIENT HOOK - Iniciando...');

// Verificar entorno
console.log('🌐 typeof window:', typeof window);
console.log('🌐 window !== undefined:', typeof window !== 'undefined');
console.log('🌐 process.env.NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);

// Verificar Firebase
try {
  const { db } = require('./src/lib/firebase/config');
  console.log('🔥 db disponible:', !!db);
  console.log('🔥 db object:', db);
} catch (error) {
  console.log('❌ Error al importar Firebase:', error.message);
}

// Simular lógica del hook
function simulateHook() {
  console.log('🧪 Simulando lógica del hook...');
  
  const isClient = typeof window !== 'undefined';
  console.log('🧪 isClient:', isClient);
  
  if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true') {
    console.log('🧪 Firebase deshabilitado - debería devolver isReady: true');
    return { isReady: true, isClient };
  }
  
  console.log('🧪 Firebase habilitado - verificando db...');
  return { isReady: false, isClient };
}

const result = simulateHook();
console.log('🧪 Resultado simulado:', result);

console.log('🔍 DEBUG CLIENT HOOK - Finalizado');