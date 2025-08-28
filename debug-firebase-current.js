// Script simple para verificar Firebase en el navegador
console.log('=== VERIFICACIÓN FIREBASE ===');

// 1. Verificar variables de entorno
console.log('Variables de entorno:');
console.log('- NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('- NEXT_PUBLIC_FIREBASE_API_KEY existe:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// 2. Verificar si estamos en el cliente
console.log('\nEntorno:');
console.log('- typeof window:', typeof window);
console.log('- En cliente:', typeof window !== 'undefined');

// 3. Verificar el componente FirebaseStatus en la página
const firebaseStatusElement = document.querySelector('[class*="bg-blue-50"]');
if (firebaseStatusElement) {
  console.log('\n✅ Componente FirebaseStatus encontrado en la página');
  console.log('Contenido:', firebaseStatusElement.textContent);
} else {
  console.log('\n❌ Componente FirebaseStatus NO encontrado');
}

// 4. Verificar si hay servicios en la página
const serviceCards = document.querySelectorAll('[class*="service"], [class*="card"]');
console.log('\nServicios en página:', serviceCards.length);

// 5. Verificar títulos de servicios para detectar mock vs real
const serviceTitles = Array.from(document.querySelectorAll('h3, h2, .font-bold')).map(el => el.textContent).filter(text => text && text.length > 5);
console.log('\nTítulos encontrados:', serviceTitles.slice(0, 5));

if (serviceTitles.some(title => title.includes('Restaurante El Sabor') || title.includes('Peluquería Bella'))) {
  console.log('🔴 DETECTADO: Usando datos MOCK');
} else {
  console.log('🟢 POSIBLE: Usando datos REALES');
}

console.log('=== FIN VERIFICACIÓN ===');