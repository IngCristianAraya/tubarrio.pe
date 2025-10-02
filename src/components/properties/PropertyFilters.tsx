import { PropertyType } from '@/types/property';

interface PropertyFiltersProps {
  selectedType: PropertyType | 'all';
  selectedDistrict: string;
  selectedOperation: 'all' | 'rent' | 'sale';
  minPrice: number;
  maxPrice: number;
  districts: string[];
  onTypeChange: (type: PropertyType | 'all') => void;
  onDistrictChange: (district: string) => void;
  onOperationChange: (operation: 'all' | 'rent' | 'sale') => void;
  onPriceChange: (min: number, max: number) => void;
}

const propertyTypes = [
  { id: 'apartment' as PropertyType, label: 'Departamento' },
  { id: 'house' as PropertyType, label: 'Casa' },
  { id: 'office' as PropertyType, label: 'Oficina' },
  { id: 'commercial' as PropertyType, label: 'Local Comercial' },
  { id: 'land' as PropertyType, label: 'Terreno' },
  { id: 'warehouse' as PropertyType, label: 'Almacén' }
];

export default function PropertyFilters({
  selectedType,
  selectedDistrict,
  selectedOperation,
  minPrice,
  maxPrice,
  districts,
  onTypeChange,
  onDistrictChange,
  onOperationChange,
  onPriceChange
}: PropertyFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de inmueble
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as PropertyType | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            {propertyTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por operación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operación
          </label>
          <select
            value={selectedOperation}
            onChange={(e) => onOperationChange(e.target.value as 'all' | 'rent' | 'sale')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="rent">Alquiler</option>
            <option value="sale">Venta</option>
          </select>
        </div>

        {/* Filtro por distrito */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distrito
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Todos los distritos</option>
            {districts.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio máximo
          </label>
          <select
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value={999999999}>Sin límite</option>
            <option value={1000}>S/ 1,000</option>
            <option value={2000}>S/ 2,000</option>
            <option value={3000}>S/ 3,000</option>
            <option value={5000}>S/ 5,000</option>
            <option value={10000}>S/ 10,000</option>
            <option value={200000}>S/ 200,000</option>
            <option value={500000}>S/ 500,000</option>
            <option value={1000000}>S/ 1,000,000</option>
          </select>
        </div>
      </div>
    </div>
  );
}