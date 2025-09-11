# Sistema de Caché - Documentación

## Visión General

Este documento detalla la implementación y uso del sistema de caché en la aplicación Tubarrio. El sistema está diseñado para mejorar el rendimiento reduciendo las llamadas a Firestore, proporcionando una experiencia de usuario más rápida y reduciendo costos de operación.

## Arquitectura

El sistema de caché utiliza una estrategia de múltiples niveles:

1. **Caché en Memoria**: Para acceso rápido durante la sesión actual
2. **Caché Persistente (localStorage)**: Para persistencia entre recargas de página
3. **Firestore**: Fuente de datos primaria, consultada cuando es necesario

## Componentes Principales

### 1. useServiceCache Hook

El hook principal que gestiona el sistema de caché. Proporciona métodos para:

- Almacenar y recuperar datos del caché
- Validar la vigencia de los datos en caché
- Gestionar diferentes tipos de caché (servicios completos, destacados, individuales)

### 2. useServices Hook

Hook de alto nivel que utiliza `useServiceCache` para proporcionar una interfaz amigable para acceder a los servicios, implementando la estrategia de caché.

## Estrategia de Caché

### Flujo de Datos

1. **Primera carga**:
   - Intenta cargar desde caché persistente (si existe y es válido)
   - Si no hay caché o está expirado, carga desde Firestore
   - Actualiza el caché con los datos más recientes

2. **Solicitudes posteriores**:
   - Devuelve datos del caché inmediatamente
   - Realiza una actualización en segundo plano si los datos están desactualizados
   - Actualiza la interfaz cuando hay nuevos datos disponibles

### Tiempos de Expiración

| Tipo de Dato | Tiempo de Expiración |
|--------------|----------------------|
| Servicios Destacados | 24 horas |
| Todos los Servicios | 48 horas |
| Servicio Individual | 7 días |

## Uso Básico

### Obtener Servicios con Caché

```typescript
import { useServices } from '../hooks/useServices';

function ServiciosComponente() {
  // Obtener servicios con opciones de filtrado
  const { data: servicios, error, isLoading } = useServices({
    category: 'restaurantes',
    barrio: 'centro',
    featured: true,
    pageSize: 10
  });

  // ... resto del componente
}
```

### Actualizar el Caché Manualmente

```typescript
import { useServices } from '../hooks/useServices';

function MiComponente() {
  const { mutate } = useServices();

  const actualizarDatos = async () => {
    // Forzar actualización de los datos
    await mutate();
  };

  // ...
}
```

## Manejo de Errores

El sistema está diseñado para ser resistente a fallos:

1. Si hay un error al acceder a Firestore:
   - Se devuelven los datos del caché si están disponibles
   - Se registra el error para monitoreo
   - Se puede configurar para mostrar datos de respaldo

2. Si hay un error en el caché:
   - Se intenta cargar directamente desde Firestore
   - Se limpia el caché corrupto
   - Se registra el incidente

## Mejoras de Rendimiento

- **Carga perezosa**: Los datos se cargan solo cuando se necesitan
- **Actualización en segundo plano**: La interfaz responde inmediatamente con datos en caché mientras se actualizan
- **Paginación**: Soporte para carga paginada de resultados
- **Deduplicación de solicitudes**: Evita múltiples solicitudes simultáneas por los mismos datos

## Consideraciones

1. **Consistencia**: Los datos en caché pueden no reflejar cambios recientes en la base de datos
2. **Almacenamiento**: El caché persistente usa localStorage, con un límite típico de 5-10MB
3. **Seguridad**: Los datos en caché están disponibles en el navegador del usuario

## Próximos Pasos

1. Implementar pruebas unitarias para el sistema de caché
2. Agregar métricas de rendimiento
3. Implementar invalidación de caché basada en eventos
4. Añadir soporte para caché offline avanzado

## Depuración

Para propósitos de desarrollo, puedes inspeccionar el caché desde la consola del navegador:

```javascript
// Ver todo el caché de servicios
try {
  console.log('Caché de servicios:', JSON.parse(localStorage.getItem('tubarrio_all_services')));
  console.log('Caché de destacados:', JSON.parse(localStorage.getItem('tubarrio_featured_services')));
} catch (e) {
  console.error('Error al leer el caché:', e);
}
```

## Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.
