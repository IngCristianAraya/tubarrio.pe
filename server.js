// Set up the self reference for server-side rendering
if (typeof self === 'undefined') {
  global.self = global;
}

// Import the Next.js server
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ 
  dev,
  // Disable the webpack 5 minification to avoid the self reference issue
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimize = false;
    }
    return config;
  }
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // Set the self reference for each request
    if (typeof self === 'undefined') {
      global.self = global;
    }
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
