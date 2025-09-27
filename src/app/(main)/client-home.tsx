// src/app/client-home.tsx
'use client';

import dynamic from 'next/dynamic';

const ClientHomePage = dynamic(() => import('./client-page'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white">
      <div className="h-[70vh] bg-gray-100 animate-pulse"></div>
    </div>
  )
});

export default function ClientHome() {
  return <ClientHomePage />;
}