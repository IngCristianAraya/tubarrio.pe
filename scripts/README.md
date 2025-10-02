# Scripts de Gestión de Servicios

Esta carpeta contiene scripts utilitarios para la gestión y mantenimiento de los servicios en la base de datos Firebase.

## 📍 update-service-location-data.js

Script principal para actualizar servicios con coordenadas y campos `cacheBreaker` faltantes.

### Funcionalidades

- **Análisis**: Identifica servicios sin coordenadas y/o cacheBreaker
- **Geocoding**: Genera coordenadas basadas en direcciones y distritos
- **Actualización**: Agrega campos faltantes a los servicios
- **Limitación**: Permite procesar un número específico de servicios

### Uso

```bash
# Solo analizar servicios (no actualiza nada)
node scripts/update-service-location-data.js --analyze

# Actualizar todos los servicios que necesiten campos
node scripts/update-service-location-data.js --update

# Actualizar máximo 5 servicios (recomendado para pruebas)
node scripts/update-service-location-data.js --update --limit=5

# Actualizar máximo 10 servicios
node scripts/update-service-location-data.js --update --limit=10
```

### Campos que maneja

- **coordenadas**: Array de [latitud, longitud] generado desde la dirección
- **cacheBreaker**: Timestamp numérico para invalidar caché

### Geocoding

El script incluye un sistema de geocoding básico que:

1. Usa coordenadas aproximadas por distrito de Lima
2. Agrega variación aleatoria pequeña para evitar duplicados exactos
3. Usa coordenadas por defecto de Lima centro si no hay dirección

### Distritos soportados

- Miraflores, San Isidro, Barranco
- Surco, La Molina, San Borja
- Chorrillos, Villa El Salvador
- Callao, Lima Centro
- Pueblo Libre, Jesús María, Lince
- Magdalena, San Miguel

### Seguridad

- Procesa servicios de uno en uno con pausas
- Manejo de errores por servicio individual
- Límites configurables para evitar sobrecarga
- Validación de datos antes de actualizar

### Ejemplo de salida

```
📊 RESUMEN DEL ANÁLISIS:
   Total de servicios: 22
   ✅ Con coordenadas y cacheBreaker: 2
   ❌ Sin coordenadas: 20
   ❌ Sin cacheBreaker: 0

📝 Procesando: Bobocha Bubble Tea Shop
   📍 Coordenadas generadas: [-12.073793, -77.086709]
   ✅ Servicio actualizado exitosamente

📊 RESUMEN DE ACTUALIZACIÓN:
   ✅ Servicios actualizados: 2
   ❌ Errores: 0
```

### Requisitos

- Node.js
- Firebase Admin SDK configurado
- Variables de entorno en `.env.local`:
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

### Recomendaciones de uso

1. **Siempre ejecutar primero con `--analyze`** para ver qué servicios necesitan actualización
2. **Usar `--limit` para pruebas** antes de actualizar todos los servicios
3. **Revisar manualmente** las coordenadas generadas para servicios importantes
4. **Ejecutar en horarios de bajo tráfico** para evitar impacto en usuarios

### Próximas mejoras

- Integración con Google Maps Geocoding API para mayor precisión
- Soporte para más ciudades fuera de Lima
- Validación de coordenadas existentes
- Backup automático antes de actualizar