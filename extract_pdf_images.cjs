const { exportImages } = require('pdf-export-images');
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, 'public', 'portfolio.pdf');
const outputDir = path.join(__dirname, 'extracted_temp');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Starting image extraction from:', pdfPath);

exportImages(pdfPath, outputDir)
  .then((images) => {
    console.log('Successfully extracted', images.length, 'images.');
    images.forEach((img, index) => {
      console.log(`Image ${index + 1}: name=${img.name}, size=${img.data.length} bytes`);
    });
  })
  .catch((err) => {
    console.error('Error during extraction:', err);
  });
