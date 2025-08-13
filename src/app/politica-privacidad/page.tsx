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
)

// Componente para los ítems de lista
const InfoItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 mr-2 rounded-full bg-amber-400/80"></span>
    <span className="text-gray-300">{children}</span>
  </li>
)

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden text-gray-200">
      {/* Efecto de partículas sutiles */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]"></div>
      </div>

      <Header />

      <main className="relative z-10" aria-label="Política de Privacidad">
        <CustomCursor />

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Encabezado con neumorfismo */}
            <div className="flex flex-col items-center gap-4 mb-12 text-center">
              <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/20 rounded-2xl shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#1a1a1a]" />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-amber-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 0V7m0 8h.01" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 leading-tight">
                Política de Privacidad
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
                  En TuBarrio.pe valoramos y respetamos la privacidad de nuestros usuarios y clientes. Esta Política describe cómo recopilamos, usamos, almacenamos y protegemos la información personal proporcionada a través de nuestra plataforma.
                </p>
              </SectionCard>

              {/* Sección 2 */}
              <SectionCard title="2. Información que Recopilamos">
                <ul className="space-y-2">
                  <InfoItem>Información de contacto: nombre, correo electrónico, teléfono, dirección.</InfoItem>
                  <InfoItem>Datos de negocio: nombre comercial, rubro, descripción, imágenes, ubicación, horarios, enlaces y promociones.</InfoItem>
                  <InfoItem>Información de navegación: IP, dispositivo, navegador, páginas visitadas, cookies.</InfoItem>
                </ul>
              </SectionCard>

              {/* Sección 3 */}
              <SectionCard title="3. Uso de la Información">
                <ul className="space-y-2">
                  <InfoItem>Gestionar publicaciones de negocios en la plataforma.</InfoItem>
                  <InfoItem>Comunicar actualizaciones, promociones y novedades.</InfoItem>
                  <InfoItem>Mejorar la experiencia de usuario y seguridad del sitio.</InfoItem>
                  <InfoItem>Cumplir con obligaciones legales o requerimientos de autoridad.</InfoItem>
                </ul>
              </SectionCard>

              {/* Sección 4 */}
              <SectionCard title="4. Compartir Información">
                <p className="text-gray-300 mb-3">Solo compartimos datos personales cuando:</p>
                <ul className="space-y-2">
                  <InfoItem>Es necesario para brindar el servicio (proveedores tecnológicos).</InfoItem>
                  <InfoItem>Lo exige la ley o autoridad competente.</InfoItem>
                  <InfoItem>Se cuenta con autorización expresa del usuario.</InfoItem>
                </ul>
              </SectionCard>

              {/* Sección 5 */}
              <SectionCard title="5. Seguridad de los Datos">
                <p className="text-gray-300 leading-relaxed">
                  Aplicamos medidas técnicas y organizativas para proteger los datos personales. Sin embargo, ningún sistema es infalible, y no podemos garantizar seguridad absoluta.
                </p>
              </SectionCard>

              {/* Sección 6 */}
              <SectionCard title="6. Derechos del Usuario">
                <p className="text-gray-300 leading-relaxed">
                  Puedes solicitar acceso, modificación o eliminación de tus datos escribiéndonos a 
                  <a href="mailto:info@tubarrio.pe" className="text-amber-400 hover:text-amber-300 transition-colors font-medium"> info@tubarrio.pe</a>. 
                  Atenderemos tu solicitud en el menor tiempo posible.
                </p>
              </SectionCard>

              {/* Sección 7 */}
              <SectionCard title="7. Cookies">
                <p className="text-gray-300 leading-relaxed">
                  Usamos cookies para mejorar el sitio, analizar el tráfico y personalizar la experiencia. Puedes configurar tu navegador para aceptar o rechazar cookies según tus preferencias.
                </p>
              </SectionCard>

              {/* Sección 8 */}
              <SectionCard title="8. Enlaces Externos">
                <p className="text-gray-300 leading-relaxed">
                  TuBarrio.pe puede contener enlaces a sitios de terceros. No nos hacemos responsables de sus políticas ni de su contenido.
                </p>
              </SectionCard>

              {/* Sección 9 */}
              <SectionCard title="9. Cambios en la Política">
                <p className="text-gray-300 leading-relaxed">
                  Esta política puede actualizarse periódicamente. La versión vigente siempre estará disponible en esta página.
                </p>
              </SectionCard>

              {/* Sección 10 */}
              <SectionCard title="10. Contacto">
                <p className="text-gray-300 leading-relaxed">
                Para dudas o solicitudes relacionadas con privacidad, contáctanos:
              </p>
              <ul>
                <li>Email: info@tubarrio.pe</li>
                <li>Teléfono: +51 906 684 284</li>
                <li>Dirección: Lima, Perú</li>
              </ul>

              </SectionCard>

              {/* Sección 11 */}
              <SectionCard title="11. Aceptación">
                <p className="text-gray-300 leading-relaxed">
                  Al usar nuestra web o contratar nuestros servicios, confirmas que has leído y aceptado esta Política de Privacidad.
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

export default PrivacyPolicy;
