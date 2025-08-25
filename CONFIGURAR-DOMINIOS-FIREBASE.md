# Configurar Dominios Autorizados en Firebase Console

## 🎯 Problema Identificado

Firebase puede estar bloqueando las conexiones desde tu dominio de Vercel porque no está autorizado en Firebase Console.

## 📋 Pasos para Verificar y Configurar

### 1. Acceder a Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **tubarriope-7ed1d**
3. En el menú lateral, ve a **Authentication**
4. Haz clic en la pestaña **Settings**
5. Busca la sección **Authorized domains**

### 2. Verificar Dominios Actuales

Probablemente solo tengas configurado:
- ✅ `localhost` (para desarrollo)
- ✅ `tubarriope-7ed1d.firebaseapp.com` (dominio por defecto de Firebase)

### 3. Agregar tu Dominio de Vercel

1. Haz clic en **Add domain**
2. Agrega tu dominio de Vercel (ejemplo: `tubarrio-pe.vercel.app`)
3. **IMPORTANTE**: Agrega SOLO el dominio, sin `https://` ni rutas

**Ejemplos de dominios correctos:**
```
tubarrio-pe.vercel.app
tu-proyecto.vercel.app
mi-app-123abc.vercel.app
```

**❌ Incorrecto:**
```
https://tubarrio-pe.vercel.app
tubarrio-pe.vercel.app/
https://tubarrio-pe.vercel.app/home
```

### 4. Encontrar tu Dominio de Vercel

Si no sabes cuál es tu dominio exacto:

1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Busca tu proyecto
3. En la página del proyecto, verás la URL en la sección **Domains**
4. Copia solo la parte del dominio (sin `https://`)

### 5. Dominios Comunes a Agregar

Basándote en tu proyecto, probablemente necesites agregar:
```
tubarrio-pe.vercel.app
tubarriope.vercel.app
revistadigital-next.vercel.app
```

**Tip**: Si tienes múltiples dominios o subdominios, agrégalos todos.

### 6. Verificar Configuración

Después de agregar el dominio:

1. Guarda los cambios
2. Espera 1-2 minutos para que se propague
3. Prueba tu aplicación en producción
4. Usa el script `debug-firebase-production-issue.js` para verificar

## 🔍 Cómo Verificar si Este es el Problema

### En el Navegador (Producción)

1. Abre tu app en Vercel
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Console**
4. Busca errores como:
   ```
   Firebase: Error (auth/unauthorized-domain)
   This domain is not authorized for OAuth operations
   ```

### En la Pestaña Network

1. Ve a la pestaña **Network**
2. Recarga la página
3. Busca requests a Firebase que fallen con códigos 400 o 403

## 🚨 Errores Comunes

### Error: "unauthorized-domain"
**Causa**: Tu dominio de Vercel no está en la lista de dominios autorizados
**Solución**: Agregar el dominio exacto en Firebase Console

### Error: "domain-mismatch"
**Causa**: El dominio agregado no coincide exactamente con el dominio real
**Solución**: Verificar que el dominio sea exacto (sin https://, sin rutas)

## 📝 Lista de Verificación

- [ ] Accedí a Firebase Console
- [ ] Fui a Authentication > Settings > Authorized domains
- [ ] Verifiqué los dominios actuales
- [ ] Agregué mi dominio de Vercel exacto
- [ ] Guardé los cambios
- [ ] Esperé 1-2 minutos
- [ ] Probé la aplicación en producción
- [ ] Verifiqué que no hay errores de dominio en la consola

## 🔄 Próximos Pasos

Después de configurar los dominios:
1. Forzar redespliegue en Vercel
2. Probar conexión con `debug-firebase-production-issue.js`
3. Verificar que `NEXT_PUBLIC_SITE_URL` esté configurado correctamente
4. Revisar logs de Vercel para otros errores

## 💡 Tip Adicional

Si tienes un dominio personalizado (no `.vercel.app`), también agrégalo a la lista de dominios autorizados.