'use client';

import dynamic from 'next/dynamic';

// Importar el Header y Footer dinámicamente para evitar problemas de hidratación
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function TodosLosServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}