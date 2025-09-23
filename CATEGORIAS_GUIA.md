# Guía de Categorías y Subcategorías

## Estructura de Categorías Principales

### 1. 🍽️ Restaurantes y menús
- **Slug:** `restaurantes-y-menus`
- **Descripción:** Restaurantes formales y menús de comida casera
- **Subcategorías sugeridas:**
  - Cocina peruana
  - Comida china (chifa)
  - Comida marina
  - Comida vegetariana/vegana
  - Desayunos
  - Almuerzos ejecutivos

### 2. 🍔 Comida rápida
- **Slug:** `comida-rapida`
- **Descripción:** Opciones de comida rápida y callejera
- **Subcategorías sugeridas:**
  - Pollo a la brasa
  - Hamburguesas
  - Pizzerías
  - Sandwiches
  - Comida callejera
  - Anticucherías

### 3. 🛒 Abarrotes
- **Slug:** `abarrotes`
- **Descripción:** Tiendas de abarrotes y bodegas
- **Subcategorías sugeridas:**
  - Bodegas
  - Minimarkets
  - Mayoristas

### 4. 🏠 Servicios del hogar
- **Slug:** `servicios-hogar`
- **Descripción:** Servicios para el hogar
- **Subcategorías sugeridas:**
  - Fontanería
  - Electricidad
  - Pintura
  - Mudanzas
  - Limpieza
  - Jardinería

### 5. ✂️ Belleza y cuidado personal
- **Slug:** `belleza-cuidado-personal`
- **Descripción:** Servicios de belleza y cuidado personal
- **Subcategorías sugeridas:**
  - Peluquerías
  - Barberías
  - Manicure/Pedicure
  - Depilación
  - Spa

## Estructura en Firebase

### Colección: `categories`
```typescript
{
  id: string;
  name: string;
  slug: string;
  icon: string;
  emoji: string;
  serviceCount: number;
  isActive: boolean;
  parentId: string | null; // Para subcategorías
  order: number; // Para ordenar categorías
}
```

### Colección: `services`
Cada servicio debe incluir:
```typescript
{
  // ... otros campos
  categoryId: string; // ID de la categoría principal
  subcategoryId?: string; // ID de la subcategoría (opcional)
  categorySlug: string; // Slug de la categoría principal
  subcategorySlug?: string; // Slug de la subcategoría (opcional)
}
```

## Consultas optimizadas

### Obtener categorías principales
```typescript
const mainCategories = db.collection('categories')
  .where('parentId', '==', null)
  .where('isActive', '==', true)
  .orderBy('order');
```

### Obtener subcategorías de una categoría
```typescript
const subcategories = db.collection('categories')
  .where('parentId', '==', categoryId)
  .where('isActive', '==', true)
  .orderBy('name');
```

### Obtener servicios por categoría (con paginación)
```typescript
const getServicesByCategory = async (categorySlug: string, lastVisible = null, limit = 10) => {
  let query = db.collection('services')
    .where('categorySlug', '==', categorySlug)
    .where('isActive', '==', true)
    .orderBy('name')
    .limit(limit);

  if (lastVisible) {
    query = query.startAfter(lastVisible);
  }

  const snapshot = await query.get();
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  
  return {
    services: snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })),
    lastDoc
  };
};
```

## Beneficios de esta estructura

1. **Rendimiento**: Al usar subcategorías, reducimos la cantidad de documentos a leer en cada consulta.
2. **Escalabilidad**: Fácil de mantener y extender con nuevas categorías.
3. **Experiencia de usuario**: Navegación más intuitiva con categorías y subcategorías bien definidas.
4. **SEO amigable**: URLs limpias y jerárquicas como `/categoria/comida-rapida/pollo-a-la-brasa`

## Próximos pasos

1. Implementar la estructura de subcategorías en la interfaz de administración.
2. Actualizar los formularios de creación/edición de servicios para incluir subcategorías.
3. Actualizar las consultas para filtrar por categoría y subcategoría.
4. Implementar la navegación por subcategorías en el frontend.
