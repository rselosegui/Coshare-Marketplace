const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
`    const matchesVerified = !filters.verifiedOnly || listing.isVerified;
    
    return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesGoal && matchesVerified;`,
`    const matchesVerified = !filters.verifiedOnly || listing.isVerified;
    const matchesLocation = filters.location === '' || (listing.location && listing.location.toLowerCase().includes(filters.location.toLowerCase()));
    
    return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesGoal && matchesVerified && matchesLocation;`
);

content = content.replace(
`{(filters.minPrice || filters.maxPrice || filters.goals.length > 0 || filters.verifiedOnly) && (`,
`{(filters.location || filters.minPrice || filters.maxPrice || filters.goals.length > 0 || filters.verifiedOnly) && (`
);

content = content.replace(
`{filters.verifiedOnly && (`,
`{filters.location && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-[10px] font-bold text-primary dark:text-gray-50">
                        <span>LOC: {filters.location}</span>
                        <button onClick={() => setFilters({ ...filters, location: '' })} className="text-gray-400 dark:text-gray-500 hover:text-accent">
                          <Plus className="w-3 h-3 rotate-45" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                    {filters.verifiedOnly && (`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Updated filteredListings and active chips");
