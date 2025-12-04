import ClientPage from './ClientPage';
import type { Metadata } from 'next';
import { generateMetadata as buildMetadata } from '@/lib/seo';
import { fetchServiceById } from '@/lib/repositories/servicesRepository';

// Forzar renderizado dinámico para evitar 404 por generateStaticParams incompleto
export const dynamic = 'force-dynamic';

// Server component wrapper que renderiza el subcomponente cliente
export default function ServicioPage({ params }: { params: { id: string } }) {
  return <ClientPage id={params.id} />;
}

// Metadata dinámica para que OG/Twitter usen la imagen del servicio
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const raw = await fetchServiceById(params.id);
    const service = (raw as any)?.service || raw || null;

    if (!service) {
      return buildMetadata({
        title: 'Servicio no encontrado',
        description: 'El servicio solicitado no existe o fue removido.',
        url: `/servicio/${params.id}`,
        image: '/images/og-image.jpg',
        type: 'article',
        tags: ['servicio', 'no encontrado'],
      });
    }

    const image = service.image || (Array.isArray(service.images) ? service.images[0] : undefined) || '/images/og-image.jpg';
    const title = service.name || 'Servicio';
    const description = service.description || `Descubre más sobre ${title} en TuBarrio.pe`;
    const slugOrId = service.slug || params.id;
    const url = `/servicio/${slugOrId}`;

    return buildMetadata({
      title,
      description,
      url,
      image,
      type: 'article',
      tags: [service.category, service.location, 'servicios locales'].filter(Boolean) as string[],
      publishedTime: service.createdAt ? new Date(service.createdAt).toISOString() : undefined,
      modifiedTime: service.updatedAt ? new Date(service.updatedAt).toISOString() : undefined,
      section: service.category || undefined,
      author: 'TuBarrio.pe',
    });
  } catch (err) {
    return buildMetadata({
      title: 'Servicio',
      description: 'Explora servicios locales en TuBarrio.pe',
      url: `/servicio/${params.id}`,
      image: '/images/og-image.jpg',
      type: 'article',
    });
  }
}
