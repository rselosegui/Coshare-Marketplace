const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const locationHtml = `
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Location</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="City, Country or Region"
                value={localFilters.location}
                onChange={e => setLocalFilters({...localFilters, location: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border-2 border-transparent dark:border-transparent focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-gray-950 text-sm font-bold text-primary dark:text-gray-50 transition-all placeholder:font-medium placeholder:text-gray-400"
              />
            </div>
          </div>
`;

content = content.replace(
  '<div className="space-y-4">\n            <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Asset Strategy</label>',
  locationHtml + '\n          <div className="space-y-4">\n            <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Asset Strategy</label>'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Added location HTML to FilterModal");
