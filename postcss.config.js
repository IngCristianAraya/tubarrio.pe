module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/nesting': require('@tailwindcss/nesting')(require('postcss-nested')),
    tailwindcss: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    autoprefixer: {},
  },
}