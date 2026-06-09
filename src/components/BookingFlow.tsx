import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Info, Loader2, Sparkles, X, AlertTriangle } from 'lucide-react';
import { AssetListing } from '../types';

const CATEGORY_EXTRAS: Record<string, { title: string; price: string }[]> = {
  'Cars': [
    { title: 'Chauffeur / Driver', price: 'AED 500/day' },
    { title: 'Premium Insurance', price: 'AED 200/day' },
  ],
  'Boats': [
    { title: 'Captain / Skipper', price: 'AED 800/day' },
    { title: 'Catering Package', price: 'AED 450' }
  ],
  'Bikes': [
    { title: 'Helmet & Gear', price: 'AED 50/day' },
    { title: 'Premium Insurance', price: 'AED 100/day' },
  ],
  'Luxury Watches': [
    { title: 'Watch Winder Case', price: 'AED 150/day' },
    { title: 'Insured Delivery', price: 'AED 300' }
  ],
  'Others': [
    { title: 'Premium Insurance', price: 'AED 200/day' },
    { title: 'Cleaning Service', price: 'AED 150' }
  ]
};

export const BookingFlow = ({ listing, onComplete, onCancel }: { listing: AssetListing, onComplete: () => void, onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<number[]>([14, 15, 16]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [showHistory, setShowHistory] = useState(false);
  const [conflictDate, setConflictDate] = useState<number | null>(null);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDates([]);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDates([]);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // 0 is Monday, 6 is Sunday
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Mock allowance data
  const slotsOwned = 1; // Simulated slots owned by user for this asset
  const daysPerSlot = 44; 
  const totalDaysAllocated = slotsOwned * daysPerSlot;
  const daysUtilized = 12; // Mock used days
  const baseDaysRemaining = totalDaysAllocated - daysUtilized;
  const currentDaysRemaining = baseDaysRemaining - selectedDates.length;

  const toggleDate = (day: number) => {
    if ([5, 6, 20, 21].includes(day)) {
      setConflictDate(day);
      return;
    }
    if (selectedDates.includes(day)) {
      setSelectedDates(selectedDates.filter(d => d !== day));
    } else {
      if (selectedDates.length >= baseDaysRemaining) return; // Prevent booking beyond allocation
      setSelectedDates([...selectedDates, day].sort((a, b) => a - b));
    }
  };

  const handleComplete = () => {
    if (selectedDates.length === 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 1500);
  };

  const dayCount = selectedDates.length;
  const usageCost = dayCount * Math.round(listing.pricePerMonth / 30);

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_e, { offset, velocity }) => {
        if (offset.y > 150 || velocity.y > 500) {
          onCancel();
        }
      }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col pt-safe"
    >
      <div className="w-full flex justify-center pt-3 pb-1 bg-white dark:bg-gray-950">
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
      </div>
      <div className="px-4 pb-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 text-primary dark:text-gray-50">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg text-primary dark:text-gray-50">Book Usage</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-8 border border-gray-100 dark:border-gray-800">
          <img src={listing.image} alt={listing.title} className="w-20 h-20 rounded-xl object-cover" />
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-bold text-primary dark:text-gray-50 uppercase tracking-tight text-sm">{listing.title}</h3>
            <p className="text-[12px] leading-tight text-accent font-black uppercase tracking-normal mt-0.5">{listing.goals?.[0] || listing.goal}</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-950 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">Booking Allowance</h3>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-lg"
                >
                  {showHistory ? 'Book Dates' : 'View History'}
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
                 <div className="text-center flex-1">
                    <p className="text-xl font-black text-primary dark:text-gray-50">{totalDaysAllocated}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Allocated</p>
                 </div>
                 <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                 <div className="text-center flex-1">
                    <p className="text-xl font-black text-primary dark:text-gray-50">{daysUtilized}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Utilized</p>
                 </div>
                 <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                 <div className="text-center flex-1 relative">
                    <p className={`text-xl font-black ${currentDaysRemaining === 0 ? 'text-red-500' : 'text-accent'}`}>{currentDaysRemaining}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wide mt-1 ${currentDaysRemaining === 0 ? 'text-red-500/70' : 'text-accent/70'}`}>Remaining</p>
                 </div>
              </div>
            </div>

            {showHistory ? (
              <div className="bg-white dark:bg-gray-950 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm animate-in fade-in duration-300">
                <h3 className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal mb-2">Past Bookings</h3>
                <div className="space-y-3">
                  {[
                    { id: 1, date: 'May 10 - May 14', days: 4, status: 'Completed' },
                    { id: 2, date: 'April 02 - April 05', days: 3, status: 'Completed' },
                    { id: 3, date: 'March 15 - March 20', days: 5, status: 'Completed' }
                  ].map(past => (
                    <div key={past.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                      <div>
                        <div className="font-bold text-sm text-primary dark:text-gray-50">{past.date}</div>
                        <div className="text-[12px] leading-tight font-medium text-gray-400 uppercase tracking-wider mt-1">{past.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-primary dark:text-gray-50">{past.days}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Days</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
            <div className="bg-white dark:bg-gray-950 rounded-3xl p-2 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4 px-4 pt-2">
                <h3 className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">Select Dates</h3>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-primary dark:text-gray-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-primary dark:text-gray-50 min-w-[100px] text-center">{monthName}</span>
                  <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-primary dark:text-gray-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 px-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[12px] leading-tight font-black text-gray-300 mb-2">{d}</div>
                ))}
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[44px] aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = selectedDates.includes(day);
                  const isUnavailable = [5, 6, 20, 21].includes(day);
                  return (
                    <button 
                      key={day}
                      onClick={() => toggleDate(day)}
                      className={`min-h-[44px] aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all relative ${
                        isSelected 
                          ? 'bg-accent text-white shadow-md shadow-accent/20 scale-95' 
                          : isUnavailable
                            ? 'text-gray-300 dark:text-gray-700 bg-gray-50/50 dark:bg-gray-900/50'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-primary dark:text-gray-50'
                      }`}
                    >
                      {day}
                      {isSelected && <div className="absolute -bottom-1 w-1 h-1 bg-white dark:bg-gray-950 rounded-full" />}
                      {isUnavailable && <div className="absolute top-[2px] right-[2px] w-1.5 h-1.5 bg-red-400 rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {(() => {
              const extras = listing.extras && listing.extras.length > 0 ? listing.extras : (CATEGORY_EXTRAS[listing.category] || CATEGORY_EXTRAS['Others']);
              return extras && extras.length > 0 ? (
              <div>
                <h3 className="text-[12px] leading-tight font-bold mb-3 text-gray-400 dark:text-gray-500 uppercase tracking-normal px-1">Add Extras</h3>
                <div className="space-y-2">
                  {extras.map((extra, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <div className="font-bold text-sm text-primary dark:text-gray-50">{extra.title}</div>
                        <div className="text-[12px] leading-tight font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{extra.price}</div>
                      </div>
                      <button className="w-10 h-10 bg-white dark:bg-gray-950 rounded-xl shadow-sm text-primary dark:text-gray-50 hover:text-accent transition-colors flex items-center justify-center border border-gray-100 dark:border-gray-800">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
            })()}
            </>
          )}
          </div>
        )}

        {conflictDate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex py-safe px-4 pt-48 items-start justify-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setConflictDate(null)}
                className="absolute top-4 right-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-primary dark:text-gray-50"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h2 className="text-xl font-bold text-primary dark:text-gray-50 mb-2">Schedule Conflict</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                The requested date ({monthName} {conflictDate}) is already booked by another Co-owner.
              </p>

              <div className="bg-accent/10 rounded-2xl p-5 border border-accent/20 mb-6 flex gap-3 text-left items-start">
                <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-accent uppercase tracking-tight mb-1">AI Optimization</h4>
                  <p className="text-[12px] font-medium text-accent/80 leading-relaxed">
                    Based on historical utilization and the asset's availability, the optimal alternative window is next week.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedDates([11, 12, 13]);
                    setConflictDate(null);
                  }}
                  className="w-full flex justify-between items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-accent p-4 rounded-xl transition-colors"
                >
                  <div className="text-left">
                    <div className="font-bold text-sm text-primary dark:text-gray-50">{monthName} 11 - 13</div>
                    <div className="text-[12px] text-gray-500 font-medium">+3 Available Days</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setConflictDate(null)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-primary dark:text-gray-50 font-bold text-sm py-4 rounded-xl uppercase tracking-tight hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Manual Selection
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-[12px] leading-tight font-bold mb-4 text-gray-400 dark:text-gray-500 uppercase tracking-normal px-1">Booking Summary</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4 shadow-inner">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-gray-400">Usage ({dayCount} days)</span>
                  <span className="text-primary dark:text-gray-50">AED {usageCost.toLocaleString('de-DE')}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-gray-400">Service Fee</span>
                  <span className="text-primary dark:text-gray-50">AED {Math.round(usageCost * 0.1).toLocaleString('de-DE')}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline">
                  <span className="text-xs font-black text-primary dark:text-gray-50 uppercase tracking-normal">Total</span>
                  <span className="text-2xl font-black text-accent tracking-tighter">AED {Math.round(usageCost * 1.1).toLocaleString('de-DE')}</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 p-5 rounded-2xl flex gap-4 text-accent border border-accent/10">
              <Info className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <p className="text-[12px] leading-tight font-bold uppercase tracking-normal mb-1">Reservation Policy</p>
                <p className="text-[12px] leading-tight font-medium leading-relaxed opacity-80">Funds are held in escrow. You will not be charged until the host confirms availability.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
             <motion.button 
              whileTap={{ scale: 0.98 }}
              disabled={selectedDates.length === 0}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-primary dark:bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-normal text-[12px] leading-tight shadow-2xl shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-30"
            >
              Confirm Dates
            </motion.button>
          ) : (
             <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-primary dark:text-gray-50 rounded-2xl font-black uppercase tracking-normal text-[12px] leading-tight shadow-xl shadow-accent/20 disabled:opacity-80"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing Spot...
                </>
              ) : (
                <>
                  <CalendarDays className="w-4 h-4" />
                  Request Booking
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
