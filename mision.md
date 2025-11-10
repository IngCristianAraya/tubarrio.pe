📄 Documento Estratégico: Expansión Internacional de tubarrio.pe
Versión: 1.0 – Noviembre 2025
Propietario: Christian Araya

🎯 1. Visión del Modelo de Negocio
Crear una red global de directorios locales de servicios, replicando tubarrio.pe en múltiples países mediante socios locales (no técnicos), mientras se mantiene un backend centralizado, control técnico total y ingresos recurrentes.

Cada socio:

Opera con su propia marca y dominio
Se enfoca en ventas y atención al cliente
Paga una licencia inicial + fee mensual por cliente activo
Tú (Christian):

Mantienes el código, infraestructura y panel de administración
Recibes ingresos pasivos
Conservas la operación en Perú
💼 2. Estructura Comercial
✅ Opción de venta por país
Pago inicial: $299 USD (una sola vez)
Incluye:
Código fuente listo para desplegar
Panel de administración (Python)
Guía de despliegue paso a paso
Soporte inicial de 2 horas
Fee mensual recurrente: $2 USD por cliente activo
Máximo recomendado: 100 clientes por país → $200/mes
“Cliente activo” = negocio publicado y renovado mensualmente
💰 Ejemplo de rentabilidad por socio
Alemania
€15 (~$16)
$2
$14
Chile
$10
$2
$8
EE.UU.
$20
$2
$18

✅ Ganancia tuya: escalable, sin riesgo, sin límite geográfico. 

🛠️ 3. Arquitectura Técnica
Stack actual → Migración recomendada
Frontend
Next.js 14 + Firebase
Next.js 14 + Supabase
Backend
Firebase Firestore
Supabase (PostgreSQL)
Hosting
Vercel
Vercel Pro ($20/mes)
Base de datos
Firebase
Supabase Pro ($25/mes)
Panel admin
Python + scripts
Mismo panel, adaptado a Supabase
Dominios
tubarrio.pe
Cada socio compra su dominio
(ej.
meinviertel.de
)

🔑 Características clave del nuevo modelo
Una sola cuenta de Supabase (la tuya)
Tabla services con campo country (pe, de, cl, us, co)
Índice en country para búsquedas instantáneas
Endpoints separados por país:
/api/de/services → solo servicios alemanes
/api/cl/services → solo servicios chilenos
Caché en Vercel (revalidate: 60) → reduce lecturas a Supabase
Panel admin centralizado → tú subes todos los clientes
✅ Capacidad técnica (con planes Pro)
Hasta 100,000+ servicios sin problemas de rendimiento
Más de 10 millones de lecturas/mes en Supabase Pro
Carga rápida en todo el mundo gracias a Edge Network de Vercel
📦 4. Flujo Operativo con un Socio (Ej. Alemania)
Socio paga $299 USD → vía Wise o PayPal
Compras dominio: meinviertel.de (él paga ~$12/año)
Tú despliegas en Vercel: proyecto tubarrio-de → apuntas dominio
Él te envía datos de nuevos clientes (WhatsApp, formulario, email)
Tú subes los datos a Supabase con country: 'de'
Cliente aparece en meinviertel.de
Cada mes, tú le envías:
“Tienes 12 clientes activos → $24. Pago vía Wise.” 
Él cobra a sus clientes y gana la diferencia
🔄 Él no toca código, tú controlas todo. 

📑 5. Aspectos Legales en Perú
✅ ¿Es legal recibir dinero del extranjero?
Sí. Se considera exportación de servicios digitales, exenta de IGV.

✅ Requisitos mínimos
Tener RUC activo
Actividad: “Servicios de desarrollo de software” o “Otros servicios informáticos”
Emitir factura de exportación
Sin IGV
En dólares (USD)
Cliente: nombre del socio extranjero + país
Concepto: “Licencia de software + administración mensual”
Declarar ingresos en SUNAT
En PDT 621 (régimen MYPE Tributario)
Tasa: 1.5% sobre ingresos brutos
Gastos deducibles: Vercel, Supabase, internet, etc.
✅ Cómo recibir el dinero
Wise (recomendado):
Cuenta con IBAN en USD/EUR
Bajas comisiones (~1–2%)
Compatible con RUC peruano
PayPal:
Más conocido, pero comisiones altas (~4%)
🔁 Retiras a tu cuenta en soles o dólares en BCP, Interbank, etc. 

✅ Documentos necesarios
Acuerdo simple por PDF (en español/inglés)
Factura de exportación mensual
Registro de ingresos para declaración anual
💡 6. Proyección Financiera (3 años)
1
3
1,000
$2,000
$24,000
2
5
2,500
$5,000
$60,000
3
8
5,000
$10,000
$120,000

💰 Costos fijos: ~$45/mes (Vercel Pro + Supabase Pro)
✅ Margen de utilidad: >95% 

🚀 7. Próximos Pasos Técnicos
Migrar de Firebase → Supabase
Crear tabla services con campo country
Añadir índice: CREATE INDEX idx_services_country ON services(country);
Actualizar Next.js para usar Supabase
Crear endpoints por país (/api/de/services, etc.)
Adaptar panel Python para Supabase
Preparar paquete de venta:
tubarrio-template.zip
GUIDE-DEPLOYMENT.md
LICENSE-WHITE-LABEL.txt
Abrir cuenta Wise y preparar plantilla de factura
📎 Anexos (disponibles a solicitud)
Plantilla de factura de exportación en USD
Contrato simple de licencia por país
Guía de despliegue en Vercel + Supabase
Script de migración Firebase → Supabase
✍️ Este documento es tu hoja de ruta para escalar internacionalmente, operar legalmente y construir un negocio sostenible desde Perú. 