// src/mocks/featuredBanners.ts

export const featuredBanners = [
  {
    id: "banner-verano",
    title: "¡Ofertas de Verano!",
    subtitle: "Hasta 50% de descuento en restaurantes y lavanderías de tu barrio.",
    image: {
      desktop: "/images/superburger_desktop.png",  // 1200x300px
      mobile: "/images/superburger_movil.gif"      // 800x400px - Nota: el archivo tiene un espacio en el nombre
    },
    buttonText: "Ver ofertas →",
    buttonLink: "/ofertas/verano",
  },
  {
    id: "banner-inmuebles",
    title: "🏠 Nueva sección: Inmuebles",
    subtitle: "Alquileres y ventas de departamentos en tu zona. ¡Descúbrelos!",
    image: {
      desktop: "/images/tubarrio_desktop.png",
      mobile: "/images/tubarrio_movil.png"
    },
    buttonText: "Explorar inmuebles →",
    buttonLink: "/inmuebles",
  },
  {
    id: "banner-negocios",
    title: "¿Eres un negocio local?",
    subtitle: "Registra tu negocio GRATIS y llega a cientos de clientes en tu barrio.",
    image: {
      desktop: "/images/creciendodigital_desktop.png",
      mobile: "/images/creciendodigital_movil.png"
    },
    buttonText: "Registrar negocio →",
    buttonLink: "/registro-negocio",
  },
];