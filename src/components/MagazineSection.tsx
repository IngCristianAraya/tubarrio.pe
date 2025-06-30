'use client';

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import { useServices } from '../context/ServicesContext';
import { Plus, Star, MapPin, ChevronLeft, ChevronRight, Info } from 'lucide-react';

// Definir la interfaz para un negocio
interface Business {
  name: string;
  category: string;
  description: string;
  image: string;
  location: string;
  rating?: number;
}

// Componente para una página individual de la revista con dos negocios por página
const Page = React.forwardRef<HTMLDivElement, { businesses: Business[]; pageNumber: number }>((props, ref) => {
  const { businesses, pageNumber } = props;
  
  return (
    <div 
      className="page bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100" 
      ref={ref}
    >
      <div className="page-content p-6 h-full flex flex-col">
        {pageNumber === 0 ? (
          // Diseño especial para la portada
          <div className="cover-page flex flex-col items-center justify-center h-full text-center">
            <div className="cover-image mb-4 sm:mb-8 w-full h-[250px] sm:h-[300px] md:h-[400px] relative overflow-hidden rounded-lg">
              <div className="relative w-full h-full">
                <Image 
                  src="/images/hero_3.webp" 
                  alt="Portada"
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4 sm:pb-8">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">Revista Digital</h1>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">Revista Pando</h2>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mb-3 sm:mb-6"></div>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 mb-4 sm:mb-8 max-w-md px-2">Bienvenido a nuestra revista digital de negocios locales y emprendimientos.</p>
            
            <div className="mt-auto">
              <p className="text-xs sm:text-sm text-gray-500 italic">Edición {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        ) : businesses.length > 0 ? (
          // Diseño para páginas interiores con dos negocios por página
          <div className="flex flex-col h-full">
            <div className="page-header mb-3 sm:mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Negocios Destacados</h2>
              <p className="text-xs sm:text-sm text-gray-500">Página {pageNumber}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 h-full">
              {businesses.map((business, index) => (
                <div key={index} className="business-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
                      <h3 className="text-base sm:text-xl font-bold text-gray-800 truncate max-w-[70%]">{business.name}</h3>
                      <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                        {business.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="sm:w-2/5 w-full">
                        <div className="relative h-[140px] sm:h-full sm:min-h-[160px]">
                          <div className="relative w-full h-full">
                            <Image 
                              src={business.image || '/images/placeholder-business.jpg'} 
                              alt={business.name}
                              className="object-cover"
                              fill
                              sizes="(max-width: 640px) 100vw, 40vw"
                            />
                          </div>
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-semibold ml-1">{business.rating || '4.5'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sm:w-3/5 w-full p-3 sm:p-4 flex flex-col">
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-3">{business.description}</p>
                        
                        <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{business.location}</span>
                        </div>
                        
                        <div className="mt-auto flex justify-between items-center">
                          <button className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-orange-600 hover:to-yellow-600 transition-all flex items-center justify-center">
                            <span>Ver detalles</span>
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-400 text-lg">Página en blanco</p>
          </div>
        )}
      </div>
    </div>
  );
});

// Componente principal de la sección de revista
const MagazineSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { services } = useServices();
  const flipBookRef = React.useRef<any>(null);
  
  // Recopilar todos los servicios de todas las categorías
  const getAllServices = () => {
    // Obtener todos los servicios disponibles
    const allServices: Business[] = services.map(service => ({
      name: service.name,
      category: service.category || 'General',
      description: service.description || 'Sin descripción disponible',
      image: service.image || '/images/placeholder-business.jpg',
      location: service.location || 'Lima, Perú'
    }));
    
    return allServices;
  };
  
  const allBusinesses = getAllServices();
  
  // Agrupar los negocios en pares (2 por página)
  const getBusinessPairs = () => {
    const pairs: Business[][] = [];
    
    // Crear pares de negocios
    for (let i = 0; i < allBusinesses.length; i += 2) {
      const pair = allBusinesses.slice(i, i + 2);
      pairs.push(pair);
    }
    
    return pairs;
  };
  
  const businessPairs = getBusinessPairs();
  const totalPages = businessPairs.length + 1; // +1 para la portada
  
  const handleFlip = (e: any) => {
    setCurrentPage(e.data);
  };
  
  // Función para ir a una página específica
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(pageNumber);
    }
  };
  
  return (
    <section id="revista" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Nuestra Revista Digital</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Explora nuestra revista digital con los mejores negocios y emprendimientos locales.
          </p>
        </div>
        
        <div className="magazine-container relative mx-auto max-w-4xl">
          <div className="magazine-wrapper overflow-hidden">
            <HTMLFlipBook
              width={550}
              height={733}
              size="stretch"
              minWidth={280}
              maxWidth={1000}
              minHeight={350}
              maxHeight={1533}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              startPage={currentPage}
              onFlip={(e) => setCurrentPage(e.data)}
              ref={flipBookRef}
              className="mx-auto"
              style={{
                touchAction: 'none'
              }}
              drawShadow={true}
              flippingTime={800}
              usePortrait={true}
              useMouseEvents={true}
              clickEventForward={true}
              swipeDistance={20}
              showPageCorners={true}
              disableFlipByClick={false}
              autoSize={true}
              startZIndex={0}
            >
              {/* Portada */}
              <Page pageNumber={0} businesses={[]} />
              
              {/* Páginas de negocios (2 por página) */}
              {businessPairs.map((pair, index) => (
                <Page 
                  key={index} 
                  pageNumber={index + 1} 
                  businesses={pair} 
                />
              ))}
            </HTMLFlipBook>
            
            <div className="magazine-controls flex flex-col items-center mt-4 sm:mt-6 md:mt-10">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-3 md:mb-5">
                <button 
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  className="flex items-center px-3 sm:px-5 py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-md disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  disabled={currentPage <= 0}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Anterior</span>
                </button>
                
                <div className="px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center">
                  <span className="text-gray-800 font-medium text-xs sm:text-sm">
                    {currentPage + 1}/{totalPages}
                  </span>
                </div>
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  className="flex items-center px-3 sm:px-5 py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-md disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  disabled={currentPage >= totalPages - 1}
                  aria-label="Página siguiente"
                >
                  <span className="hidden xs:inline">Siguiente</span>
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                </button>
              </div>
              
              <div className="flex gap-2 mt-2 flex-wrap justify-center max-w-full px-2 overflow-x-auto">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${currentPage === i ? 'bg-orange-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Ir a la página ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="magazine-info mt-10 sm:mt-12 md:mt-16 text-center px-4 sm:px-0">
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            ¿Quieres que tu negocio aparezca en nuestra revista digital?
          </p>
          <a 
            href="#contacto" 
            className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium sm:font-bold rounded-lg hover:from-orange-600 hover:to-yellow-600 active:scale-95 transition-all shadow-md text-sm sm:text-base"
          >
            <span>Contáctanos</span>
            <Plus className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
