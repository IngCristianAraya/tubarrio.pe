"use client";

import Link from "next/link";
import { Category } from "@/types/service";

interface Props {
  categories: Category[];
}

export default function CategoryChips({ categories }: Props) {
  if (!categories || categories.length === 0) return null;
  return (
    <div className="md:hidden sticky top-14 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100">
      <div className="flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categorias/${c.slug}`}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-800 hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <span className="text-base">{c.emoji || "🏷️"}</span>
            <span className="line-clamp-1 max-w-[140px]">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

