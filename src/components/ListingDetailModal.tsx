import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Heart, Scale, Star, MapPin, ChevronRight, 
  ShieldCheck, CalendarDays, ArrowUpRight, MessageCircle, AlertTriangle, 
  Info, Zap, Shapes, Compass, LayoutGrid, Calendar, Fingerprint, Home, Wallet,
  Share2, Copy, Check, Mail, Send, CheckCircle2, MessageSquare
} from 'lucide-react';
import { AssetListing } from '../types';

export const ListingDetailModal: React.FC<{ 
  listing: AssetListing, 
  isLoggedIn: boolean,
  isOwned?: boolean,
  onClose: () => void, 
  isSaved: boolean, 
  onToggleSave: () => void,
  isInCompare: boolean,
  onToggleCompare: () => void,
  onBook: () => void,
  onBuyFraction: () => void,
  onDispute: () => void,
  onCosharerChat: () => void,
  onHostChat?: () => void,
  onMakeOffer: () => void,
  onLogin: () => void,
  onShowToast?: (msg: string, type?: 'success' | 'error') => void
}> = ({ listing, isLoggedIn, isOwned = false, onClose, isSaved, onToggleSave, isInCompare, onToggleCompare, onBook, onBuyFraction, onDispute, onCosharerChat, onHostChat, onMakeOffer, onLogin, onShowToast }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteContact, setInviteContact] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [referralBonusOption, setReferralBonusOption] = useState('credits');

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
      <motion.div 
        className="fixed inset-0 z-50 bg-white dark:bg-gray-950 overflow-y-auto"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative h-72 md:h-96 bg-gray-100 dark:bg-gray-800">
          <motion.div
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={imgIndex}
                src={images[imgIndex]} 
                alt={listing.title} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover pointer-events-none" 
              />
            </AnimatePresence>
          </motion.div>

          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent pt-safe">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-1.5 py-1 rounded-full border border-white/10 shadow-lg">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsShareOpen(true)}
                className="p-1 px-2.5 text-white hover:text-accent transition-colors flex items-center gap-1 text-xs font-bold"
                title="Share & Invite"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </motion.button>
              <div className="w-px h-4 bg-white/25" />
              <button 
                onClick={onToggleSave}
                className="transition-transform hover:scale-115 active:scale-95 p-1 px-2 text-white"
              >
                <Heart className={`w-4.5 h-4.5 transition-colors ${isSaved ? 'text-accent fill-accent' : 'text-white'}`} style={{ strokeWidth: 2.2 }} />
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === imgIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-6 pb-32">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-gray-50 mb-1">{listing.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{listing.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary dark:text-gray-50">AED {listing.pricePerMonth.toLocaleString('de-DE')}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">per month</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm text-primary dark:text-gray-50">{listing.rating}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">({listing.reviewCount})</span>
            </div>
            {listing.isVerified && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400">
                <ShieldCheck className="w-4 h-4" />
                Verified Asset
              </div>
            )}
            <div className="flex flex-1 justify-end items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              Dubai, UAE
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 text-primary dark:text-gray-50">
              Cosharing Status
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 relative z-0">
              <div className="flex justify-between items-end mb-4 relative z-0">
                <div>
                  <div className="text-[12px] leading-tight font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Available Slots</div>
                  <div className="text-xl font-bold text-primary dark:text-gray-50">{listing.availableSlots} <span className="text-sm font-medium text-gray-400 dark:text-gray-500">/ {listing.totalSlots}</span></div>
                </div>
                <div className="text-right relative z-0">
                  <div className="text-[12px] leading-tight font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Asset Value</div>
                  <div className="font-bold text-primary dark:text-gray-50">AED {listing.totalValue?.toLocaleString('de-DE') || (listing.pricePerMonth * listing.totalSlots * 12).toLocaleString('de-DE')}</div>
                </div>
              </div>

              <div className="flex gap-1 mb-4 relative z-0">
                {Array.from({ length: Number(listing.totalSlots) || 4 }).map((_, i) => {
                  const total = Number(listing.totalSlots) || 4;
                  const avail = typeof listing.availableSlots === 'number' ? listing.availableSlots : 0;
                  const isTaken = i >= (total - avail);
                  return (
                    <div 
                      key={i} 
                      className={`h-2 flex-1 rounded-sm ${isTaken ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-800'}`} 
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-3 relative z-0">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(3, listing.coOwnersCount || 1))].map((_, i) => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/100?u=u${i + (listing.coOwnersCount || 0)}`}
                      alt="Cosharer"
                      className="w-8 h-8 rounded-full border-2 border-gray-50 dark:border-gray-900"
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium font-bold text-primary dark:text-white mt-1">
                  Join <span className="font-extrabold text-accent">{listing.coOwnersCount} others</span> in this asset
                </div>
              </div>
            </div>
          </div>

          {isOwned && (
            <div className="mt-4 p-5 bg-gradient-to-br from-primary via-primary text-white dark:from-gray-901 dark:to-accent/15 border border-accent/20 rounded-3xl relative overflow-hidden shadow-xl shadow-primary/10">
              <div className="absolute -right-4 -bottom-4 p-3 opacity-10">
                <Share2 className="w-24 h-24 text-accent" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] bg-accent/20 text-accent font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Co-ownership Referral</span>
                  <h4 className="text-base font-black uppercase text-accent tracking-normal">Invite Cosharers & Earn Premium Credits</h4>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed">
                    Need partners to join you? Click invite below to send an exclusive fast-track link to family, friends, or contacts:
                  </p>
                  <ul className="text-[11px] text-accent font-semibold space-y-1 mt-1 pl-1">
                    <li className="flex items-center gap-1.5 p-0.5"><Check className="w-3.5 h-3.5" /> Both get 5 hours of premium booking credit</li>
                    <li className="flex items-center gap-1.5 p-0.5"><Check className="w-3.5 h-3.5" /> 0% service/host fees on your next 3 reservations</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsShareOpen(true)}
                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl bg-accent text-primary font-black text-xs uppercase tracking-tight shadow-lg shadow-accent/10"
                  >
                    <Share2 className="w-4 h-4" />
                    Invite Cosharers
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {listing.availableSlots === listing.totalSlots && (
            <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-2xl relative z-0">
              <h4 className="flex items-center gap-2 font-bold text-accent mb-2 text-sm uppercase tracking-normal">
                <Star className="w-4 h-4 fill-accent" />
                First Cosharer Exclusivity
              </h4>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                Become the pioneer! If you are the first cosharer, you'll unlock a 10-day exclusivity period to privately invite friends and family before the remaining slots are publicly listed.
              </p>
            </div>
          )}

          {listing.specifications && Object.keys(listing.specifications).length > 0 && (
            <div className="mb-8 relative z-0">
              <h3 className="font-bold mb-4 text-primary dark:text-gray-50">Specifications</h3>
              <div className="grid grid-cols-2 gap-3 relative z-0">
                {Object.entries(listing.specifications).filter(([key]) => key.toLowerCase() !== 'vin').map(([key, value]) => {
                  const specIconMap: Record<string, any> = {
                    'Condition': ShieldCheck,
                    'Mileage': Zap,
                    'Fuel Type': Shapes,
                    'Specs': Compass,
                    'Transmission': LayoutGrid,
                    'Engine Hours': Calendar,
                    'Length': ArrowUpRight,
                    'Year': Calendar,
                    'Material': Fingerprint,
                    'Movement': Zap,
                    'Bedrooms': Home,
                    'Area (sqft)': LayoutGrid
                  };

                  const SpecIcon = specIconMap[key] || Info;

                  return (
                    <div key={key} className="flex flex-col p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 relative z-0">
                      <div className="flex items-center gap-1.5 mb-1 text-gray-500 dark:text-gray-400">
                        <SpecIcon className="w-3.5 h-3.5" />
                        <span className="text-[12px] leading-tight font-bold uppercase tracking-wider">{key}</span>
                      </div>
                      <div className="font-semibold text-sm text-primary dark:text-gray-50">{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {listing.agent && (
            <div className="mb-8">
              <h3 className="font-bold mb-4 text-primary dark:text-gray-50">About the Host</h3>
              <div 
                onClick={() => onHostChat && onHostChat()}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 relative z-0 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <img 
                  src={listing.agent.avatar} 
                  alt={listing.agent.name}
                  className="w-12 h-12 rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-0.5 relative z-0"
                />
                <div className="flex-1 relative z-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-bold text-sm text-primary dark:text-gray-50">{listing.agent.name}</span>
                    {listing.agent.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-accent fill-accent/10" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{listing.agent.rating}</span>
                    • Host
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 relative z-0" />
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50">
          {isLoggedIn ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                 <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={!isOwned ? (listing.goal === 'Co-own' ? onBuyFraction : onMakeOffer) : (listing.availableSlots > 0 && (listing.specifications?.['Condition'] === 'New' || listing.type === 'dealer' || listing.availableSlots === listing.totalSlots) ? undefined : onBook)}
                  disabled={isOwned && listing.availableSlots > 0 && (listing.specifications?.['Condition'] === 'New' || listing.type === 'dealer' || listing.availableSlots === listing.totalSlots)}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold border shadow-sm transition-colors ${
                    isOwned && listing.availableSlots > 0 && (listing.specifications?.['Condition'] === 'New' || listing.type === 'dealer' || listing.availableSlots === listing.totalSlots)
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-950 border-gray-900 dark:border-gray-50'
                  }`}
                >
                  {isOwned ? <CalendarDays className="w-5 h-5" /> : (listing.goal === 'Co-own' ? <Wallet className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />)}
                  {isOwned ? (listing.availableSlots > 0 && (listing.specifications?.['Condition'] === 'New' || listing.type === 'dealer' || listing.availableSlots === listing.totalSlots) ? 'Pending Slots' : 'Book Usage') : (listing.goal === 'Co-own' ? 'Acquire Fraction' : 'Make an Offer')}
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isOwned) {
                      onCosharerChat();
                    } else {
                      if (listing.goal === 'Co-own') {
                        onMakeOffer();
                      } else {
                        if (onHostChat) onHostChat();
                        else onCosharerChat();
                      }
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  {isOwned ? 'Chat' : (listing.goal === 'Co-own' ? 'Make Offer / Chat' : 'Chat')}
                </motion.button>
              </div>
              {isOwned && (
                <div>
                   <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={onDispute}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl font-bold border border-red-100 dark:border-red-900/50"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Report Issue / Dispute
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Log in to book usage and chat</p>
              <button 
                onClick={onLogin}
                className="px-6 py-3 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-bold rounded-xl whitespace-nowrap"
              >
                Log In
              </button>
            </div>
          )}
        </div>

        {/* Share & Invite Bottom Sheet Overlay */}
        <AnimatePresence>
          {isShareOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsShareOpen(false)}
                className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-gray-950 rounded-t-[2.5rem] border-t border-gray-200 dark:border-gray-800 z-[160] overflow-y-auto flex flex-col pt-safe text-left"
              >
                <div className="w-full flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-850 rounded-full"></div>
                </div>

                <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-900">
                  <div>
                    <h3 className="font-black text-lg text-primary dark:text-gray-50 uppercase tracking-tight">Share & Invite<span className="text-accent">.</span></h3>
                    <p className="text-xs text-gray-400 font-medium">Spread the word or invite co-owners</p>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsShareOpen(false)}
                    aria-label="Close Share Overlay"
                    className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50 border border-gray-100 dark:border-gray-800"
                  >
                    Close
                  </motion.button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Share Asset Summary Card */}
                  <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-850">
                    <img src={images[0]} alt="" className="w-16 h-12 object-cover rounded-xl" />
                    <div>
                      <h4 className="font-bold text-sm text-primary dark:text-gray-50">{listing.title}</h4>
                      <p className="text-[11px] font-black text-accent uppercase tracking-normal">{listing.category}</p>
                      <p className="text-xs text-gray-500 font-medium">{listing.availableSlots} / {listing.totalSlots} Slots left</p>
                    </div>
                  </div>

                  {/* Copy link */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Asset Link</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={`https://coshare.ae/listings/${listing.id}`}
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-mono text-gray-500 select-all outline-none" 
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigator.clipboard.writeText(`https://coshare.ae/listings/${listing.id}`);
                          setCopied(true);
                          if (onShowToast) onShowToast('Link copied to clipboard!');
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Social sharing links */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Social Channels</label>
                    <div className="grid grid-cols-4 gap-2">
                      <a 
                        href={`https://api.whatsapp.com/send?text=Hey!%20Join%20me%20in%20co-owning%20this%20amazing%20${encodeURIComponent(listing.title)}%20on%20CoShare!%20Only%20${listing.availableSlots}%20slots%20left:%20https://coshare.ae/listings/${listing.id}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => { if (onShowToast) onShowToast('Opening WhatsApp...'); }}
                        className="flex flex-col items-center justify-center p-3 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30 border border-green-100/50 rounded-2xl text-center group transition-colors"
                      >
                        <svg className="w-6 h-6 text-[#25D366] transition-transform group-hover:scale-110 duration-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.261 2.268 3.504 5.28 3.5 8.485-.01 6.657-5.347 11.993-11.956 11.993-2.005 0-3.974-.503-5.717-1.46L0 24zm6.59-2.735c1.606.953 3.197 1.455 4.82 1.456 5.486 0 9.95-4.461 9.956-9.94.004-2.654-1.023-5.15-2.89-7.02-1.87-1.873-4.364-2.903-7.027-2.904-5.485 0-9.947 4.461-9.953 9.942-.001 1.777.49 3.511 1.42 5.058L1.13 22.842l6.517-1.577zm11.064-7.466c-.3-.15-1.77-.874-2.046-.975-.275-.101-.476-.15-.676.15-.199.3-.776.974-.951 1.176-.176.201-.351.226-.651.075-1.25-.625-2.083-1.036-2.917-2.463-.235-.4-.471-.803-.131-1.144.3-.3.473-.525.648-.75.176-.226.236-.375.352-.625.115-.25.059-.475-.03-.625-.09-.15-.75-1.849-1.03-2.518-.27-.648-.54-.56-.75-.56l-.643-.008c-.22 0-.576.08-.876.413-.3.33-1.152 1.127-1.152 2.752 0 1.625 1.183 3.198 1.344 3.424.161.226 2.327 3.554 5.64 4.981.787.34 1.4.542 1.88.697.79.25 1.512.215 2.082.129.635-.096 1.77-.724 2.022-1.388.251-.663.251-1.23.176-1.348-.075-.118-.275-.199-.575-.349z"/>
                        </svg>
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold mt-1 uppercase">WhatsApp</span>
                      </a>

                      <a 
                        href={`https://twitter.com/intent/tweet?text=Join%20me%20in%20co-owning%20this%20amazing%20${encodeURIComponent(listing.title)}%20on%20CoShare!%20https://coshare.ae/listings/${listing.id}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => { if (onShowToast) onShowToast('Opening Twitter X...'); }}
                        className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 border border-gray-100 dark:border-gray-800 rounded-2xl text-center group transition-colors"
                      >
                        <svg className="w-5 h-5 text-black dark:text-white transition-transform group-hover:scale-110 duration-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold mt-1.5 uppercase">Twitter X</span>
                      </a>

                      <a 
                        href={`https://t.me/share/url?url=https://coshare.ae/listings/${listing.id}&text=Join%20me%20in%20co-owning%20this%20amazing%20${encodeURIComponent(listing.title)}%20on%20CoShare!`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => { if (onShowToast) onShowToast('Opening Telegram...'); }}
                        className="flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 border border-blue-100/50 rounded-2xl text-center group transition-colors"
                      >
                        <svg className="w-5.5 h-5.5 text-[#229ED9] transition-transform group-hover:scale-110 duration-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.2.01-.08.02-1.3 1.02-3.66 2.61-.34.24-.66.35-.94.35-.32 0-.93-.17-1.38-.32-.56-.18-1-.28-.96-.59.02-.16.24-.33.66-.51 2.58-1.12 4.31-1.87 5.17-2.22 2.46-.99 2.97-1.17 3.31-1.17.07 0 .24.02.35.1.1.08.13.18.14.24-.01.07-.01.16-.02.26z"/>
                        </svg>
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold mt-1.5 uppercase">Telegram</span>
                      </a>

                      <a 
                        href={`mailto:?subject=Let's%20co-own%20this%20${encodeURIComponent(listing.title)}%20together!&body=Hey,%20check%20out%20this%20fractional%20asset%20on%20CoShare.%20Only%20${listing.availableSlots}%20slots%20left!%250D%250DJoin%20at%20https://coshare.ae/listings/${listing.id}`}
                        onClick={() => { if (onShowToast) onShowToast('Opening Email...'); }}
                        className="flex flex-col items-center justify-center p-3 bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30 border border-purple-100/50 rounded-2xl text-center group transition-colors"
                      >
                        <Mail className="w-5.5 h-5.5 text-purple-600 transition-transform group-hover:scale-110 duration-200" />
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold mt-1.5 uppercase">Email</span>
                      </a>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-900 my-4" />

                  {/* Quick Direct Invitation Referral Form */}
                  <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Send className="w-4 h-4 text-accent" />
                      <h4 className="text-xs font-black uppercase text-primary dark:text-gray-50">Direct CoShare Invitation</h4>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                      Send a dynamic direct link straight to CoShare's database. We'll pre-allocate a co-ownership request for them under your fast-track code.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider mb-1">Friend's Name</label>
                        <input 
                          type="text" 
                          required
                          value={inviteName}
                          onChange={(e) => setInviteName(e.target.value)}
                          placeholder="e.g. Salim Al Hashimi"
                          className="w-full px-3 py-2.5 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-xs outline-none focus:border-accent text-primary dark:text-gray-50 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider mb-1">Email or Mobile Phone</label>
                        <input 
                          type="text" 
                          required
                          value={inviteContact}
                          onChange={(e) => setInviteContact(e.target.value)}
                          placeholder="e.g. salim@gmail.com or +971 50..."
                          className="w-full px-3 py-2.5 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-xs outline-none focus:border-accent text-primary dark:text-gray-50 font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button 
                          type="button" 
                          onClick={() => setReferralBonusOption('credits')}
                          className={`p-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-center ${
                            referralBonusOption === 'credits' 
                            ? 'bg-accent/15 border-accent text-accent' 
                            : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-gray-400'
                          }`}
                        >
                          Earn Credits
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setReferralBonusOption('split')}
                          className={`p-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-center ${
                            referralBonusOption === 'split' 
                            ? 'bg-accent/15 border-accent text-accent' 
                            : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-gray-400'
                          }`}
                        >
                          Split Host Fee
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!inviteName.trim() || !inviteContact.trim()) return;
                        setInviteLoading(true);
                        setTimeout(() => {
                          setInviteLoading(false);
                          if (onShowToast) {
                            onShowToast(`Exclusive invite link sent to ${inviteName}!`);
                          }
                          setInviteName('');
                          setInviteContact('');
                          setIsShareOpen(false);
                        }, 1200);
                      }}
                      disabled={inviteLoading || !inviteName.trim() || !inviteContact.trim()}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                        inviteLoading || !inviteName.trim() || !inviteContact.trim()
                        ? 'bg-gray-100 dark:bg-gray-850 text-gray-400 cursor-not-allowed'
                        : 'bg-accent text-primary dark:text-gray-50 shadow-md shadow-accent/15'
                      }`}
                    >
                      {inviteLoading ? 'Sending Invitation' : 'Send Invitation Request'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
  );
};