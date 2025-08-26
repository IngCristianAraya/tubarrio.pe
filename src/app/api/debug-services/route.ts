import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

// Configuración de Firebase para servidor (sin NEXT_PUBLIC_) - con limpieza de variables
const firebaseConfig = {
  apiKey: (process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '').trim(),
  authDomain: (process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '').trim(),
  projectId: (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d').trim(),
  storageBucket: (process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '').trim(),
  messagingSenderId: (process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  appId: (process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '').trim(),
};

export async function GET() {
  try {
    // Debug: Verificar variables de entorno
    console.log('🔍 Variables de entorno Firebase:');
    console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'SET' : 'NOT SET');
    console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'NOT SET');
    console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT SET');
    
    // Verificar configuración
    console.log('🔧 Configuración Firebase:', {
      apiKey: firebaseConfig.apiKey ? 'SET' : 'NOT SET',
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain
    });
    
    // Inicializar Firebase
    const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(firebaseApp);
    
    console.log('✅ Firebase inicializado correctamente');
    
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
    console.error('❌ Error al consultar servicios:', error);
    
    // Capturar más detalles del error
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Error desconocido',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      firebaseConfig: {
        hasApiKey: !!firebaseConfig.apiKey,
        projectId: firebaseConfig.projectId,
        hasAuthDomain: !!firebaseConfig.authDomain
      }
    };
    
    return NextResponse.json(
      { 
        error: 'Error al consultar servicios', 
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}