import { db } from '@/lib/firebase/config';

// Función para obtener funciones de Firebase dinámicamente
export const getFirestoreFunctions = async () => {
  if (!db) {
    return null;
  }

  try {
    const firestore = await import('firebase/firestore');
    return {
      collection: firestore.collection,
      addDoc: firestore.addDoc,
      query: firestore.query,
      where: firestore.where,
      getDocs: firestore.getDocs,
      orderBy: firestore.orderBy,
      limit: firestore.limit,
      startAfter: firestore.startAfter,
      getDoc: firestore.getDoc,
      doc: firestore.doc,
      DocumentSnapshot: firestore.DocumentSnapshot,
      onSnapshot: firestore.onSnapshot,
      getCountFromServer: firestore.getCountFromServer, // Añadir getCountFromServer
    };
  } catch (error) {
    console.warn('Firebase/firestore no disponible:', error);
    return null;
  }
};