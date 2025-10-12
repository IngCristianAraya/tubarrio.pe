import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import axios from 'axios';
import { SITE_URL } from '../src/lib/constants';

const exec = promisify(execCallback);

// List of important pages to test
const PAGES_TO_TEST = [
  '/',
  '/servicios',
  '/politica-privacidad',
  '/terminos-condiciones',
  // Add more pages as needed
];

// Test if the server is running
async function isServerRunning() {
  try {
    const { stdout } = await exec('netstat -ano | findstr :3000');
    return stdout.includes('LISTENING');
  } catch (error) {
    return false;
  }
}

// Test if a URL returns a 200 status code
async function testUrl(url: string) {
  try {
    const response = await axios.get(url, { validateStatus: () => true });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Check if a URL has the required meta tags
async function checkMetaTags(url: string) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    
    const requiredTags = [
      'title',
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:image"]',
      'meta[property="og:url"]',
      'meta[property="og:type"]',
      'meta[name="twitter:card"]',
      'link[rel="canonical"]',
      'script[type="application/ld+json"]',
    ];

    const missingTags = [];
    for (const tag of requiredTags) {
      if (!html.includes(tag)) {
        missingTags.push(tag);
      }
    }

    return {
      success: missingTags.length === 0,
      missingTags,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Main function to run all tests
async function runTests() {
  console.log('🚀 Starting SEO validation tests...\n');
  
  // Check if server is running
  console.log('🔍 Checking if the development server is running...');
  const isRunning = await isServerRunning();
  
  if (!isRunning) {
    console.error('❌ Error: Development server is not running. Please start it with `npm run dev`');
    process.exit(1);
  }
  
  console.log('✅ Development server is running\n');
  
  // Test each page
  for (const page of PAGES_TO_TEST) {
    const url = `${SITE_URL}${page}`;
    console.log(`\n📄 Testing page: ${url}`);
    
    // Test if URL is accessible
    const isAccessible = await testUrl(url);
    if (!isAccessible) {
      console.error(`❌ Error: Could not access ${url}`);
      continue;
    }
    
    console.log(`✅ Page is accessible`);
    
    // Check meta tags
    console.log('🔍 Checking meta tags...');
    const metaResult = await checkMetaTags(url);
    
    if (metaResult.success) {
      console.log('✅ All required meta tags are present');
    } else if (metaResult.missingTags) {
      console.error(`❌ Missing required meta tags: ${metaResult.missingTags.join(', ')}`);
    } else {
      console.error(`❌ Error checking meta tags: ${metaResult.error}`);
    }
    
    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✨ SEO validation tests completed!');
}

// Run the tests
runTests().catch(console.error);
