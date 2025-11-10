import { notFound } from 'next/navigation';
import { getServicesByCategory, getCategoryBySlug, Category, Service } from '@/lib/services';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Categoría no encontrada',
      description: 'La categoría solicitada no existe o ha sido eliminada.'
    };
  }

  return {
    title: `${category.name} en tu barrio | TuBarrio.pe`,
    description: `Encuentra los mejores ${category.name} cerca de ti. ${category.serviceCount} lugares disponibles.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    notFound();
  }

  const { services } = await getServicesByCategory(category.slug, 20);

  const isValidImage = (imageUrl?: string) => {
    if (!imageUrl) return false;
    const trimmed = imageUrl.trim().toLowerCase();
    if (!trimmed || trimmed === 'none' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'invalid') {
      return false;
    }
    return trimmed.startsWith('http') || trimmed.startsWith('/');
  };

  const getServiceImage = (service: Service) => {
    const candidates = Array.isArray(service.images) ? service.images : [];
    const firstValidFromArray = candidates.find((img) => isValidImage(img));
    if (isValidImage(firstValidFromArray)) return firstValidFromArray as string;
    if (isValidImage(service.image)) return service.image as string;
    return '/images/placeholder-service.jpg';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-500">{services.length} {services.length === 1 ? 'lugar' : 'lugares'} disponibles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services && services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={getServiceImage(service)}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {service.featured && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                    Destacado
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {service.name}
                </h2>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span>⭐ {service.rating || 'Nuevo'}</span>
                  {(service.reviewCount && service.reviewCount > 0) ? (
                    <>
                      <span className="mx-2">•</span>
                      <span>{service.reviewCount} {service.reviewCount === 1 ? 'reseña' : 'reseñas'}</span>
                    </>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {service.description}
                </p>
                <Link 
                  href={`/servicios/${service.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  Ver detalles →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {(!services || services.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay servicios disponibles en esta categoría por el momento.</p>
            <Link 
              href="/" 
              className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
