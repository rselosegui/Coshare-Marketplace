const fs = require('fs');

let typesContent = fs.readFileSync('src/types.ts', 'utf-8');
typesContent = typesContent.replace('category: string;', 'category: string;\n  location?: string;');
fs.writeFileSync('src/types.ts', typesContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('PenTool')) {
  appContent = appContent.replace('import { \n  Search', 'import { PenTool, \n  Search');
  if(!appContent.includes('PenTool')) {
     appContent = appContent.replace('import {', 'import { PenTool,');
  }
}

// Ensure the chat replacement actually uses 'me' and mock data correctly
// Let's replace 'participantId || "them"' with 'conversation.participantName' to avoid TS error ? 
// Actually 'participantId' was added to 'Conversation' so it's fine.

fs.writeFileSync('src/App.tsx', appContent);

console.log('Fixed types.ts and PenTool again');
