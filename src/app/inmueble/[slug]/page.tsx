import { mockProperties } from '@/mocks/properties';
import PropertyDetails from '@/components/properties/PropertyDetails';
import Header from '@/components/Header';
import PropertyDetailBottomBar from '@/components/properties/PropertyDetailBottomBar';
import type { Metadata } from 'next';
import { generateMetadata as buildMetadata } from '@/lib/seo';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = mockProperties.find((p) => p.slug === params.slug);

  // Fallback seguro si no se encuentra el inmueble
  if (!property) {
    return buildMetadata({
      title: 'Inmueble no encontrado',
      description: 'Verifica el enlace o regresa a la lista de inmuebles.',
      url: `/inmueble/${params.slug}`,
      image: '/images/hero_3.webp',
      type: 'article',
    });
  }

  // Elegir imagen destacada: primero property.image, luego la primera de images
  const featuredImage = property.image || (Array.isArray(property.images) ? property.images[0] : undefined) || '/images/hero_3.webp';

  return buildMetadata({
    title: property.title,
    description: property.description,
    url: `/inmueble/${params.slug}`,
    image: featuredImage,
    type: 'article',
    publishedTime: property.publishedDate ? new Date(property.publishedDate).toISOString() : undefined,
    modifiedTime: property.updatedDate ? new Date(property.updatedDate).toISOString() : undefined,
    author: property.contact?.agentName || 'TuBarrio.pe',
    section: property.type,
    tags: property.tags || [],
  });
}

export default function InmueblePage({ params }: PageProps) {
  const property = mockProperties.find(p => p.slug === params.slug);

  if (!property) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900">Inmueble no encontrado</h1>
        <p className="text-gray-700 mt-2">Verifica el enlace o regresa a la lista de inmuebles.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 pb-24">
        <PropertyDetails property={property} />
      </div>
      <PropertyDetailBottomBar property={property} />
    </div>
  );
}
