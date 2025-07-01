import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Todas las Categorías | Revista Digital',
  description: 'Explora todos los servicios y negocios de la zona por categoría.',
};

const categorias = [
  {
    slug: 'express',
    title: 'Servicios Express',
    description: 'Todos los servicios rápidos y de entrega inmediata.',
  },
  {
    slug: 'mercado-local',
    title: 'Mercado Local',
    description: 'Negocios y productos del mercado local.',
  },
  {
    slug: 'sabores-zona',
    title: 'Sabores de la Zona',
    description: 'Gastronomía y sabores típicos de la zona.',
  },
];

export default function CategoriasPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Explora todas las categorías</h1>
      <div className="grid gap-6">
        {categorias.map((cat) => (
          <div key={cat.slug} className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-orange-600 mb-1">{cat.title}</h2>
              <p className="text-gray-600 text-sm">{cat.description}</p>
            </div>
            <Link
              href={`/categorias/${cat.slug}`}
              className="mt-4 sm:mt-0 inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-5 py-2 rounded-lg shadow hover:from-orange-600 hover:to-yellow-600 transition-all"
            >
              Ver todos
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
