'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
    <header className="bg-white/95 backdrop-blur-lg shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-200" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Botón menú móvil */}
          <div className="md:hidden">
            <button 
              className="p-3 rounded-lg !bg-transparent !text-gray-700 hover:!text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 active:bg-gray-200 transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => {
                playFolderSound();
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6 !text-gray-700 hover:!text-orange-500" /> : <Menu className="w-6 h-6 !text-gray-700 hover:!text-orange-500" />}
            </button>
          </div>

          {/* Logo centrado en móvil, a la izquierda en desktop */}
          <div className="flex-shrink-0 flex items-center md:mr-auto absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
            <Link href="/" className="flex items-center select-none" aria-label="Ir a inicio">
              <div className="relative h-[60px] md:h-[50px] lg:h-[60px] w-auto aspect-[4/1] min-w-[140px] md:min-w-[100px] lg:min-w-[120px]">
                <Image
                  src="/images/tubarriope_logo_penegro2.webp"
                  alt="Logo TuBarrio.pe"
                  fill
                  sizes="(max-width: 768px) 140px, 200px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Espaciador invisible en móvil para balancear el centrado */}
          <div className="md:hidden w-[44px]"></div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex gap-3 lg:gap-6 items-center mx-4">
            <NavItem href="/">Inicio</NavItem>
            <NavItem href="/#servicios">Destacados</NavItem>
            <NavItem href="/todos-los-servicios">Categorías</NavItem>
            <NavItem href="/#cobertura">Cobertura</NavItem>
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-4">
            <NavItem href="/#registro">
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
                <NavItem href="/#servicios">Destacados</NavItem>
              </div>
              <div className="py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 min-h-[48px] flex items-center">
                <NavItem href="/todos-los-servicios">Categorías</NavItem>
              </div>
              <div className="py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 min-h-[48px] flex items-center">
                <NavItem href="/#cobertura">Cobertura</NavItem>
              </div>
              <div className="mt-6">
                <NavItem href="/#registro">
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
