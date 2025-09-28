import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  connectFirestoreEmulator, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { logger } from '../utils/logger';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Validar configuración
const isValidFirebaseConfig = (config: any) => {
  return (
    config.apiKey &&
    config.projectId &&
    config.appId
  );
};

if (!isValidFirebaseConfig(firebaseConfig)) {
  logger.error('Configuración de Firebase incompleta. Verifica tus variables de entorno.');
  logger.debug('Configuración actual:', JSON.stringify(firebaseConfig, null, 2));
}

// Variables globales
let firebaseApp: FirebaseApp | null = null;
let _db: Firestore | null = null;
let isInitialized = false;

// Inicializar Firebase
function initializeFirebase() {
  if (isInitialized) {
    return { app: firebaseApp, db: _db };
  }

  try {
    // Inicializar la aplicación de Firebase
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Inicializar Firestore
    _db = getFirestore(firebaseApp);
    
    // Configurar emulador si es necesario
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      try {
        const host = 'localhost';
        const port = 8080;
        connectFirestoreEmulator(_db, host, port);
        logger.info(`🔥 Firestore conectado al emulador en ${host}:${port}`);
      } catch (emulatorError) {
        logger.warn('No se pudo conectar al emulador de Firestore:', emulatorError);
      }
    }
    
    isInitialized = true;
    logger.info('✅ Firebase inicializado correctamente');
    
    return { app: firebaseApp, db: _db };
  } catch (error) {
    logger.error('❌ Error al inicializar Firebase:', error);
    return { app: null, db: null };
  }
}

// Get Firestore instance with error handling
function getFirestoreInstance(): Firestore {
  if (!_db) {
    logger.warn('Firestore no está inicializado. Inicializando...');
    const { db } = initializeFirebase();
    if (!db) {
      throw new Error('No se pudo inicializar Firestore');
    }
    _db = db;
  }
  return _db;
}

// Export the Firebase instances
export const app = {
  get instance(): FirebaseApp {
    if (!firebaseApp) {
      const { app } = initializeFirebase();
      if (!app) {
        throw new Error('No se pudo inicializar la aplicación de Firebase');
      }
      firebaseApp = app;
    }
    return firebaseApp;
  }
};

// Export the Firestore instance directly for Firebase SDK compatibility
export const db = {
  get instance(): Firestore {
    return getFirestoreInstance();
  },
  get firestore(): Firestore {
    return this.instance;
  }
} as Firestore & { instance: Firestore, firestore: Firestore };

// Inicializar Firebase solo en el cliente
if (typeof window !== 'undefined') {
  try {
    console.log('🔍 Iniciando Firebase en el cliente...');
    
    // TEMPORALMENTE DESHABILITADO: Inicialización completa de Firebase para evitar bucle de errores
    console.log('⚠️ Firebase temporalmente deshabilitado para evitar bucle de errores');
    /*
    const { app, db } = initializeFirebase();
    
    if (app && db) {
      console.log('✅ Firebase inicializado correctamente en el cliente');
      
      // TEMPORALMENTE DESHABILITADO: Verificación de conectividad causaba bucle de errores
      // Verificar conectividad con una consulta simple
      import('firebase/firestore').then(({ doc, getDoc }) => {
        const testDoc = doc(db, 'test', 'connection');
        getDoc(testDoc).then(() => {
          console.log('✅ Conectividad con Firestore verificada');
        }).catch((error) => {
          if (error.code === 'permission-denied') {
            console.warn('⚠️ Permisos limitados en Firestore (esperado)');
          } else if (error.code === 'unavailable') {
            console.error('❌ Firestore no disponible - verificar conexión');
          } else {
            console.warn('⚠️ Error de conectividad:', error.code);
          }
        });
      });
    } else {
      console.error('❌ Error al inicializar Firebase');
    }
    */
  } catch (error) {
    console.error('❌ Error crítico al inicializar Firebase:', error);
  }
} else {
  console.log('🔍 Ejecutándose en el servidor - Firebase se inicializará bajo demanda');
}

// Exportar instancias
export { firebaseApp, getFirestoreInstance };
export default firebaseApp;
