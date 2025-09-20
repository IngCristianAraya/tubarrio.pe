'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import useSound from '../hooks/useSound';

const Header = () => {
  const { play: playFolderSound } = useSound('folder', { volume: 0.4 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Función de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/todos-los-servicios?busqueda=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
    // Determinar si el enlace es interno o externo (ancla)
    const isAnchor = href.startsWith('#') || href.startsWith('/#');
    
    const handleClick = (e: React.MouseEvent) => {
      playFolderSound();
      
      // Si es una ancla, manejar la navegación manualmente
      if (isAnchor) {
        e.preventDefault();
        
        // Extraer el ID de la ancla
        const anchorId = href.replace('/#', '').replace('#', '');
        
        // Si estamos en una página diferente a la home, navegar primero a home
        if (window.location.pathname !== '/') {
          window.location.href = `/#${anchorId}`;
          return;
        }
        
        // Si ya estamos en home, hacer scroll a la sección
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };
    
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
    
    // Para anclas, usar manejo personalizado
    return (
      <a 
        href={href}
        className="group relative px-3 py-2 font-semibold text-gray-700 hover:text-orange-500 transition-colors duration-200"
        onClick={handleClick}
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
    <header className="bg-white shadow-sm sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - visible en todas las pantallas pero con diferentes estilos */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="Ir a inicio">
              <div className="relative h-12 w-40 md:h-14 md:w-48 lg:h-16 lg:w-56">
                <Image
                  src="/images/tubarriope_logo_penegro2.webp"
                  alt="Logo TuBarrio.pe"
                  fill
                  className="object-contain"
                  sizes="(max-width: 767px) 160px, 224px"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Barra de búsqueda para móvil */}
          <div className="md:hidden flex-1 mx-2 -ml-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-orange-500" />
            </form>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex-shrink-0 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-full bg-white text-orange-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => {
                playFolderSound();
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>


          {/* Navegación desktop */}
          <nav className="hidden md:flex gap-3 lg:gap-6 items-center mx-4">
            <NavItem href="/">Inicio</NavItem>
            <NavItem href="/#inmuebles">Inmuebles</NavItem>
            <NavItem href="/todos-los-servicios">Todos los servicios</NavItem>
            <NavItem href="/cobertura">Cobertura</NavItem>
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-4">
            <NavItem href="/registro-negocio">
              <span className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 flex items-center">
                <span className="mr-2">+</span> Registrar Negocio
              </span>
            </NavItem>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-6 px-4 shadow-inner">
            <nav className="flex flex-col space-y-2">
              <div className="py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 min-h-[48px] flex items-center">
                <NavItem href="/">Inicio</NavItem>
              </div>
              <div className="py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 min-h-[48px] flex items-center">
                <NavItem href="/#inmuebles">Inmuebles</NavItem>
              </div>
              <div className="py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 min-h-[48px] flex items-center">
                <NavItem href="/todos-los-servicios">Todos los servicios</NavItem>
              </div>
              <div className="py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 min-h-[48px] flex items-center">
                <NavItem href="/cobertura">Cobertura</NavItem>
              </div>
              <div className="mt-6">
                <NavItem href="/registro-negocio">
                  <span 
                    className="block w-full px-6 py-4 text-center rounded-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md hover:from-orange-600 hover:to-yellow-500 active:from-orange-700 active:to-yellow-600 transition-all duration-200 min-h-[52px] flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    + Registrar Negocio
                  </span>
                </NavItem>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
