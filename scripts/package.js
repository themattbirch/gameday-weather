const fs = require('fs-extra');
const path = require('path');

const DIST_DIR = 'gameday-weather';

async function packageExtension() {
  try {
    // Create dist directory if it doesn't exist
    await fs.ensureDir(DIST_DIR);

    // Copy manifest
    await fs.copy('./public/manifest.json', path.join(DIST_DIR, 'manifest.json'));

    // Copy HTML files
    await fs.copy("./public/index.html", path.join(DIST_DIR, "popup.html"));

    // Copy styles.css
    await fs.copy('./src/styles.css', path.join(DIST_DIR, 'styles.css'));

    // Copy scripts
    await fs.copy('background.js', path.join(DIST_DIR, 'background.js'));
    await fs.copy('popup.js', path.join(DIST_DIR, 'popup.js'));
    await fs.copy('offlineDetection.js', path.join(DIST_DIR, 'offlineDetection.js')); // Existing script

    // Copy data directory
    await fs.copy('./src/data', path.join(DIST_DIR, 'data'));

    // Copy icons
    await fs.copy('./public/icons', path.join(DIST_DIR, 'icons'));

    console.log('Extension packaged successfully in:', DIST_DIR);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Could not find file ${error.path}`);
    } else {
      console.error('Error packaging extension:', error);
    }
  }
}

packageExtension().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
