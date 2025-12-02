"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { key: "home", label: "Inicio", href: "/", icon: "🏠" },
  { key: "nearby", label: "Cerca", href: "/todos-los-servicios?nearby=1", icon: "📍" },
  { key: "categorias", label: "Categorías", href: "/todos-los-servicios", icon: "🧭" },
  // Enlazar al mismo registro que PromoBar.tsx
  { key: "registro", label: "Registrar", href: "https://registro.tubarrio.pe", icon: "➕" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 z-50">
      <div className="mx-auto max-w-md">
        <ul className="grid grid-cols-4">
          {tabs.map((t) => {
            const isActive = pathname === t.href || (t.key === "home" && pathname === "/");
            const isExternal = t.href.startsWith("http");
            return (
              <li key={t.key} className="">
                <Link
                  href={t.href}
                  className={`flex flex-col items-center justify-center py-2.5 text-xs ${isActive ? "text-orange-600" : "text-gray-700"}`}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <span className="text-xl leading-none">{t.icon}</span>
                  <span className="mt-0.5">{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}