# Guía de Migración a Supabase y Expansión Internacional

Esta guía describe, paso a paso, cómo migraremos de Firebase a Supabase y cómo prepararemos la aplicación para operar en Alemania (DE), Chile (CL), Estados Unidos (US) y Colombia (CO). Está alineada con la visión y sostenibilidad indicadas en `mision.md` y toma como base inicial el documento `guia_migracion_firebase_a_supabase.md` (actualizándolo para la nueva dimensión internacional).

## Objetivos
- Migrar de Firebase (Firestore/Auth/Storage/Functions) a Supabase (Postgres/Auth/Storage/Edge Functions) con mínima fricción.
- Establecer soporte multi-país y multi-idioma, con cumplimiento legal por jurisdicción.
- Mantener continuidad de servicio mediante una estrategia de “modo dual” (lectura/escritura paralelas) y feature flags.

## Enfoque por Fases (alto nivel)
1. Preparación y arquitectura
2. Diseño de esquema y datos (Postgres)
3. Autenticación y cuentas (Supabase Auth)
4. Storage de imágenes y archivos
5. Lógica de servidor y analíticas (Edge Functions/BFF)
6. Real-time y suscripciones (Supabase Realtime)
7. Internacionalización (i18n) y localización
8. Cumplimiento legal por país
9. CI/CD, despliegue y observabilidad
10. Pruebas, verificación y rollout controlado

---

## Fase 1: Preparación y arquitectura
- Revisar `mision.md` y extraer requerimientos técnicos clave (multi-país, sostenibilidad, legalidad).
- Revisar y actualizar `guia_migracion_firebase_a_supabase.md` para incluir expansión internacional.
- Inventario de funcionalidades críticas: servicios, categorías, filtros por barrio/distrito, registro, analíticas, páginas de detalle.
- Definir “modo dual”:
  - Lectura: Firebase (primaria) → Supabase (secundaria, verificación).
  - Escritura: dual-write (cliente/servidor) con feature flags por módulo.
- Decidir nombres de tablas, convenciones y normalización de ubicaciones (país → ciudad → distrito → barrio).

Checklist:
- [ ] Documento de arquitectura actualizado
- [ ] Plan de feature flags y estrategia dual
- [ ] Lista de módulos afectados y prioridad

Entregables:
- Diagrama de arquitectura actual vs futura
- Lista de decisiones técnicas (nombres, convenciones, reglas)

## Fase 2: Diseño de esquema y datos (Postgres)
Tablas principales sugeridas:
- `services`: `id`, `name`, `category`, `category_slug`, `description`, `images[]`, `image`, `rating`, `location`, `whatsapp`, `tags[]`, `hours`, `social`, `active`, `featured`, `country_code`, `city`, `district`, `neighborhood`, `zona`, `user_id`, `created_at`.
- `categories`: `slug`, `name`, `locale`, `sort_order`.
- `service_images`: `service_id`, `url`, `order`.
- `service_tags`: `service_id`, `tag`.
- `analytics_events`: `id`, `user_id`, `event_name`, `service_id`, `metadata`, `country_code`, `timestamp`.
- (Opcional) `countries`, `districts`, `neighborhoods` para normalización por país.

Índices recomendados:
- `services(category_slug)`, `services(country_code)`, `services(district)`, `services(neighborhood)`.
- Índices parciales para `active = true` y `featured = true`.

Seguridad (RLS):
- Lectura pública de `services` activos.
- Escritura acotada por `user_id` y roles (`admin`, `business_owner`).

Checklist:
- [ ] DDL inicial (migraciones SQL)
- [ ] Índices creados
- [ ] Reglas RLS definidas y probadas

Entregables:
- Migraciones SQL versionadas
- Documento de modelo de datos

## Fase 3: Autenticación y cuentas
- Sustituir Firebase Auth por Supabase Auth (email/password, OAuth, opcional OTP).
- Plan de migración de usuarios: exportar correos/UID; evaluar reset de contraseñas por seguridad.
- Sesiones: integración de JWT con Next.js (SSR/CSR, middleware).
- Roles y permisos mapeados a RLS.

Checklist:
- [ ] Estrategia de migración de usuarios
- [ ] Flujos de login/registro con Supabase
- [ ] Roles y permisos validados

Entregables:
- Documentación de flujos de auth
- Scripts/estrategia de migración de cuentas

## Fase 4: Storage de imágenes y archivos
- Decidir Cloudinary (si ya se usa) vs Supabase Storage.
- Buckets por entorno (`dev`, `prod`) y tipo (`services`, `banners`).
- Políticas de acceso: lectura pública, escritura por propietario/admin.
- Adaptar componente de imagen y whitelist de dominios/CDN.
- Plan de migración de archivos: lote de URLs y verificación (checksums/conteos).

Checklist:
- [ ] Buckets y políticas configuradas
- [ ] Código de carga/lectura de imágenes adaptado
- [ ] Migración de activos planificada

Entregables:
- Guía de almacenamiento y CDN
- Informe de integridad de archivos

