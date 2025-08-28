import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

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
  return required.every(key => config[key] && config[key].trim() !== '');
}

// Variables globales
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

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
    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true') {
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

    // Inicializar Firestore
    if (firebaseApp) {
      db = getFirestore(firebaseApp);
      console.log('✅ Firestore inicializado');
    }

    // Inicializar Auth
    if (firebaseApp) {
      auth = getAuth(firebaseApp);
      console.log('✅ Firebase Auth inicializado');
    }

    return { app: firebaseApp, db, auth };
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    return { app: null, db: null, auth: null };
  }
}

// Inicializar Firebase solo en el cliente
if (typeof window !== 'undefined') {
  try {
    const { app, db: firestoreDb, auth: firebaseAuth } = initializeFirebase();
    firebaseApp = app;
    db = firestoreDb;
    auth = firebaseAuth;
    console.log('✅ Firebase inicializado en el cliente:', { app: !!app, db: !!db, auth: !!auth });
  } catch (error) {
    console.error('❌ Error al inicializar Firebase en el cliente:', error);
    firebaseApp = null;
    db = null;
    auth = null;
  }
} else {
  console.log('🔍 Ejecutándose en el servidor - Firebase no inicializado');
}

// Exportar instancias
export { firebaseApp as app, db, auth, initializeFirebase };
export default firebaseApp;
