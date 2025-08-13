'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';

// Componente para las tarjetas de sección
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(245,158,11,0.1)]">
    <h2 className="text-2xl font-bold text-amber-400 mb-4 relative">
      <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-amber-500/50"></span>
      {title}
    </h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Componente para los ítems de lista
const InfoItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 mr-2 rounded-full bg-amber-400/80"></span>
    <span className="text-gray-300">{children}</span>
  </li>
);

const TermsAndConditions = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden text-gray-200">
      {/* Efecto de partículas sutiles */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]"></div>
      </div>

      <Header />

      <main className="relative z-10" aria-label="Términos y Condiciones">
        <CustomCursor />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Encabezado con neumorfismo */}
            <div className="flex flex-col items-center gap-4 mb-12 text-center">
              <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/20 rounded-2xl shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#1a1a1a]" />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-amber-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 leading-tight">
                Términos y Condiciones
              </h1>
              <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-amber-900/30 to-amber-800/20 text-amber-300 border border-amber-800/50 backdrop-blur-sm">
                Última actualización: 30 de junio de 2025
              </span>
            </div>

            {/* Contenido principal */}
            <div className="space-y-10">
              {/* Sección 1 */}
              <SectionCard title="1. Introducción">
                <p className="text-gray-300 leading-relaxed">
                  Bienvenido a TuBarrio.pe. Estos Términos y Condiciones regulan el uso de nuestra plataforma web y los servicios
                  de publicación digital ofrecidos a negocios y emprendedores de la zona. Al contratar nuestros servicios o utilizar
                  nuestro sitio web, usted acepta estos términos en su totalidad.
                </p>
              </SectionCard>

              {/* Sección 2 */}
              <SectionCard title="2. Uso de los Servicios">
                <p className="text-gray-300 leading-relaxed">
                  TuBarrio.pe permite a emprendedores, negocios y profesionales aparecer en nuestro directorio digital mediante una
                  suscripción mensual. Las páginas personalizadas (landing pages) permiten exhibir productos, servicios y datos de contacto.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Nos enfocamos en visibilizar negocios de la zona a través de medios digitales como subdominios, QR impresos y redes sociales.
                </p>
              </SectionCard>

              {/* Sección 3 */}
              <SectionCard title="3. Suscripciones y Pagos">
                <p className="text-gray-300 leading-relaxed">
                  Para publicar en TuBarrio.pe se requiere una membresía mensual, desde S/ 15. Esta membresía incluye presencia en el portal,
                  una landing page con subdominio personalizado y promoción básica en redes locales.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  El pago se realiza por adelantado. En caso de no recibir el pago en un plazo máximo de 7 días tras el vencimiento, la publicación
                  será suspendida temporalmente. No se realizan reembolsos por periodos ya facturados.
                </p>
              </SectionCard>

              {/* Sección 4 */}
              <SectionCard title="4. Contenido proporcionado por el Cliente">
                <p className="text-gray-300 leading-relaxed">
                  Los clientes son responsables de la información enviada para su publicación, incluyendo textos, imágenes, precios y promociones.
                  Al enviarla, nos autorizan a mostrarla en su landing page, en redes sociales, y en otros medios de promoción relacionados con TuBarrio.pe.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  No se aceptará contenido ofensivo, engañoso, ilegal o que infrinja derechos de terceros.
                </p>
              </SectionCard>

              {/* Sección 5 */}
              <SectionCard title="5. Propiedad Intelectual">
                <p className="text-gray-300 leading-relaxed">
                  Todo el contenido original de la plataforma, el diseño web y las funcionalidades desarrolladas por TuBarrio.pe son propiedad
                  intelectual de la empresa. Queda prohibida su copia o uso sin autorización expresa.
                </p>
              </SectionCard>

              {/* Sección 6 */}
              <SectionCard title="6. Enlaces a Otros Sitios">
                <p className="text-gray-300 leading-relaxed">
                  Algunas landing pages o publicaciones pueden contener enlaces externos provistos por los clientes. TuBarrio.pe no se responsabiliza
                  por el contenido ni la legalidad de dichos enlaces ni por daños derivados de su uso.
                </p>
              </SectionCard>

              {/* Sección 7 */}
              <SectionCard title="7. Terminación del Servicio">
                <p className="text-gray-300 leading-relaxed">
                  Nos reservamos el derecho de suspender o cancelar el servicio de un cliente en caso de incumplimiento de estos términos, falta de pago
                  reiterada, o por el uso indebido de nuestra plataforma.
                </p>
              </SectionCard>

              {/* Sección 8 */}
              <SectionCard title="8. Limitación de Responsabilidad">
                <p className="text-gray-300 leading-relaxed">
                  TuBarrio.pe no garantiza ventas ni resultados específicos para los negocios publicados. No nos hacemos responsables por pérdidas comerciales,
                  daños indirectos o interrupciones de servicio fuera de nuestro control.
                </p>
              </SectionCard>

              {/* Sección 9 */}
              <SectionCard title="9. Cambios a los Términos">
                <p className="text-gray-300 leading-relaxed">
                  Podemos actualizar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigencia a partir de su publicación
                  en esta página. Se recomienda revisar esta sección periódicamente.
                </p>
              </SectionCard>

              {/* Sección 10 */}
              <SectionCard title="10. Contacto">
                <p className="text-gray-300 mb-3">Si tienes alguna duda o consulta relacionada con estos términos, contáctanos:</p>
                <ul className="space-y-2">
                  <InfoItem>Email: <a href="mailto:info@tubarrio.pe" className="text-amber-400 hover:text-amber-300 transition-colors">info@tubarrio.pe</a></InfoItem>
                  <InfoItem>Teléfono: <a href="tel:+51906684284" className="text-amber-400 hover:text-amber-300 transition-colors">+51 906 684 284</a></InfoItem>
                  <InfoItem>Dirección: Lima, Perú</InfoItem>
                </ul>
              </SectionCard>

              {/* Sección 11 */}
              <SectionCard title="11. Aceptación">
                <p className="text-gray-300 leading-relaxed">
                  Al contratar nuestros servicios o mantener una publicación activa en TuBarrio.pe, usted confirma que ha leído,
                  entendido y aceptado estos Términos y Condiciones.
                </p>
              </SectionCard>
            </div>
          </div>
        </section>

        <WhatsAppButton phoneNumber="+51906684284" />
      </main>

      <Footer />
    </div>
  );
}

export default TermsAndConditions;
