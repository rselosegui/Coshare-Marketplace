const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacements = [
  { match: /border-red-50(?!\s*dark:border-)/g, replace: 'border-red-50 dark:border-red-900/30' },
  { match: /border-red-100\/50(?!\s*dark:border-)/g, replace: 'border-red-100/50 dark:border-red-900/30' },
  { match: /bg-red-50(?!\s*dark:bg-)/g, replace: 'bg-red-50 dark:bg-red-950/40' },
  { match: /bg-green-50\/50(?!\s*dark:bg-)/g, replace: 'bg-green-50/50 dark:bg-green-900/20' },
  { match: /border-green-100\/50(?!\s*dark:border-)/g, replace: 'border-green-100/50 dark:border-green-900/30' },
  { match: /bg-blue-50(?!\s*dark:bg-)/g, replace: 'bg-blue-50 dark:bg-blue-950/40' },
  { match: /bg-blue-100(?!\s*dark:bg-)/g, replace: 'bg-blue-100 dark:bg-blue-900/40' },
  { match: /border-blue-100(?!\s*dark:border-)/g, replace: 'border-blue-100 dark:border-blue-900/30' }
];

replacements.forEach(r => {
  content = content.replace(r.match, r.replace);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed colored backgrounds and borders in src/App.tsx');
