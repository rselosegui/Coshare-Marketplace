import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info, Wallet, Loader2 } from 'lucide-react';
import { AssetListing } from '../types';

export const ResellFlow = ({ asset, slotsOwned = 1, onComplete, onCancel }: { asset: AssetListing, slotsOwned?: number, onComplete: (price?: number, shares?: number) => void, onCancel: () => void }) => {
  const [step, setStep] = useState<'details' | 'confirm' | 'formal-offer'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [askingPrice, setAskingPrice] = useState(asset.pricePerMonth);
  const [sharesToSell, setSharesToSell] = useState(1);

  const equityValue = (asset.totalValue ? asset.totalValue / 4 : asset.pricePerMonth * 2) * sharesToSell;

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete(askingPrice, sharesToSell);
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
              if (step === 'confirm' || step === 'formal-offer') setStep('details');
              else onCancel();
            }}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="font-black text-lg text-primary dark:text-gray-50 uppercase tracking-tight">
            Resell Share<span className="text-accent">.</span>
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
            <div>
              <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3">Estimated Equity Value</h3>
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 text-center">
                <Wallet className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-black text-accent">AED {equityValue.toLocaleString('de-DE')}</p>
                <p className="text-[12px] font-bold text-accent/70 uppercase tracking-tight mt-1">Based on current market value</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3">Shares to Sell</h3>
              <div className="flex bg-gray-50 dark:bg-gray-900 rounded-xl p-2 max-w-[200px] mx-auto">
                {Array.from({ length: slotsOwned }).map((_, i) => {
                   const num = i + 1;
                   return (
                     <button 
                       key={num}
                       onClick={() => setSharesToSell(num)}
                       className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${sharesToSell === num ? 'bg-white dark:bg-gray-950 text-primary dark:text-gray-50 shadow-sm' : 'text-gray-400 hover:text-primary'}`}
                     >
                       {num}
                     </button>
                   );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3">Asking Price (AED)</h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">AED</span>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={askingPrice ? askingPrice.toLocaleString('de-DE') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setAskingPrice(val ? Number(val) : 0);
                  }}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-transparent focus:border-accent outline-none text-xl font-bold text-primary dark:text-gray-50 transition-colors"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Selling active shares on the CoShare marketplace incurs a 2.5% transaction fee upon successful transfer.</p>
            </div>
          </div>
        ) : step === 'confirm' ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center py-6">
            <h3 className="font-bold text-2xl text-primary dark:text-gray-50 mb-2">Review Listing</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[260px] mx-auto font-medium">
              You are about to list {sharesToSell} share(s) of the {asset.title}.
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 text-left my-8 scale-105 shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-sm font-bold text-gray-500">Asking Price</span>
                 <span className="font-black text-lg text-primary dark:text-gray-50">AED {askingPrice.toLocaleString('de-DE')}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                 <span className="text-sm font-bold text-gray-500">Platform Fee (2.5%)</span>
                 <span className="font-bold text-gray-500">- AED {(askingPrice * 0.025).toLocaleString('de-DE')}</span>
               </div>
               <div className="h-px w-full bg-gray-200 dark:bg-gray-800 mb-4" />
               <div className="flex justify-between items-center">
                 <span className="text-sm font-black text-primary dark:text-gray-50">Estimated Payout</span>
                 <span className="font-black text-xl text-accent">AED {(askingPrice * 0.975).toLocaleString('de-DE')}</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 py-2">
            <h3 className="font-bold text-2xl text-primary dark:text-gray-50 tracking-tight mb-2 text-center">Formal Offer</h3>
            <p className="text-[12px] font-medium text-gray-500 mb-6 text-center leading-relaxed max-w-[280px] mx-auto">
              This asset is privately listed. Your co-owners have the first right of refusal. They can accept or counter your offer via CoShare Messages.
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
              <h4 className="text-[10px] font-bold text-accent uppercase tracking-wide">Preview Message</h4>
              
              <div className="bg-white dark:bg-gray-950 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-sm">
                <p className="font-medium text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                  I'm looking to resell {sharesToSell} of my fraction(s) in the {asset.title}. I am offering this to the co-owner group first for <span className="font-black text-primary dark:text-gray-50">AED {askingPrice.toLocaleString('de-DE')}</span>.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="py-2 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center font-bold text-gray-400 text-[12px]">Counter Offer</div>
                  <div className="py-2 flex items-center justify-center rounded-lg bg-accent text-white shadow-sm text-center font-bold text-[12px]">Accept</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-accent/5 p-4 rounded-3xl border border-accent/20">
               <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-accent text-accent focus:ring-accent" />
               <p className="text-[12px] font-medium text-gray-500 leading-relaxed">
                 Allow this offer to be forwarded to pre-approved third parties if co-owners decline.
               </p>
            </div>
            
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-wide font-bold">
              If declined by all, it will be listed publicly.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pt-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-10 mx-auto max-w-md w-full">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (step === 'details') {
              setStep(asset.visibility === 'private' ? 'formal-offer' : 'confirm');
            } else {
              handleComplete();
            }
          }}
          disabled={isLoading}
          className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 rounded-2xl font-black text-[12px] uppercase tracking-normal shadow-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 'details' ? (
            'Review Details'
          ) : step === 'formal-offer' ? (
            'Send to Co-owners'
          ) : (
            'List on Marketplace'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
