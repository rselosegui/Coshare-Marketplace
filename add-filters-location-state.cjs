const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
`interface FilterState {
  minPrice: string;
  maxPrice: string;
  goals: ListingGoal[];
  verifiedOnly: boolean;
}`,
`interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  goals: ListingGoal[];
  verifiedOnly: boolean;
}`
);

// Initial state for filters
content = content.replace(
`const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    goals: [],
    verifiedOnly: false
  });`,
`const [filters, setFilters] = useState<FilterState>({
    location: '',
    minPrice: '',
    maxPrice: '',
    goals: [],
    verifiedOnly: false
  });`
);

// Reset filter inside FilterModal
content = content.replace(
`const reset: FilterState = { minPrice: '', maxPrice: '', goals: [], verifiedOnly: false };`,
`const reset: FilterState = { location: '', minPrice: '', maxPrice: '', goals: [], verifiedOnly: false };`
);

// Reset filter inside Clear Filters button
content = content.replace(
`setFilters({ minPrice: '', maxPrice: '', goals: [], verifiedOnly: false })`,
`setFilters({ location: '', minPrice: '', maxPrice: '', goals: [], verifiedOnly: false })`
);

// Another Reset filter:
content = content.replace(
`setFilters({ minPrice: '', maxPrice: '', goals: [], verifiedOnly: false });`,
`setFilters({ location: '', minPrice: '', maxPrice: '', goals: [], verifiedOnly: false });`
);


fs.writeFileSync('src/App.tsx', content);
console.log("Added location to FilterState and default values");
