const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace all "fixed inset-0" with "fixed inset-0 max-w-md mx-auto w-full"
content = content.replace(/className="((?:.*?)?(?:fixed inset-0)(?:.*?))"/g, (match, classes) => {
  if (!classes.includes('max-w-md')) {
    return `className="${classes} max-w-md mx-auto w-full"`;
  }
  return match;
});

// Since the second argument was a string template or similar we'll fix backticks too
content = content.replace(/className={\`((?:.*?)?(?:fixed inset-0)(?:.*?))\`}/g, (match, classes) => {
  if (!classes.includes('max-w-md')) {
    return `className={\`${classes} max-w-md mx-auto w-full\`}`;
  }
  return match;
});

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed full screen modals to be max-w-md mx-auto w-full');
