/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.firebaseio.com *.firebase.com *.gstatic.com *.google.com *.google-analytics.com *.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
      "img-src 'self' data: blob: *.googleapis.com *.google.com *.gstatic.com *.firebaseio.com *.firebase.com *.google-analytics.com *.googletagmanager.com *.pexels.com images.pexels.com *.unsplash.com images.unsplash.com *.pixabay.com cdn.pixabay.com",
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
            key: 'Content-Security-Policy-Report-Only',
            value: csp,
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
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
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'], // Usar formatos modernos pero con alta calidad
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config, { isServer, dev }) => {
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
      },
    });

    return config;
  },
  // TypeScript configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizeCss: false,
  },
};

module.exports = nextConfig;
