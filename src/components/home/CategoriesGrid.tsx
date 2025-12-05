'use client';

import React from 'react';
import type { Category } from '@/lib/types';

interface CategoriesGridProps {
  categories: Category[];
  onCategoryClick?: (slug: string) => void;
}

export default function CategoriesGrid({ categories, onCategoryClick }: CategoriesGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-700 mb-4">Categorías populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className="group border border-orange-200 rounded-md p-3 text-left hover:border-orange-400 hover:bg-orange-50 transition"
              onClick={() => onCategoryClick?.(cat.slug)}
            >
              <div className="text-2xl mb-2">{cat.icon || '🏷️'}</div>
              <div className="font-semibold text-gray-800 group-hover:text-orange-700">{cat.name}</div>
              <div className="text-sm text-gray-500">{cat.serviceCount} servicios</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
