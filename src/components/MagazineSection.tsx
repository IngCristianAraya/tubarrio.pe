'use client';

import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useServices } from '../context/ServicesContext';

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
            <div className="cover-image mb-8 w-full h-[400px] relative overflow-hidden rounded-lg">
              <img 
                src="/images/hero_3.webp" 
                alt="Portada"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-8">
                <h1 className="text-white text-4xl font-bold drop-shadow-lg">Revista Digital</h1>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Revista Pando</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mb-6"></div>
            <p className="text-xl text-gray-600 mb-8 max-w-md">Bienvenido a nuestra revista digital de negocios locales y emprendimientos.</p>
            
            <div className="mt-auto">
              <p className="text-sm text-gray-500 italic">Edición {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        ) : businesses.length > 0 ? (
          // Diseño para páginas interiores con dos negocios por página
          <div className="flex flex-col h-full">
            <div className="page-header mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-2xl font-bold text-gray-800">Negocios Destacados</h2>
              <p className="text-sm text-gray-500">Página {pageNumber}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 h-full">
              {businesses.map((business, index) => (
                <div key={index} className="business-card border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                        {business.category}
                      </span>
                    </div>
                    
                    <div className="flex md:flex-row flex-col h-full">
                      <div className="md:w-2/5 w-full">
                        <div className="relative h-full min-h-[180px]">
                          <img 
                            src={business.image || '/images/placeholder-business.jpg'} 
                            alt={business.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-semibold ml-1">{business.rating || '4.5'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-3/5 w-full p-4 flex flex-col">
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">{business.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {business.location || 'Lima, Perú'}
                        </div>
                        
                        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Contacto: (01) 123-4567</span>
                          <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-600 transition-colors">
                            Ver detalles
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
    <section id="revista" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestra Revista Digital</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los mejores negocios y servicios locales en nuestra revista digital interactiva.
          </p>
        </div>
        
        <div className="magazine-container flex flex-col items-center">
          <div className="magazine-wrapper w-full max-w-4xl mx-auto overflow-hidden">
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
              className="mx-auto"
              ref={flipBookRef}
              onFlip={handleFlip}
              startPage={currentPage}
              style={{}}
              drawShadow={true}
              flippingTime={1000}
              startZIndex={0}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
              autoSize={true}
              usePortrait={true}
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
            
            <div className="magazine-controls flex flex-col items-center mt-8 md:mt-12">
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-4 md:mb-6">
                <button 
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                  disabled={currentPage <= 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Página</span> Anterior
                </button>
                
                <div className="px-3 sm:px-6 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center">
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {currentPage + 1}/{totalPages}
                  </span>
                </div>
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                  disabled={currentPage >= totalPages - 1}
                >
                  <span className="hidden sm:inline">Página</span> Siguiente
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-3 h-3 rounded-full transition-all ${currentPage === i ? 'bg-orange-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Ir a la página ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="magazine-info mt-16 text-center">
          <p className="text-gray-600 mb-4">
            ¿Quieres que tu negocio aparezca en nuestra revista digital?
          </p>
          <a 
            href="#contacto" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
