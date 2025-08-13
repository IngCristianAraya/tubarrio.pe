import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ServicesProvider } from "@/context/ServicesContext";
import { SuppressHydrationWarning } from "@/components/SuppressHydrationWarning";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Metadatos globales de la aplicación
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://tubarrio.pe'),
  title: "Tubarrio.pe - Descubre todos los servicios de tu zona",
  description: "Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio. La plataforma que conecta negocios y clientes en tu comunidad.",
  keywords: "directorio comercial, negocios locales, servicios, restaurantes, abarrotes, lavanderías, panaderías, emprendimientos, tu barrio",
  openGraph: {
    title: "Tubarrio.pe - Descubre todos los servicios de tu zona",
    description: "Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio.",
    url: "https://tubarrio.pe",
    siteName: "Tubarrio.pe",
    images: [
      {
        url: "/images/hero_3.webp",
        width: 1200,
        height: 630,
        alt: "Tubarrio.pe - Servicios en tu barrio"
      }
    ],
    locale: "es_PE",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tubarrio.pe - Descubre todos los servicios de tu zona",
    description: "Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio.",
    images: ["/images/hero_3.webp"],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, orientation=portrait" />
        <link rel="manifest" href="/manifest.json" />
        {/* Prevenir inyección de estilos por extensiones */}
        <meta name="theme-color" content="#ffffff" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              -webkit-tap-highlight-color: transparent;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            /* Prevenir inyección de estilos por extensiones */
            [data-windsurf-page-id],
            [data-windsurf-extension-id] {
              all: unset !important;
            }
          `
        }} />
      </head>
      <body className={`${geist.variable} antialiased min-h-screen bg-white`} suppressHydrationWarning>
        <ServicesProvider>
          <SuppressHydrationWarning>
            {children}
          </SuppressHydrationWarning>
        </ServicesProvider>
      </body>
    </html>
  );
}
