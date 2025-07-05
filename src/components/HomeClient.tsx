"use client";
import dynamic from "next/dynamic";
import BankAgentsSection from "./BankAgentsSection";
import BusinessRegistration from "./BusinessRegistration";
import WhatsAppButton from "./WhatsAppButton";
import LazyMapSection from "./LazyMapSection";

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
