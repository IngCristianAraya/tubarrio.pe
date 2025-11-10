// Configuración de Content Security Policy (CSP)
// Documentación: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

type Directive = string[] | string;

export interface CspDirectives {
  defaultSrc?: Directive;
  scriptSrc?: Directive;
  styleSrc?: Directive;
  imgSrc?: Directive;
  fontSrc?: Directive;
  connectSrc?: Directive;
  mediaSrc?: Directive;
  objectSrc?: Directive;
  frameSrc?: Directive;
  frameAncestors?: Directive;
  formAction?: Directive;
  baseUri?: Directive;
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
  requireTrustedTypesFor?: string[];
}

// Configuración de CSP para producción
const productionCsp: CspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://maps.googleapis.com",
    "https://apis.google.com",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
  ],
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https:",
    // Permitir imágenes servidas desde Supabase (storage/public)
    "https://*.supabase.co",
    "https://*.googleapis.com",
    "https://*.gstatic.com",
    "https://*.firebaseio.com",
    "https://*.google.com",
    "https://*.facebook.com",
    "https://*.fbcdn.net",
    "https://*.tile.openstreetmap.org",
    "https://unpkg.com",
    "*.pexels.com",
    "images.pexels.com",
    "*.unsplash.com",
    "images.unsplash.com",
    "*.pixabay.com",
    "cdn.pixabay.com",
  ],
  fontSrc: [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
  ],
  connectSrc: [
    "'self'",
    // Supabase: REST, Auth y Storage API (HTTPS y WebSocket para tiempo real si fuera necesario)
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.firebaseio.com",
    "wss://*.firebaseio.com",
    "https://*.google.com",
    "https://*.googleapis.com",
    "https://firestore.googleapis.com",
  ],
  frameSrc: [
    "'self'",
    "https://www.google.com",
    "https://www.youtube.com",
    "https://www.facebook.com",
  ],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: true,
  blockAllMixedContent: true,
};

// Configuración de CSP para desarrollo
const developmentCsp: CspDirectives = {
  ...productionCsp,
  // Menos restrictivo en desarrollo para facilitar el desarrollo
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'"
  ],
  connectSrc: [
    "'self'",
    "http://localhost:*",
    "ws://localhost:*",
    ...(Array.isArray(productionCsp.connectSrc) ? productionCsp.connectSrc : [])
  ]
};

// Función para convertir las directivas a formato de cadena
export function generateCspHeader(directives: CspDirectives): string {
  return Object.entries(directives)
    .map(([key, value]) => {
      // Manejar directivas booleanas como upgrade-insecure-requests
      if (typeof value === 'boolean' && value) {
        return key.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
      
      // Manejar arrays de directivas
      if (Array.isArray(value)) {
        const directiveName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${directiveName} ${value.join(' ')}`;
      }
      
      return '';
    })
    .filter(Boolean)
    .join('; ');
}

// Exportar la configuración de CSP según el entorno
export const cspConfig = process.env.NODE_ENV === 'production' 
  ? productionCsp 
  : developmentCsp;

export const cspHeader = generateCspHeader(cspConfig);
