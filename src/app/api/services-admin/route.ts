import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Configuración de Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    // La inicialización ya se maneja en firebase-admin.ts
    return db;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
};

export async function GET() {
  try {
    console.log('🚀 Iniciando consulta con Firebase Admin SDK...');
    
    // Inicializar Firebase Admin
    const db = initializeFirebaseAdmin();
    
    console.log('✅ Firebase Admin inicializado correctamente');
    
    // Consultar servicios
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.orderBy('name').get();
    
    console.log(`📊 Encontrados ${snapshot.size} servicios`);
    
    const allServices: any[] = [];
    const activeServices: any[] = [];
    const inactiveServices: any[] = [];
    
    snapshot.forEach((doc) => {
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
      method: 'Firebase Admin SDK',
      total: allServices.length,
      active: activeServices.length,
      inactive: inactiveServices.length,
      allServices: allServices.slice(0, 5), // Solo primeros 5 para evitar respuesta muy grande
      activeServices: activeServices.slice(0, 5),
      inactiveServices: inactiveServices.slice(0, 5),
      success: true
    });
    
  } catch (error) {
    console.error('❌ Error con Firebase Admin SDK:', error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Error desconocido',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      envVars: {
        hasProjectId: !!(process.env.FIREBASE_PROJECT_ID || '').trim(),
        hasClientEmail: !!(process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
        hasPrivateKey: !!(process.env.FIREBASE_PRIVATE_KEY || '').trim(),
        projectId: (process.env.FIREBASE_PROJECT_ID || '').trim()
      }
    };
    
    return NextResponse.json(
      { 
        error: 'Error al consultar servicios con Firebase Admin SDK', 
        details: errorDetails,
        timestamp: new Date().toISOString(),
        method: 'Firebase Admin SDK'
      },
      { status: 500 }
    );
  }
}