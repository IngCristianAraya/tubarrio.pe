// Configuración de Firebase para Next.js
import { initializeApp, getApps, getApp } from '@firebase/app';
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "tubarriope-7ed1d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tubarriope-7ed1d.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
let app;
let db;
let auth;

// Solo inicializar en el lado del cliente
try {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DISABLE_FIREBASE !== 'true') {
    // Inicializar la aplicación de Firebase
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    // Inicializar servicios de Firebase
    db = getFirestore(app);
    auth = getAuth(app);

    // Conectar al emulador en desarrollo si está configurado
    if (process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('Conectado al emulador de Firestore');
      } catch (emulatorError) {
        console.warn('No se pudo conectar al emulador:', emulatorError);
      }
    }
    
    console.log('Firebase inicializado correctamente');
  }
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
} finally {
  // Si Firebase está deshabilitado, crear objetos mock
  if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true') {
    console.log('Firebase deshabilitado en desarrollo');
    db = null;
    auth = null;
  }
  // En desarrollo, muestra más detalles del error
  if (process.env.NODE_ENV === 'development') {
    // Configuración de Firebase cargada correctamente
  }
}

export { app, db, auth };
