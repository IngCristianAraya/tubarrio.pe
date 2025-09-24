/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Configuración de rendimiento
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  generateBuildId: () => 'build',
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  swcMinify: true,
  
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.firebaseio.com *.firebase.com *.gstatic.com *.google.com *.google-analytics.com *.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
      "img-src 'self' data: blob: https: *.googleapis.com *.google.com *.gstatic.com *.firebaseio.com *.firebase.com *.google-analytics.com *.googletagmanager.com *.pexels.com images.pexels.com *.unsplash.com images.unsplash.com *.pixabay.com cdn.pixabay.com *.cloudinary.com res.cloudinary.com *.tile.openstreetmap.org",
      "font-src 'self' data: *.gstatic.com *.googleapis.com",
      "connect-src 'self' http://localhost:* ws://localhost:* https://*.googleapis.com wss://*.firebaseio.com https://*.firebaseio.com https://*.firebase.com https://*.firestore.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.google-analytics.com https://*.analytics.google.com",
      "frame-src 'self' *.google.com *.googleapis.com *.firebaseapp.com *.firebase.com",
      "media-src 'self' data: blob: *.googleapis.com https:",
      "worker-src 'self' blob:",
      "form-action 'self'"
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ];
  },
  // Configuración optimizada de imágenes
  images: {
    // Formatos modernos con prioridad AVIF
    formats: ['image/avif', 'image/webp'],
    // Patrones de dominios remotos permitidos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [375, 480, 640, 750, 828, 1080, 1200, 1920],
    // Tamaños de imágenes para diferentes breakpoints
    imageSizes: [64, 96, 128, 256, 384],
    // Tiempo de caché extendido (1 semana)
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Desactivar en desarrollo para mejor rendimiento
    disableStaticImages: process.env.NODE_ENV === 'development',
    // Dominios permitidos para optimización de imágenes
    domains: [
      'localhost',
      'vercel.app',
      'tubarrio.vercel.app',
      'firebasestorage.googleapis.com',
      '*.googleapis.com',
      '*.google.com',
      '*.gstatic.com',
      '*.pexels.com',
      'images.pexels.com',
      '*.unsplash.com',
      'images.unsplash.com',
      '*.pixabay.com',
      'cdn.pixabay.com',
      'res.cloudinary.com'
    ],
    // Patrones remotos para imágenes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.google.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.pexels.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.pixabay.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'tile.openstreetmap.org',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.tile.openstreetmap.org',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'unpkg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Permitir SVGs con precaución
    dangerouslyAllowSVG: true,
    // Configuración de Content Security Policy
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.firebaseio.com *.firebase.com *.gstatic.com *.google.com *.google-analytics.com *.googletagmanager.com; style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com; img-src 'self' data: blob: https: *.googleapis.com *.google.com *.gstatic.com *.firebaseio.com *.firebase.com *.google-analytics.com *.googletagmanager.com *.pexels.com images.pexels.com *.unsplash.com images.unsplash.com *.pixabay.com cdn.pixabay.com *.cloudinary.com res.cloudinary.com *.tile.openstreetmap.org; font-src 'self' data: *.gstatic.com *.googleapis.com; connect-src 'self' http://localhost:* ws://localhost:* https://*.googleapis.com wss://*.firebaseio.com https://*.firebaseio.com https://*.firebase.com https://*.firestore.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.google-analytics.com https://*.analytics.google.com; frame-src 'self' *.google.com *.googleapis.com *.firebaseapp.com *.firebase.com; media-src 'self' data: blob: *.googleapis.com https:; worker-src 'self' blob:; form-action 'self';",
  },
  // Configuración avanzada de Webpack para optimización
  webpack: (config, { isServer, dev, webpack }) => {
    // Configuración para manejar módulos de Node.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
        zlib: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        url: require.resolve('url/'),
        string_decoder: require.resolve('string_decoder/')
      };
    }
    // Solo en producción
    if (!dev) {
      // Habilitar tree shaking
      config.optimization.usedExports = true;
      
      // Configurar split chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        cacheGroups: {
          default: false,
          vendors: false,
          // Agrupar módulos de node_modules
          vendor: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },
          // Agrupar código compartido
          common: {
            name: 'common',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    // Resolver el problema con undici
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: require.resolve('undici')
    };

    // Configuración para manejar módulos nativos
    config.experiments = {
      ...config.experiments,
      layers: true,
    };

    // Excluir la versión problemática de undici
    config.module.rules.push({
      test: /node_modules[\\/]undici[\\/]lib[\\/]web[\\/]fetch[\\/]util\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: '!(#target in this)',
        replace: '!(this && this[\'#target\'] !== undefined)',
        flags: 'g'
      }
    });

    // Configuración de alias para rutas absolutas
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@/lib': require('path').resolve(__dirname, 'src/lib'),
      '@/components': require('path').resolve(__dirname, 'src/components'),
      '@/hooks': require('path').resolve(__dirname, 'src/hooks'),
      '@/types': require('path').resolve(__dirname, 'src/types'),
    };

    // Deshabilitar caché de chunks
    config.cache = false;
    
    // Configuración para manejar mejor los errores de chunks
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true,
        },
        lib: {
          test(module) {
            return module.size() > 160000;
          },
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )?.[1];
            return packageName ? `lib-${packageName.replace('@', '')}` : null;
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        commons: {
          name: 'commons',
          minChunks: 3,
          priority: 20,
        },
      },
    };
    
    // Asegurar que los chunks tén nombres deterministas
    config.optimization.chunkIds = 'named';
    
    // Mejorar el manejo de errores
    config.stats = 'minimal';
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
      };
    }

    // Add support for .geojson files
    config.module.rules.push({
      test: /\.geojson$/,
      use: ['json-loader']
    });

    // Fix for Leaflet marker icons in production
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Remove any existing worker loaders for mapbox
    config.module.rules = config.module.rules.filter(
      rule => !(rule.test && rule.test.toString().includes('worker'))
    );

    // Add worker-loader for any remaining worker files
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { 
        loader: 'worker-loader',
        options: { 
          publicPath: '/_next/',
          inline: true,
          name: 'static/[hash].worker.js'
        }
      }
    });

    return config;
  },
  // Configuración de TypeScript
  typescript: {
    // Habilitar comprobación de tipos en modo producción
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Excluir scripts de prueba de la compilación
  webpack: (config, { isServer }) => {
    // Ignorar archivos .test.ts y .test.tsx
    config.module.rules.push({
      test: /\.test\.(ts|tsx)$/,
      loader: 'ignore-loader'
    });
    
    // Ignorar la carpeta scripts en producción
    if (!isServer && process.env.NODE_ENV === 'production') {
      config.module.rules.push({
        test: /\/scripts\/.*\.ts$/,
        loader: 'ignore-loader'
      });
    }
    
    return config;
  },
  
  // Configuración de modularizeImports
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Optimización de CSS
    optimizeCss: true,
    // Mejorar el rendimiento de la compilación
    // Nota: serverActions ya está habilitado por defecto en Next.js 14
    // modularizeImports se ha movido a la raíz de la configuración
    // Se ha eliminado la configuración redundante
    // Se mantiene solo la configuración estable y compatible
  },
};

// Aplicar el analizador de paquetes si está habilitado
module.exports = process.env.ANALYZE === 'true' 
  ? withBundleAnalyzer(nextConfig) 
  : nextConfig;
