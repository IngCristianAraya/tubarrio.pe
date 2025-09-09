# Tubarrio.pe - Directorio de Servicios

Este es un directorio de servicios locales construido con Next.js 14 y Firebase. La aplicación está optimizada para lectura, con un panel de administración separado en Python.

## Características Principales

- 🚀 **Rendimiento optimizado** con carga perezosa y caché de datos
- 🔒 **Seguridad mejorada** con autenticación simplificada
- 📱 **Diseño responsive** que funciona en todos los dispositivos
- 🔄 **Sistema de caché** para reducir las lecturas de Firestore
- 🔍 **Búsqueda y filtrado** de servicios por categoría y palabras clave

## Configuración del Proyecto

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase

### Configuración de Firebase

1. Crea un nuevo proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Añade una nueva aplicación web a tu proyecto de Firebase
3. Copia el objeto de configuración de Firebase
4. Copia `.env.example` a `.env.local` y completa con tus credenciales:

```bash
cp .env.example .env.local
```

5. Edita `.env.local` con tu configuración de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

### Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Estructura del Proyecto

- `/src/app` - Rutas y páginas de la aplicación
- `/src/components` - Componentes reutilizables
- `/src/context` - Contextos de React para gestión de estado global
- `/src/lib` - Utilidades y configuraciones
- `/public` - Archivos estáticos

## Despliegue

Puedes desplegar esta aplicación en Vercel, Netlify o cualquier otro servicio de hosting compatible con Next.js.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deployment on Vercel

### ⚠️ IMPORTANTE: Configuración de Variables de Entorno

Para que la aplicación funcione correctamente en producción, **DEBES configurar las variables de entorno en Vercel**:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **Environment Variables**
4. Agrega todas las variables de `.env.local` (especialmente las `NEXT_PUBLIC_FIREBASE_*`)
5. Haz un **redeploy** después de agregar las variables

### Verificar Despliegue

Puedes verificar que todo esté configurado correctamente:

```bash
# Verificar variables de entorno en producción
node check-vercel-deployment.js

# O visita directamente:
# https://tu-app.vercel.app/api/debug-env
```

### Variables Críticas para Firestore

Estas variables son **OBLIGATORIAS** en Vercel:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

📖 **Guía completa**: Ver `VERCEL-DEPLOYMENT-GUIDE.md`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SEO Implementation

This project includes comprehensive SEO optimization with the following features:

### 1. Metadata
- Dynamic metadata generation using Next.js 13+ `generateMetadata`
- Automatic title and description generation
- Open Graph and Twitter Card meta tags for rich social sharing
- Canonical URLs to prevent duplicate content

### 2. Structured Data (Schema.org)
- LocalBusiness schema for business listings
- Breadcrumb navigation markup
- FAQ schema for common questions
- Organization schema for the platform

### 3. Technical SEO
- Dynamic sitemap generation (`/sitemap.xml`)
- Robots.txt configuration
- Proper URL canonicalization
- Mobile-friendly responsive design
- Fast loading with optimized images

### 4. Performance
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Font optimization
- Minimal JavaScript bundle size

## Testing SEO

To test the SEO implementation, run:

```bash
# Install required dependencies
npm install axios @types/node --save-dev

# Make sure the development server is running
npm run dev

# In a new terminal, run the SEO tests
npx ts-node scripts/test-seo.ts
```

## Adding SEO to New Pages

1. **Basic Metadata**
   Use the `generateMetadata` function in your page component:

   ```tsx
   export async function generateMetadata() {
     return generateSeoMetadata({
       title: 'Page Title',
       description: 'Page description for search engines',
       url: '/page-path',
       type: 'website',
     });
   }
   ```

2. **Structured Data**
   Use the provided JSON-LD components:

   ```tsx
   import { LocalBusinessJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
   
   // In your component
   <LocalBusinessJsonLd
     name="Business Name"
     description="Business description"
     // ... other props
   />
   ```

3. **Social Sharing**
   Use the `SocialMeta` component for Open Graph and Twitter Cards:

   ```tsx
   import { SocialMeta } from '@/components/seo/SocialMeta';
   
   // In your component
   <SocialMeta 
     title="Page Title"
     description="Page description"
     image="/path/to/image.jpg"
     url="/page-path"
   />
   ```

## Optimización de Imágenes

Este proyecto incluye un sistema de optimización de imágenes que genera versiones en formato WebP de diferentes tamaños para mejorar el rendimiento de carga.

### Script de Optimización de Imágenes

```bash
npm run optimize:images
```

#### Características
- Convierte imágenes a formato WebP (más ligero que JPG/PNG)
- Genera múltiples tamaños para diferentes dispositivos
- Mantiene la estructura de directorios original
- Omite imágenes ya optimizadas para ahorrar tiempo

#### Directorios
- **Entrada**: `/public/images/` - Coloca aquí las imágenes originales
- **Salida**: `/public/optimized-images/` - Directorio con las versiones optimizadas

#### Tamaños Generados
- `-sm`: 320px (móviles pequeños)
- `-md`: 640px (móviles grandes y tablets)
- `-lg`: 1024px (tablets y pantallas pequeñas)
- `-xl`: 1280px (escritorios)
- `-2xl`: 1920px (pantallas grandes)

#### Uso en Componentes
El componente `OptimizedImage` detecta automáticamente las imágenes optimizadas. Solo usa la ruta original:

```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage 
  src="/images/ejemplo.jpg" 
  alt="Descripción"
  width={800}
  height={600}
  loading="lazy"
/>
```

## Scripts de Administración

Este proyecto incluye scripts para gestionar los servicios en Firestore de manera eficiente.

### Requisitos Previos
- Node.js instalado
- Archivo `firebase-admin.json` en el directorio raíz con las credenciales de Firebase Admin
- Dependencias de Node instaladas (`npm install`)

### Scripts Disponibles

1. **Estandarizar Servicios**
   ```bash
   node scripts/standardize_services.js
   ```
   - **Propósito**: Estandariza el archivo `services.json` para que todos los servicios tengan los mismos campos.
   - **Salida**: Genera `services_standardized.json` con la estructura corregida.

2. **Actualizar Servicios Modificados**
   ```bash
   node scripts/update_modified_services.js
   ```
   - **Propósito**: Actualiza solo los servicios que han sido modificados en Firestore.
   - **Uso ideal**: Para actualizaciones frecuentes, ya que solo modifica lo necesario.

3. **Importar Todos los Servicios**
   ```bash
   node scripts/import_services_to_firestore.js
   ```
   - **Propósito**: Importa o actualiza todos los servicios en Firestore.
   - **Advertencia**: Sobrescribe los datos existentes. Usar con precaución.

4. **Corregir Servicios**
   ```bash
   node scripts/fix_services.js
   ```
   - **Propósito**: Corrige problemas comunes en los datos de los servicios.
   - **Uso**: Útil después de hacer cambios manuales en los datos.

### Flujo de Trabajo Recomendado
1. Editar `services.json` con los cambios necesarios
2. Ejecutar `node scripts/standardize_services.js`
3. Revisar `services_standardized.json`
4. Ejecutar `node scripts/update_modified_services.js`
5. Verificar los cambios en la aplicación

## Despliegue en Vercel

La forma más sencilla de desplegar tu aplicación Next.js es usando la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Consulta nuestra [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.
