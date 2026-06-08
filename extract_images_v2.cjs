const { getDocument, OPS } = require('pdfjs-dist');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const pdfPath = path.join(__dirname, 'public', 'portfolio.pdf');
const outputDir = path.join(__dirname, 'extracted_temp');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getObjectWithRetry(page, name, isCommon, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const obj = isCommon 
        ? page.commonObjs.get(name) 
        : page.objs.get(name);
      if (obj) return obj;
    } catch (e) {
      if (e.message && e.message.includes("isn't resolved yet")) {
        // Wait and retry
        await delay(200);
        continue;
      }
      throw e;
    }
    await delay(100);
  }
  throw new Error(`Object ${name} could not be resolved after ${maxRetries} retries`);
}

async function run() {
  console.log('Loading PDF...');
  const doc = await getDocument(pdfPath).promise;
  const pageCount = doc._pdfInfo.numPages;
  console.log(`Success! Total pages: ${pageCount}`);

  for (let p = 1; p <= pageCount; p++) {
    console.log(`Processing page ${p}...`);
    const page = await doc.getPage(p);
    const ops = await page.getOperatorList();
    
    // Give some time for background image decoding to trigger
    await delay(500);

    for (let i = 0; i < ops.fnArray.length; i++) {
      if (ops.fnArray[i] === OPS.paintImageXObject || ops.fnArray[i] === OPS.paintInlineImageXObject) {
        const name = ops.argsArray[i][0];
        console.log(`Found image ref: ${name} on page ${p}`);
        
        try {
          const isCommon = page.commonObjs.has(name);
          const img = await getObjectWithRetry(page, name, isCommon);
          
          const { width, height } = img;
          const bytes = img.data.length;
          const channels = bytes / width / height;
          
          console.log(`Resolved image ${name}: ${width}x${height}, channels=${channels}, bytes=${bytes}`);
          
          if (channels === 1 || channels === 3 || channels === 4) {
            const file = path.join(outputDir, `page-${p}-${name}.png`);
            await sharp(img.data, {
              raw: { width, height, channels }
            }).toFile(file);
            console.log(`Saved: ${file}`);
          } else {
            console.warn(`Unsupported channels count: ${channels} for image ${name}`);
          }
        } catch (err) {
          console.error(`Failed to process image ${name} on page ${p}:`, err.message);
        }
      }
    }
  }
}

run().catch(e => console.error('Global Error:', e));
