'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import useSound from '../hooks/useSound';

const Header = () => {
  const { play: playFolderSound } = useSound('folder', { volume: 0.4 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
    // Determinar si el enlace es interno o externo (ancla)
    const isAnchor = href.startsWith('#');
    
    // Para enlaces internos, usar Link de Next.js
    if (!isAnchor) {
      return (
        <Link 
          href={href}
          className="group relative px-3 py-2 font-semibold text-gray-700 hover:text-orange-500 transition-colors duration-200"
          onClick={() => playFolderSound()}
        >
          <span className="z-10 relative">{children}</span>
          <span 
            className="absolute left-1/2 -bottom-1 w-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-300 ease-out -translate-x-1/2 group-hover:w-2/3"
            aria-hidden="true"
          />
        </Link>
      );
    }
    
    // Para anclas, mantener el comportamiento normal
    return (
      <a 
        href={href}
        className="group relative px-3 py-2 font-semibold text-gray-700 hover:text-orange-500 transition-colors duration-200"
        onClick={() => playFolderSound()}
      >
        <span className="z-10 relative">{children}</span>
        <span 
          className="absolute left-1/2 -bottom-1 w-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-300 ease-out -translate-x-1/2 group-hover:w-2/3"
          aria-hidden="true"
        />
      </a>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-200" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y menú móvil */}
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2 p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onClick={() => {
                playFolderSound();
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight select-none">
                Revista <span className="text-orange-500">Pando</span>
              </Link>
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex gap-3 lg:gap-6 items-center mx-4">
            <NavItem href="/">Inicio</NavItem>
            <NavItem href="#servicios">Servicios</NavItem>
            <NavItem href="#categorias">Categorías</NavItem>
            <NavItem href="#cobertura">Cobertura</NavItem>
            <NavItem href="#revista">Catálogo Digital</NavItem>
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#registro"
              className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 flex items-center"
              onClick={() => playFolderSound()}
            >
              <span className="mr-2">+</span> Registrar Negocio
            </a>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 shadow-inner">
            <nav className="flex flex-col space-y-4">
              <NavItem href="/">Inicio</NavItem>
              <NavItem href="#servicios">Servicios</NavItem>
              <NavItem href="#categorias">Categorías</NavItem>
              <NavItem href="#cobertura">Cobertura</NavItem>
              <NavItem href="#revista">Catálogo Digital</NavItem>
              <a
                href="#registro"
                className="block w-full px-4 py-3 text-center rounded-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 mt-6"
                onClick={() => playFolderSound()}
              >
                + Registrar Negocio
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
