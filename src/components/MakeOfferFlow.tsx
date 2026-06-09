import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Wallet, Loader2, Handshake, CalendarDays, Clock } from 'lucide-react';
import { AssetListing, Offer } from '../types';

export const MakeOfferFlow = ({ asset, onComplete, onCancel }: { asset: AssetListing, onComplete: (offer: Offer) => void, onCancel: () => void }) => {
  const [step, setStep] = useState<'details' | 'confirm'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [offerPrice, setOfferPrice] = useState(asset.pricePerMonth);
  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(1);

  const isCoOp = asset.goal === 'Co-own' || !asset.goal;

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete({
        price: offerPrice,
        shares: isCoOp ? sharesToBuy : undefined,
        startDate: !isCoOp ? startDate : undefined,
        duration: !isCoOp ? duration : undefined,
        type: isCoOp ? 'co-own' : (asset.goal === 'Swap' ? 'swap' : 'share'),
        status: 'pending'
      });
    }, 1500);
  };

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
      className="absolute inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col pt-safe overflow-hidden"
    >
      <div className="w-full flex justify-center pt-3 pb-1">
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
      </div>
      
      <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (step === 'confirm') setStep('details');
              else onCancel();
            }}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="font-black text-lg text-primary dark:text-gray-50 uppercase tracking-tight">
            Make an Offer<span className="text-accent">.</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 p-6 space-y-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-5 flex items-center gap-4">
           <img src={asset.image} alt={asset.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
           <div>
             <h3 className="font-bold text-primary dark:text-gray-50 text-lg leading-tight mb-1 truncate max-w-[200px]">{asset.title}</h3>
             <p className="text-[12px] font-bold text-gray-500 uppercase">{asset.category}</p>
           </div>
        </div>

        {step === 'details' ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {isCoOp ? (
              <div>
                <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3 flex items-center justify-between">
                  <span>Shares to Buy</span>
                  {asset.totalSlots && (
                    <span className="text-accent text-xs">{(sharesToBuy / asset.totalSlots * 100).toFixed(1)}% Ownership</span>
                  )}
                </h3>
                <div className="flex bg-gray-50 dark:bg-gray-900 rounded-xl p-2 max-w-[200px] mx-auto">
                  {Array.from({ length: asset.availableSlots || 1 }).map((_, i) => {
                     const num = i + 1;
                     return (
                       <button 
                         key={num}
                         onClick={() => setSharesToBuy(num)}
                         className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${sharesToBuy === num ? 'bg-white dark:bg-gray-950 text-primary dark:text-gray-50 shadow-sm' : 'text-gray-400 hover:text-primary'}`}
                       >
                         {num}
                       </button>
                     );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3 block">Start Date</h3>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-[52px] pr-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-transparent focus:border-accent outline-none font-bold text-primary dark:text-gray-50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3 block">Duration</h3>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full pl-[52px] pr-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-transparent focus:border-accent outline-none font-bold text-primary dark:text-gray-50 transition-colors appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 12, 24].map(m => (
                        <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3">Your Offer Price (AED)</h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">AED</span>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={offerPrice ? offerPrice.toLocaleString('de-DE') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setOfferPrice(val ? Number(val) : 0);
                  }}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-transparent focus:border-accent outline-none text-xl font-bold text-primary dark:text-gray-50 transition-colors"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center py-6">
            <h3 className="font-bold text-2xl text-primary dark:text-gray-50 mb-2">Review Offer</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[260px] mx-auto font-medium">
              {isCoOp ? (
                <>You are offering AED {offerPrice.toLocaleString('de-DE')} for {sharesToBuy} share(s) of the {asset.title}.</>
              ) : (
                <>You are offering AED {offerPrice.toLocaleString('de-DE')} to {asset.goal?.toLowerCase()} the {asset.title} for {duration} month(s) starting {new Date(startDate).toLocaleDateString()}.</>
              )}
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 text-left my-8 scale-105 shadow-sm border border-gray-100 dark:border-gray-800 flex justify-center items-center flex-col gap-4">
               <Handshake className="w-12 h-12 text-accent" />
               <div className="text-center">
                 <span className="text-sm font-bold text-gray-500 block mb-1">Your Proposed Offer</span>
                 <span className="font-black text-2xl text-primary dark:text-gray-50">AED {offerPrice.toLocaleString('de-DE')}</span>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pt-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-10 mx-auto max-w-md w-full">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (step === 'details') setStep('confirm');
            else handleComplete();
          }}
          disabled={isLoading}
          className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 rounded-2xl font-black text-[12px] uppercase tracking-normal shadow-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 'details' ? 'Review Offer' : 'Submit Offer to Owner'}
        </motion.button>
      </div>
    </motion.div>
  );
};
