const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Convertir funciones de fs a promesas
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

// Configuración
const config = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/optimized-images'),
  formats: ['webp'], // Agregar 'avif' si es necesario
  quality: 80,
  sizes: [
    { width: 320, suffix: 'sm' },
    { width: 640, suffix: 'md' },
    { width: 1024, suffix: 'lg' },
    { width: 1280, suffix: 'xl' },
    { width: 1920, suffix: '2xl' },
  ],
  skipExisting: true // Saltar imágenes ya optimizadas
};

// Crear directorio de salida si no existe
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Obtener todas las imágenes recursivamente
async function getImages(dir) {
  const subdirs = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    subdirs.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getImages(res) : res;
    })
  );
  return files.flat().filter(file => 
    /\.(jpg|jpeg|png|webp|avif)$/i.test(file) && 
    !file.includes('optimized-images')
  );
}

// Optimizar una imagen
async function optimizeImage(inputPath) {
  const relativePath = path.relative(config.inputDir, inputPath);
  const parsedPath = path.parse(relativePath);
  
  // Crear subdirectorios de salida
  const outputSubdir = path.join(config.outputDir, parsedPath.dir);
  await ensureDir(outputSubdir);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Generar versiones en diferentes formatos y tamaños
    for (const format of config.formats) {
      for (const size of config.sizes) {
        // No escalar imágenes más grandes que el original
        if (metadata.width && metadata.width < size.width) continue;
        
        const outputPath = path.join(
          outputSubdir,
          `${parsedPath.name}-${size.suffix}.${format}`
        );
        
        // Saltar si el archivo ya existe
        if (config.skipExisting && fs.existsSync(outputPath)) {
          console.log(`⏩ Saltando (ya existe): ${outputPath}`);
          continue;
        }
        
        // Aplicar transformaciones
        const pipeline = image.clone()
          .resize({ width: size.width })
          .toFormat(format, {
            quality: config.quality,
            effort: 6 // Nivel de compresión (0-10)
          });
        
        // Guardar imagen optimizada
        await pipeline.toFile(outputPath);
        console.log(`✅ Optimizado: ${outputPath}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error al procesar ${inputPath}:`, error);
    return false;
  }
}

// Procesar todas las imágenes
async function main() {
  console.log('🚀 Iniciando optimización de imágenes...');
  console.log(`📂 Directorio de entrada: ${config.inputDir}`);
  console.log(`📂 Directorio de salida: ${config.outputDir}`);
  
  try {
    // Asegurar directorios
    await ensureDir(config.inputDir);
    await ensureDir(config.outputDir);
    
    // Obtener y procesar imágenes
    const images = await getImages(config.inputDir);
    console.log(`🔍 Encontradas ${images.length} imágenes para optimizar`);
    
    // Procesar imágenes en paralelo (con un límite de concurrencia)
    const concurrency = 4; // Número de imágenes a procesar en paralelo
    for (let i = 0; i < images.length; i += concurrency) {
      const batch = images.slice(i, i + concurrency);
      await Promise.all(batch.map(optimizeImage));
    }
    
    console.log('✨ Proceso de optimización completado');
  } catch (error) {
    console.error('❌ Error en el proceso de optimización:', error);
    process.exit(1);
  }
}

// Ejecutar
main();