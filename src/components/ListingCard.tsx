import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Scale, ShieldCheck, Star, Plus } from 'lucide-react';
import { AssetListing } from '../types';

export const ListingCard: React.FC<{ 
  listing: AssetListing, 
  onClick: () => void, 
  isSaved: boolean, 
  onToggleSave: () => void,
  isInCompare: boolean,
  onToggleCompare: () => void
}> = ({ listing, onClick, isSaved, onToggleSave, isInCompare, onToggleCompare }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const images = listing.images && listing.images.length > 0 ? listing.images : [listing.image];

  const handleDragEnd = (_e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
    if (swipe && images.length > 1) {
      if (offset.x > 0) {
        setImgIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        setImgIndex((prev) => (prev + 1) % images.length);
      }
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer h-full flex flex-col active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <motion.div
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <img 
            key={imgIndex}
            src={images[imgIndex]} 
            alt={listing.title} 
            className="w-full h-full object-cover pointer-events-none transition-opacity duration-200" 
          />
        </motion.div>

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === imgIndex ? 'w-4 bg-white dark:bg-gray-950' : 'w-1 bg-white dark:bg-gray-950/50'
                }`} 
              />
            ))}
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {listing.isFeatured && (
            <div className="bg-primary dark:bg-gray-900 text-accent text-[10px] leading-tight font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
              Featured
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className="transition-transform hover:scale-115 active:scale-95 p-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          >
            <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'text-accent fill-accent' : 'text-white'}`} style={{ strokeWidth: 2 }} />
          </button>
        </div>
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-bold text-primary dark:text-gray-50 text-sm line-clamp-2 min-h-[40px] mb-1 flex items-start gap-1.5 leading-tight">
          {listing.isVerified && (
            <ShieldCheck className="w-4 h-4 text-green-500 fill-green-50 shrink-0 mt-0.5" />
          )}
          {listing.title}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-primary dark:text-gray-50">{listing.rating || '0.0'}</span>
          <span className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-medium">({listing.reviewCount || 0})</span>
        </div>
        
        <p className="text-[12px] leading-tight text-gray-500 dark:text-gray-400 mb-3 line-clamp-1 h-3.5 font-medium">{listing.subtitle}</p>
        
        <div className="flex items-center gap-2 mb-3">
          {listing.availableSlots < (listing.totalSlots || 4) ? (
            <>
              <div className="flex -space-x-1.5 overflow-hidden">
                {[...Array(Math.min(3, (listing.totalSlots || 4) - listing.availableSlots))].map((_, i) => (
                  <div key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-gray-950 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=u${i + (listing.id)}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[12px] leading-tight font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                {(listing.totalSlots || 4) - listing.availableSlots} active
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/5 border border-accent/10 rounded-full">
              <Plus className="w-3 h-3 text-accent" />
              <span className="text-[9px] font-black text-accent uppercase tracking-normal">Be the pioneer</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-50 dark:border-gray-800">
          <div>
            <span className="font-bold text-sm text-primary dark:text-gray-50">AED {listing.pricePerMonth.toLocaleString('de-DE')}</span>
            <span className="text-[12px] leading-tight text-gray-500 dark:text-gray-400">/mo</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[12px] leading-tight font-bold text-primary dark:text-gray-50">
              {typeof listing.availableSlots === 'number' ? listing.availableSlots : 0}{' '}
              <span className="text-gray-400 dark:text-gray-500 font-medium">
                / {listing.totalSlots || 4} slots left
              </span>
            </span>
            <div className="flex gap-0.5 w-16">
              {Array.from({ length: listing.totalSlots || 4 }).map((_, i) => {
                const total = listing.totalSlots || 4;
                const avail = typeof listing.availableSlots === 'number' ? listing.availableSlots : 0;
                const taken = total - avail;
                return (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-sm ${i < taken ? 'bg-accent' : 'bg-gray-100 dark:bg-gray-800'}`} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
