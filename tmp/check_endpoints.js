const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, '../80road.postman_collection (2).json');
const collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

// Recursive function to extract all endpoints from postman collection
const endpoints = [];
function extractEndpoints(item) {
  if (item.request && item.request.url) {
    let urlStr = '';
    const raw = item.request.url.raw || '';
    
    // Attempt to extract the path without the host and variables
    // Usually like {{url}}/api/v1/auth/login -> /auth/login or /api/v1/auth/login
    // We just want the suffix. Let's get the path array
    if (item.request.url.path) {
      let pathArr = item.request.url.path;
      // Many times path starts with strings we might need to filter or keep
      let pathStr = '/' + pathArr.join('/');
      // Also store the method
      let method = item.request.method;
      endpoints.push({ name: item.name, method, path: pathStr, raw });
    } else if (typeof item.request.url === 'string') {
      endpoints.push({ name: item.name, method: item.request.method, path: item.request.url, raw: item.request.url });
    }
  }
  
  if (item.item) {
    item.item.forEach(extractEndpoints);
  }
}

collectionData.item.forEach(extractEndpoints);

// Now we have endpoints. Let's find all source files in the project to check if the path is used
function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
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

const sourceFiles = getAllFiles(path.join(__dirname, '..'));

const contents = sourceFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

const unusedEndpoints = [];

endpoints.forEach(ep => {
  // Let's refine the path for searching. 
  // For example, if path is /pages/faqs, we search for 'pages/faqs' or '/pages/faqs'
  // Let's take the last 2-3 segments to avoid generic matches like '/login' matching different things if possible, or just the whole path.
  let searchStr = ep.path;
  if (searchStr.startsWith('/')) {
    searchStr = searchStr.substring(1); 
  }
  
  // If the path has variables like /api/users/:id, it's represented as /api/users/{{id}} or similar in postman
  // Let's strip parameters like {{...}} or :...
  searchStr = searchStr.replace(/\{\{[^\}]+\}\}/g, '').replace(/:[^\/]+/g, '');
  // Clean up trailing slash
  if (searchStr.endsWith('/')) searchStr = searchStr.slice(0, -1);
  if (searchStr.startsWith('/')) searchStr = searchStr.substring(1);

  if (!searchStr) return; // Skip if empty after stripping variables
  
  // Also split by '/' and maybe just use the longest part if there's issue, but full path is better.
  let isUsed = false;
  if (contents.includes(searchStr)) {
    isUsed = true;
  } else {
    // try adding leading slash
    if (contents.includes('/' + searchStr)) isUsed = true;
  }

  if (!isUsed) {
    unusedEndpoints.push(ep);
  }
});

console.log(JSON.stringify(unusedEndpoints, null, 2));
