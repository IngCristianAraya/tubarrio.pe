import { initializeApp, getApps, cert, App, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin with environment variables
const initializeFirebaseAdmin = () => {
  // Check if we're in a production environment (Vercel)
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  
  // For local development, you can use the service account key file
  if (!isProduction) {
    try {
      const serviceAccount = require('../../firebase-admin.json');
      return initializeApp({
        credential: cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });
    } catch (error) {
      console.warn('Could not find local firebase-admin.json. Falling back to environment variables.');
    }
  }

  // For production, use environment variables
  const serviceAccount = {
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error(
      'Firebase Admin SDK configuration is incomplete. Please set the required environment variables: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  return initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });};

// Initialize Firebase Admin SDK if it hasn't been initialized yet
let firebaseAdmin: App;
let firestoreAdmin: Firestore;

try {
  if (!getApps().length) {
    firebaseAdmin = initializeFirebaseAdmin();
    console.log('Firebase Admin initialized successfully');
  } else {
    firebaseAdmin = getApp();
  }

  // Initialize Firestore
  firestoreAdmin = getFirestore(firebaseAdmin);
  console.log('Firestore Admin initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Don't throw in the module scope to avoid crashing the app at startup
  // The error will be thrown when the database is actually used
}

export { firebaseAdmin, firestoreAdmin as db };
