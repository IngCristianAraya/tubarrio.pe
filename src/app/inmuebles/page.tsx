'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockProperties } from '@/mocks/properties';
import { Property, PropertyType } from '@/types/property';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyGrid from '@/components/properties/PropertyGrid';

export default function InmueblesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedOperation, setSelectedOperation] = useState<'all' | 'rent' | 'sale'>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(999999999);

  // Filtrar propiedades
  const filteredProperties = mockProperties.filter(property => {
    const typeMatch = selectedType === 'all' || property.type === selectedType;
    const districtMatch = selectedDistrict === 'all' || property.district === selectedDistrict;
    const operationMatch = selectedOperation === 'all' || property.priceType === selectedOperation;
    const priceMatch = property.price >= minPrice && property.price <= maxPrice;
    return typeMatch && districtMatch && operationMatch && priceMatch;
  });

  // Obtener distritos únicos
  const districts = Array.from(new Set(mockProperties.map(p => p.district)));

  const handleViewDetails = (property: Property) => {
    // Navegar a la página de detalle del inmueble por slug
    if (property.slug) {
      router.push(`/inmueble/${property.slug}`);
    }
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🏠 Inmuebles en tu barrio</h1>
        <p className="text-lg text-gray-600 mb-8">
          Descubre departamentos, casas y locales comerciales en alquiler o venta cerca de ti.
        </p>

        {/* Filtros */}
        <PropertyFilters
          selectedType={selectedType}
          selectedDistrict={selectedDistrict}
          selectedOperation={selectedOperation}
          minPrice={minPrice}
          maxPrice={maxPrice}
          districts={districts}
          onTypeChange={setSelectedType}
          onDistrictChange={setSelectedDistrict}
          onOperationChange={setSelectedOperation}
          onPriceChange={handlePriceChange}
        />

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredProperties.length} inmuebles
          </p>
        </div>

        {/* Grid de inmuebles */}
        <PropertyGrid
          properties={filteredProperties}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}
