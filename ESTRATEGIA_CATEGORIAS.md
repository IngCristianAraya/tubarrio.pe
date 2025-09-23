# Estrategia de Categorías y Subcategorías para Firebase

## Objetivo
Minimizar las lecturas de Firebase manteniendo una estructura escalable y fácil de mantener para las categorías y subcategorías de servicios.

## Estructura Actual de Datos

### Colección: `categories`
```typescript
{
  id: string;           // ID único de la categoría
  name: string;         // Nombre para mostrar (ej: "Pollo a la brasa")
  slug: string;         // URL-friendly (ej: "pollo-a-la-brasa")
  icon: string;         // Emoji o ícono (ej: "🍗")
  emoji: string;        // Emoji (ej: "🍗")
  serviceCount: number; // Número de servicios en esta categoría
  isActive?: boolean;   // Si la categoría está activa
  parentId?: string;    // ID de la categoría padre (para subcategorías)
  order?: number;       // Orden de visualización
}
```

## Estrategia para Minimizar Lecturas

### 1. Caché de Categorías en el Cliente

```typescript
// src/hooks/useCategories.ts
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/firebase/categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Intentar obtener del localStorage primero
        const cached = localStorage.getItem('cachedCategories');
        
        if (cached) {
          const parsed = JSON.parse(cached);
          // Verificar si la caché tiene menos de 1 hora
          if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
            setCategories(parsed.data);
            setLoading(false);
            return;
          }
        }

        // Si no hay caché o está vencida, cargar desde Firebase
        const data = await getCategories();
        
        // Guardar en caché
        localStorage.setItem('cachedCategories', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        
        setCategories(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
}
```

### 2. Pre-carga de Categorías

```typescript
// src/pages/_app.tsx
import { useEffect } from 'react';
import { getCategories } from '@/lib/firebase/categories';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Precargar categorías en segundo plano
    getCategories().then(categories => {
      localStorage.setItem('cachedCategories', JSON.stringify({
        data: categories,
        timestamp: Date.now()
      }));
    });
  }, []);

  return <Component {...pageProps} />;
}
```

### 3. Consultas Optimizadas

#### Obtener Servicios por Categoría con Paginación

```typescript
// src/lib/firebase/services.ts
export async function getServicesByCategory(
  categorySlug: string, 
  subcategorySlug: string | null = null,
  limit = 10,
  lastVisible = null
) {
  let q = query(
    collection(db, 'services'),
    where('isActive', '==', true),
    where('categorySlug', '==', categorySlug),
    orderBy('name'),
    limit(limit)
  );

  // Añadir filtro de subcategoría si existe
  if (subcategorySlug) {
    q = query(q, where('subcategorySlug', '==', subcategorySlug));
  }

  // Paginación
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  const snapshot = await getDocs(q);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  
  return {
    services: snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })),
    lastDoc
  };
}
```

### 4. Contadores en Tiempo Real

Para evitar contar documentos, mantener contadores en la categoría:

```typescript
// src/lib/firebase/categories.ts
export async function updateCategoryCount(categoryId: string) {
  const categoryRef = doc(db, 'categories', categoryId);
  const services = await getDocs(
    query(
      collection(db, 'services'),
      where('categoryId', '==', categoryId),
      where('isActive', '==', true)
    )
  );
  
  await updateDoc(categoryRef, {
    serviceCount: services.size
  });
}
```

## Estructura Recomendada para Categorías

### Categorías Principales (ejemplo)

```typescript
const mainCategories = [
  {
    id: 'comida-rapida',
    name: 'Comida Rápida',
    slug: 'comida-rapida',
    icon: '🍔',
    emoji: '🍔',
    serviceCount: 0,
    isActive: true,
    order: 1
  },
  // ... más categorías
];
```

### Subcategorías (ejemplo)

```typescript
const subcategories = [
  {
    id: 'pollo-a-la-brasa',
    name: 'Pollo a la Brasa',
    slug: 'pollo-a-la-brasa',
    icon: '🍗',
    emoji: '🍗',
    serviceCount: 0,
    isActive: true,
    parentId: 'comida-rapida',
    order: 1
  },
  // ... más subcategorías
];
```

## Recomendaciones Adicionales

1. **Índices Compuestos**: Crea índices compuestos en Firebase para las consultas frecuentes.

2. **Batch Updates**: Usa operaciones por lotes para actualizar múltiples documentos a la vez.

3. **Denormalización Controlada**: Duplica datos cuando sea necesario para evitar joins costosos.

4. **Monitoreo**: Usa Firebase Performance Monitoring para identificar consultas lentas.

5. **Paginación**: Siempre implementa paginación para listados largos.

## Ejemplo de Uso en Componentes

```tsx
// src/components/CategoryList.tsx
import { useCategories } from '@/hooks/useCategories';

export function CategoryList() {
  const { categories, loading, error } = useCategories();

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error al cargar categorías</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map(category => (
        <Link 
          key={category.id} 
          href={`/categoria/${category.slug}`}
          className="block p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="text-3xl mb-2">{category.emoji}</div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.serviceCount} servicios</p>
        </Link>
      ))}
    </div>
  );
}
```
