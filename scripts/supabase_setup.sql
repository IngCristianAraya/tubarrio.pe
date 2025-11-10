create extension if not exists pgcrypto;
-- Para normalizar slugs sin acentos
create extension if not exists unaccent;

create table if not exists public.services (
  id text primary key,
  slug text unique,
  name text not null,
  category text,
  categorySlug text,
  description text,
  image text,
  images jsonb,
  address text,
  phone text,
  whatsapp text,
  email text,
  website text,
  contactUrl text,
  detailsUrl text,
  hours text,
  "socialMedia" jsonb,
  social jsonb,
  rating numeric,
  reviewCount integer,
  featured boolean,
  neighborhood text,
  district text,
  location text,
  reference text,
  conditions jsonb,
  country text,
  active boolean default true,
  userId text,
  createdAt timestamptz,
  updatedAt timestamptz,
  tags jsonb
);

-- Ajustes de esquema para instalaciones existentes (si la tabla ya existe)
-- Convertir id de uuid a text y eliminar default
alter table if exists public.services
  alter column id type text using id::text;
alter table if exists public.services
  alter column id drop default;

-- Agregar columna slug si no existe
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'services' and column_name = 'slug'
  ) then
    alter table public.services add column slug text;
  end if;
end $$;

-- Agregar columna country si no existe y crear índice
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'services' and column_name = 'country'
  ) then
    alter table public.services add column country text;
  end if;
end $$;

-- Agregar columnas faltantes si no existen (compatibilidad con export de Firebase)
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='image') then
    alter table public.services add column image text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='images') then
    alter table public.services add column images jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='address') then
    alter table public.services add column address text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='phone') then
    alter table public.services add column phone text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='whatsapp') then
    alter table public.services add column whatsapp text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='email') then
    alter table public.services add column email text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='website') then
    alter table public.services add column website text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='contactUrl') then
    alter table public.services add column contactUrl text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='detailsUrl') then
    alter table public.services add column detailsUrl text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='hours') then
    alter table public.services add column hours text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='socialMedia') then
    alter table public.services add column "socialMedia" jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='social') then
    alter table public.services add column social jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='reviewCount') then
    alter table public.services add column reviewCount integer;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='featured') then
    alter table public.services add column featured boolean;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='location') then
    alter table public.services add column location text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='reference') then
    alter table public.services add column reference text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='conditions') then
    alter table public.services add column conditions jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='userId') then
    alter table public.services add column userId text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='createdAt') then
    alter table public.services add column createdAt timestamptz;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='services' and column_name='updatedAt') then
    alter table public.services add column updatedAt timestamptz;
  end if;
end $$;

-- Inicializar slug a partir de name si está vacío
update public.services
set slug = coalesce(
  slug,
  regexp_replace(
    regexp_replace(
      regexp_replace(lower(unaccent(coalesce(name,''))), '[^a-z0-9\s-]', '', 'g'),
      '\\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
where slug is null;

-- Activar RLS y permitir lectura pública de servicios activos
alter table public.services enable row level security;

-- Re-crear policy de lectura pública (Postgres no soporta IF NOT EXISTS en policies)
drop policy if exists "read_active_services_public" on public.services;
create policy "read_active_services_public"
on public.services
for select
to anon
using (active = true);

create index if not exists services_active_idx on public.services(active);
create index if not exists services_category_idx on public.services(category);
create index if not exists services_neighborhood_idx on public.services(neighborhood);
create index if not exists services_district_idx on public.services(district);
create unique index if not exists services_slug_unique_idx on public.services(slug);
create index if not exists services_country_idx on public.services(country);

-- Backfill de socialMedia desde social si existe
update public.services set "socialMedia" = social
where "socialMedia" is null and social is not null;