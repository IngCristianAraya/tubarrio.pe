// Script para diagnosticar variables de entorno en Vercel
console.log('🔍 Diagnóstico de Variables de Entorno en Vercel');
console.log('================================================');

// Variables Firebase Admin SDK
console.log('\n🔧 FIREBASE ADMIN SDK:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? `✅ "${process.env.FIREBASE_PROJECT_ID}"` : '❌ No configurada');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? `✅ "${process.env.FIREBASE_CLIENT_EMAIL.substring(0, 20)}..."` : '❌ No configurada');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? `✅ Configurada (${process.env.FIREBASE_PRIVATE_KEY.length} caracteres)` : '❌ No configurada');

// Variables Firebase Client SDK
console.log('\n🌐 FIREBASE CLIENT SDK:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? `✅ "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 20)}..."` : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? `✅ "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}"` : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `✅ "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}"` : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? `✅ "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}"` : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? `✅ "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}"` : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? `✅ "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}"` : '❌ No configurada');

// Otras variables
console.log('\n🌍 OTRAS VARIABLES:');
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL ? `✅ "${process.env.NEXT_PUBLIC_SITE_URL}"` : '❌ No configurada');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? `✅ "${process.env.CLOUDINARY_CLOUD_NAME}"` : '❌ No configurada');

// Verificar formato de private key
if (process.env.FIREBASE_PRIVATE_KEY) {
  console.log('\n🔑 ANÁLISIS DE PRIVATE KEY:');
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  console.log('Longitud:', privateKey.length);
  console.log('Comienza con BEGIN:', privateKey.includes('-----BEGIN PRIVATE KEY-----'));
  console.log('Termina con END:', privateKey.includes('-----END PRIVATE KEY-----'));
  console.log('Contiene \\n:', privateKey.includes('\\n'));
  console.log('Primeros 50 caracteres:', privateKey.substring(0, 50));
  console.log('Últimos 50 caracteres:', privateKey.substring(privateKey.length - 50));
}

// Test de service account object
console.log('\n🧪 TEST DE SERVICE ACCOUNT:');
try {
  const serviceAccount = {
    projectId: (process.env.FIREBASE_PROJECT_ID || '').trim(),
    clientEmail: (process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim(),
  };
  
  console.log('Service Account Object:');
  console.log('- projectId:', serviceAccount.projectId ? `✅ "${serviceAccount.projectId}"` : '❌ Vacío');
  console.log('- clientEmail:', serviceAccount.clientEmail ? `✅ "${serviceAccount.clientEmail}"` : '❌ Vacío');
  console.log('- privateKey:', serviceAccount.privateKey ? `✅ ${serviceAccount.privateKey.length} caracteres` : '❌ Vacío');
  
  // Verificar tipos
  console.log('\n📊 TIPOS DE DATOS:');
  console.log('- projectId type:', typeof serviceAccount.projectId);
  console.log('- clientEmail type:', typeof serviceAccount.clientEmail);
  console.log('- privateKey type:', typeof serviceAccount.privateKey);
  
} catch (error) {
  console.error('❌ Error creando service account object:', error);
}

console.log('\n🏁 Diagnóstico completado');
console.log('================================================');