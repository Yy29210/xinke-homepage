const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const existingDir = path.join(__dirname, 'public', '临海');
const extractedDir = path.join(__dirname, 'extracted_temp');

const existingFiles = [
  '临海市设备管理驾驶舱.png',
  '耗材监管平台.png',
  '内控监管平台.png',
  '人员监管平台.png'
];

async function getStats(filePath) {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const buffer = await image
    .resize(1, 1, { fit: 'fill' })
    .raw()
    .toBuffer();
    
  return {
    width: metadata.width,
    height: metadata.height,
    r: buffer[0],
    g: buffer[1],
    b: buffer[2]
  };
}

async function run() {
  console.log('--- EXISTING HEALTHCARE IMAGES STATS ---');
  for (const f of existingFiles) {
    try {
      const fullPath = path.join(existingDir, f);
      const stats = await getStats(fullPath);
      const hex = '#' + ((1 << 24) + (stats.r << 16) + (stats.g << 8) + stats.b).toString(16).slice(1);
      console.log(`${f}: ${stats.width}x${stats.height} | AvgColor: ${hex} (R:${stats.r}, G:${stats.g}, B:${stats.b})`);
    } catch (e) {
      console.log(`${f}: error - ${e.message}`);
    }
  }
}

run();
