import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  connectFirestoreEmulator, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
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
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
};

if (!isValidFirebaseConfig(firebaseConfig)) {
  logger.error('Configuración de Firebase incompleta. Verifica tus variables de entorno.');
  logger.debug('Configuración actual:', JSON.stringify(firebaseConfig, null, 2));
}

// Verificar que las variables de entorno estén disponibles en el cliente
if (typeof window !== 'undefined') {
  logger.debug('Variables de entorno en el cliente:', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'Faltante',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Configurado' : 'Faltante',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Configurado' : 'Faltante'
  });
}

// Función para validar la configuración
function isFirebaseConfigValid(config: any): boolean {
  const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
  
  logger.debug('Verificando variables de entorno de Firebase:');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];
  
  const missingVars: string[] = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
    }
    logger.debug(`  ${varName}: ${value ? 'Set' : 'Faltante'}`);
  });
  
  if (missingVars.length > 0) {
    logger.warn(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
  }
  
  return required.every(key => config[key] && config[key].trim() !== '');
}

// Variables globales
let firebaseApp: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

// Ensure we only initialize once
let isInitialized = false;

// Get Firestore instance with error handling
function getFirestoreInstance(): Firestore {
  if (!_db) {
    logger.warn('Firestore no está inicializado. Inicializando...');
    try {
      initializeFirebase();
      if (!_db) {
        const error = new Error('No se pudo inicializar Firestore');
        logger.error('Error al inicializar Firestore:', error);
        throw error;
      }
      logger.debug('Firestore inicializado correctamente en getFirestoreInstance');
    } catch (error) {
      logger.error('Error crítico al inicializar Firestore:', error);
      throw error;
    }
  }
  return _db!;
}

// Export the Firebase instances
export const app = {
  get instance(): FirebaseApp {
    if (!firebaseApp) {
      console.warn('Firebase App not initialized, initializing now...');
      initializeFirebase();
      if (!firebaseApp) {
        throw new Error('Failed to initialize Firebase App');
      }
    }
    return firebaseApp;
  }
};

export const db = {
  get instance(): Firestore {
    if (!_db) {
      console.warn('Firestore not initialized, initializing now...');
      initializeFirebase();
      if (!_db) {
        throw new Error('Failed to initialize Firestore');
      }
    }
    return _db;
  }
};

export const auth = {
  get instance(): Auth {
    if (!_auth) {
      console.warn('Auth not initialized, initializing now...');
      initializeFirebase();
      if (!_auth) {
        throw new Error('Failed to initialize Firebase Auth');
      }
    }
    return _auth;
  }
};

// Función para inicializar Firebase
export function initializeFirebase() {
  if (isInitialized) {
    logger.debug('Firebase ya está inicializado');
    return { app: firebaseApp, db: _db, auth: _auth };
  }

  try {
    logger.debug('Inicializando Firebase...');
    
    // Validar configuración
    if (!isValidFirebaseConfig(firebaseConfig)) {
      const error = new Error('Configuración de Firebase incompleta');
      logger.error('Error de configuración:', error);
      throw error;
    }

    logger.debug('Configuración de Firebase válida');
    
    // Mostrar los primeros 3 caracteres de cada variable para verificación
    logger.debug('Prefijos de las variables (solo para depuración):', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 3) + '...',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.substring(0, 3) + '...',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.substring(0, 3) + '...'
    });
    
    // Inicializar la aplicación de Firebase
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    logger.debug('Firebase App inicializada');
    
    // Inicializar Firestore
    _db = getFirestore(firebaseApp);
    logger.debug('Firestore inicializado');
    
    // Verificar la conexión a Firestore
    const testDoc = doc(_db, 'test', 'connection');
    getDoc(testDoc)
      .then(() => logger.debug('Conexión a Firestore exitosa'))
      .catch((err: Error) => {
        logger.error('Error de conexión a Firestore:', err);
        logger.warn('Continuando sin conexión a Firestore');
      });
      
    // Inicializar Auth
    _auth = getAuth(firebaseApp);
    logger.debug('Firebase Auth inicializado');
    
    isInitialized = true;
    logger.debug('Firebase inicializado correctamente');
    
    // Verificar si estamos en el cliente o en el servidor
    console.log('🔍 Entorno de ejecución:', {
      isServer: typeof window === 'undefined',
      isClient: typeof window !== 'undefined',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'development'
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
      try {
        firebaseApp = initializeApp(firebaseConfig);
        console.log('✅ Firebase app inicializada');
      } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error);
        throw error;
      }
    } else {
      firebaseApp = getApp();
      console.log('✅ Firebase app ya existía');
    }

    // Initialize Firestore
    try {
      if (!firebaseApp) {
        throw new Error('Firebase App no está inicializado');
      }
      _db = getFirestore(firebaseApp);
      console.log('✅ Firestore inicializado');
      
      // Verificar la conexión a Firestore
      const testDoc = doc(_db, 'test', 'connection');
      getDoc(testDoc)
        .then(() => console.log('✅ Conexión a Firestore exitosa'))
        .catch((err: Error) => console.error('❌ Error de conexión a Firestore:', err));
        
    } catch (error) {
      console.error('❌ Error al inicializar Firestore:', error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        console.error('Stack trace:', error.stack);
      }
      throw error;
    }
    
    // Initialize Auth
    try {
      _auth = getAuth(firebaseApp);
      console.log('✅ Auth inicializado');
      isInitialized = true;
    } catch (error) {
      console.error('❌ Error al inicializar Auth:', error);
      throw error;
    }
    
    // Deshabilitar emuladores para forzar conexión a producción
    console.log('🔌 Usando servicios de Firebase en producción');
    // Eliminar cualquier configuración de emulador
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      console.warn('⚠ Los emuladores están deshabilitados. Usando servicios de producción.');
    }
    
    console.log('✅ Firebase Firestore inicializado correctamente');

    return { app: firebaseApp, db: _db, auth: _auth };
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    return { app: null, db: null };
  }
}

// Inicializar Firebase solo en el cliente
if (typeof window !== 'undefined' && !firebaseApp) {
  try {
    console.log('🔍 Iniciando Firebase en el cliente...');
    console.log('🔍 Ubicación actual:', window.location.href);
    
    // Verificar si estamos en localhost o en producción
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    console.log('🔍 Entorno detectado:', {
      hostname: window.location.hostname,
      isLocalhost,
      protocol: window.location.protocol,
      href: window.location.href
    });
    
    // Forzar la recarga de las variables de entorno
    console.log('🔍 Reinicializando configuración de Firebase...');
    
    const result = initializeFirebase();
    
    if (result?.app) {
      console.log('✅ Firebase inicializado correctamente en el cliente');
      console.log('🔍 Configuración de Firebase:', {
        app: result.app.name,
        db: result.db ? 'Inicializado' : 'No inicializado',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado'
      });
      
      // Verificar conexión a Firestore
      if (result.db) {
        console.log('🔄 Verificando conexión a Firestore...');
        // Aquí podrías agregar una verificación de conexión a Firestore
      }
    } else {
      console.error('❌ No se pudo inicializar Firebase en el cliente');
      console.error('🔍 Razón:', 
        !result ? 'initializeFirebase() devolvió undefined' : 
        'Faltan credenciales o hay un error de configuración');
    }
  } catch (error) {
    console.error('❌ Error al inicializar Firebase en el cliente:', error);
    firebaseApp = null;
    _db = null;
  }
} else {
  console.log('🔍 Ejecutándose en el servidor - Firebase no inicializado');
}

// Exportar instancias
export { firebaseApp, getFirestoreInstance };
export default firebaseApp;
