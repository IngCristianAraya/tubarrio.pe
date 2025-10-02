// Script simplificado para configurar permisos de administrador
const admin = require('firebase-admin');

// Configuración usando las credenciales que ya funcionan
const serviceAccount = {
  type: "service_account",
  project_id: "tubarriope-7ed1d",
  private_key_id: "fbsvc",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDum5GNy0lFwyx\nydg6dSQq4mtXFS5IpvTdFz4sTYlOFhuGFP/4DK7kZ792rRsyWP8YVRKyQUGGGmKj\nHvRVWixwkBzV4bMLcrjLE1/C9p49JvdrB1V4Y9VKN3kHD2WddSWHXjEBiGG6UU+2\nbpSL+ixTx6H8WauN/fUAV1vB/W07ZFwztLGH+6UPTuvz+IuDKTUaei+ka...\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com",
  client_id: "1097392406942",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40tubarriope-7ed1d.iam.gserviceaccount.com"
};

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'tubarriope-7ed1d'
  });
}

async function createAdminUser() {
  const adminEmail = 'admin@revistadigital.com';
  const adminPassword = 'Admin123456!';
  
  try {
    console.log('🔧 Configurando usuario administrador...');
    
    // Intentar crear el usuario
    let user;
    try {
      user = await admin.auth().createUser({
        email: adminEmail,
        password: adminPassword,
        emailVerified: true
      });
      console.log(`✅ Usuario creado: ${adminEmail}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('ℹ️ Usuario ya existe, obteniendo información...');
        user = await admin.auth().getUserByEmail(adminEmail);
      } else {
        throw error;
      }
    }
    
    // Asignar claims de admin
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Permisos de administrador asignados a: ${adminEmail}`);
    console.log(`📋 UID del usuario: ${user.uid}`);
    
    console.log('\n🎉 Configuración completada!');
    console.log('\n📋 Credenciales de acceso:');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ve a http://localhost:3000/admin/login');
    console.log('2. Inicia sesión con las credenciales de arriba');
    console.log('3. Serás redirigido al panel de administración');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar la función
createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });