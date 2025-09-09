'use client';

import ClientOnlyTodosLosServicios from '@/components/ClientOnlyTodosLosServicios';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ClientOnlyTodosLosServicios />
      </div>
    </div>
  );
}
