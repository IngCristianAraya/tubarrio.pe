// Configuración para sharp en diferentes entornos
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // Habilitar solo en producción para desarrollo local más rápido
  sharp: isProduction ? {
    // Configuración para producción
    avif: {
      quality: 70,
    },
    webp: {
      quality: 75,
    },
    png: {
      quality: 70,
      compressionLevel: 9,
    },
    jpeg: {
      quality: 80,
      mozjpeg: true,
    },
  } : undefined
};
