const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacements = [
  // Backgrounds
  { match: /\bbg-white\b(?! dark:bg-)/g, replace: 'bg-white dark:bg-gray-950' },
  { match: /\bbg-gray-50\b(?! dark:bg-)/g, replace: 'bg-gray-50 dark:bg-gray-900' },
  { match: /\bbg-gray-100\b(?! dark:bg-)/g, replace: 'bg-gray-100 dark:bg-gray-800' },
  { match: /\bbg-gray-200\b(?! dark:bg-)/g, replace: 'bg-gray-200 dark:bg-gray-800' },
  
  // Texts
  { match: /\btext-primary\b(?! dark:text-)/g, replace: 'text-primary dark:text-gray-50' },
  { match: /\btext-gray-400\b(?! dark:text-)/g, replace: 'text-gray-400 dark:text-gray-500' },
  { match: /\btext-gray-500\b(?! dark:text-)/g, replace: 'text-gray-500 dark:text-gray-400' },
  { match: /\btext-gray-600\b(?! dark:text-)/g, replace: 'text-gray-600 dark:text-gray-300' },
  { match: /\btext-gray-700\b(?! dark:text-)/g, replace: 'text-gray-700 dark:text-gray-300' },
  { match: /\btext-gray-900\b(?! dark:text-)/g, replace: 'text-gray-900 dark:text-gray-100' },
  
  // Borders
  { match: /\bborder-gray-50\b(?! dark:border-)/g, replace: 'border-gray-50 dark:border-gray-800' },
  { match: /\bborder-gray-100\b(?! dark:border-)/g, replace: 'border-gray-100 dark:border-gray-800' },
  { match: /\bborder-gray-200\b(?! dark:border-)/g, replace: 'border-gray-200 dark:border-gray-700' },
  { match: /\bborder-white\b(?! dark:border-)/g, replace: 'border-white dark:border-gray-800' },
  
  // Transparents
  { match: /\bbg-white\/40\b(?! dark:bg-)/g, replace: 'bg-white/40 dark:bg-gray-800/40' },
  { match: /\bbg-white\/60\b(?! dark:bg-)/g, replace: 'bg-white/60 dark:bg-gray-800/60' },
  { match: /\bbg-white\/70\b(?! dark:bg-)/g, replace: 'bg-white/70 dark:bg-gray-900/70' },
  { match: /\bbg-white\/80\b(?! dark:bg-)/g, replace: 'bg-white/80 dark:bg-gray-900/80' },
  { match: /\bbg-white\/90\b(?! dark:bg-)/g, replace: 'bg-white/90 dark:bg-gray-900/90' },
  { match: /\bbg-white\/50\b(?! dark:bg-)/g, replace: 'bg-white/50 dark:bg-gray-800/50' },

  // Inverse elements (primary backgrounds become light)
  // We'll leave primary backgrounds alone for now, or just add dark overrides specifically where needed.
  // Actually, keeping bg-primary in dark mode is fine if it matches the dark theme (primary is dark blue/black anyway)
  // Let's just map bg-primary to dark:bg-black for deeper dark mode
  { match: /\bbg-primary\b(?! dark:bg-| \/)/g, replace: 'bg-primary dark:bg-gray-900' },
  { match: /\bbg-[#0f1e37]\b(?! dark:bg-)/g, replace: 'bg-[#0f1e37] dark:bg-gray-900' },
  
  // Fills & Strokes
  { match: /\bfill-white\b(?! dark:fill-)/g, replace: 'fill-white dark:fill-gray-950' },
];

replacements.forEach(r => {
  content = content.replace(r.match, r.replace);
});

// Revert double darks if any
content = content.replace(/dark:bg-gray-950 dark:bg-[^\s'"]+/g, 'dark:bg-gray-950');

fs.writeFileSync('src/App.tsx', content);
console.log('Applied dark mode classes to src/App.tsx');
