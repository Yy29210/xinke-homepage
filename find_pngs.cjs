const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'dist' || file === '.npm') return;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (file.toLowerCase().endsWith('.png')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

try {
  const pngs = walk(process.cwd());
  console.log('--- ALL PNG FILES ---');
  pngs.forEach(p => {
    const rel = path.relative(process.cwd(), p);
    const stat = fs.statSync(p);
    console.log(`${rel} (${stat.size} bytes)`);
  });
  console.log('---------------------');
} catch (e) {
  console.log('Error: ' + e.message);
}
