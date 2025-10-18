# Proyecto externo: Registro de Clientes — registro.tubarrio.pe

Objetivo
- Crear un proyecto independiente (Next.js + React + TypeScript + Tailwind) desplegado en Vercel bajo `registro.tubarrio.pe` para un formulario profesional de inscripción de negocios/clientes.
- Mantener identidad visual de TuBarrio.pe (colores, tipografía, estilo de botones y tarjetas).
- Usar Supabase como backend para almacenar los registros, con políticas de seguridad y anti-spam.

Stack y configuración
- Next.js 14 con App Router, React, TypeScript, Tailwind CSS.
- Tipografía: `Geist Sans` (como en la web actual) usando `geist/font/sans`.
- Variables de estilo (consistentes con TuBarrio.pe):
  - `--primary: #ea580c` (orange-600)
  - `--ring: #f97316` (orange-500)
  - `--background: #ffffff`, `--foreground: #171717`, `--muted: #f3f4f6`, `--muted-foreground: #4b5563`, `--border: #e5e7eb`, `--input: #9ca3af`, `--destructive: #ef4444`, `--success: #10b981`, `--radius: 0.5rem`
- Tailwind config: usar `darkMode: 'class'`, y mapear colores a las variables CSS como en la web actual.

Identidad visual
- Botones y CTAs: gradiente `from-orange-500 to-yellow-400`, hover más oscuro, borde redondeado.
- Tarjetas: fondo blanco, borde `gray-100/200`, sombra suave, radios grandes.
- Titulares: peso `bold`, colores `text-gray-900`; textos secundarios `text-gray-600`.
- Layout responsive centrado con `container` y `screens['2xl']=1400px`.

Estructura solicitada
- `app/layout.tsx`: html `lang="es"`, carga `GeistSans`, aplica clases base y proveedores mínimos.
- `app/page.tsx`: landing simple con hero, copy breve y botón “Registrar Negocio” que navega a `/registro`.
- `app/registro/page.tsx`: formulario multi-paso (wizard) con progreso.
- `app/api/register/route.ts`: endpoint POST que valida y persiste en Supabase (con clave service role, no exponer al cliente).
- `lib/slugify.ts`: helper que normaliza y genera ID/slug consistentes con la plataforma.
- `lib/supabase.ts`: util para crear cliente de Supabase del lado servidor.
- `types/service.ts`: tipos para los campos del registro.
- `components/RegistroForm.tsx`: UI del formulario con `react-hook-form` + `zod` y validación.
- `globals.css` + `tailwind.config.js`: variables y extensiones de Tailwind alineadas a la identidad.
- `vercel.json`: configuración básica para headers y seguridad (opcional).

Campos del formulario (tipos y validación)
- `active` (boolean) default `true`
- `name` (string, requerido, 2–80 chars)
- `id` (string, slug normalizado a partir de `name`)
- `description` (string, 0–1000 chars)
- `category` (string, requerido)
- `neighborhood` (string)
- `location` (string)
- `address` (string)
- `phone` (string)
- `contactUrl` (string, URL opcional)
- `detailsUrl` (string, URL opcional)
- `horario` (string)
- `rating` (number, opcional)
- `reference` (string)
- `image` (string, URL opcional)
- `images` (string[], URLs)

Zod schema (crear archivo `lib/schema.ts`)
```ts
import { z } from 'zod';

export const registroSchema = z.object({
  active: z.boolean().default(true),
  name: z.string().min(2).max(80),
  id: z.string().min(2),
  description: z.string().max(1000).optional(),
  category: z.string().min(2),
  neighborhood: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  contactUrl: z.string().url().optional(),
  detailsUrl: z.string().url().optional(),
  horario: z.string().optional(),
  rating: z.number().optional(),
  reference: z.string().optional(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),
});
export type RegistroInput = z.infer<typeof registroSchema>;
```

Slugify (consistente con la plataforma)
```ts
export function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .replace(/-{2,}/g, '-');
}
```

Supabase: tabla y políticas (SQL)
```sql
-- Tabla principal
create table if not exists public.client_services (
  id text primary key,              -- slug único (p.ej. "servicio-tecnico-galaxia")
  active boolean not null default true,
  name text not null,
  description text,
  category text not null,
  neighborhood text,
  location text,
  address text,
  phone text,
  contact_url text,
  details_url text,
  horario text,
  rating numeric,
  reference text,
  image text,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  created_at timestamp with time zone not null default now()
);

-- Activar RLS y restringir operaciones al service role
alter table public.client_services enable row level security;

-- Solo el service role puede insertar/leer/actualizar/borrar
create policy service_role_insert on public.client_services
  for insert to service_role using (true) with check (true);
create policy service_role_select on public.client_services
  for select to service_role using (true);
create policy service_role_update on public.client_services
  for update to service_role using (true) with check (true);
create policy service_role_delete on public.client_services
  for delete to service_role using (true);
```

API de registro (`app/api/register/route.ts`)
```ts
import { NextResponse } from 'next/server';
import { registroSchema } from '@/lib/schema';
import { createClient } from '@supabase/supabase-js';
import { slugify } from '@/lib/slugify';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ¡Servidor solo!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = registroSchema.parse({
      ...data,
      id: data.id || slugify(data.name || ''),
    });

    // Anti-spam: honeypot simple
    if (data.website) return NextResponse.json({ ok: true }, { status: 200 });

    const { error } = await supabase
      .from('client_services')
      .insert({
        id: parsed.id,
        active: parsed.active,
        name: parsed.name,
        description: parsed.description,
        category: parsed.category,
        neighborhood: parsed.neighborhood,
        location: parsed.location,
        address: parsed.address,
        phone: parsed.phone,
        contact_url: parsed.contactUrl,
        details_url: parsed.detailsUrl,
        horario: parsed.horario,
        rating: parsed.rating,
        reference: parsed.reference,
        image: parsed.image,
        images: parsed.images,
        status: 'pending',
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
```

Tailwind y estilos
- `tailwind.config.js` (extender colores con variables CSS):
```js
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        success: 'hsl(var(--success))',
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
```
- `app/globals.css` (variables base):
```css
:root{
  --background:#fff;--foreground:#171717;--primary:#ea580c;--primary-foreground:#fff;
  --muted:#f3f4f6;--muted-foreground:#4b5563;--border:#e5e7eb;--input:#9ca3af;
  --ring:#f97316;--destructive:#ef4444;--success:#10b981;--radius:0.5rem;
}
body{background:#fff;color:#171717}
a{color:var(--primary)}
button{background:var(--primary);color:#fff;border-radius:.375rem}
```

UI del formulario (`components/RegistroForm.tsx`)
- Multi-paso: Datos, Ubicación, Contacto, Imágenes, Confirmación.
- Validaciones en tiempo real, estados de envío, feedback.
- Botón primario con gradiente `from-orange-500 to-yellow-400`.

Protecciones anti-spam
- Honeypot (campo oculto `website`).
- Integración opcional de hCaptcha/Recaptcha v3 en el endpoint (verificación server-side).
- Rate limiting opcional (Upstash) por IP.

Variables de entorno (Vercel)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (solo servidor)
- (Opcional) `HCAPTCHA_SECRET` o `RECAPTCHA_SECRET` para verificación.

Deploy y dominio
- Desplegar en Vercel.
- Asignar subdominio `registro.tubarrio.pe` al proyecto.

Notas
- No leer la tabla desde el cliente; toda inserción pasa por `/api/register` con Service Role.
- Generar `id` automáticamente con `slugify(name)`, pero permitir override manual.
- Soportar `images` como array de URLs (se guardan en `jsonb`).