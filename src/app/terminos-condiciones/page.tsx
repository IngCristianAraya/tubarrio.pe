import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import CustomCursor from '@/components/CustomCursor'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Revista Pando',
  description: 'Conoce las políticas y condiciones de uso de Revista Pando para negocios que deseen aparecer en nuestra plataforma local.'
}

export default function TermsAndConditions() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-x-hidden">
      {/* Fondo decorativo con gradientes y detalles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-orange-200/40 to-orange-100/0 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-blue-200/40 to-blue-100/0 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-0 w-1 h-1/3 bg-gradient-to-b from-orange-300/30 to-transparent rounded-full" />
      </div>
      <Header />

      <main className="flex flex-col relative z-10" aria-label="Términos y Condiciones">
        <CustomCursor />
        
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-3 mb-10 animate-fade-in">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 shadow-inner mb-2 border-2 border-orange-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-8-4h8M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                Términos y Condiciones
              </h1>
              <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold rounded-full px-4 py-1 mt-1 border border-orange-200 shadow-sm">Última actualización: 30 de junio de 2025</span>
            </div>
            <div className="relative bg-white/90 shadow-xl border border-orange-100 rounded-2xl p-6 md:p-10 transition-all duration-300 animate-fade-in prose prose-orange max-w-none">
              <div className="absolute left-0 top-0 w-full h-2 bg-gradient-to-r from-orange-300/40 via-orange-100/0 to-blue-200/30 rounded-t-2xl" />
              <h2>1. Introducción</h2>
              <p>
                Bienvenido a TuBarrio.pe. Estos Términos y Condiciones regulan el uso de nuestra plataforma web y los servicios
                de publicación digital ofrecidos a negocios y emprendedores de la zona. Al contratar nuestros servicios o utilizar
                nuestro sitio web, usted acepta estos términos en su totalidad.
              </p>

              <h2>2. Uso de los Servicios</h2>
              <p>
                TuBarrio.pe permite a emprendedores, negocios y profesionales aparecer en nuestro directorio digital mediante una
                suscripción mensual. Las páginas personalizadas (landing pages) permiten exhibir productos, servicios y datos de contacto.
              </p>
              <p>
                Nos enfocamos en visibilizar negocios de la zona a través de medios digitales como subdominios, QR impresos y redes sociales.
              </p>

              <h2>3. Suscripciones y Pagos</h2>
              <p>
                Para publicar en TuBarrio.pe se requiere una membresía mensual, desde S/ 15. Esta membresía incluye presencia en el portal,
                una landing page con subdominio personalizado y promoción básica en redes locales.
              </p>
              <p>
                El pago se realiza por adelantado. En caso de no recibir el pago en un plazo máximo de 7 días tras el vencimiento, la publicación
                será suspendida temporalmente. No se realizan reembolsos por periodos ya facturados.
              </p>

              <h2>4. Contenido proporcionado por el Cliente</h2>
              <p>
                Los clientes son responsables de la información enviada para su publicación, incluyendo textos, imágenes, precios y promociones.
                Al enviarla, nos autorizan a mostrarla en su landing page, en redes sociales, y en otros medios de promoción relacionados con TuBarrio.pe.
              </p>
              <p>
                No se aceptará contenido ofensivo, engañoso, ilegal o que infrinja derechos de terceros.
              </p>

              <h2>5. Propiedad Intelectual</h2>
              <p>
                Todo el contenido original de la plataforma, el diseño web y las funcionalidades desarrolladas por TuBarrio.pe son propiedad
                intelectual de la empresa. Queda prohibida su copia o uso sin autorización expresa.
              </p>

              <h2>6. Enlaces a Otros Sitios</h2>
              <p>
                Algunas landing pages o publicaciones pueden contener enlaces externos provistos por los clientes. TuBarrio.pe no se responsabiliza
                por el contenido ni la legalidad de dichos enlaces ni por daños derivados de su uso.
              </p>

              <h2>7. Terminación del Servicio</h2>
              <p>
                Nos reservamos el derecho de suspender o cancelar el servicio de un cliente en caso de incumplimiento de estos términos, falta de pago
                reiterada, o por el uso indebido de nuestra plataforma.
              </p>

              <h2>8. Limitación de Responsabilidad</h2>
              <p>
                TuBarrio.pe no garantiza ventas ni resultados específicos para los negocios publicados. No nos hacemos responsables por pérdidas comerciales,
                daños indirectos o interrupciones de servicio fuera de nuestro control.
              </p>

              <h2>9. Cambios a los Términos</h2>
              <p>
                Podemos actualizar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigencia a partir de su publicación
                en esta página. Se recomienda revisar esta sección periódicamente.
              </p>

              <h2>10. Contacto</h2>
              <p>Si tienes alguna duda o consulta relacionada con estos términos, contáctanos:</p>
              <ul>
                <li>Email: info@tubarrio.pe</li>
                <li>Teléfono: +51 906 684 284</li>
                <li>Dirección: Lima, Perú</li>
              </ul>

              <h2>11. Aceptación</h2>
              <p>
                Al contratar nuestros servicios o mantener una publicación activa en TuBarrio.pe, usted confirma que ha leído,
                entendido y aceptado estos Términos y Condiciones.
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
