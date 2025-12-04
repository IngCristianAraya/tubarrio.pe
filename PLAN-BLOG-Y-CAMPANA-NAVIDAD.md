# Plan del Blog Comunitario y Campaña Navideña (tubarrio.pe)

Este documento resume la visión del blog hiperlocal, el modelo de datos simplificado, cómo funcionan los permisos (RLS) explicado en lenguaje simple, y un checklist accionable para lanzar la campaña navideña.

## 1) Visión del Blog Comunitario

- Tubarrio.pe será el boletín por barrio en Lima: eventos y noticias útiles (vacunatones, ferias, talleres, campañas).
- Objetivo principal: atraer tráfico orgánico y convertir visitas en registros de emprendedores e inmobiliarios.
- En cada artículo/evento se enlazan servicios y propiedades del mismo barrio para mejorar el SEO interno.

## 2) Stack actual que aprovechamos

- Frontend: Next.js 14 (App Router) + Tailwind CSS + Vercel (deploy).
- Backend: Supabase (PostgreSQL + Auth + Storage).
- Mapa: Leaflet (para ubicaciones en eventos).
- Medios: imágenes WebP optimizadas y `next/image`.

## 3) Modelo de datos (explicado sencillo)

Pensado para que sea fácil de entender y trabajar:

- Posts (artículos/eventos)
  - Tipo: “evento”, “noticia” o “guía”.
  - Título, subtítulo, resumen, contenido enriquecido, portada.
  - Estado: “borrador”, “enviado”, “en revisión”, “publicado”, “rechazado”.
  - Fechas importantes: `publicado_en`, y para eventos `inicio`/`fin`.
  - Autor y (opcional) revisor.
  - Enlaces: fuente externa (si aplica), y relación con barrios/distritos.

- Barrios y Distritos
  - Distritos: nombre + slug.
  - Barrios: nombre + slug + distrito + coordenadas básicas (opcional).

- Etiquetas (tags)
  - Palabras clave para clasificar el contenido (ej. “salud”, “mascotas”, “ferias”).

- Meta de eventos (campos específicos)
  - Lugar (nombre y dirección), fecha/hora inicio y fin, organizador, costo (si aplica), enlace de registro.

Relaciones básicas:
- Un post puede pertenecer a uno o varios barrios.
- Un post puede tener varias etiquetas.
- Un post puede enlazar servicios del barrio (para SEO interno).

## 4) Permisos y seguridad (RLS) sin tecnicismos

- Lectores (público): sólo ven artículos “publicados”.
- Autores (comunidades/municipios/colaboradores):
  - Pueden crear artículos/eventos en “borrador”.
  - Pueden enviarlos a revisión (“enviado”).
  - Pueden editar mientras esté en “borrador” o “enviado”.
- Revisores/Admin:
  - Revisan el contenido, corrigen detalles, y pueden “publicar” o “rechazar”.
- Agentes inmobiliarios:
  - Sólo ven y editan sus propios inmuebles (no los de otros agentes).

En pocas palabras: cada quien ve y edita sólo lo que le corresponde. Lo publicado es visible para todos.

## 5) Flujo editorial simple

1. Autor crea un evento o noticia (borrador).
2. Envía a revisión (estado “enviado”).
3. Revisor revisa (estado “en revisión”): corrige texto, añade enlaces internos al barrio.
4. Publica (“publicado”) → esto actualiza la web automáticamente sin tener que redeployar.
5. Si no cumple, puede “rechazar” con motivo.

## 6) ISR y SEO explicado simple

- ISR: las páginas del blog se actualizan solas cada cierto tiempo, y cuando se “publica” se puede pedir que se refresquen de inmediato. No hace falta volver a desplegar.
- SEO del artículo:
  - Título y descripción claras.
  - Portada (imagen) y fecha bien puestas.
  - Mapa y dirección si es un evento.
  - Enlaces internos a servicios y propiedades del mismo barrio.
  - Datos estructurados (JSON-LD: Event o BlogPosting) para que Google entienda el contenido.

## 7) Componentes clave del blog

- Listado `/blog`: filtros por barrio, fecha, tipo (evento/noticia).
- Detalle `/blog/[slug]`: portada, contenido, mapa, enlaces a servicios y propiedades del barrio.
- Envío `/blog/enviar`: formulario para comunidades/municipios.
- Revisión interna (vista simple) para cambiar estados y publicar.

