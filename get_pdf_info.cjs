const { getDocument } = require('pdfjs-dist');
const path = require('path');
const fs = require('fs');

const pdfPath = path.join(__dirname, 'public', 'portfolio.pdf');

async function run() {
  const doc = await getDocument(pdfPath).promise;
  console.log(`Total Pages in portfolio.pdf: ${doc._pdfInfo.numPages}`);
  
  const files = fs.readdirSync(path.join(__dirname, 'extracted_temp'))
    .filter(f => f.endsWith('.png'));
  console.log(`Successfully Extracted PNG files count in extracted_temp: ${files.length}`);
}

run().catch(e => console.error(e));
