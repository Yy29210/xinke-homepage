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

async function getNormalizedBuffer(filePath) {
  return await sharp(filePath)
    .resize(128, 128, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();
}

function calculateMSE(buf1, buf2) {
  let sum = 0;
  for (let i = 0; i < buf1.length; i++) {
    sum += Math.pow(buf1[i] - buf2[i], 2);
  }
  return sum / buf1.length;
}

async function run() {
  const existingBuffers = {};
  for (const f of existingFiles) {
    const p = path.join(existingDir, f);
    if (fs.existsSync(p)) {
      existingBuffers[f] = await getNormalizedBuffer(p);
    }
  }

  const extractedFiles = fs.readdirSync(extractedDir)
    .filter(f => f.endsWith('.png'));

  for (const [existName, existBuf] of Object.entries(existingBuffers)) {
    console.log(`\n--- Top 5 Candidates for [${existName}] ---`);
    const list = [];
    
    for (const extFile of extractedFiles) {
      const extPath = path.join(extractedDir, extFile);
      try {
        const extBuf = await getNormalizedBuffer(extPath);
        const mse = calculateMSE(existBuf, extBuf);
        const similarity = (1 - mse / 65025) * 100;
        list.push({ file: extFile, similarity, mse });
      } catch (e) {}
    }
    
    list.sort((a, b) => b.similarity - a.similarity);
    
    list.slice(0, 5).forEach((item, index) => {
      console.log(`  ${index + 1}. File: ${item.file} | Sim: ${item.similarity.toFixed(4)}% | MSE: ${item.mse.toFixed(2)}`);
    });
  }
}

run().catch(e => console.error(e));
