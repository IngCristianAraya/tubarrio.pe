import { initializeApp, getApps, getApp } from '@firebase/app';
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validar configuración de Firebase
const isFirebaseConfigValid = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  return requiredFields.every(field => firebaseConfig[field as keyof typeof firebaseConfig]);
};

// Inicialización de Firebase
let firebaseApp: any = null;
let db: any = null;

// Solo inicializar en el cliente
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DISABLE_FIREBASE !== 'true') {
  try {
    if (!isFirebaseConfigValid()) {
      console.warn('Firebase configuration is incomplete. Some features may not work properly.');
    } else {
      // Inicializar la aplicación de Firebase
      firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      
      // Inicializar Firestore
      db = getFirestore(firebaseApp);
      
      // Conectar al emulador en desarrollo si está configurado
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
        try {
          connectFirestoreEmulator(db, 'localhost', 8080);
          console.log('Connected to Firestore emulator');
        } catch (error) {
          console.warn('Failed to connect to Firestore emulator:', error);
        }
      }
      
      console.log('Firebase Firestore inicializado correctamente');
    }
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    // Establecer valores null para evitar errores posteriores
    firebaseApp = null;
    db = null;
  }
} else if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true') {
  console.log('Firebase deshabilitado en desarrollo');
  firebaseApp = null;
  db = null;
}

export { firebaseApp, db };
