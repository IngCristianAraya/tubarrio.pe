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
  variant?: 'outline' | 'neutral' | 'links' | 'segmented'; // desktop-only visual variant
}

const CategoryChips = ({ categories, selected, onSelect, variant = 'outline' }: Props) => (
  <div className="w-full mb-8">
    {/* Vista desktop: flex-wrap normal (segmented agrega contenedor tenue) */}
    <div
      className={
        variant === 'segmented'
          ? 'hidden md:flex flex-wrap gap-3 md:bg-gray-50 md:border md:border-gray-200 md:rounded-xl md:px-3 md:py-2'
          : 'hidden md:flex flex-wrap gap-4'
      }
    >
      {/* Botón para ver todas las categorías */}
      <button
        className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 md:h-9 md:px-4 md:shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
          // Variantes desktop para 'Todas'
          variant === 'neutral'
            ? (selected === ''
              ? 'md:bg-orange-100 md:text-orange-800 md:border md:border-orange-300'
              : 'md:bg-gray-50 md:text-gray-800 md:border md:border-gray-200 md:hover:border-orange-300 md:hover:text-orange-700 md:hover:bg-white')
            : variant === 'links'
              ? (selected === ''
                ? 'md:bg-transparent md:text-orange-700 md:underline underline-offset-4'
                : 'md:bg-transparent md:text-gray-800 md:hover:text-orange-700 md:hover:underline underline-offset-4')
              : variant === 'segmented'
                ? (selected === ''
                  ? 'md:bg-orange-100 md:text-orange-800 md:border md:border-orange-300'
                  : 'md:bg-transparent md:text-gray-800 md:border md:border-transparent md:hover:bg-white md:hover:border-orange-300 md:hover:text-orange-700')
                : (selected === ''
                  ? 'md:bg-orange-50 md:text-orange-700 md:border md:border-orange-400'
                  : 'md:bg-white md:text-gray-800 md:border md:border-orange-300 md:hover:bg-orange-50 md:hover:border-orange-400 md:hover:text-orange-700')
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
          className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 md:h-9 md:px-4 md:shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${variant === 'neutral'
            ? (selected === cat.slug
              ? 'md:bg-orange-100 md:text-orange-800 md:border md:border-orange-300'
              : 'md:bg-gray-50 md:text-gray-800 md:border md:border-gray-200 md:hover:border-orange-300 md:hover:text-orange-700 md:hover:bg-white')
            : variant === 'links'
              ? (selected === cat.slug
                ? 'md:bg-transparent md:text-orange-700 md:font-semibold md:underline underline-offset-4'
                : 'md:bg-transparent md:text-gray-800 md:hover:text-orange-700 md:hover:underline underline-offset-4')
              : variant === 'segmented'
                ? (selected === cat.slug
                  ? 'md:bg-orange-100 md:text-orange-800 md:border md:border-orange-300'
                  : 'md:bg-transparent md:text-gray-800 md:border md:border-transparent md:hover:bg-white md:hover:border-orange-300 md:hover:text-orange-700')
                : (selected === cat.slug
                  ? 'md:bg-orange-50 md:text-orange-700 md:border md:border-orange-400'
                  : 'md:bg-white md:text-gray-800 md:border md:border-orange-300 md:hover:bg-orange-50 md:hover:border-orange-400 md:hover:text-orange-700')
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
          className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selected === ''
            ? 'bg-white text-orange-600 border border-orange-500 hover:bg-orange-50'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800'
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
            className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selected === cat.slug
              ? 'bg-white text-orange-600 border border-orange-500 hover:bg-orange-50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800'
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
