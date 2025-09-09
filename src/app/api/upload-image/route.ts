import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { checkUploadRateLimit } from '@/lib/rateLimit';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MIME types permitidos (más específicos)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

// Función para sanitizar nombres de archivo
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Reemplazar caracteres especiales
    .replace(/_{2,}/g, '_') // Evitar múltiples guiones bajos consecutivos
    .replace(/^_+|_+$/g, '') // Remover guiones bajos al inicio y final
    .substring(0, 100); // Limitar longitud
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkUploadRateLimit(request);
    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes. Intente nuevamente más tarde.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      );
    }
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró ningún archivo' },
        { status: 400 }
      );
    }

    // Validación más estricta de MIME types
    if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Use JPEG, PNG, WebP o GIF' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'La imagen es demasiado grande. Máximo 5MB' },
        { status: 400 }
      );
    }

    // Generar nombre único con sanitización
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedOriginalName = sanitizeFileName(file.name.split('.')[0]);
    const fileName = `${timestamp}-${randomString}-${sanitizedOriginalName}`;

    // Subir a Cloudinary usando stream directo
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: `services/${fileName}`,
          folder: 'tubarrio/services',
          transformation: [
            { width: 1200, crop: 'limit' }, // Más flexible que width/height fijos
            { quality: 'auto:good' },       // Mejor balance calidad/tamaño
            { format: 'auto' }              // Auto-detectar mejor formato
          ],
          context: {
            upload_source: 'tubarrio_admin',
            original_filename: file.name,
            upload_timestamp: timestamp.toString()
          },
          tags: ['service', 'tubarrio', 'user_upload']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Stream directo desde el file
      const reader = file.stream().getReader();
      
      const pushChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          uploadStream.end();
          return;
        }
        uploadStream.write(value);
        pushChunk();
      };
      
      pushChunk();
    });

    // Retornar URL pública de Cloudinary
    const result = uploadResult as any;
    
    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      thumbnailUrl: result.secure_url.replace('/upload/', '/upload/w_300,h_200,c_fill/'),
      fileName: fileName,
      fileSize: result.bytes,
      format: result.format
    });

  } catch (error) {
    console.error('Error al subir imagen:', error);
    
    // Error más específico
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error interno del servidor';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// ✅ CONFIGURACIÓN CORRECTA para Next.js 14:
export const runtime = 'nodejs'; // Necesario para APIs con buffers
export const maxDuration = 300; // 5 minutos máximo