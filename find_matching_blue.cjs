const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const extractedDir = path.join(__dirname, 'extracted_temp');

async function getStats(fileName) {
  const filePath = path.join(extractedDir, fileName);
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const buffer = await image
    .resize(1, 1, { fit: 'fill' })
    .raw()
    .toBuffer();
    
  return {
    name: fileName,
    width: metadata.width,
    height: metadata.height,
    r: buffer[0],
    g: buffer[1],
    b: buffer[2]
  };
}

async function run() {
  const files = fs.readdirSync(extractedDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/page-(\d+)/)[1]);
      const numB = parseInt(b.match(/page-(\d+)/)[1]);
      return numA - numB;
    });

  console.log('--- FINDING HEALTHCARE DEEP BLUE PAGES ---');
  let count = 0;
  for (const f of files) {
    try {
      const stats = await getStats(f);
      // Target: R: ~20, G: ~50, B: ~112
      // Let's use Euclidean distance in RGB color space
      const distance = Math.sqrt(
        Math.pow(stats.r - 21, 2) +
        Math.pow(stats.g - 50, 2) +
        Math.pow(stats.b - 112, 2)
      );
      
      // If the color is within a certain distance, it represents a candidate slide!
      if (distance < 30) {
        count++;
        const hex = '#' + ((1 << 24) + (stats.r << 16) + (stats.g << 8) + stats.b).toString(16).slice(1);
        console.log(`[CANDIDATE #${count}] ${stats.name} | AvgColor: ${hex} (R:${stats.r}, G:${stats.g}, B:${stats.b}) | Dist: ${distance.toFixed(2)}`);
      }
    } catch (e) {
      // Skip
    }
  }
}

run();
