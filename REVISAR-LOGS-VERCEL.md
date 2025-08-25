# Revisar Logs de Despliegue en Vercel

## 🎯 Objetivo

Revisar los logs del despliegue más reciente en Vercel para identificar errores que puedan estar causando el problema de conexión con Firebase.

## 📋 Pasos para Revisar Logs

### 1. Acceder a los Logs via Dashboard

1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Busca y haz clic en tu proyecto
3. Ve a la pestaña **Deployments**
4. Haz clic en el despliegue más reciente (el primero de la lista)
5. Verás tres pestañas:
   - **Building**: Logs de construcción/build
   - **Functions**: Logs de funciones serverless
   - **Static**: Archivos estáticos generados

### 2. Revisar Logs de Building (Más Importante)

**Busca estos tipos de errores:**

#### 🔍 **Errores de Variables de Entorno**
```
Error: Environment variable NEXT_PUBLIC_FIREBASE_API_KEY is not defined
Warning: Missing environment variable
```

#### 🔍 **Errores de Firebase**
```
Firebase: Error (auth/invalid-api-key)
Firebase: Error (auth/project-not-found)
Error initializing Firebase
```

#### 🔍 **Errores de Build/Compilación**
```
Module not found: Can't resolve 'firebase/app'
TypeScript error in src/lib/firebase/config.ts
Build failed with exit code 1
```

#### 🔍 **Errores de Dependencias**
```
npm ERR! peer dep missing
Error: Cannot find module 'firebase'
Package.json dependencies conflict
```

### 3. Revisar Logs de Functions

**Busca errores en tiempo de ejecución:**

#### 🔍 **Errores de Runtime**
```
ReferenceError: firebase is not defined
Error: Firebase app not initialized
Unhandled Promise Rejection
```

#### 🔍 **Errores de Conexión**
```
Firestore connection failed
Auth domain not authorized
CORS policy error
```

### 4. Usar Vercel CLI (Alternativo)

Si prefieres usar la línea de comandos:

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Hacer login
vercel login

# Ver logs del último despliegue
vercel logs

# Ver logs en tiempo real
vercel logs --follow
```

### 5. Errores Comunes y Soluciones

#### ❌ **"Environment variable not defined"**
**Causa**: Variables de entorno no configuradas en Vercel
**Solución**: 
- Ve a Settings > Environment Variables
- Agrega las variables faltantes
- Redespliega

#### ❌ **"Firebase app not initialized"**
**Causa**: Error en la configuración de Firebase
**Solución**:
- Verificar `src/lib/firebase/config.ts`
- Comprobar que todas las variables estén definidas
- Revisar sintaxis de inicialización

#### ❌ **"Module not found: firebase"**
**Causa**: Dependencias de Firebase no instaladas correctamente
**Solución**:
- Verificar `package.json`
- Ejecutar `npm install` localmente
- Hacer commit y redeploy

#### ❌ **"Auth domain not authorized"**
**Causa**: Dominio de Vercel no autorizado en Firebase
**Solución**:
- Ir a Firebase Console > Authentication > Settings
- Agregar dominio de Vercel a authorized domains

#### ❌ **"CORS policy error"**
**Causa**: Problemas de CORS con Firebase
**Solución**:
- Verificar configuración de dominios en Firebase
- Comprobar `NEXT_PUBLIC_SITE_URL`

### 6. Información Específica a Buscar

#### En la sección **Building**:
```
✅ Buscar: "Build completed successfully"
❌ Buscar: Cualquier línea que contenga "Error" o "Failed"
⚠️ Buscar: Warnings sobre variables de entorno
```

#### En la sección **Functions**:
```
✅ Buscar: Requests exitosos (status 200)
❌ Buscar: Status 500, 400, 403
⚠️ Buscar: Timeouts o errores de conexión
```

### 7. Capturar Información Importante

Cuando encuentres errores, anota:

1. **Timestamp** del error
2. **Mensaje completo** del error
3. **Archivo/línea** donde ocurre (si se especifica)
4. **Stack trace** completo
5. **Variables de entorno** mencionadas

### 8. Ejemplo de Log Exitoso

```
[Building] ✓ Compiled successfully
[Building] ✓ Linting and checking validity of types
[Building] ✓ Creating an optimized production build
[Building] ✓ Collecting page data
[Building] ✓ Finalizing page optimization
[Building] Build completed in 45s
```

### 9. Ejemplo de Log con Errores

```
[Building] ❌ Failed to compile
[Building] Error: Environment variable NEXT_PUBLIC_FIREBASE_API_KEY is not defined
[Building] at /vercel/path0/src/lib/firebase/config.ts:15:23
[Building] Build failed with exit code 1
```

## 🔄 Acciones Según los Logs

### Si no hay errores en los logs:
- El problema puede ser de configuración post-build
- Verificar variables de entorno en runtime
- Probar script de diagnóstico en producción

### Si hay errores de variables:
- Configurar variables faltantes en Vercel
- Verificar nombres exactos de variables
- Forzar redespliegue

### Si hay errores de Firebase:
- Revisar configuración de Firebase
- Verificar dominios autorizados
- Comprobar reglas de Firestore

### Si hay errores de build:
- Revisar código fuente
- Verificar dependencias en package.json
- Probar build localmente

## 📝 Checklist de Revisión

- [ ] Accedí a Vercel Dashboard
- [ ] Revisé el despliegue más reciente
- [ ] Verifiqué logs de Building
- [ ] Revisé logs de Functions
- [ ] Busqué errores específicos de Firebase
- [ ] Anoté errores encontrados
- [ ] Identifiqué posibles soluciones
- [ ] Planifiqué próximos pasos

## 💡 Tip

Si los logs son muy largos, usa Ctrl+F (Cmd+F en Mac) para buscar palabras clave como:
- "Error"
- "Failed"
- "Firebase"
- "NEXT_PUBLIC_FIREBASE"
- "undefined"
- "not found"