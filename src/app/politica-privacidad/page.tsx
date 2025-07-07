import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import CustomCursor from '@/components/CustomCursor'

export const metadata: Metadata = {
  title: 'Política de Privacidad - TuBarrio.pe',
  description: 'Conoce cómo TuBarrio.pe protege y utiliza tus datos personales y la privacidad de los negocios y usuarios de la plataforma.'
}

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-x-hidden">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-orange-200/40 to-orange-100/0 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-blue-200/40 to-blue-100/0 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-0 w-1 h-1/3 bg-gradient-to-b from-orange-300/30 to-transparent rounded-full" />
      </div>

      <Header />

      <main className="flex flex-col relative z-10" aria-label="Política de Privacidad">
        <CustomCursor />

        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-3 mb-10 animate-fade-in">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 shadow-inner mb-2 border-2 border-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 0V7m0 8h.01" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                Política de Privacidad
              </h1>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold rounded-full px-4 py-1 mt-1 border border-blue-200 shadow-sm">
                Última actualización: 30 de junio de 2025
              </span>
            </div>

            <div className="relative bg-white/90 shadow-xl border border-blue-100 rounded-2xl p-6 md:p-10 animate-fade-in prose prose-blue max-w-none">
              <div className="absolute left-0 top-0 w-full h-2 bg-gradient-to-r from-blue-300/40 via-blue-100/0 to-orange-200/30 rounded-t-2xl" />

              <h2>1. Introducción</h2>
              <p>
                En TuBarrio.pe valoramos y respetamos la privacidad de nuestros usuarios y clientes. Esta Política describe cómo recopilamos, usamos, almacenamos y protegemos la información personal proporcionada a través de nuestra plataforma.
              </p>

              <h2>2. Información que Recopilamos</h2>
              <ul>
                <li><strong>Información de contacto:</strong> nombre, correo electrónico, teléfono, dirección.</li>
                <li><strong>Datos de negocio:</strong> nombre comercial, rubro, descripción, imágenes, ubicación, horarios, enlaces y promociones.</li>
                <li><strong>Información de navegación:</strong> IP, dispositivo, navegador, páginas visitadas, cookies.</li>
              </ul>

              <h2>3. Uso de la Información</h2>
              <ul>
                <li>Gestionar publicaciones de negocios en la plataforma.</li>
                <li>Comunicar actualizaciones, promociones y novedades.</li>
                <li>Mejorar la experiencia de usuario y seguridad del sitio.</li>
                <li>Cumplir con obligaciones legales o requerimientos de autoridad.</li>
              </ul>

              <h2>4. Compartir Información</h2>
              <p>Solo compartimos datos personales cuando:</p>
              <ul>
                <li>Es necesario para brindar el servicio (proveedores tecnológicos).</li>
                <li>Lo exige la ley o autoridad competente.</li>
                <li>Se cuenta con autorización expresa del usuario.</li>
              </ul>

              <h2>5. Seguridad de los Datos</h2>
              <p>
                Aplicamos medidas técnicas y organizativas para proteger los datos personales. Sin embargo, ningún sistema es infalible, y no podemos garantizar seguridad absoluta.
              </p>

              <h2>6. Derechos del Usuario</h2>
              <p>
                Puedes solicitar acceso, modificación o eliminación de tus datos escribiéndonos a <strong>info@tubarrio.pe</strong>. Atenderemos tu solicitud en el menor tiempo posible.
              </p>

              <h2>7. Cookies</h2>
              <p>
                Usamos cookies para mejorar el sitio, analizar el tráfico y personalizar la experiencia. Puedes configurar tu navegador para aceptar o rechazar cookies según tus preferencias.
              </p>

              <h2>8. Enlaces Externos</h2>
              <p>
                TuBarrio.pe puede contener enlaces a sitios de terceros. No nos hacemos responsables de sus políticas ni de su contenido.
              </p>

              <h2>9. Cambios en la Política</h2>
              <p>
                Esta política puede actualizarse periódicamente. La versión vigente siempre estará disponible en esta página.
              </p>

              <h2>10. Contacto</h2>
              <p>
                Para dudas o solicitudes relacionadas con privacidad, contáctanos:
              </p>
              <ul>
                <li>Email: info@tubarrio.pe</li>
                <li>Teléfono: +51 906 684 284</li>
                <li>Dirección: Lima, Perú</li>
              </ul>

              <h2>11. Aceptación</h2>
              <p>
                Al usar nuestra web o contratar nuestros servicios, confirmas que has leído y aceptado esta Política de Privacidad.
              </p>
            </div>
          </div>
        </section>

        <WhatsAppButton phoneNumber="+51906684284" />
      </main>

      <Footer />
    </div>
  )
}
