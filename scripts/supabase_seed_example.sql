insert into public.services (
  name,
  category,
  description,
  rating,
  neighborhood,
  district,
  active,
  tags,
  images
) values (
  'Ejemplo Servicio',
  'Peluquería',
  'Servicio de prueba',
  4.7,
  'Miraflores',
  'Lima',
  true,
  '["corte","barbería"]'::jsonb,
  '{"main":"https://example.com/image.jpg"}'::jsonb
);