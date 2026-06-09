const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const s1 = `const BookingFlow = ({ listing, onComplete, onCancel }: { listing: AssetListing, onComplete: () => void, onCancel: () => void }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });`;

const r1 = `const BookingFlow = ({ listing, onComplete, onCancel }: { listing: AssetListing, onComplete: () => void, onCancel: () => void }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(4);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      hasConflict: [2, 5, 8].includes(i),
      isHighDemand: [3, 4, 10].includes(i)
    };
  });`;

content = content.replace(s1, r1);

const s2 = `{dates.map((date, i) => {
              const isSelected = selectedDate === date.toDateString();
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(date.toDateString())}
                  className={\`w-20 h-24 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shrink-0 snap-center transition-all \${
                    isSelected ? 'border-primary bg-primary dark:bg-gray-900 text-white shadow-xl shadow-primary/20' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-primary dark:text-gray-50'
                  }\`}
                >
                  <span className={\`text-[10px] font-bold uppercase tracking-tight \${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}\`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-xl font-black">{date.getDate()}</span>
                  <span className={\`text-[9px] font-bold uppercase \${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}\`}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </motion.button>
              );
            })}`;
            
const r2 = `{dates.map((obj, i) => {
              const isSelected = selectedDate === obj.date.toDateString();
              return (
                <motion.button
                  key={i}
                  disabled={obj.hasConflict}
                  whileTap={!obj.hasConflict ? { scale: 0.95 } : {}}
                  onClick={() => !obj.hasConflict && setSelectedDate(obj.date.toDateString())}
                  className={\`relative w-20 h-24 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shrink-0 snap-center transition-all \${
                    isSelected ? 'border-primary bg-primary dark:bg-gray-900 text-white shadow-xl shadow-primary/20' 
                    : obj.hasConflict ? 'border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-red-300 opacity-60 cursor-not-allowed'
                    : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-primary dark:text-gray-50'
                  }\`}
                >
                  {obj.isHighDemand && !obj.hasConflict && <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />}
                  <span className={\`text-[10px] font-bold uppercase tracking-tight \${isSelected ? 'text-white/60' : obj.hasConflict ? 'text-red-300' : 'text-gray-400 dark:text-gray-500'}\`}>
                    {obj.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-xl font-black">{obj.date.getDate()}</span>
                  <span className={\`text-[9px] font-bold uppercase \${isSelected ? 'text-white/60' : obj.hasConflict ? 'text-red-300' : 'text-gray-400 dark:text-gray-500'}\`}>
                    {obj.date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  {obj.hasConflict && <span className="absolute -bottom-2 px-2 bg-red-100 dark:bg-red-900/50 text-[8px] text-red-600 dark:text-red-300 font-bold rounded-full border border-red-200 dark:border-red-800">Booked</span>}
                </motion.button>
              );
            })}`;
            
content = content.replace(s2, r2);

const durationUI = `
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Duration (Hours)</label>
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-950 flex items-center justify-center shadow-sm text-primary dark:text-gray-50 disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-xl font-bold text-primary dark:text-gray-50">{duration}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">hrs</span>
            </div>
            <button onClick={() => setDuration(Math.min(12, duration + 1))} className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-950 flex items-center justify-center shadow-sm text-primary dark:text-gray-50 disabled:opacity-50">
              <span className="w-5 h-5 flex items-center justify-center"><Plus className="w-5 h-5" /></span>
            </button>
          </div>
        </div>
`;

content = content.replace(
  `<div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Available Slots</label>`,
  durationUI + `\n        <div className="space-y-4">\n          <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Available Slots</label>`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Updated BookingFlow UI");
