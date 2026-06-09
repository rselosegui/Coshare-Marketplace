import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Users, Handshake, RefreshCcw, CheckCircle2, ShieldCheck, Star, Layers } from 'lucide-react';
import { FilterState, ListingGoal } from '../types';

export const FilterModal = ({ filters, onUpdate, onClose }: { filters: FilterState, onUpdate: (f: FilterState) => void, onClose: () => void }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const toggleGoal = (goal: ListingGoal) => {
    setLocalFilters(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
      <motion.div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white dark:bg-gray-950 w-full sm:max-w-md rounded-t-[2rem] sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_e, { offset, velocity }) => {
            if (offset.y > 150 || velocity.y > 500) {
              onClose();
            }
          }}
        >
          {/* Pull Indicator */}
          <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center px-6 pb-4 pt-2 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-lg text-primary dark:text-gray-50">Refine Search</h2>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1">
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-sm text-primary dark:text-gray-50">Location</h3>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  autoComplete="address-level2"
                  autoCorrect="off"
                  enterKeyHint="next"
                  placeholder="City, Country or Region"
                  value={localFilters.location}
                  onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-transparent dark:border-gray-800 focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-gray-950 text-[16px] placeholder-gray-400 text-primary dark:text-gray-50 transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3 text-sm text-primary dark:text-gray-50">Asset Goals <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">(Select multiple)</span></h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'All', label: 'All', icon: Layers, desc: 'Flexible options' },
                  { id: 'Co-own', label: 'Co-own', icon: Users, desc: 'Sell fractions' },
                  { id: 'Share', label: 'Share', icon: Handshake, desc: 'Rent out' },
                  { id: 'Swap', label: 'Swap', icon: RefreshCcw, desc: 'Exchange' }
                ].map((goal) => {
                  const isSelected = localFilters.goals.includes(goal.id as ListingGoal);
                  const Icon = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id as ListingGoal)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-accent bg-accent/5' 
                          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-accent/10 text-accent' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-accent" />}
                      </div>
                      <div className={`font-bold text-sm ${isSelected ? 'text-accent' : 'text-primary dark:text-gray-50'}`}>{goal.label}</div>
                      <div className="text-[12px] leading-tight text-gray-500 dark:text-gray-400 mt-0.5">{goal.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3 text-sm text-primary dark:text-gray-50">Price Range (AED/mo)</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="e.g. 10.000"
                  value={localFilters.minPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const formatted = val ? Number(val).toLocaleString('de-DE') : '';
                    setLocalFilters({ ...localFilters, minPrice: formatted });
                  }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-transparent dark:border-gray-800 focus:outline-none focus:border-accent text-[16px] text-primary dark:text-gray-50 transition-all font-medium"
                />
                <span className="text-gray-400 dark:text-gray-500 font-medium">-</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="e.g. 100.000"
                  value={localFilters.maxPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const formatted = val ? Number(val).toLocaleString('de-DE') : '';
                    setLocalFilters({ ...localFilters, maxPrice: formatted });
                  }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-transparent dark:border-gray-800 focus:outline-none focus:border-accent text-[16px] text-primary dark:text-gray-50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3 text-sm text-primary dark:text-gray-50">Minimum Trust Index</h3>
              <div className="flex gap-2">
                {[4, 4.5, 4.8, 5].map((rating) => {
                  const isSelected = localFilters.minRating === rating;
                  return (
                    <button
                      key={rating}
                      onClick={() => setLocalFilters({ ...localFilters, minRating: isSelected ? 0 : rating })}
                      className={`flex-1 flex items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-700' 
                          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="font-bold">{rating}+</span>
                      <Star className={`w-4 h-4 ${isSelected ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3 text-sm text-primary dark:text-gray-50">Condition</h3>
              <div className="flex flex-wrap gap-2">
                {['Brand New', 'Like New', 'Pre-owned', 'Vintage'].map((condition) => {
                  const isSelected = localFilters.conditions?.includes(condition);
                  return (
                    <button
                      key={condition}
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        conditions: isSelected 
                          ? prev.conditions?.filter(c => c !== condition) 
                          : [...(prev.conditions || []), condition]
                      }))}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                        isSelected 
                          ? 'border-accent bg-accent/5 text-accent' 
                          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      {condition}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3 text-sm text-primary dark:text-gray-50">Minimum Available Slots</h3>
              <div className="flex bg-gray-50 dark:bg-gray-900 rounded-xl p-2 select-none">
                {[1, 2, 3, 4].map((num) => {
                  const isSelected = localFilters.minSlotsAvailable === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setLocalFilters({ ...localFilters, minSlotsAvailable: isSelected ? undefined : num })}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-white dark:bg-gray-950 text-accent shadow-sm ring-1 ring-accent/10' 
                          : 'text-gray-400 hover:text-primary dark:hover:text-gray-50'
                      }`}
                    >
                      {num}+
                    </button>
                  );
                })}
              </div>
              <p className="text-[12px] text-gray-500 mt-2 font-medium">Filter co-own assets by available fractions.</p>
            </div>

            <div className="mb-2">
              <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localFilters.verifiedOnly}
                  onChange={(e) => setLocalFilters({ ...localFilters, verifiedOnly: e.target.checked })}
                  className="w-5 h-5 rounded text-accent focus:ring-accent accent-accent"
                />
                <div className="flex-1">
                  <div className="font-bold text-sm text-primary dark:text-gray-50 flex items-center gap-1.5">
                    Verified Assets Only
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Show only assets vetted by Coshare</div>
                </div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pb-[calc(1rem+env(safe-area-inset-bottom))] flex gap-3">
            <button 
              onClick={() => {
                const reset: FilterState = { location: '', minPrice: '', maxPrice: '', goals: [], verifiedOnly: false, minRating: 0, conditions: [], minSlotsAvailable: undefined };
                setLocalFilters(reset);
              }}
              className="px-6 py-3.5 rounded-xl font-bold text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Reset
            </button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onUpdate(localFilters);
                onClose();
              }}
              className="flex-1 py-3.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20"
            >
              Show Results
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
  );
};
