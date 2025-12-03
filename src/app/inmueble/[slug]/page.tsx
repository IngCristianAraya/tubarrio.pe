import { mockProperties } from '@/mocks/properties';
import PropertyDetails from '@/components/properties/PropertyDetails';

interface PageProps {
  params: { slug: string };
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PropertyDetails property={property} />
    </div>
  );
}

