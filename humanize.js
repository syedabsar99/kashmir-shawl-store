const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const pathsToSweep = [
  './client/src/pages',
  './client/src/components',
  './client/src/store',
  './client/src/api',
  './server/routes',
  './server/models',
  './server/controllers'
];

let allFiles = [];
pathsToSweep.forEach(p => {
  if (fs.existsSync(p)) {
    allFiles = [...allFiles, ...walkSync(p).filter(f => f.endsWith('.js') || f.endsWith('.jsx'))];
  }
});

const oldHeader = `/* \n * Project Name: Saadat Shawl House E-Commerce\n * Author: Syed Tanzeel\n * Description: Custom-built architecture for the Saadat Shawl House Application.\n * Notes: This code is proprietary and developed from scratch.\n */\n\n`;

const newHeader = `/* \n * Project Name: Saadat Shawl House\n * Author: Syed Noor ul Absar\n * Description: Custom-built architecture for the Saadat Shawl House Application.\n * Notes: This code is proprietary and developed from scratch.\n */\n\n`;

let modifiedCount = 0;

allFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  if (content.includes(oldHeader)) {
    // Replace the old header with the exact new one
    content = content.replace(oldHeader, newHeader);
    fs.writeFileSync(f, content);
    modifiedCount++;
  } else if (!content.includes('Syed Noor ul Absar')) {
    // Just in case a file got missed, add the new header
    content = newHeader + content;
    fs.writeFileSync(f, content);
    modifiedCount++;
  }
});

console.log(`Success! Updated ownership signature to Syed Noor ul Absar on ${modifiedCount} files.`);
