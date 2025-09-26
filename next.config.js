
    /** @type {import('next').NextConfig} */
let withBundleAnalyzer = (config) => config;

try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (e) {
  console.warn('@next/bundle-analyzer no encontrado, continuando sin él');
}

// Configuración de seguridad
const securityHeaders = [
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
    value: [
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
    ].join('; '),
  },
];

// Configuración de imágenes
const imageDomains = [
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
  'res.cloudinary.com',
  'tile.openstreetmap.org',
  'unpkg.com',
  'lh3.googleusercontent.com',
  'picsum.photos',
  'via.placeholder.com',
  'source.unsplash.com'
];

const nextConfig = {
  // Configuración básica
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  generateBuildId: () => 'build',
  productionBrowserSourceMaps: false,
  swcMinify: true,
  optimizeFonts: true,
  optimizeCss: true,

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Configuración de imágenes
  images: {
    domains: imageDomains,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    disableStaticImages: process.env.NODE_ENV === 'development',
    dangerouslyAllowSVG: true,
  },

  // Configuración de Webpack
  webpack: (config, { isServer, dev }) => {
    // Configuración de polyfills para navegadores
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
        string_decoder: require.resolve('string_decoder/'),
        path: false,
        crypto: require.resolve('crypto-browserify'),
        os: require.resolve('os-browserify/browser'),
      };
    }

    // Optimizaciones solo para producción
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        splitChunks: {
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
              test: /[\\/]node_modules[\\/]/,
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
        },
      };
    }

    // Alias para rutas absolutas
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@/lib': require('path').resolve(__dirname, 'src/lib'),
      '@/components': require('path').resolve(__dirname, 'src/components'),
      '@/hooks': require('path').resolve(__dirname, 'src/hooks'),
      '@/types': require('path').resolve(__dirname, 'src/types'),
      undici: require.resolve('undici')
    };

    // Reglas para archivos específicos
    config.module.rules.push(
      {
        test: /\.geojson$/,
        use: ['json-loader']
      },
      {
        test: /\.worker\.js$/,
        use: { 
          loader: 'worker-loader',
          options: { 
            publicPath: '/_next/',
            inline: true,
            name: 'static/[hash].worker.js'
          }
        }
      },
      {
        test: /node_modules[\\/]undici[\\/]lib[\\/]web[\\/]fetch[\\/]util\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: '!(#target in this)',
          replace: '!(this && this[\'#target\'] !== undefined)',
          flags: 'g'
        }
      }
    );

    // Ignorar archivos de prueba
    if (!isServer) {
      config.module.rules.push(
        {
          test: /\.test\.(ts|tsx)$/,
          loader: 'ignore-loader'
        },
        {
          test: /\/scripts\/.*\.ts$/,
          loader: 'ignore-loader'
        }
      );
    }

    return config;
  },

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configuración experimental
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Configuración de modularizeImports
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },
};

module.exports = process.env.ANALYZE === 'true' 
  ? withBundleAnalyzer(nextConfig) 
  : nextConfig;