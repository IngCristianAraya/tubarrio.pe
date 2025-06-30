import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ServicesProvider } from "@/context/ServicesContext";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Metadatos globales de la aplicación
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://revistapando.com'),
  title: "Revista Pando - Descubre todos los servicios de tu zona",
  description: "Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en Lima Este. La revista digital que conecta negocios y clientes en tu barrio.",
  keywords: "revista digital, negocios locales, Lima Este, Pando, restaurantes, servicios, directorio comercial, emprendimientos",
  openGraph: {
    title: "Revista Pando - Descubre todos los servicios de tu zona",
    description: "Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en Lima Este.",
    url: "https://revistapando.com",
    siteName: "Revista Pando",
    images: [
      {
        url: "/images/hero_3.webp",
        width: 1200,
        height: 630,
        alt: "Revista Pando"
      }
    ],
    locale: "es_PE",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Revista Pando - Descubre todos los servicios de tu zona",
    description: "Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en Lima Este.",
    images: ["/images/hero_3.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${geist.variable} antialiased min-h-screen bg-white`}>
        <ServicesProvider>
          {children}
        </ServicesProvider>
      </body>
    </html>
  );
}
