import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Configuración de Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    // Usar variables de entorno para Firebase Admin
    const serviceAccount = {
      projectId: (process.env.FIREBASE_PROJECT_ID || 'tubarriope-7ed1d').trim(),
      clientEmail: (process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com').trim(),
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim(),
    };
    
    console.log('🔧 Inicializando Firebase Admin con:', {
      projectId: serviceAccount.projectId,
      hasClientEmail: !!serviceAccount.clientEmail,
      hasPrivateKey: !!serviceAccount.privateKey
    });
    
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId
    });
  }
  return getApps()[0];
};

// Inicializar Firebase Admin
const app = initializeFirebaseAdmin();
const db = getFirestore(app);

// GET - Obtener todos los servicios
export async function GET() {
  try {
    console.log('📖 Consultando servicios con Firebase Admin...');
    
    const servicesRef = db.collection('services');
    const querySnapshot = await servicesRef.orderBy('name').get();
    
    const services: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Solo incluir servicios activos (active !== false)
      if (data.active !== false) {
        services.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    console.log(`✅ Encontrados ${services.length} servicios activos`);
    
    return NextResponse.json(services);
    
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('✏️ Creando nuevo servicio con Firebase Admin:', body.name);
    
    // Generar ID único
    const serviceId = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Datos del servicio con valores por defecto
    const serviceData = {
      name: body.name || 'Servicio sin nombre',
      description: body.description || '',
      category: body.category || 'General',
      location: body.location || '',
      contact: {
        phone: body.contact?.phone || '',
        whatsapp: body.contact?.whatsapp || '',
        email: body.contact?.email || ''
      },
      address: body.address || '',
      reference: body.reference || '',
      image: body.image || '',
      images: body.images || [],
      active: body.active !== false, // Por defecto true
      featured: body.featured || false,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Crear documento en Firestore usando Firebase Admin
    await db.collection('services').doc(serviceId).set(serviceData);
    
    console.log(`✅ Servicio creado con ID: ${serviceId}`);
    
    return NextResponse.json({ id: serviceId, ...serviceData }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar servicio existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID del servicio requerido' }, { status: 400 });
    }
    
    console.log('🔄 Actualizando servicio con Firebase Admin:', id);
    
    // Verificar que el servicio existe
    const serviceRef = db.collection('services').doc(id);
    const serviceDoc = await serviceRef.get();
    
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    
    // Actualizar con timestamp
    const updatedData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await serviceRef.update(updatedData);
    
    console.log(`✅ Servicio ${id} actualizado`);
    
    return NextResponse.json({ id, ...updatedData });
    
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID del servicio requerido' }, { status: 400 });
    }
    
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