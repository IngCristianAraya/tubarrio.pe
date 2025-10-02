# Configuración de Google Maps en Vercel

## Problema Identificado
Los mapas de servicios no se muestran en producción porque falta configurar la API key de Google Maps en Vercel.

## Solución

### 1. Obtener API Key de Google Maps

1. **Ir a Google Cloud Console**: https://console.cloud.google.com/
2. **Crear o seleccionar un proyecto**
3. **Habilitar APIs necesarias**:
   - Maps Embed API
   - Maps JavaScript API (opcional)
   - Geocoding API (opcional, para futuras funcionalidades)

4. **Crear API Key**:
   - Ir a "Credenciales" > "Crear credenciales" > "Clave de API"
   - Copiar la API key generada

5. **Configurar restricciones** (recomendado):
   - Restricciones de aplicación: "Referentes HTTP (sitios web)"
   - Agregar dominios autorizados:
     - `https://www.tubarrio.pe/*`
     - `https://tubarrio.pe/*`
     - `https://*.vercel.app/*` (para previews)

### 2. Configurar en Vercel

1. **Ir al Dashboard de Vercel**: https://vercel.com/dashboard
2. **Seleccionar el proyecto**
3. **Ir a Settings > Environment Variables**
4. **Agregar nueva variable**:
   - **Name**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: [Tu API key de Google Maps]
   - **Environment**: Production, Preview, Development

### 3. Variables de Entorno Necesarias en Vercel

Asegúrate de tener configuradas todas estas variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCyUy8zFbyy0VwYVUZo9TnfDMoMU3eqAUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tubarriope-7ed1d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tubarriope-7ed1d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tubarriope-7ed1d.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1097392406942
NEXT_PUBLIC_FIREBASE_APP_ID=1:1097392406942:web:aa206fa1542c74c235568f

# Firebase Admin SDK
FIREBASE_PROJECT_ID=tubarriope-7ed1d
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=[Tu private key completa]

# Google Maps (NUEVA)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[Tu API key de Google Maps]

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=51901426737

# SEO
NEXT_PUBLIC_SITE_URL=https://www.tubarrio.pe
NEXT_PUBLIC_SITE_NAME=Tu Barrio PE
NEXT_PUBLIC_SITE_DESCRIPTION=Directorio de servicios locales en tu barrio

# Cloudinary
CLOUDINARY_CLOUD_NAME=do2rpqupm
CLOUDINARY_API_KEY=686419979272171
CLOUDINARY_API_SECRET=bxlyqkDjGKDRawmEtYJ0dncNUS0

# Firebase Features
NEXT_PUBLIC_FIRESTORE_READS_ENABLED=true
```

### 4. Redeploy del Proyecto

Después de configurar las variables de entorno:

1. **Hacer un nuevo deploy**:
   - Puedes hacer un push a tu repositorio
   - O usar "Redeploy" en el dashboard de Vercel

2. **Verificar que funcione**:
   - Ir a cualquier página de servicio
   - Verificar que el mapa se muestre correctamente

## Implementación Técnica

### Componente ServiceMap Actualizado

El componente ya está configurado para:

1. **Usar API key cuando esté disponible**: Para mejor rendimiento y funcionalidades
2. **Fallback sin API key**: Para desarrollo local y casos de emergencia
3. **Múltiples fuentes de ubicación**: Coordenadas > dirección completa > dirección > barrio

### URLs Generadas

**Con API Key**:
```
https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=lat,lng&zoom=16
```

**Sin API Key (Fallback)**:
```
https://www.google.com/maps?q=lat,lng&output=embed&z=16
```

## Beneficios de Usar API Key

1. **Mejor rendimiento**: Carga más rápida de mapas
2. **Más funcionalidades**: Controles avanzados, estilos personalizados
3. **Estadísticas**: Monitoreo de uso en Google Cloud Console
4. **Límites más altos**: Mayor cuota de requests
5. **Soporte oficial**: Garantía de funcionamiento a largo plazo

## Costos

- **Maps Embed API**: Gratuita hasta 25,000 cargas por mes
- **Uso actual estimado**: ~1,000-5,000 cargas por mes
- **Costo adicional**: $0 (dentro del límite gratuito)

## Monitoreo

Después de la implementación, monitorear:

1. **Google Cloud Console**: Uso de la API
2. **Vercel Analytics**: Rendimiento de páginas con mapas
3. **Feedback de usuarios**: Reportes de mapas que no cargan

## Próximos Pasos

1. ✅ Configurar API key en .env.local
2. ✅ Actualizar componente ServiceMap
3. 🔄 Configurar variables en Vercel
4. ⏳ Hacer redeploy
5. ⏳ Verificar funcionamiento en producción

---

**Fecha**: 2 de octubre, 2024
**Estado**: Listo para configuración en Vercel