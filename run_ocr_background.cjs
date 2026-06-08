const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const extractedDir = path.join(__dirname, 'extracted_temp');
const logFile = path.join(__dirname, 'ocr_output.txt');

function writeLog(text) {
  fs.appendFileSync(logFile, text + '\n');
  console.log(text);
}

async function run() {
  if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
  
  writeLog('=== OCR BACKGROUND SCANNING STARTED ===');
  
  const worker = await createWorker('chi_sim');
  writeLog('Tesseract Worker load success. Scanning pages 41 to 64...');

  const files = fs.readdirSync(extractedDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/page-(\d+)/)[1]);
      const numB = parseInt(b.match(/page-(\d+)/)[1]);
      return numA - numB;
    });

  for (const file of files) {
    const pageNum = parseInt(file.match(/page-(\d+)/)[1]);
    if (pageNum < 41 || pageNum > 64) continue;
    
    const filePath = path.join(extractedDir, file);
    try {
      const { data: { text } } = await worker.recognize(filePath);
      const cleanText = text.replace(/\s+/g, ' ').trim();
      writeLog(`PAGE ${pageNum} | FILE: ${file} | TEXT: "${cleanText.substring(0, 300)}"`);
    } catch (err) {
      writeLog(`PAGE ${pageNum} | FAILED: ${err.message}`);
    }
  }

  await worker.terminate();
  writeLog('=== OCR BACKGROUND SCANNING COMPLETED ===');
}

run().catch(e => {
  fs.appendFileSync(logFile, 'Error: ' + e.message + '\n');
});
