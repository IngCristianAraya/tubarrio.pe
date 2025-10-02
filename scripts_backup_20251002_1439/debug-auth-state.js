// Script para debuggear el estado del AuthContext
const puppeteer = require('puppeteer');

async function debugAuthState() {
  console.log('🔍 Iniciando debug del estado de autenticación...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Interceptar logs de consola
    page.on('console', msg => {
      console.log(`🖥️  BROWSER LOG [${msg.type()}]:`, msg.text());
    });
    
    // Interceptar errores
    page.on('pageerror', error => {
      console.log('❌ PAGE ERROR:', error.message);
    });
    
    // Interceptar requests
    page.on('request', request => {
      if (request.url().includes('admin')) {
        console.log(`📡 REQUEST: ${request.method()} ${request.url()}`);
      }
    });
    
    // Interceptar responses
    page.on('response', response => {
      if (response.url().includes('admin')) {
        console.log(`📨 RESPONSE: ${response.status()} ${response.url()}`);
      }
    });
    
    console.log('\n🌐 Navegando a localhost:3000/admin...');
    await page.goto('http://localhost:3000/admin', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Esperar un poco para que React se inicialice
    await page.waitForTimeout(3000);
    
    // Verificar el estado del AuthContext
    const authState = await page.evaluate(() => {
      // Intentar acceder al estado del contexto
      const authElements = document.querySelectorAll('[data-testid], [class*="auth"], [class*="login"]');
      const currentUrl = window.location.href;
      const title = document.title;
      const bodyContent = document.body.innerText.substring(0, 500);
      
      return {
        currentUrl,
        title,
        bodyContent,
        authElementsCount: authElements.length,
        hasLoadingSpinner: document.querySelector('.animate-spin') !== null,
        hasLoginForm: document.querySelector('form') !== null,
        hasErrorMessage: document.querySelector('[class*="error"], [class*="alert"]') !== null
      };
    });
    
    console.log('\n📊 Estado actual de la página:');
    console.log('URL actual:', authState.currentUrl);
    console.log('Título:', authState.title);
    console.log('Tiene spinner de carga:', authState.hasLoadingSpinner);
    console.log('Tiene formulario de login:', authState.hasLoginForm);
    console.log('Tiene mensaje de error:', authState.hasErrorMessage);
    console.log('Elementos relacionados con auth:', authState.authElementsCount);
    console.log('\nContenido del body (primeros 500 chars):');
    console.log(authState.bodyContent);
    
    // Verificar si hay redirección
    console.log('\n⏳ Esperando posible redirección...');
    await page.waitForTimeout(5000);
    
    const finalState = await page.evaluate(() => {
      return {
        currentUrl: window.location.href,
        title: document.title
      };
    });
    
    if (finalState.currentUrl !== authState.currentUrl) {
      console.log('🔄 REDIRECCIÓN DETECTADA:');
      console.log('URL inicial:', authState.currentUrl);
      console.log('URL final:', finalState.currentUrl);
    } else {
      console.log('⚠️  NO SE DETECTÓ REDIRECCIÓN');
    }
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug-admin-page.png', fullPage: true });
    console.log('\n📸 Screenshot guardado como debug-admin-page.png');
    
    console.log('\n✅ Debug completado. Presiona Enter para cerrar el navegador...');
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error);
  } finally {
    await browser.close();
  }
}

debugAuthState().catch(console.error);