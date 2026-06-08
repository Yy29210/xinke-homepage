const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    // Skip node_modules and .git
    if (file === 'node_modules' || file === '.git' || file === 'extracted_temp') return;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push({ path: fullPath, size: stat.size });
    }
  });
  return results;
}

try {
  console.log('--- SCANNING ALL FILES ---');
  const allFiles = walk(process.cwd());
  allFiles.forEach(f => {
    console.log(`${path.relative(process.cwd(), f.path)} (${f.size} bytes)`);
  });
} catch (e) {
  console.error(e);
}
