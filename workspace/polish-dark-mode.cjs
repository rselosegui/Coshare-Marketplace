const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Some more comprehensive regex replacements for dark mode
const polishReplacements = [
  // Make sure backdrop-blur has a good dark background opacity
  { match: /bg-white\/90 backdrop-blur-md/g, replace: 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md' },
  { match: /bg-white\/80 backdrop-blur-md/g, replace: 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md' },
  
  // Specific border color fixes
  { match: /border-gray-50(?!\s*dark:border)/g, replace: 'border-gray-50 dark:border-gray-800' },
  { match: /border-gray-100(?!\s*dark:border)/g, replace: 'border-gray-100 dark:border-gray-800' },
  { match: /border-gray-200(?!\s*dark:border)/g, replace: 'border-gray-200 dark:border-gray-700' },

  // Group hover
  { match: /group-hover:bg-white(?!\s*dark:group-hover:bg)/g, replace: 'group-hover:bg-white dark:group-hover:bg-gray-800' },
  { match: /group-hover:bg-gray-50(?!\s*dark:group-hover:bg)/g, replace: 'group-hover:bg-gray-50 dark:group-hover:bg-gray-800' },
  { match: /group-hover:text-primary(?!\s*dark:group-hover:text)/g, replace: 'group-hover:text-primary dark:group-hover:text-gray-50' },
];

polishReplacements.forEach(r => {
  content = content.replace(r.match, r.replace);
});

// Avoid duplicate dark classes that might have been accidentally inserted
// e.g. dark:bg-gray-950 dark:bg-gray-900 -> dark:bg-gray-950
const fixDuplicates = (str) => {
    let prev = '';
    while (prev !== str) {
      prev = str;
      str = str.replace(/(dark:[a-[a-zA-Z0-9\/]+)\s+\1/g, '$1');
    }
    return str;
};

content = fixDuplicates(content);

fs.writeFileSync('src/App.tsx', content);
console.log('Polished dark mode in src/App.tsx');
