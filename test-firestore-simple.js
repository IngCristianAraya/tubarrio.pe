// Test simple de conexión a Firestore usando Firebase Admin SDK
const admin = require('firebase-admin');

// Configuración usando variables de entorno
const serviceAccount = {
  type: "service_account",
  project_id: "tubarriope-7ed1d",
  private_key_id: "fbsvc",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDum5GNy0lFwyx\nydg6dSQq4mtXFS5IpvTdFz4sTYlOFhuGFP/4DK7kZ792rRsyWP8YVRKyQUGGGmKj\nHvRVWixwkBzV4bMLcrjLE1/C9p49JvdrB1V4Y9VKN3kHD2WddSWHXjEBiGG6UU+2\nbpSL+ixTx6H8WauN/fUAV1vB/W07ZFwztLGH+6UPTuvz+IuDKTUaei+kaGTmM+SQ\nEaZ95B896WxNjArA/MlXP5cVrhSucayJjQPQaFS+cbG1jH2/B3gg17TdqtZYW3kh\ny/mg1WMtPpcBWfMbhN415gp7Ig6qVliWSeueyQmHkxdZ0HEWk5sGURk1mtbVPMRN\n6WGcB2rFAgMBAAECggEACNCzuMExbP3jGiV0x0/mp3Eifn3mDhWe6k+VWETMY1JG\n6RIMY+1GTzkw/ApYiDr5OkJSoOlO0dhhtZERAMBv8fM7qT0Muv5EE7lf/cBCaOSs\nDgulg3zo6qUhnqTIjH/t3HFB6cdtB17ez+DzxcjTCERHJ74Y0OtYMSy+EDhMHCRD\n0eQn4O54o8DeNkf3t6Q6+zRTscjvbA8nAq1xLwiC0MGy74AnqLM0t/g75rEfc/kY\nNBQbTSMyVBd8qsc2od7CgsG2afQptH760AQR1GX/G0h/45Q+SmD1er1/ur8TUu/0\nxKblfvGFgkT02O3YwfcS0wufaTjXi+xGTDiJb8sMwQKBgQDqrBMDyJo1J1PbsVxy\nPROlufd3cpthN1edKJOmvtT9ahEWRwwkWCHlFw6zIFWx9UXzNOwykT/mgH5sF0DI\nUkRT504RCG3IjCST+ba+uxAyaxuEqShQhlSlH/GuJLzsz3WWaXidSnaAwdMKIxmm\ny3+Ki+/O0ZBz9qDDJ1u8QYA7MQKBgQDVhEezfj6UZnoKSrBk0jdyV6MqYVUbEmgG\nXvtz1mMhI63sKvKSsrt82kH1bTR3cZINArpBG6u6tqM2KEQDCqLJbkeJUoOnQPsy\nm4Cz527oUGFqg4w43Kll5M8czOo6knZk+T3wESmWSqr+rotk6+RD3r8X9LbbEdqT\nc39sQZgb1QKBgQC6+fl4hUfg3AHjxHANEX7rB74VrPoCPm8PZ/ok3F2lv/H3Vwpk\nltgCyRlMPZIp5WwjeGJNdA9+35hbFTfnpCyO0XgQ+C9In+ixAkDJvRANq+tUCtd1\nOWKN4mLUxq7E3BMrkcOpR2Ad/NDifc79Z5yqTg73MWAwFSxH8b8UwvehsQKBgHEy\nnTTbFGBm6AK20EfTb1PuhHG+gnlEy+O8zYD/QzTZjqarqkj9+wpZSCjOyccdbfn5\n3TcRbX0iwOrAdDZMmDtEfSafmW69s6+D47r9Ur5VhyAKN/gZfLGpmehB91gwOBaW\nUTEKWEr2sSsu7HYH3c/hstwHgD4qfAA6dm61Y+g1AoGAA/rV6T5z82AaCS6ofkP1\nQqfZHRnlsK+JkSfdGrcx1a7HkP1qTambUbf/PL0Yg0AJizpOIfsBObbLMLwydDjR\nxzTjTBhczHJt9Ue/U+TOQ+lXJvzz+F1yoawJ3TiU1TL8TETL2ILrScs9r1ki9J27\nBoAHqRffCL8OSTIZ9+J/kaM=\n-----END PRIVATE KEY-----",
  client_email: "firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com",
  client_id: "1097392406942",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40tubarriope-7ed1d.iam.gserviceaccount.com"
};

async function testFirestore() {
  try {
    console.log('🔍 Inicializando Firebase Admin...');
    
    // Verificar si ya está inicializado
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'tubarriope-7ed1d'
      });
    }
    
    console.log('🔍 Obteniendo instancia de Firestore...');
    const db = admin.firestore();
    
    console.log('🔍 Probando consulta a servicios...');
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.limit(3).get();
    
    console.log('✅ Conexión exitosa!');
    console.log('📊 Documentos encontrados:', snapshot.size);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Documento:', doc.id);
      console.log('   - Nombre:', data.name);
      console.log('   - Categoría:', data.category);
      console.log('   - Activo:', data.active);
    });
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error);
    console.error('❌ Código de error:', error.code);
    console.error('❌ Mensaje:', error.message);
  }
}

testFirestore();