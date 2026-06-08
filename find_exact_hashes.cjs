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
  // Resize to 128x128, convert to grayscale, and get raw bytes
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
  console.log('Pre-loading normalized buffers for existing images...');
  const existingBuffers = {};
  for (const f of existingFiles) {
    const p = path.join(existingDir, f);
    if (fs.existsSync(p)) {
      existingBuffers[f] = await getNormalizedBuffer(p);
    }
  }

  const extractedFiles = fs.readdirSync(extractedDir)
    .filter(f => f.endsWith('.png'));

  console.log(`Comparing against ${extractedFiles.length} extracted raw image streams...`);
  const bestMatches = {};

  for (const extFile of extractedFiles) {
    const extPath = path.join(extractedDir, extFile);
    try {
      const extBuf = await getNormalizedBuffer(extPath);
      
      for (const [existName, existBuf] of Object.entries(existingBuffers)) {
        const mse = calculateMSE(existBuf, extBuf);
        // Normalize MSE to a 0-100 score where 0 MSE is 100% match
        // Max possible MSE is 255*255 = 65025
        const similarity = (1 - mse / 65025) * 100;
        
        if (!bestMatches[existName] || similarity > bestMatches[existName].similarity) {
          bestMatches[existName] = { file: extFile, similarity, mse };
        }
      }
    } catch (e) {
      // Ignore reading errors on corrupt streams
    }
  }

  console.log('\n--- ACCURATE MATCHING RESULTS (MSE BASED) ---');
  for (const [existName, match] of Object.entries(bestMatches)) {
    console.log(`Existing: [${existName}] -> Best PDF Page File: [${match.file}] | Similarity Score: [${match.similarity.toFixed(4)}%] (MSE: ${match.mse.toFixed(2)})`);
  }
}

run().catch(e => console.error(e));
