const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const extractedDir = path.join(__dirname, 'extracted_temp');
const logFile = path.join(__dirname, 'ocr_output_earlier.txt');

function writeLog(text) {
  fs.appendFileSync(logFile, text + '\n');
  console.log(text);
}

async function run() {
  if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
  
  writeLog('=== OCR BACKGROUND SCANNING EARLIER PAGES ===');
  const worker = await createWorker('chi_sim');
  writeLog('Tesseract Worker load success. Scanning pages 6 to 30...');

  for (let p = 6; p <= 30; p++) {
    // skip page 10, 15, 20 which we already scanned in test
    if (p === 10 || p === 15 || p === 20) continue;
    
    const file = fs.readdirSync(extractedDir).find(f => f.startsWith(`page-${p}-`));
    if (!file) continue;
    
    const filePath = path.join(extractedDir, file);
    try {
      const { data: { text } } = await worker.recognize(filePath);
      const cleanText = text.replace(/\s+/g, ' ').trim();
      writeLog(`PAGE ${p} | FILE: ${file} | TEXT: "${cleanText.substring(0, 300)}"`);
    } catch (err) {
      writeLog(`PAGE ${p} | FAILED: ${err.message}`);
    }
  }

  await worker.terminate();
  writeLog('=== OCR EARLIER SCANNING COMPLETED ===');
}

run().catch(e => {
  fs.appendFileSync(logFile, 'Error: ' + e.message + '\n');
});
