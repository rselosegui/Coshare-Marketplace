const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacements = [
  { match: /ring-gray-100(?!\s*dark:ring-)/g, replace: 'ring-gray-100 dark:ring-gray-800' },
  { match: /ring-white(?!\s*dark:ring-)/g, replace: 'ring-white dark:ring-gray-950' },
  { match: /border-white(?!\s*dark:border-)/g, replace: 'border-white dark:border-gray-950' },
  { match: /border-transparent(?!\s*dark:border-)/g, replace: 'border-transparent dark:border-transparent' } // already works for both, just in case
];

replacements.forEach(r => {
  content = content.replace(r.match, r.replace);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed rings and remaining borders in src/App.tsx');
