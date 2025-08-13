'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Dynamic imports for client-side components with custom loading states
const HomeClient = dynamic(() => import('@/components/HomeClient'), {
  loading: () => (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false
});

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), {
  loading: () => null,
  ssr: false
});

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
  loading: () => null,
  ssr: false
});

const ClientComponents = () => {
  const pathname = usePathname();
  
  // Only show certain components on specific routes if needed
  const isHomePage = pathname === '/';

  return (
    <>
      {/* Custom cursor for the entire application */}
      <CustomCursor />
      
      {/* HomeClient component - only on home page */}
      {isHomePage && <HomeClient />}
      
      {/* WhatsApp button - shown on all pages */}
      <WhatsAppButton phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51901426737'} />
    </>
  );
};

export default ClientComponents;