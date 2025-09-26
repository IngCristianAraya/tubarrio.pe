import { NextRequest, NextResponse } from 'next/server';
import { db as firebaseDb } from '@/lib/firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';

// Definir interfaz para el tipo de datos del servicio
interface ServiceData {
  id: string;
  name?: string;
  [key: string]: any; // Para otras propiedades dinámicas
}

// Configuración de Firebase Admin SDK
const initializeFirebaseAdmin = (): Firestore => {
  try {
    // La inicialización ya se maneja en firebase-admin.ts
    return firebaseDb;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
};

// Inicializar Firebase Admin
const db = initializeFirebaseAdmin();

// GET - Obtener servicio específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('📖 Consultando servicio con Firebase Admin:', id);
    
    const serviceRef = db.collection('services').doc(id);
    const serviceDoc = await serviceRef.get();
    
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    
    const serviceData: ServiceData = {
      id: serviceDoc.id,
      ...serviceDoc.data()
    };
    
    console.log(`✅ Servicio encontrado: ${serviceData.name || 'Sin nombre'}`);
    
    return NextResponse.json(serviceData);
    
  } catch (error) {
    console.error('❌ Error al obtener servicio:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar servicio específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log('🔄 Actualizando servicio con Firebase Admin:', id);
    
    // Verificar que el servicio existe
    const serviceRef = db.collection('services').doc(id);
    const serviceDoc = await serviceRef.get();
    
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    
    // Actualizar con timestamp
    const updatedData = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await serviceRef.update(updatedData);
    
    console.log(`✅ Servicio ${id} actualizado`);
    
    // Obtener datos actualizados
    const updatedDoc = await serviceRef.get();
    const result = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('🗑️ Eliminando servicio con Firebase Admin:', id);
    
    // Verificar que el servicio existe
    const serviceRef = db.collection('services').doc(id);
    const serviceDoc = await serviceRef.get();
    
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    
    await serviceRef.delete();
    
    console.log(`✅ Servicio ${id} eliminado`);
    
    return NextResponse.json({ message: 'Servicio eliminado correctamente', id });
    
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}