## Fase 5: Lógica de servidor y analíticas
- Portar funciones a Supabase Edge Functions o implementar capa BFF (Backend for Frontend).
- Endpoints clave: analíticas de vistas, contadores, administración.
- Telemetría y observabilidad de endpoints (logs, alertas).

Checklist:
- [ ] Endpoints migrados/creados
- [ ] Monitoreo activo configurado

Entregables:
- Documentación de API interna
- Tablero de métricas y alertas

## Fase 6: Real-time y suscripciones
- Reemplazar Firestore realtime por Supabase Realtime donde sea necesario.
- Suscribirse a canales relevantes (por país/categoría) para evitar sobrecarga.

Checklist:
- [ ] Canales y eventos definidos
- [ ] Pruebas de carga y latencia

Entregables:
- Especificación de eventos realtime

## Fase 7: Internacionalización (i18n) y localización
- Idiomas: ES, EN, DE. Fallback razonable.
- Datos: `locale`, `country_code` en tablas; categorías traducibles.
- Slugs por idioma donde aplique; coherencia SEO.
- Filtros geográficos normalizados por país (nombres locales, acentos, capitalización).

Checklist:
- [ ] Estructura de i18n definida
- [ ] Traducciones críticas preparadas
- [ ] SEO internacional (metadata/slugs) revisado

Entregables:
- Guía de i18n y convenciones de nombres

## Fase 8: Cumplimiento legal por país
- Alemania (UE/GDPR): base legal, consentimiento, derechos, DPA, retención/borrado.
- Estados Unidos (p.ej., CCPA/CPRA): privacidad focalizada por estados, “Do Not Sell”.
- Chile: Ley 19.628.
- Colombia: Ley 1581/2012.
- Acciones transversales: políticas por país, banner de cookies donde aplique, minimización de PII, pseudonimización en analíticas.

Checklist:
- [ ] Políticas de privacidad por país
- [ ] Mecanismos de derechos del usuario
- [ ] Revisiones legales internas

Entregables:
- Documentos legales por jurisdicción

## Fase 9: CI/CD, despliegue y observabilidad
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Pipelines: build, migraciones SQL, pruebas (unit/integración), lint/type-check.
- Despliegues: Vercel/Netlify para frontend; Supabase como backend.
- Observabilidad: trazas, logs, alertas; paneles de rendimiento.

Checklist:
- [ ] Entornos y llaves configuradas
- [ ] Pipeline CI/CD con gates de calidad
- [ ] Paneles de observabilidad activos

Entregables:
- Documentación de despliegue y operaciones

## Fase 10: Pruebas, verificación y rollout controlado
- Unitarias: adaptadores, hooks, utilidades de filtrado.
- Integración: auth, lectura/escritura en `services`, analíticas.
- E2E: navegación, búsqueda, filtros barrio/distrito, detalles, contacto.
- Migración de datos: conteos por tablas; verificación de campos y paridad con Firebase.

Checklist:
- [ ] Suite de pruebas ejecutada y verde
- [ ] Paridad de datos validada (≥99%)
- [ ] Criterios de éxito definidos

Entregables:
- Reportes de pruebas y paridad

---

## Estrategia de migración (modo dual y corte)
- Dual-read/dual-write:
  - Lectura primaria en Firebase, secundaria en Supabase para verificación.
  - Escritura en ambos, con feature flags por módulo.
- Criterios de corte:
  - Latencia comparable, error rate < 1%, paridad ≥ 99%.
- Plan de backout:
  - Conmutar feature flag a Firebase.
  - Scripts de reconciliación de datos.

## Plan de rollout por país
Orden recomendado:
1. Chile (ES): validación rápida por cercanía lingüística.
2. Colombia (ES): normalización de barrios/distritos.
3. Estados Unidos (EN): mayor atención a privacidad y SEO.
4. Alemania (DE): enfoque fuerte en GDPR y localización completa.

Por país:
- Verificar filtros `district/neighborhood` en datos y UI.
- Cargar traducciones y políticas legales.
- Revisar SEO internacional.

## Riesgos y contingencias
- Desfase de esquemas: migraciones versionadas y pruebas de compatibilidad.
- Rendimiento en consultas: índices de filtrado y caching en cliente.
- Autenticación: transición de credenciales, plan de reset controlado.
- Imágenes/CDN: evitar rompimientos de enlaces; monitor 404 y fallback.

## Métricas de éxito
- Error rate < 1% en lecturas/escrituras durante y post-corte.
- Paridad de datos ≥ 99% bajo dual-run.
- Latencia igual o mejor que Firebase.
- Sesiones y conversión estables o en incremento en nuevos países.
- Cumplimiento legal: auditorías internas sin hallazgos críticos.

## Próximos pasos (sin ejecutar cambios)
- Validar esta guía con el equipo y actualizar `guia_migracion_firebase_a_supabase.md`.
- Asignar responsables y estimaciones por fase.
- Preparar feature flags y telemetría desde el día 1.
- Comenzar por el diseño de esquema y migraciones SQL, seguido por autenticación.

> Nota: Esta guía es un documento vivo. Cualquier cambio estratégico en `mision.md` debe reflejarse aquí para asegurar alineamiento y sostenibilidad.