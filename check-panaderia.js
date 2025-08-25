const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkServices() {
  try {
    console.log('Verificando servicios de panadería...');
    
    // Verificar panaderia-el-molino
    const doc1 = await db.collection('services').doc('panaderia-el-molino').get();
    if (doc1.exists) {
      console.log('\n=== PANADERIA EL MOLINO ===');
      const data1 = doc1.data();
      console.log('image:', data1.image);
      console.log('images:', data1.images);
      console.log('localImages:', data1.localImages);
    }
    
    // Verificar panaderia-el-molinos
    const doc2 = await db.collection('services').doc('panaderia-el-molinos').get();
    if (doc2.exists) {
      console.log('\n=== PANADERIA EL MOLINOS ===');
      const data2 = doc2.data();
      console.log('image:', data2.image);
      console.log('images:', data2.images);
      console.log('localImages:', data2.localImages);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkServices();