const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// replace "fixed inset-0" with "absolute inset-0"
content = content.replace(/fixed inset-0/g, 'absolute inset-0');

// replace "fixed bottom-0" with "absolute bottom-0"
content = content.replace(/fixed bottom-0/g, 'absolute bottom-0');

// replace "fixed bottom-24" with "absolute bottom-24"
content = content.replace(/fixed bottom-24/g, 'absolute bottom-24');

// remove " max-w-md mx-auto w-full" that might be appended
content = content.replace(/ max-w-md mx-auto w-full/g, '');
// and for the compare modal " max-w-md mx-auto"
content = content.replace(/ max-w-md mx-auto"/g, '"');

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced fixed with absolute");
