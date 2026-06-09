const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const BookingFlow = \(\{ listing, onComplete, onCancel \}: \{ listing: AssetListing, onComplete: \(\) => void, onCancel: \(\) => void \}\) => \{([^]*?)<motion\.button\n            whileTap=\{\{ scale: 0\.9 \}\}\n            onClick=\{onCancel\}\n            className="w-10 h-10/m;

const mockConflictedDates = `const BookingFlow = ({ listing, onComplete, onCancel }: { listing: AssetListing, onComplete: () => void, onCancel: () => void }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(4);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      hasConflict: [2, 5, 8].includes(i), // Mock some conflicted dates
      isHighDemand: [3, 4, 10].includes(i)
    };
  });

  const slots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];

  return (
    <div className="absolute inset-0 bg-white dark:bg-gray-950 z-[100] flex flex-col pt-safe overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="w-10 h-10`;

content = content.replace(regex, mockConflictedDates);

const datesMapRegex = /\{dates\.map\(\(date, i\) => \{\n\s*const isSelected = selectedDate === date\.toDateString\(\);\n\s*return \(\n\s*<motion\.button\n\s*key=\{i\}\n\s*whileTap=\{\{ scale: 0\.95 \}\}\n\s*onClick=\{\(\) => setSelectedDate\(date\.toDateString\(\)\)\}\n\s*className=\{\`w-20 h-24 rounded-\[1\.5rem\] border-2 flex flex-col items-center justify-center shrink-0 snap-center transition-all \$\{\n\s*isSelected \? 'border-primary bg-primary dark:bg-gray-900 text-white shadow-xl shadow-primary\/20' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-primary dark:text-gray-50'\n\s*\}\`\}\n\s*>\n\s*<span className=\{\`text-\[10px\] font-bold uppercase tracking-tight \$\{\n*isSelected \? 'text-white\/60' : 'text-gray-400 dark:text-gray-500'\n*\}\`\}>\n\s*\{date\.toLocaleDateString\('en-US', \{ weekday: 'short' \}\)\}\n\s*<\/span>\n\s*<span className="text-xl font-black">\{date\.getDate\(\)\}<\/span>\n\s*<span className=\{\`text-\[9px\] font-bold uppercase \$\{\n*isSelected \? 'text-white\/60' : 'text-gray-400 dark:text-gray-500'\n*\}\`\}>\n\s*\{date\.toLocaleDateString\('en-US', \{ month: 'short' \}\)\}\n\s*<\/span>\n\s*<\/motion\.button>\n\s*\);\n\s*\}\)\}/m;

// Replacing the mapping for Dates
const datesReplacement = `{dates.map((obj, i) => {
              const isSelected = selectedDate === obj.date.toDateString();
              const isConflict = obj.hasConflict;
              return (
                <motion.button
                  key={i}
                  disabled={isConflict}
                  whileTap={!isConflict ? { scale: 0.95 } : {}}
                  onClick={() => !isConflict && setSelectedDate(obj.date.toDateString())}
                  className={\`relative w-20 h-24 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shrink-0 snap-center transition-all \${
                    isSelected ? 'border-primary bg-primary dark:bg-gray-900 text-white shadow-xl shadow-primary/20' 
                    : isConflict ? 'border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-red-300 opacity-60 cursor-not-allowed'
                    : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-primary dark:text-gray-50'
                  }\`}
                >
                  {obj.isHighDemand && !isConflict && <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />}
                  <span className={\`text-[10px] font-bold uppercase tracking-tight \${isSelected ? 'text-white/60' : (isConflict ? 'text-red-300' : 'text-gray-400 dark:text-gray-500')}\`}>
                    {obj.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-xl font-black">{obj.date.getDate()}</span>
                  <span className={\`text-[9px] font-bold uppercase \${isSelected ? 'text-white/60' : (isConflict ? 'text-red-300' : 'text-gray-400 dark:text-gray-500')}\`}>
                    {obj.date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  {isConflict && <span className="absolute -bottom-2 px-2 bg-red-100 text-[8px] text-red-600 font-bold rounded-full border border-red-200">Booked</span>}
                </motion.button>
              );
            })}`;
            
// Instead of replacing blindly, let's just do a string replacement targeting `dates.map` manually. Wait, regular expressions across multiple lines with so much varied spacing might fail. Let's use standard string replacement for the dates map.

fs.writeFileSync('src/App.tsx', content);