## 8) Campaña Navideña: acciones concretas

Qué podemos avanzar YA para la campaña:

- Preparar un formulario de “Publicar evento” con:
  - Título, fecha y hora, barrio, organizador, contacto, portada, descripción, fuente.
- Plantillas de artículos:
  - Evento tipo “Feria navideña”, “Vacunatón mascotas”, “Campaña de donación”.
- Recolectar eventos navideños por barrio:
  - Páginas de municipios, Facebook de comunidades barriales, juntas vecinales.
- Enlazar los eventos a servicios locales:
  - Ej. ferias → gastronomía/hospedaje cercanos; vacunatón → veterinarias del barrio.
- Ajustar la homepage con una sección “Esta semana en tu barrio (Navidad)” y dos CTAs:
  - “Registrar mi negocio” y “Publicar evento del barrio”.
- Preparar posts destacados:
  - Guía de ferias navideñas por distrito.
  - Rutas seguras y horarios (si hay info oficial).

## 9) Checklist de avance

Prioridad Alta (campaña navideña)
- [ ] Crear formulario “Publicar evento” (campos mínimos y subida de portada).
- [ ] Configurar estados del post: borrador → enviado → revisión → publicado.
- [ ] Armar listado `/blog` con filtro por fecha y barrio.
- [ ] Página de detalle `/blog/[slug]` con mapa y enlaces a servicios del barrio.
- [ ] Sección navideña en la homepage con feed de eventos y CTAs.
- [ ] Plantillas de texto para eventos navideños (rápido de publicar).
- [ ] Definir reglas simples de revisión (ortografía, fuente, relevancia local).
- [ ] Activar revalidación al publicar (las páginas se refrescan en segundos).

Operativo
- [ ] Agenda de fuentes: municipios, juntas vecinales, grupos de Facebook por barrio.
- [ ] Calendario editorial: fechas clave de diciembre (fines de semana).
- [ ] Librería de imágenes navideñas (portadas sobrias y en WebP).
- [ ] Guía interna: cómo enlazar servicios e inmuebles a cada evento.

SEO
- [ ] Añadir datos estructurados (Event/BlogPosting) en páginas de detalle.
- [ ] Títulos con barrio + fecha + actividad (“Navidad en Pando 3ra Etapa: Feria vecinal 6–8pm”).
- [ ] Descripciones cortas y claras; portada optimizada.
- [ ] Enlaces internos a categorías y servicios relevantes.

Medición
- [ ] Eventos: `blog_view`, `cta_register_business_click`, `event_map_open`.
- [ ] Seguimiento de click en CTAs y enlaces internos.
- [ ] Reporte semanal: qué barrios generan más tráfico y conversiones.

## 10) Reglas editoriales básicas

- Siempre asociar barrio y distrito.
- Portada obligatoria.
- Fuente verificable si aplica (enlace y nombre).
- Descripción útil y concreta (qué, cuándo, dónde, quién).
- Enlazar servicios del barrio que aporten valor al visitante.
- Evitar lenguaje comercial directo (informativo y comunitario).

## 11) Riesgos y mitigaciones

- Falta de eventos confirmados: usar plantillas + contacto con municipios/comunidades.
- Contenido duplicado: revisar por título/fecha/barrio antes de publicar.
- Datos inexactos: pedir fuente y contacto del organizador, validar horarios.
- Baja conversión: reforzar CTAs visibles en homepage y en el detalle del evento.

---

### Qué significa “políticas RLS” sin tecnicismos

RLS es “Reglas para que cada usuario vea/edite sólo lo suyo” en la base de datos:
- El público sólo ve lo publicado.
- Autores pueden crear y editar sus borradores, y enviarlos a revisión.
- Revisores pueden aprobar o rechazar y publicar.
- Agentes inmobiliarios sólo ven sus fichas.
En resumen: orden y seguridad para que todo funcione sin mezclar información.

### Siguiente paso inmediato

1) Crear el formulario de “Publicar evento” y el listado básico del blog.
2) Preparar 3–5 eventos navideños reales por barrios prioritarios y publicarlos.
3) Mostrar esos eventos en la homepage con CTAs de registro.

Con esto la campaña navideña puede estar visible en pocos días y empezar a convertir tráfico en registros.