// Script para configurar permisos de administrador
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Ruta al archivo de credenciales
const credentialsPath = path.join(__dirname, 'firebase-admin-credentials.json');

// Verificar si existe el archivo de credenciales
if (!fs.existsSync(credentialsPath)) {
  console.log('❌ No se encontró el archivo de credenciales: firebase-admin-credentials.json');
  console.log('📋 Sigue las instrucciones en CONFIGURAR-CREDENCIALES-FIREBASE.md');
  process.exit(1);
}

// Inicializar Firebase Admin con credenciales específicas
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentialsPath),
    projectId: 'tubarriope-7ed1d'
  });
}

async function setAdminClaim(email) {
  try {
    // Buscar usuario por email
    const user = await admin.auth().getUserByEmail(email);
    
    // Asignar claim de admin
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Permisos de administrador asignados a: ${email}`);
    console.log(`UID del usuario: ${user.uid}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n📝 Pasos para crear el usuario:');
      console.log('1. Ve a Firebase Console > Authentication > Users');
      console.log('2. Haz clic en "Add user"');
      console.log(`3. Ingresa el email: ${email}`);
      console.log('4. Ingresa una contraseña segura');
      console.log('5. Ejecuta este script nuevamente');
    }
  }
}

// Obtener email del argumento de línea de comandos
const email = process.argv[2];

if (!email) {
  console.log('❌ Por favor proporciona un email:');
  console.log('node setup-admin.js tu-email@ejemplo.com');
  process.exit(1);
}

if (!email.includes('@')) {
  console.log('❌ Por favor proporciona un email válido');
  process.exit(1);
}

console.log(`🔧 Configurando permisos de administrador para: ${email}`);
setAdminClaim(email)
  .then(() => {
    console.log('\n✅ Configuración completada');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ve a http://localhost:3000/admin/login');
    console.log('2. Inicia sesión con tus credenciales');
    console.log('3. Serás redirigido al panel de administración');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });