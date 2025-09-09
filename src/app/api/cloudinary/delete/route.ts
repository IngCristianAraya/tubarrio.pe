/**
 * API Route para eliminar imágenes de Cloudinary
 * Requiere autenticación del servidor para operaciones de eliminación
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Verificar que las credenciales estén configuradas
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Credenciales de Cloudinary no configuradas' },
        { status: 500 }
      );
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId es requerido' },
        { status: 400 }
      );
    }

    // TODO: Agregar autenticación del usuario aquí
    // Verificar que el usuario tenga permisos para eliminar esta imagen
    // Por ejemplo, verificar que la imagen pertenezca a un servicio del usuario
    
    // Eliminar la imagen de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Imagen eliminada exitosamente',
          publicId 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          error: 'No se pudo eliminar la imagen',
          details: result 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Endpoint para eliminar múltiples imágenes
export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Credenciales de Cloudinary no configuradas' },
        { status: 500 }
      );
    }

    const { publicIds } = await request.json();

    if (!publicIds || !Array.isArray(publicIds)) {
      return NextResponse.json(
        { error: 'publicIds debe ser un array' },
        { status: 400 }
      );
    }

    // TODO: Agregar autenticación del usuario aquí
    
    // Eliminar múltiples imágenes
    const results = await Promise.allSettled(
      publicIds.map(publicId => cloudinary.uploader.destroy(publicId))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.result === 'ok'
    ).length;

    const failed = results.length - successful;

    return NextResponse.json(
      {
        success: true,
        message: `${successful} imágenes eliminadas, ${failed} fallaron`,
        successful,
        failed,
        details: results
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al eliminar imágenes de Cloudinary:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}