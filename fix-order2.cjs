const fs = require('fs');

const dataFile = 'src/data.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

// The best way is to extract each object.
// Objects start with '  {' and end with '  }' but they can be nested.
// We can use a simple brace matching to extract them.

const match = content.match(/export const mockListings: AssetListing\[\] = \[([\s\S]*?)\];\n\nexport const categories/);
if (!match) process.exit(1);

const arrayStr = match[1];

let items = [];
let braceCount = 0;
let currentItem = '';
let inString = false;
let escape = false;
let stringChar = '';

for (let i = 0; i < arrayStr.length; i++) {
    const char = arrayStr[i];
    currentItem += char;
    
    if (escape) {
        escape = false;
        continue;
    }
    if (char === '\\') {
        escape = true;
        continue;
    }
    
    if (inString) {
        if (char === stringChar) {
            inString = false;
        }
        continue;
    }
    
    if (char === "'" || char === '"' || char === '\`') {
        inString = true;
        stringChar = char;
        continue;
    }
    
    if (char === '{') {
        braceCount++;
    } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
            // End of an object
            items.push(currentItem);
            currentItem = '';
        }
    }
}

// Clean up whitespace from extracted items
items = items.map(item => item.trim()).filter(item => item.length > 0);

const orderObj = {
    '1': 1,   // Porsche
    '2': 2,   // Ducati
    '10': 3,  // Hanse
    '4': 4,   // Rolex
    '5': 5,   // Vespa
    '6': 6,   // Foil
    '7': 7,   // Jet Ski
    '8': 8,   // Audi
    '19': 9,  // Pro Kite
    '18': 10, // Toyota
    '9': 11,  // Boston
    '20': 12, // Kayak
    '17': 13, // Mini Cooper
    '3': 14,  // Azimut
    '15': 15, // Harley
    '16': 16  // Camping Kit
};

const getTitleId = (itemStr) => {
    const idMatch = itemStr.match(/id:\s*'(.+?)'/);
    return idMatch ? idMatch[1] : '';
};

items.sort((a, b) => {
    const idA = getTitleId(a);
    const idB = getTitleId(b);
    const orderA = orderObj[idA] || 999;
    const orderB = orderObj[idB] || 999;
    return orderA - orderB;
});

const joinedItems = items.map(i => '  ' + i).join(',\n');
const replacement = `export const mockListings: AssetListing[] = [\n${joinedItems}\n];\n\nexport const categories`;

content = content.replace(/export const mockListings: AssetListing\[\] = \[([\s\S]*?)\];\n\nexport const categories/, replacement);

fs.writeFileSync(dataFile, content);
console.log("Successfully fixed and ordered");
