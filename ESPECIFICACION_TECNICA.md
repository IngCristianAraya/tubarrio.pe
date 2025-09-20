# Especificación Técnica - Tubarrio.pe

## 1. Arquitectura General

### 1.1 Tecnologías Principales
- **Framework**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS + CSS Modules
- **Base de Datos**: Firestore (solo lectura)
- **Autenticación**: Sin autenticación de usuarios
- **Despliegue**: Vercel

### 1.2 Estructura de Carpetas
```
src/
├── app/
│   ├── (home)/                  # Ruta principal
│   │   └── page.tsx
│   ├── categorias/             
│   │   └── [slug]/            # Páginas dinámicas de categoría
│   │       └── page.tsx
│   └── servicios/
│       └── [id]/              # Páginas de detalle de servicio
│           └── page.tsx
├── components/
│   ├── home/                  # Componentes específicos del home
│   │   ├── CategoryGrid/
│   │   ├── VisualFilters/
│   │   └── HeroSection/
│   └── shared/                # Componentes reutilizables
│       ├── CategoryCard/
│       └── ServiceCard/
├── lib/
│   ├── firebase/              # Configuración de Firebase
│   └── categoryData.ts        # Datos estáticos de categorías
└── styles/
    └── globals.css            # Estilos globales
```

## 2. Componentes Clave

### 2.1 CategoryGrid
- Muestra las categorías principales en un grid
- Datos estáticos generados en build time
- Imágenes optimizadas con next/image
- Animaciones con Framer Motion

```tsx
interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  serviceCount: number;
}
```

### 2.2 VisualFilters
- Filtros de navegación rápida
- Iconos de Lucide React
- Estado local para selección activa
- Navegación instantánea

### 2.3 ServiceCard
- Tarjeta de servicio individual
- Lazy loading de imágenes
- Badge de "Destacado" si aplica
- Rating con estrellas

## 3. Estrategia de Datos

### 3.1 Generación de Páginas Estáticas
```typescript
// app/categorias/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
```

### 3.2 Revalidación Incremental (ISR)
```typescript
// Actualización cada hora
export const revalidate = 3600; 
```

## 4. Optimizaciones de Rendimiento

### 4.1 Imágenes
- Uso de next/image con formatos WebP
- Tamaños responsive con srcSet
- Lazy loading nativo
- Placeholder blur para imágenes

### 4.2 Código
- Dynamic imports para componentes pesados
- Tree-shaking automático
- División de código por rutas
- Prefetching de rutas

## 5. SEO y Metadatos

### 5.1 Metadatos Dinámicos
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const category = await getCategory(params.slug);
  
  return {
    title: `${category.name} en tu barrio | Tubarrio.pe`,
    description: `Encuentra los mejores ${category.name} cerca de ti.`,
    openGraph: {
      images: [category.image],
    },
  };
}
```

## 6. Pruebas y Calidad

### 6.1 Pruebas Unitarias
- Jest + React Testing Library
- Cobertura > 80%
- Pruebas de componentes clave

### 6.2 Pruebas de Rendimiento
- Lighthouse CI
- Web Vitals
- Pruebas de carga

## 7. Monitoreo y Analytics

### 7.1 Métricas Clave
- Web Vitals en tiempo real
- Eventos personalizados
- Tasa de conversión
- Tiempo en página

### 7.2 Herramientas
- Vercel Analytics
- Google Analytics 4
- Hotjar para grabaciones

## 8. Plan de Despliegue

### 8.1 Entornos
- **Producción**: `main` branch
- **Preproducción**: `staging` branch
- **Desarrollo**: `develop` branch

### 8.2 CI/CD
- Despliegue automático en push
- Pruebas automáticas
- Preview deployments para PRs

## 9. Mantenimiento

### 9.1 Actualizaciones
- Dependencias actualizadas mensualmente
- Revisión de seguridad semanal
- Backups diarios

### 9.2 Escalabilidad
- Caché a nivel de CDN
- Optimización de consultas
- Monitoreo de límites de Firestore
