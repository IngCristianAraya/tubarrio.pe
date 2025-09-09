import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Función para validar la configuración
function isFirebaseConfigValid(config: any): boolean {
  const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
  
  console.log('🔍 Checking Firebase environment variables:');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`  ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
  });
  
  return required.every(key => config[key] && config[key].trim() !== '');
}

// Variables globales
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;

// Función para inicializar Firebase
function initializeFirebase() {
  try {
    console.log('🔍 Inicializando Firebase...');
    console.log('🔍 Variables de entorno:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Configurado' : 'No configurado',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Configurado' : 'No configurado',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Configurado' : 'No configurado'
    });
    
    // Verificar si Firebase está deshabilitado
    const disableFirebase = process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true';
    console.log('🔍 NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE, '→', disableFirebase);
    
    if (disableFirebase) {
      console.log('🚫 Firebase deshabilitado por configuración');
      return { app: null, db: null };
    }

    // Validar configuración
    if (!isFirebaseConfigValid(firebaseConfig)) {
      console.warn('⚠️ Configuración de Firebase inválida');
      console.warn('⚠️ Configuración recibida:', firebaseConfig);
      return { app: null, db: null };
    }

    // Inicializar app
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
      console.log('✅ Firebase app inicializada');
    } else {
      firebaseApp = getApp();
      console.log('✅ Firebase app ya existía');
    }

    // Initialize Firestore
    db = getFirestore(firebaseApp);
    
    // Configure emulator in development
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('🔧 Firestore emulator connected');
      } catch (error) {
        console.warn('⚠️ Could not connect to Firestore emulator', error);
      }
    }
    
    console.log('✅ Firebase Firestore inicializado correctamente');

    return { app: firebaseApp, db };
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    return { app: null, db: null };
  }
}

// Inicializar Firebase solo en el cliente
if (typeof window !== 'undefined') {
  try {
    console.log('🔍 Iniciando Firebase en el cliente...');
    const { app, db: firestoreDb } = initializeFirebase();
    firebaseApp = app;
    db = firestoreDb;
    console.log('✅ Firebase inicializado en el cliente:', { 
      app: !!app, 
      db: !!db,
      projectId: app?.options?.projectId,
      apiKey: app?.options?.apiKey ? 'Configurado' : 'No configurado'
    });
    
    // Verificar conexión a Firestore
    if (db) {
      console.log('🔄 Verificando conexión a Firestore...');
    }
  } catch (error) {
    console.error('❌ Error al inicializar Firebase en el cliente:', error);
    firebaseApp = null;
    db = null;
  }
} else {
  console.log('🔍 Ejecutándose en el servidor - Firebase no inicializado');
}

// Exportar instancias
export { firebaseApp as app, db, initializeFirebase };
export default firebaseApp;
