import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from './lib/rateLimit';
import { cspHeader, cspConfig } from './lib/csp';

// Configuración de rate limiting
const applyRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // Límite de 100 peticiones por minuto
  message: 'Demasiadas peticiones desde esta IP. Por favor, inténtalo de nuevo en un minuto.',
  statusCode: 429,
  // Rutas excluidas del rate limiting
  skip: (req) => {
    const { pathname } = req.nextUrl;
    return (
      pathname.startsWith('/_next') ||
      pathname.includes('.') ||
      pathname.startsWith('/api/health') ||
      pathname.startsWith('/_vercel')
    );
  },
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Aplicar rate limiting
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Asegurar que todas las respuestas tengan los headers de seguridad
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  
  // Headers adicionales de seguridad
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // Prevenir MIME type sniffing
  response.headers.set('X-Download-Options', 'noopen');
  
  // Prevenir clickjacking
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  return response;
}

// Configuración de las rutas que deben pasar por el middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/health).*)',
  ],
};
