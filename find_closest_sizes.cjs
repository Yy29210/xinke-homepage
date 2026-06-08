const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'extracted_temp');
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  const results = files.map(file => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    return { name: file, size: stat.size };
  });
  
  // Sort by name numerically based on page number
  results.sort((a, b) => {
    const numA = parseInt(a.name.match(/page-(\d+)/)[1]);
    const numB = parseInt(b.name.match(/page-(\d+)/)[1]);
    return numA - numB;
  });

  console.log('--- ALL EXTRACTED FILE SIZES ---');
  results.forEach(r => {
    console.log(`${r.name}: ${r.size} bytes`);
  });
  console.log('--------------------------------');
} else {
  console.log('Directory not found');
}
