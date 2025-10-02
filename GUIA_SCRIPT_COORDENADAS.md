# 📍 Guía de Uso: Script de Actualización de Coordenadas

Esta guía te explica paso a paso cómo usar el script `update-service-location-data.js` para actualizar automáticamente las coordenadas y campos `cacheBreaker` de tus servicios.

## 🎯 ¿Qué hace este script?

El script automatiza la tarea de:
- **Analizar** qué servicios no tienen coordenadas o `cacheBreaker`
- **Generar coordenadas** basadas en direcciones y distritos
- **Actualizar** los servicios en Firebase con los datos faltantes
- **Reportar** el progreso y resultados de la operación

## 📋 Requisitos Previos

### 1. Verificar configuración de Firebase
Asegúrate de tener configuradas estas variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tubarriope-7ed1d
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-clave-privada\n-----END PRIVATE KEY-----\n"
```

### 2. Instalar dependencias
```bash
npm install firebase-admin dotenv
```

## 🚀 Cómo Usar el Script

### Paso 1: Análisis Inicial (RECOMENDADO)

**Siempre ejecuta primero el análisis** para ver qué servicios necesitan actualización:

```bash
node scripts/update-service-location-data.js --analyze
```

**Ejemplo de salida:**
```
🔍 Analizando servicios sin coordenadas y cacheBreaker...

📊 RESUMEN DEL ANÁLISIS:
   Total de servicios: 22
   ✅ Con coordenadas y cacheBreaker: 2
   ❌ Sin coordenadas: 20
   ❌ Sin cacheBreaker: 0
   ❌ Sin ambos campos: 0

📍 SERVICIOS SIN COORDENADAS:
   - Bobocha Bubble Tea Shop (bobocha-bubble-tea-shop)
     Dirección: Av. Universitaria 1795, Lima
   - Caldo de gallina (caldo-de-gallina)
     Dirección: Santa Mariana 520
   ...
```

### Paso 2: Actualización de Prueba

**Antes de actualizar todos**, prueba con pocos servicios:

```bash
# Actualizar solo 3 servicios
node scripts/update-service-location-data.js --update --limit=3
```

**Ejemplo de salida:**
```
🚀 Actualizando 3 servicios...

📝 Procesando: Bobocha Bubble Tea Shop (bobocha-bubble-tea-shop)
   🔍 Generando coordenadas para: Av. Universitaria 1795, Lima, San Miguel
   📍 Coordenadas generadas: [-12.073793, -77.086709]
   ✅ Servicio actualizado exitosamente

📊 RESUMEN DE ACTUALIZACIÓN:
   ✅ Servicios actualizados: 3
   ❌ Errores: 0
   📝 Total procesados: 3
```

### Paso 3: Actualización Completa

Una vez verificado que funciona correctamente:

```bash
# Actualizar todos los servicios
node scripts/update-service-location-data.js --update
```

## 🎛️ Opciones Disponibles

| Comando | Descripción | Uso Recomendado |
|---------|-------------|-----------------|
| `--analyze` | Solo analiza, no actualiza nada | **Siempre primero** |
| `--update` | Actualiza todos los servicios | Después de probar |
| `--update --limit=N` | Actualiza máximo N servicios | Para pruebas |

### Ejemplos de Comandos

```bash
# 1. Ver estado actual (no modifica nada)
node scripts/update-service-location-data.js --analyze

# 2. Probar con 5 servicios
node scripts/update-service-location-data.js --update --limit=5

# 3. Probar con 10 servicios
node scripts/update-service-location-data.js --update --limit=10

# 4. Actualizar todos (después de probar)
node scripts/update-service-location-data.js --update
```

## 🗺️ Cómo Funciona el Geocoding

### Distritos Soportados
El script tiene coordenadas aproximadas para estos distritos de Lima:

- **Zona Centro**: Lima, Jesús María, Lince
- **Zona Norte**: Pueblo Libre, San Miguel
- **Zona Sur**: Miraflores, San Isidro, Barranco, Surco, Chorrillos
- **Zona Este**: La Molina, San Borja
- **Zona Oeste**: Magdalena, Callao
- **Zona Sur Extremo**: Villa El Salvador

### Proceso de Generación
1. **Identifica el distrito** del servicio
2. **Usa coordenadas base** del distrito
3. **Agrega variación aleatoria** pequeña (±0.01 grados)
4. **Evita duplicados exactos** entre servicios

### Coordenadas por Defecto
Si no encuentra distrito o dirección, usa las coordenadas del centro de Lima: `[-12.0464, -77.0428]`

## ⚠️ Precauciones y Buenas Prácticas

### ✅ Hacer SIEMPRE
- Ejecutar `--analyze` antes de actualizar
- Probar con `--limit=5` antes de actualizar todos
- Revisar manualmente servicios importantes
- Ejecutar en horarios de bajo tráfico
- Hacer backup de la base de datos antes de cambios masivos

### ❌ NO Hacer
- Actualizar todos los servicios sin probar primero
- Ejecutar múltiples veces seguidas sin verificar
- Interrumpir el proceso a la mitad
- Ejecutar durante horas pico de usuarios

## 🔧 Solución de Problemas

### Error: "Firebase not initialized"
```bash
# Verificar variables de entorno
node -e "console.log(process.env.FIREBASE_CLIENT_EMAIL)"
```

### Error: "Permission denied"
- Verificar que el service account tenga permisos de escritura
- Revisar que las credenciales sean correctas

### Coordenadas incorrectas
- El script usa aproximaciones por distrito
- Para mayor precisión, considera integrar Google Maps Geocoding API

### Script se detiene
- Revisar conexión a internet
- Verificar límites de Firebase
- Usar `--limit` para procesar menos servicios

## 📊 Interpretando los Resultados

### Estados de Servicios
- **✅ Con coordenadas y cacheBreaker**: No necesita actualización
- **❌ Sin coordenadas**: Necesita geocoding
- **❌ Sin cacheBreaker**: Necesita timestamp
- **❌ Sin ambos campos**: Necesita ambos

### Códigos de Resultado
- **✅ Servicio actualizado exitosamente**: Todo correcto
- **❌ Error actualizando**: Revisar permisos o datos
- **ℹ️ Servicio ya tiene todos los campos**: Ya estaba completo

## 🔄 Mantenimiento Regular

### Cuándo Ejecutar
- **Después de agregar servicios nuevos** manualmente
- **Semanalmente** para verificar integridad de datos
- **Antes de despliegues importantes**

### Monitoreo
```bash
# Verificar estado general
node scripts/update-service-location-data.js --analyze

# Si hay servicios sin coordenadas, actualizar
node scripts/update-service-location-data.js --update --limit=10
```

## 🚀 Próximas Mejoras

### Funcionalidades Planeadas
- Integración con Google Maps Geocoding API
- Soporte para ciudades fuera de Lima
- Validación de coordenadas existentes
- Backup automático antes de actualizar
- Interfaz web para gestión visual

### Contribuir
Si encuentras bugs o tienes sugerencias:
1. Documenta el problema específico
2. Incluye el comando exacto que usaste
3. Comparte el mensaje de error completo

---

## 📞 Soporte

Si tienes problemas con el script:
1. Revisa esta guía completa
2. Verifica los requisitos previos
3. Prueba con `--analyze` primero
4. Usa `--limit=1` para probar un solo servicio

**¡Recuerda siempre hacer pruebas antes de actualizar todos los servicios!** 🛡️