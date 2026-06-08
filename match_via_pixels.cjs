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

async function computeHash(filePath) {
  // Resize to a small 16x16 grid and convert to grayscale raw bytes
  const { data } = await sharp(filePath)
    .resize(16, 16, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
}

function hammingDistance(hash1, hash2) {
  let dist = 0;
  for (let i = 0; i < hash1.length; i++) {
    const diff = Math.abs(hash1[i] - hash2[i]);
    dist += diff;
  }
  return dist;
}

async function run() {
  console.log('Computing hashes for the 4 existing images...');
  const existingHashes = {};
  for (const f of existingFiles) {
    const fullPath = path.join(existingDir, f);
    if (fs.existsSync(fullPath)) {
      existingHashes[f] = await computeHash(fullPath);
      console.log(`- Computed hash for: ${f}`);
    } else {
      console.log(`- Existing file not found: ${f}`);
    }
  }

  const extractedFiles = fs.readdirSync(extractedDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/page-(\d+)/)[1]);
      const numB = parseInt(b.match(/page-(\d+)/)[1]);
      return numA - numB;
    });

  console.log(`Comparing against ${extractedFiles.length} extracted PDF pages...`);
  const matches = {};

  for (const extFile of extractedFiles) {
    const extPath = path.join(extractedDir, extFile);
    try {
      const extHash = await computeHash(extPath);
      
      for (const [existName, existHash] of Object.entries(existingHashes)) {
        const dist = hammingDistance(existHash, extHash);
        // Normalize distance (max possible distance is 16*16*255 = 65280)
        const score = (1 - dist / 65280) * 100;
        
        if (!matches[existName] || score > matches[existName].score) {
          matches[existName] = { file: extFile, score };
        }
      }
    } catch (e) {
      // Ignore errors for some unreadable files
    }
  }

  console.log('\n--- MATCHING RESULTS ---');
  for (const [existName, match] of Object.entries(matches)) {
    console.log(`Existing: [${existName}] matches Page: [${match.file}] with Similarity: [${match.score.toFixed(2)}%]`);
  }
}

run().catch(e => console.error(e));
