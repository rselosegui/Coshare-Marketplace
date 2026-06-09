const fs = require('fs');

let typesContent = fs.readFileSync('src/types.ts', 'utf-8');
typesContent = typesContent.replace('unreadCount: number;', 'unreadCount: number;\n  participantId?: string;');
typesContent = typesContent.replace('goal: ListingGoal;', 'goal: ListingGoal;\n  location?: string;');
fs.writeFileSync('src/types.ts', typesContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('PenTool')) {
  appContent = appContent.replace('import { \n  Search', 'import { PenTool, \n  Search');
}
fs.writeFileSync('src/App.tsx', appContent);

console.log('Fixed types.ts and PenTool');
