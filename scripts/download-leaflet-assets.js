const fs = require('fs');
const path = require('path');
const https = require('https');

// Create the leaflet directory if it doesn't exist
const leafletDir = path.join(__dirname, '..', 'public', 'images', 'leaflet');
if (!fs.existsSync(leafletDir)) {
  fs.mkdirSync(leafletDir, { recursive: true });
  console.log(`Created directory: ${leafletDir}`);
}

// List of Leaflet marker assets to download
const assets = [
  {
    url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x.png',
    filename: 'marker-icon-2x.png'
  },
  {
    url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon.png',
    filename: 'marker-icon.png'
  },
  {
    url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
    filename: 'marker-shadow.png'
  }
];

// Function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      console.error(`Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

// Download all assets
async function downloadAllAssets() {
  try {
    for (const asset of assets) {
      const filepath = path.join(leafletDir, asset.filename);
      await downloadFile(asset.url, filepath);
    }
    console.log('All Leaflet assets downloaded successfully!');
  } catch (error) {
    console.error('Error downloading Leaflet assets:', error);
    process.exit(1);
  }
}

// Run the download
downloadAllAssets();
