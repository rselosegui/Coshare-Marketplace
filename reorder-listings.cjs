const fs = require('fs');

const dataFile = 'src/data.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

// Find the mockListings array
const match = content.match(/export const mockListings: AssetListing\[\] = \[([\s\S]*?)\];\n\nexport const categories/);
if (!match) {
    console.log("Could not find mockListings array");
    process.exit(1);
}

const mockListingsStr = match[1];

let items = mockListingsStr.split(/  \},\n  \{/g);

if (items.length === 0) {
    console.log("No items found");
    process.exit(1);
}

// Ensure proper brackets for each item
items = items.map((item, index) => {
    let cleanItem = item.trim();
    if (index === 0) {
        if (!cleanItem.endsWith('}')) cleanItem += '\n  }';
    } else if (index === items.length - 1) {
        if (!cleanItem.startsWith('{')) cleanItem = '  {\n' + cleanItem;
    } else {
        if (!cleanItem.startsWith('{')) cleanItem = '  {\n' + cleanItem;
        if (!cleanItem.endsWith('}')) cleanItem += '\n  }';
    }
    return cleanItem;
});

// clean up weird braces for first and last
if (!items[0].startsWith('{')) items[0] = '{\n' + items[0];
if (!items[items.length - 1].endsWith('}')) items[items.length - 1] = items[items.length - 1] + '\n}';

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

const joinedItems = items.join(',\n  ');
const replacement = `export const mockListings: AssetListing[] = [\n  ${joinedItems}\n];\n\nexport const categories`;


content = content.replace(/export const mockListings: AssetListing\[\] = \[([\s\S]*?)\];\n\nexport const categories/, replacement);

fs.writeFileSync(dataFile, content);
console.log('Reordered mockListings');
