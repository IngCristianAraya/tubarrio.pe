import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Importaciones dinámicas con carga perezosa para componentes que pueden ser renderizados en el servidor
const Header = dynamic(() => import('@/components/Header'), {
  loading: () => <header className="h-16 bg-white shadow-sm"></header>,
  ssr: true
});

const Hero = dynamic(() => import('@/components/Hero'), {
  loading: () => <div className="h-[60vh] bg-gray-100 animate-pulse"></div>,
  ssr: true
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <footer className="h-20 bg-gray-800"></footer>,
  ssr: true
});

// Importamos directamente el componente cliente
import ClientComponents from '../components/ClientComponents';

// Metadatos específicos para la página de inicio
export const metadata: Metadata = {
  title: 'Tubarrio.pe - Descubre todos los servicios de tu zona',
  description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio. La plataforma digital que conecta negocios y clientes.'
};

// Página de inicio
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header (Navbar) */}
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <Hero />
        
        {/* Componentes del cliente que necesitan interactividad del navegador */}
        <ClientComponents />
      </main>

      <Footer />
    </div>
  );
}
