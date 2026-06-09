const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace("} from 'lucide-react';", ", PenTool\n} from 'lucide-react';");
fs.writeFileSync('src/App.tsx', appContent);

console.log('Fixed PenTool');
