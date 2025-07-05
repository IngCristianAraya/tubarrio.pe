"use client";
import dynamic from "next/dynamic";

const BankAgentsSection = dynamic(() => import("./BankAgentsSection"), { ssr: false });
const BusinessRegistration = dynamic(() => import("./BusinessRegistration"), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });
const LazyMapSection = dynamic(() => import("./LazyMapSection"), { ssr: false });
const FeaturedServices = dynamic(() => import("./FeaturedServices"), { ssr: false });
const CategorySections = dynamic(() => import("./CategorySections"), { ssr: false });
const MagazineSection = dynamic(() => import("./MagazineSection"), { ssr: false });

export default function HomeClient() {
  return (
    <>
      {/* Sección de Cobertura */}
      <LazyMapSection />
      {/* Agentes Bancarios */}
      <BankAgentsSection />
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
    </>
  );
}
