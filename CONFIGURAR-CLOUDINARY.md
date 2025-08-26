# Configuración de Cloudinary para Imágenes en Producción

## Problema Identificado

En producción (Vercel), las imágenes no se muestran porque:
- Vercel no permite escribir archivos en el sistema de archivos
- Las imágenes se suben correctamente en desarrollo local pero fallan en producción
- Los errores 404 indican que las imágenes no existen en el servidor

## Solución: Cloudinary

Se ha implementado Cloudinary como servicio de almacenamiento en la nube para las imágenes.

### Pasos para Configurar Cloudinary

#### 1. Crear Cuenta en Cloudinary
1. Ve a [https://cloudinary.com](https://cloudinary.com)
2. Crea una cuenta gratuita
3. Anota tus credenciales del Dashboard:
   - Cloud Name
   - API Key
   - API Secret

#### 2. Configurar Variables de Entorno

**En desarrollo local (.env.local):**
```env
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

**En Vercel (Producción):**
1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Agrega las mismas variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

#### 3. Características de la Implementación

- **Optimización automática**: Las imágenes se convierten a WebP
- **Redimensionamiento**: Máximo 800x600px
- **Calidad automática**: Cloudinary optimiza el tamaño
- **Organización**: Las imágenes se guardan en `tubarrio/services/`
- **URLs seguras**: Todas las URLs usan HTTPS

#### 4. Verificar Funcionamiento

1. Configura las variables de entorno
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Ve a `/admin/servicios/nuevo`
4. Sube una imagen de prueba
5. Verifica que la URL generada sea de Cloudinary (cloudinary.com)

#### 5. Deploy a Producción

1. Configura las variables en Vercel
2. Haz deploy del proyecto
3. Prueba la subida de imágenes en producción

### Beneficios de Cloudinary

- ✅ Funciona en Vercel y otros servicios serverless
- ✅ Optimización automática de imágenes
- ✅ CDN global para carga rápida
- ✅ Transformaciones en tiempo real
- ✅ Plan gratuito generoso (25GB/mes)

### Troubleshooting

**Error: "Missing required parameter - cloud_name"**
- Verifica que las variables de entorno estén configuradas
- Reinicia el servidor después de agregar las variables

**Error 401 en Cloudinary**
- Verifica que API Key y API Secret sean correctos
- Asegúrate de que no haya espacios extra en las variables

**Imágenes no se muestran**
- Verifica que la URL generada sea de Cloudinary
- Revisa la consola del navegador para errores
- Verifica que las variables estén configuradas en Vercel

### Código Implementado

El endpoint `/api/upload-image` ahora:
1. Recibe la imagen del formulario
2. La sube a Cloudinary con optimizaciones
3. Retorna la URL segura de Cloudinary
4. El frontend muestra la imagen desde Cloudinary

Esto resuelve completamente el problema de imágenes 404 en producción.