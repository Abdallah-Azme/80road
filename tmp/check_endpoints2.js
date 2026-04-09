const fs = require('fs');
const path = require('path');

function getAllFiles(dir, arrayOfFiles) {
  const files = fs.readdirSync(dir);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.next', 'out', 'tmp', 'android', 'ios'].includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles('.');
const endpointSet = new Set();
// match `api.get('/path')`, `api.get( '/path' )`, `api.get(\`/path\`)`
const regex = /(?:api\.(?:get|post|put|patch|delete)(?:<[^>]+>)?\s*\(\s*`([^`]+)`|\s*'([^']+)'|\s*"([^"]+)")/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const ep = match[1] || match[2] || match[3];
    if (ep) {
        // Strip ${id} or similar generic substitutions for matching
        endpointSet.add(ep.replace(/\$\{[^}]+\}/g, 'SOME_VAR'));
    }
  }
});
console.log('Endpoints found in code:');
console.log(Array.from(endpointSet).join('\n'));
