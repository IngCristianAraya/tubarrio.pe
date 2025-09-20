import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';


// Cargar componentes dinámicamente


export const metadata: Metadata = {
  title: 'Zona de Cobertura | TuBarrio.pe',
  description: 'Descubre las zonas donde ofrecemos cobertura y conectamos negocios locales con su comunidad en TuBarrio.pe',
  keywords: 'cobertura, zonas de entrega, áreas de servicio, barrios cubiertos, TuBarrio.pe',
};

export default function CoberturaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-col min-h-screen">
        
        
        <main className="flex-1">
          {/* Hero Section - ANCHO COMPLETO */}
          <div className="w-full bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
            {/* Pattern background - ancho completo */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: "url(" + 
                "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.9 0 7-3.1 7-7s-3.1-7-7-7-7 3.1-7 7 3.1 7 7 7zm48 25c3.9 0 7-3.1 7-7s-3.1-7-7-7-7 3.1-7 7 3.1 7 7 7zm-43-7c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm63 31c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM34 90c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm56-76c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM12 86c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm28-65c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm23-11c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm-6 60c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm29-22c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM32 63c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm57-13c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm-9-21c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM60 91c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM35 41c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM12 60c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z' fill='%23f97316' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E"
            }}></div>
            
            {/* Content container with max-width */}
            <div className="relative z-10 w-full">
              {children}
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
}