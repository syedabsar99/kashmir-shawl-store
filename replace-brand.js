const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.git') && !dirFile.includes('dist')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const pathsToSweep = ['./client/src', './client/index.html', './server', './README.md', './humanize.js'];
let allFiles = [];
pathsToSweep.forEach(p => {
  if (fs.existsSync(p)) {
    if (fs.statSync(p).isDirectory()) {
      allFiles = [...allFiles, ...walkSync(p).filter(f => f.match(/\.(js|jsx|html|css|json|md)$/))];
    } else {
      allFiles.push(p);
    }
  }
});

let modifiedCount = 0;

allFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('Kashur Mart')) {
    content = content.replace(/Kashur Mart/g, 'Saadat Shawl House');
    fs.writeFileSync(f, content);
    modifiedCount++;
  }
});

console.log(`Updated brand name from "Kashur Mart" to "Saadat Shawl House" in ${modifiedCount} files.`);
