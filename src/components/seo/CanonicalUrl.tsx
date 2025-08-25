'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import { SITE_URL } from '@/lib/constants';

interface CanonicalUrlProps {
  path?: string;
  queryParams?: Record<string, string>;
}

export function CanonicalUrl({ path, queryParams }: CanonicalUrlProps) {
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  
  // Usar la ruta proporcionada o la ruta actual
  const urlPath = path || currentPath;
  
  // Construir la URL canónica
  let canonicalUrl = `${SITE_URL}${urlPath}`;
  
  // Agregar parámetros de consulta si existen
  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    canonicalUrl += `?${params.toString()}`;
  } else if (searchParams?.toString()) {
    // Si hay parámetros de búsqueda actuales, inclúyelos
    canonicalUrl += `?${searchParams.toString()}`;
  }

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

export default CanonicalUrl;
