# 📋 Guía para Revisar Logs de Vercel

## 🔍 Cómo Acceder a los Logs de Vercel

### 1. Dashboard de Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto
4. Ve a la pestaña **"Functions"** o **"Deployments"**
5. Haz clic en el deployment más reciente
6. Revisa las pestañas:
   - **Build Logs**: Errores durante la construcción
   - **Function Logs**: Errores en tiempo de ejecución
   - **Edge Logs**: Errores en el edge

### 2. CLI de Vercel (Alternativo)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer login
vercel login

# Ver logs en tiempo real
vercel logs [deployment-url]

# Ver logs de una función específica
vercel logs --follow
```

## 🚨 Errores Comunes a Buscar

### Errores de Build
- ❌ `Module not found`
- ❌ `Cannot resolve dependency`
- ❌ `TypeScript compilation errors`
- ❌ `Environment variable undefined`

### Errores de Runtime
- ❌ `Firebase configuration invalid`
- ❌ `Network request failed`
- ❌ `Permission denied`
- ❌ `Function timeout`

### Errores de Variables de Entorno
- ❌ `process.env.NEXT_PUBLIC_* is undefined`
- ❌ `Firebase app not initialized`
- ❌ `Invalid Firebase configuration`

## 🔧 Diagnóstico Específico para Firebase

### Buscar en los Logs:

1. **Errores de Inicialización**
   ```
   Error al inicializar Firebase
   Firebase configuration is incomplete
   Firebase app not initialized
   ```

2. **Errores de Variables de Entorno**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY is undefined
   process.env.NEXT_PUBLIC_* is undefined
   ```

3. **Errores de Red/Conectividad**
   ```
   Failed to fetch
   Network request failed
   CORS error
   ```

4. **Errores de Permisos**
   ```
   Permission denied
   Firestore rules
   Unauthorized
   ```

## 📊 Pasos de Diagnóstico

### Paso 1: Verificar Build Logs
```bash
# Buscar errores específicos
grep -i "error" build.log
grep -i "firebase" build.log
grep -i "environment" build.log
```

### Paso 2: Verificar Function Logs
- Buscar errores de inicialización de Firebase
- Verificar si las variables de entorno están disponibles
- Comprobar errores de red

### Paso 3: Comparar con Deployment Anterior
- Comparar logs del deployment que funcionaba
- Identificar diferencias en:
  - Variables de entorno
  - Dependencias
  - Configuración

## 🛠️ Soluciones Comunes

### Si las Variables de Entorno no se Cargan:
1. Verificar que estén configuradas en Vercel Dashboard
2. Asegurar que tengan el prefijo `NEXT_PUBLIC_`
3. Redeployar después de cambios
4. Verificar que no haya espacios o caracteres especiales

### Si Firebase no se Inicializa:
1. Verificar que todas las variables requeridas estén presentes
2. Comprobar formato de las variables
3. Verificar reglas de Firestore
4. Comprobar dominios autorizados

### Si hay Errores de Red:
1. Verificar CORS en Firebase
2. Comprobar dominios autorizados
3. Verificar reglas de seguridad
4. Revisar configuración de red de Vercel

## 📝 Comandos Útiles para Debugging

### Verificar Variables en Vercel
```bash
# Listar todas las variables de entorno
vercel env ls

# Agregar variable
vercel env add VARIABLE_NAME

# Remover variable
vercel env rm VARIABLE_NAME
```

### Forzar Redeploy
```bash
# Redeploy sin cambios
vercel --force

# Redeploy con logs detallados
vercel --debug
```

## 🎯 Checklist de Verificación

- [ ] Variables de entorno configuradas en Vercel
- [ ] Build logs sin errores
- [ ] Function logs sin errores de Firebase
- [ ] Variables `NEXT_PUBLIC_*` disponibles en runtime
- [ ] Configuración de Firebase válida
- [ ] Dominios autorizados en Firebase Console
- [ ] Reglas de Firestore permiten acceso
- [ ] No hay errores de CORS
- [ ] Deployment completado exitosamente

## 🚀 Próximos Pasos

1. **Revisar logs siguiendo esta guía**
2. **Ejecutar script de diagnóstico en producción**
3. **Comparar con entorno local**
4. **Aplicar soluciones específicas según errores encontrados**
5. **Redeployar y verificar**

---

💡 **Tip**: Mantén abierta la consola del navegador mientras revisas la aplicación en producción para capturar errores en tiempo real.