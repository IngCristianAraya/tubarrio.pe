const config = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}

// Only add postcss-import if not processing node_modules
if (!process.env['npm_package_name']?.includes('node_modules')) {
  config.plugins = {
    'postcss-import': {},
    ...config.plugins
  };
}

export default config;;
