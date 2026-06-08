const { getDocument } = require('pdfjs-dist');
const path = require('path');

const pdfPath = path.join(__dirname, 'public', 'portfolio.pdf');

async function run() {
  console.log('Dumping text of first 10 pages...');
  const doc = await getDocument(pdfPath).promise;
  const pageCount = doc._pdfInfo.numPages;

  for (let p = 1; p <= Math.min(pageCount, 10); p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    console.log(`Page ${p} has ${content.items.length} items. Content: "${pageText.substring(0, 150)}"`);
  }
}

run().catch(e => console.error(e));
