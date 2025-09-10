import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

// Deshabilitar la caché para esta ruta
export const dynamic = 'force-dynamic';

type BusinessRegistrationData = {
  businessName: string;
  category: string;
  phone: string;
  email?: string;
  description?: string;
  source?: string;
};

export async function POST(request: Request) {
  try {
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { businessName, category, phone, email, description, source } = body;

    // Validar los datos de entrada
    if (!businessName || !category || !phone) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de teléfono (solo números, mínimo 9 dígitos)
    const phoneRegex = /^[0-9]{9,15}$/;
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'Formato de teléfono inválido' },
        { status: 400 }
      );
    }

    // Validar email si se proporciona
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Formato de correo electrónico inválido' },
        { status: 400 }
      );
    }

    // Crear el objeto de negocio para guardar en Firestore
    const businessData = {
      businessName: businessName.trim(),
      category: category.trim(),
      phone: cleanPhone,
      email: email ? email.trim().toLowerCase() : null,
      description: description ? description.trim() : null,
      source: source || 'business-registration-page',
      status: 'pending', // Estado inicial
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as const;

    // Guardar en Firestore
    const docRef = await db.collection('businessRegistrations').add(businessData);

    // Aquí podrías agregar lógica adicional, como enviar notificaciones por correo, etc.

    return NextResponse.json({
      success: true,
      message: 'Registro exitoso',
      id: docRef.id
    });

  } catch (error: unknown) {
    console.error('Error en el registro de negocio:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Configuración de la ruta
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
