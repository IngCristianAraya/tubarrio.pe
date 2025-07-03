"use client";
import dynamic from "next/dynamic";
import FeaturedServices from "./FeaturedServices";
import CategorySections from "./CategorySections";
import BusinessRegistration from "./BusinessRegistration";
import WhatsAppButton from "./WhatsAppButton";

const MapSection = dynamic(() => import("./MapSection"), { ssr: false });
const MagazineSection = dynamic(() => import("./MagazineSection"), { ssr: false });

export default function HomeClient() {
  return (
    <>
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
    </>
  );
}
