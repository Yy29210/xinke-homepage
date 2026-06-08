const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const extractedDir = path.join(__dirname, 'extracted_temp');

async function run() {
  console.log('Initializing Tesseract worker for Simplified Chinese...');
  
  // Create worker
  const worker = await createWorker('chi_sim');
  console.log('Worker loaded successfully. Scanning pages...');

  const pagesToScan = [1, 2, 3, 4, 5, 10, 15, 20, 30, 35, 37, 38, 40, 50, 60];
  
  for (const p of pagesToScan) {
    const file = fs.readdirSync(extractedDir).find(f => f.startsWith(`page-${p}-`));
    if (!file) continue;
    
    const filePath = path.join(extractedDir, file);
    process.stdout.write(`Scanning Page ${p} (${file})... `);
    
    try {
      const { data: { text } } = await worker.recognize(filePath);
      const cleanText = text.replace(/\s+/g, ' ').trim();
      console.log(`\n  Text found: "${cleanText.substring(0, 200)}"\n`);
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }

  await worker.terminate();
  console.log('OCR scan finished.');
}

run().catch(e => console.error('OCR Global Error:', e));
