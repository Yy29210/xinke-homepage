const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const extractedDir = path.join(__dirname, 'extracted_temp');

async function run() {
  console.log('Initializing Tesseract worker for Simplified Chinese...');
  const worker = await createWorker('chi_sim');
  console.log('Worker loaded. Scanning pages 41 to 64...');

  for (let p = 41; p <= 64; p++) {
    const file = fs.readdirSync(extractedDir).find(f => f.startsWith(`page-${p}-`));
    if (!file) continue;
    
    const filePath = path.join(extractedDir, file);
    try {
      const { data: { text } } = await worker.recognize(filePath);
      const cleanText = text.replace(/\s+/g, ' ').trim();
      console.log(`Page ${p} (${file}): "${cleanText.substring(0, 300)}"`);
    } catch (err) {
      console.log(`Page ${p} failed: ${err.message}`);
    }
  }

  await worker.terminate();
  console.log('Finished.');
}

run().catch(e => console.error(e));
