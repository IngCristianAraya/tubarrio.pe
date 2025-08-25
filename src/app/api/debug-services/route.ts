import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function GET() {
  try {
    // Inicializar Firebase
    const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(firebaseApp);
    
    console.log("🔍 Consultando servicios desde API...");
    const servicesQuery = query(collection(db, 'services'), orderBy('name'));
    const querySnapshot = await getDocs(servicesQuery);
    
    const allServices: any[] = [];
    const activeServices: any[] = [];
    const inactiveServices: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const service = {
        id: doc.id,
        name: data.name,
        active: data.active,
        category: data.category
      };
      
      allServices.push(service);
      
      if (data.active !== false) {
        activeServices.push(service);
      } else {
        inactiveServices.push(service);
      }
    });
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      total: allServices.length,
      active: activeServices.length,
      inactive: inactiveServices.length,
      allServices,
      activeServices,
      inactiveServices,
      filterLogic: "data.active !== false (incluye true y undefined, excluye false)"
    });
    
  } catch (error) {
    console.error('Error al consultar servicios:', error);
    return NextResponse.json(
      { error: 'Error al consultar servicios', details: error },
      { status: 500 }
    );
  }
}