'use client';

import dynamic from 'next/dynamic';

// Importar el Header y Footer dinámicamente para evitar problemas de hidratación
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/ui/MobileBottomNav'), { ssr: false });

export default function TodosLosServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}