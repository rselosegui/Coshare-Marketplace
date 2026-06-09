import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Typography fixes
  content = content.replace(/text-\[10px\]/g, 'text-xs');
  content = content.replace(/text-\[11px\]/g, 'text-[12px] leading-tight');
  content = content.replace(/tracking-\[0.2em\]/g, 'tracking-normal');
  content = content.replace(/tracking-widest/g, 'tracking-normal');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'src'));

// Fix App.tsx z-indexes specifically
const appTsxPath = path.join(__dirname, 'src/App.tsx');
let appContent = fs.readFileSync(appTsxPath, 'utf8');
appContent = appContent.replace(/z-\[30\]/g, 'z-40');
appContent = appContent.replace(/z-\[60\]/g, 'z-50');
appContent = appContent.replace(/z-\[100\]/g, 'z-40');
appContent = appContent.replace(/z-\[200\]/g, 'z-50');
fs.writeFileSync(appTsxPath, appContent, 'utf8');

console.log('Successfully fixed typography and z-indexes!');
