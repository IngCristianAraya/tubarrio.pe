import dynamic from 'next/dynamic';
import React from 'react';

// Import Header and Footer components
const Header = dynamic(() => import('@/components/Header'), { 
  ssr: false,
  loading: () => <div className="h-16 bg-white shadow-sm"></div>
});
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/ui/MobileBottomNav'), { ssr: false });

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileBottomNav />
    </>
  );
}
