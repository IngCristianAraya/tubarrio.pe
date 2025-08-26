# Cómo Obtener las Credenciales de Cloudinary

## Paso 1: Acceder al Dashboard

1. Ve a [https://cloudinary.com](https://cloudinary.com)
2. Inicia sesión con tu cuenta
3. Serás redirigido al **Dashboard** automáticamente

## Paso 2: Encontrar las Credenciales

En el Dashboard verás una sección llamada **"Account Details"** o **"API Environment variable"** que contiene:

```
cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

O también verás las credenciales separadas:

- **Cloud Name**: `tu-cloud-name`
- **API Key**: `123456789012345`
- **API Secret**: `abcdefghijklmnopqrstuvwxyz123456`

## Paso 3: Configurar en tu Proyecto

### Opción A: Editar .env.local manualmente

Abre el archivo `.env.local` y reemplaza:

```env
# Cloudinary Configuration (para subida de imágenes)
CLOUDINARY_CLOUD_NAME=tu-cloud-name-real
CLOUDINARY_API_KEY=tu-api-key-real
CLOUDINARY_API_SECRET=tu-api-secret-real
```

### Opción B: Copiar desde el Dashboard

1. En el Dashboard de Cloudinary, busca la sección **"API Environment variable"**
2. Verás algo como: `cloudinary://123456:abcdef@mi-cloud-name`
3. Extrae los valores:
   - **CLOUD_NAME**: `mi-cloud-name` (después de la @)
   - **API_KEY**: `123456` (entre :// y el primer :)
   - **API_SECRET**: `abcdef` (entre el : y la @)

## Paso 4: Reiniciar el Servidor

Después de configurar las variables:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

## Paso 5: Probar la Configuración

1. Ve a `http://localhost:3000/admin/servicios/nuevo`
2. Intenta subir una imagen
3. Si funciona, verás una URL de Cloudinary en la consola
4. La URL debe ser algo como: `https://res.cloudinary.com/tu-cloud-name/image/upload/...`

## Troubleshooting

**Error: "Must supply cloud_name"**
- Verifica que `CLOUDINARY_CLOUD_NAME` esté configurado correctamente
- Reinicia el servidor después de cambiar las variables

**Error 401: "Invalid credentials"**
- Verifica que `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` sean correctos
- Asegúrate de no tener espacios extra al copiar/pegar

**Las imágenes no se suben**
- Abre la consola del navegador (F12) para ver errores
- Verifica que todas las 3 variables estén configuradas

## Siguiente Paso: Configurar en Vercel

Una vez que funcione en desarrollo local, necesitarás configurar las mismas variables en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Agrega las 3 variables de Cloudinary
4. Redeploy el proyecto

¡Compárteme tus credenciales cuando las tengas y te ayudo a configurarlas!