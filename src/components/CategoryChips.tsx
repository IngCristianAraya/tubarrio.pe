"use client";

/**
 * CategoryChips
 * Componente de UI para mostrar categorías como chips.
 * Acepta categorías con `{ slug, name }` y selecciona por `slug`.
 */
interface CategoryItem {
  slug: string;
  name: string;
}

interface Props {
  categories: CategoryItem[];
  selected: string; // selected slug
  onSelect: (slug: string) => void;
}

const CategoryChips = ({ categories, selected, onSelect }: Props) => (
  <div className="w-full mb-8">
    {/* Vista desktop: flex-wrap normal */}
    <div className="hidden md:flex flex-wrap gap-4">
      {/* Botón para ver todas las categorías */}
      <button
        className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          selected === '' 
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transform active:scale-95' 
            : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 hover:text-gray-800'
        }`}
        onClick={() => onSelect('')}
        type="button"
      >
        Todas
      </button>
      {/* Botones para cada categoría */}
      {categories.map((cat) => (
        <button
          key={cat.slug}
          className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selected === cat.slug 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transform active:scale-95' 
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 hover:text-gray-800'
            }`}
          onClick={() => onSelect(cat.slug)}
          type="button"
        >
          {cat.name}
        </button>
      ))}
    </div>

    {/* Vista móvil: carrusel deslizable */}
    <div className="md:hidden overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
        {/* Botón para ver todas las categorías */}
        <button
          className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            selected === '' 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transform active:scale-95' 
              : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 hover:text-gray-800'
          }`}
          onClick={() => onSelect('')}
          type="button"
        >
          Todas
        </button>
        {/* Botones para cada categoría */}
        {categories.map((cat) => (
          <button
            key={cat.slug}
            className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              selected === cat.slug 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transform active:scale-95' 
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 hover:text-gray-800'
            }`}
            onClick={() => onSelect(cat.slug)}
            type="button"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default CategoryChips;
