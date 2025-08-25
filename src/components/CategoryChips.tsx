"use client";

/**
 * CategoryChips
 * Componente de UI para mostrar las categorías como chips (botones redondeados).
 * Permite al usuario filtrar servicios de forma visual y rápida seleccionando una categoría.
 * Mejora la experiencia respecto a un <select> tradicional, haciendo el filtro más accesible y moderno.
 *
 * Props:
 * - categories: array de categorías disponibles
 * - selected: categoría actualmente seleccionada
 * - onSelect: función que se llama al seleccionar una categoría (o "Todas")
 *
 * Uso típico: en la página de servicios, para filtrar la grilla por categoría.
 */
interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryChips = ({ categories, selected, onSelect }: Props) => (
  <div className="w-full">
    {/* Vista desktop: flex-wrap normal */}
    <div className="hidden md:flex flex-wrap gap-2">
      {/* Botón para ver todas las categorías */}
      <button
        className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 ${selected === '' ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50'}`}
        onClick={() => onSelect('')}
        type="button"
      >
        Todas
      </button>
      {/* Botones para cada categoría */}
      {categories.map((cat) => (
        <button
          key={cat}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 ${selected === cat ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50'}`}
          onClick={() => onSelect(cat)}
          type="button"
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Vista móvil: carrusel deslizable */}
    <div className="md:hidden overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-2" style={{ width: 'max-content' }}>
        {/* Botón para ver todas las categorías */}
        <button
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 whitespace-nowrap ${selected === '' ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50'}`}
          onClick={() => onSelect('')}
          type="button"
        >
          Todas
        </button>
        {/* Botones para cada categoría */}
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 whitespace-nowrap ${selected === cat ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50'}`}
            onClick={() => onSelect(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default CategoryChips;
