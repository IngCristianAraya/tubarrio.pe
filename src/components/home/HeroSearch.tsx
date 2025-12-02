'use client';

import React from 'react';

interface HeroSearchProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function HeroSearch({ initialQuery = '', placeholder = 'Busca por categoría, barrio o servicio…', onSearch }: HeroSearchProps) {
  const [query, setQuery] = React.useState(initialQuery);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <section className="w-full py-10 sm:py-14 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600 mb-4">Encuentra servicios en tu barrio</h1>
        <p className="text-gray-600 mb-6">Búsqueda inteligente por categoría, barrio y más.</p>
        <form onSubmit={submit} className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Buscar servicios"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}

