import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuración de rate limit
interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
  skip?: (req: NextRequest) => boolean;
}

// Almacenamiento en memoria (usar Redis en producción)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (config: RateLimitConfig) => {
  const {
    windowMs = 60 * 1000, // 1 minuto por defecto
    max = 100, // 100 peticiones por ventana por defecto
    message = 'Demasiadas peticiones',
    statusCode = 429,
    skip = () => false,
  } = config;

  return (req: NextRequest) => {
    // Saltar rate limiting si skip devuelve true
    if (skip(req)) {
      return null;
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const path = req.nextUrl.pathname;
    const key = `${ip}:${path}`;
    const now = Date.now();

    const rateLimitInfo = rateLimitStore.get(key);

    if (rateLimitInfo) {
      // Reiniciar el contador si la ventana ha expirado
      if (now > rateLimitInfo.resetTime) {
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + windowMs,
        });
      } else {
        // Verificar si se excedió el límite
        if (rateLimitInfo.count >= max) {
          return new NextResponse(message, {
            status: statusCode,
            headers: {
              'Retry-After': Math.ceil((rateLimitInfo.resetTime - now) / 1000).toString(),
            },
          });
        }
        // Incrementar el contador
        rateLimitStore.set(key, {
          ...rateLimitInfo,
          count: rateLimitInfo.count + 1,
        });
      }
    } else {
      // Inicializar el contador
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
    }

    return null;
  };
};

// Función simplificada para endpoints específicos
export async function checkUploadRateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
           request.headers.get('x-real-ip') || 
           request.ip || 
           '127.0.0.1';
  
  const key = `upload:${ip}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuto
  const maxRequests = 10; // 10 uploads por minuto
  
  const rateLimitInfo = rateLimitStore.get(key);
  
  if (rateLimitInfo) {
    if (now > rateLimitInfo.resetTime) {
      // Reiniciar contador
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { isRateLimited: false, remaining: maxRequests - 1 };
    } else {
      if (rateLimitInfo.count >= maxRequests) {
        return {
          isRateLimited: true,
          remaining: 0,
          retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000)
        };
      }
      // Incrementar contador
      rateLimitStore.set(key, {
        ...rateLimitInfo,
        count: rateLimitInfo.count + 1,
      });
      return { isRateLimited: false, remaining: maxRequests - rateLimitInfo.count };
    }
  } else {
    // Inicializar contador
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { isRateLimited: false, remaining: maxRequests - 1 };
  }
}

// Limpiar el almacenamiento periódicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime + 60 * 1000) { // 1 minuto después de la expiración
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Ejecutar cada minuto
