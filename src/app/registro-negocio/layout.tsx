import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Importaciones dinámicas con carga perezosa


const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), {
  ssr: false
});

export const metadata: Metadata = {
  title: 'Registra tu Negocio | TuBarrio.pe',
  description: 'Registra tu negocio en TuBarrio.pe y llega a más clientes en tu zona. Promoción local efectiva para emprendedores y negocios en Pando y alrededores.',
  keywords: ['registrar negocio', 'publicidad local', 'promoción de negocios', 'TuBarrio.pe', 'Pando', 'Lima Este'],
  openGraph: {
    title: 'Registra tu Negocio | TuBarrio.pe',
    description: 'Lleva tu negocio al siguiente nivel con TuBarrio.pe. Regístrate ahora y conéctate con clientes locales.',
    url: 'https://tubarrio.pe/registro-negocio',
    type: 'website',
    images: [
      {
        url: 'https://tubarrio.pe/images/registro-negocio.jpg',
        width: 1200,
        height: 630,
        alt: 'Registra tu Negocio en TuBarrio.pe',
      },
    ],
  },
};

export default function RegisterBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
      <main className="pt-16"> {/* Ajuste para el header fijo */}
        {children}
      </main>
      <WhatsAppButton phoneNumber="+51901426737" message="Hola, me gustaría obtener más información sobre cómo registrar mi negocio en TuBarrio.pe" />
    </>
  );
}
