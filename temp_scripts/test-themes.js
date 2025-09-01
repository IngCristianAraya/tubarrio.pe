const { ThemeProvider } = require('next-themes');

console.log('next-themes version:', require('next-themes/package.json').version);
console.log('ThemeProvider:', ThemeProvider ? 'Found' : 'Not found');
