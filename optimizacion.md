📋 PROMPT COMPLETO para Windsurf - Optimización Total
🎯 OBJETIVO:
Llevar TuBarrio.pe al nivel de rendimiento y experiencia de Cuponidad.pe antes del lanzamiento oficial.

🔧 CONTEXTO ACTUAL:
Proyecto: TuBarrio.pe (Next.js 14 + Firebase)

Competencia directa: Cuponidad.pe (Laravel + MySQL)

Estado: Pre-lanzamiento (≈20 emprendedores de prueba)

Problema principal: Lentitud en carga de páginas (especialmente detalles de servicio)

Meta: Igualar/superar velocidad de Cuponidad antes de crecimiento masivo

📊 PROBLEMAS ESPECÍFICOS A RESOLVER:
1. RENDIMIENTO (Prioridad ALTA):
Página de detalle tarda ≈1s vs 0.3s de competencia

Navegación entre categorías no es instantánea

Firebase latency afecta experiencia de usuario

2. ARQUITECTURA DE DATOS:
Queries en tiempo real muy lentos

Falta de caching agresivo

No hay pre-rendering de páginas populares

3. EXPERIENCIA DE USUARIO:
No hay loading states efectivos

Percepción de lentitud aunque métricas sean buenas

Transiciones entre páginas no fluidas

🚀 SOLUCIONES TÉCNICAS REQUERIDAS:
FASE 1: OPTIMIZACIÓN INMEDIATA (Esta semana)
tsx
// 1. IMPLEMENTAR SKELETONS ESTRATÉGICOS
- ServiceHeaderSkeleton para páginas de detalle
- ServiceCardSkeleton para listados
- NavigationSkeleton para cambios de categoría

// 2. CACHING AGRESIVO CON NEXT.JS
- Incremental Static Regeneration (ISR) para servicios existentes
- unstable_cache para datos frecuentes
- prefetch inteligente en links

// 3. OPTIMIZAR FIREBASE QUERIES
- Queries más específicas (solo campos necesarios)
- Evitar queries complejas en tiempo real
- Implementar paginación
FASE 2: ARQUITECTURA ESCALABLE (Próximas 2 semanas)
tsx
// 1. MIGRAR A BASE DE DATOS MÁS RÁPIDA
- Opción A: Vercel Postgres + Prisma (recomendado)
- Opción B: Optimizar Firebase con índices y caching
- Opción C: Hybrid approach (Firebase + CDN cache)

// 2. IMPLEMENTAR CDN PARA ASSETS
- Vercel Blob Storage para imágenes
- Optimización automática de imágenes (WebP/AVIF)
- Edge caching global

// 3. MONITOREO Y ANALYTICS
- Vercel Analytics para métricas de rendimiento
- Error tracking con Sentry
- Performance monitoring
FASE 3: PREPARACIÓN PARA CRECIMIENTO (Mes 1)
tsx
// 1. SEO Y CONTENIDO
- Meta tags optimizados para búsquedas locales
- Structured data para negocios locales
- Sitemap dinámico
- Open Graph optimizado

// 2. HERRAMIENTAS EMPRENDEDORES
- Dashboard básico para ver estadísticas
- Sistema de verificación de perfil
- Herramientas de promoción simples

// 3. SISTEMA DE PAGOS
- Integración Yape/Plín para cobros mensuales
- Panel de administración de pagos
- Recordatorios automáticos
📋 ARCHIVOS/COMPONENTES A CREAR/MODIFICAR:
1. Componentes de Loading:
components/service/ServiceHeaderSkeleton.tsx

components/ServiceCardSkeleton.tsx

components/CategorySkeleton.tsx

app/services/[id]/loading.tsx

2. Optimizaciones de Data Fetching:
lib/cache.ts (sistema de caching)

lib/database.ts (abstracción de base de datos)

app/api/services/route.ts (APIs optimizadas)

3. Utilidades de Performance:
hooks/useOptimizedFetch.ts

utils/imageOptimizer.ts

scripts/performance-monitor.js

🎯 METRAS DE ÉXITO:
Rendimiento objetivo:
Página detalle: < 300ms (vs 1000ms actual)

Navegación categorías: < 100ms (instantáneo)

PageSpeed Mobile: 80+ (vs 66 actual)

PageSpeed Desktop: 98+ (vs 96 actual)

Experiencia usuario:
Percepción de velocidad: Igual o mejor que Cuponidad.pe

Tiempo interacción: < 50ms

Fluidez navegación: Sin saltos ni delays

🔧 TECNOLOGÍAS ESPECÍFICAS A USAR:
Caching:
Next.js ISR/revalidate

Vercel Edge Cache

React Query/SWR para client cache

Base de datos:
Primera opción: Vercel Postgres + Prisma

Segunda opción: Firebase optimizado + CDN

Tercera opción: Hybrid approach

Monitoreo:
Vercel Analytics

Custom performance metrics

Real User Monitoring (RUM)

📅 CRONOGRAMA ESTIMADO:
Semana 1:
Skeletons y loading states

Cache básico con ISR

Optimización queries Firebase

Semana 2:
Migración base de datos (si aplica)

CDN imágenes

Performance monitoring

Semana 3-4:
SEO avanzado

Herramientas emprendedores

Sistema pagos básico

💡 NOTA ESTRATÉGICA:
"El objetivo no es solo igualar técnicamente a Cuponidad, sino crear una base escalable que permita superarlos cuando tengamos 1000+ emprendedores. Su stack tiene tech debt que limita crecimiento futuro."

🎯 INSTRUCCIONES FINALES PARA WINDSURF:
"Genera todos los archivos y modificaciones necesarias para implementar la FASE 1 completa (Optimización Inmediata), con código listo para producción y documentación clara de implementación."