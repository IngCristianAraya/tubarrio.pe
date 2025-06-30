import { Metadata } from 'next';
import Image from 'next/image';
import MapSection from '@/components/MapSection';
import MagazineSection from '@/components/MagazineSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FeaturedServices from '@/components/FeaturedServices';
import CategorySections from '@/components/CategorySections';
import BusinessRegistration from '@/components/BusinessRegistration';

// Metadatos específicos para la página de inicio
export const metadata: Metadata = {
  title: 'Revista Pando - Descubre todos los servicios de tu zona',
  description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en Lima Este. La revista digital que conecta negocios y clientes en tu barrio.'
};

// Página de inicio
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header (Navbar) */}
      <Header />

      <main className="flex flex-col">
        {/* CustomCursor para toda la aplicación */}
        <CustomCursor />
        {/* Hero Section */}
        <Hero />
        
        {/* Sección de Cobertura */}
        <MapSection />
        
        {/* Servicios Destacados */}
        <FeaturedServices />

        {/* Categorías de Servicios */}
        <CategorySections />
        
        {/* Revista Digital */}
        <MagazineSection />
        
        {/* Sección de Registro de Negocios */}
        <BusinessRegistration />
        
        {/* Botón flotante de WhatsApp */}
        <WhatsAppButton phoneNumber="+51906684284" />
      </main>

      <Footer />
    </div>
  );
}
