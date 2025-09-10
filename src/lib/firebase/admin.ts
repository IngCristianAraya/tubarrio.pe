import { initializeApp, getApps, cert, App, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Get Firebase Admin SDK service account key from environment variables
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
);

let firebaseAdmin: App;
let firestoreAdmin: Firestore;

// Initialize Firebase Admin SDK if it hasn't been initialized yet
if (!getApps().length) {
  try {
    firebaseAdmin = initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    throw error;
  }
} else {
  firebaseAdmin = getApp();
}

// Initialize Firestore
try {
  firestoreAdmin = getFirestore(firebaseAdmin);
  console.log('Firestore Admin initialized successfully');
} catch (error) {
  console.error('Firestore admin initialization error', error);
  throw error;
}

export { firebaseAdmin, firestoreAdmin as db };
