const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const extractedDir = path.join(__dirname, 'extracted_temp');
const logFile = path.join(__dirname, 'ocr_output_middle.txt');

function writeLog(text) {
  fs.appendFileSync(logFile, text + '\n');
  console.log(text);
}

async function run() {
  if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
  
  writeLog('=== OCR MIDDLE PAGES ===');
  const worker = await createWorker('chi_sim');
  writeLog('Tesseract Worker load success. Scanning middle pages...');

  const pages = [31, 32, 33, 34, 36, 39];
  for (const p of pages) {
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
  writeLog('=== OCR MIDDLE SCANNING COMPLETED ===');
}

run().catch(e => {
  fs.appendFileSync(logFile, 'Error: ' + e.message + '\n');
});
