import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BookingFlow } from './components/BookingFlow';
import { ResellFlow } from './components/ResellFlow';
import { MakeOfferFlow } from './components/MakeOfferFlow';
import { AcquireFractionFlow } from './components/AcquireFractionFlow';
import { ListAssetFlow } from './components/ListAssetFlow';
import { FilterModal } from './components/FilterModal';
import { ListingCard } from './components/ListingCard';
import { Header } from './components/Header';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SplashFlow } from './components/SplashFlow';
import { CoshareLogo } from './components/CoshareLogo';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SlidersHorizontal, Bell, CarFront, Bike, Sailboat, 
  Home, CircleDashed, Watch, Heart, Star, Users, Plus, ShoppingBag, Layers, X,
  User, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, MapPin, Info, LayoutGrid,
  Calendar, ArrowUpRight, ArrowDownLeft, MessageCircle, Settings, Wallet, Zap, Shield, Compass, Shapes, ArrowRight,
  Fingerprint, CreditCard, Lock, HelpCircle, Camera, Video, ClipboardCheck, History, Gauge, AlertCircle, Play,
  CalendarDays, AlertTriangle, Scale, Hammer, Handshake, RefreshCcw, Sun, Moon, Trash2, Edit
, PenTool, Loader2, Eye, EyeOff, Building2, ShieldAlert, Check
} from 'lucide-react';
import { categories, mockListings, mockConversations } from './data';
import { AssetListing, Conversation, Message, ViewMode, EntityType, ListingGoal, NavPreference, ListingForm, FilterState } from './types';

// Map string icon names to Lucide components
const IconMap: Record<string, React.ElementType> = {
  CarFront, Bike, Sailboat, Home, Watch, ShoppingBag, LayoutGrid, Compass, Shapes
};



// Define notification type to appease typescript
type NotificationItem = { title: string, desc: string, time: string, type: string, unread: boolean };
const SwipableNotification: React.FC<{ note: NotificationItem, onShowToast: (msg: string) => void }> = ({ note, onShowToast }) => {
  const [removed, setRemoved] = useState(false);
  if (removed) return null;

  return (
    <div className="relative group overflow-hidden rounded-2xl mb-4 bg-red-500">
      <div className="absolute right-0 top-0 bottom-0 text-white flex justify-end items-center px-6 w-full z-0 h-full">
        <Trash2 className="w-5 h-5 mr-1" />
        <span className="font-bold text-xs uppercase tracking-normal opacity-90">Clear</span>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.8, right: 0 }}
        onDragEnd={(_e, { offset, velocity }) => {
          if (offset.x < -80 || velocity.x < -500) {
            setRemoved(true);
          }
        }}
        onClick={() => onShowToast(`Opened notification: ${note.title}`)}
        className={`p-4 rounded-2xl border transition-all flex gap-4 text-left relative z-10 cursor-pointer ${note.unread ? 'bg-white dark:bg-gray-900 border-accent/20 shadow-sm ring-1 ring-accent/10' : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 opacity-90'}`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          note.type === 'request' ? 'bg-accent text-white' : 
          note.type === 'system' ? 'bg-primary dark:bg-gray-900 text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
        }`}>
          <Zap className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-primary dark:text-gray-50 truncate pr-2">{note.title}</h4>
            <span className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap ml-2">{note.time}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            {note.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const NotificationsView = ({ onBack, onShowToast }: { onBack: () => void, onShowToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-950 animate-in slide-in-from-top duration-500">
    <div className="pt-12 pb-4 px-6 sticky top-0 bg-white dark:bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
      <div className="text-left">
        <h2 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight">Notifications<span className="text-accent">.</span></h2>
        <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-0.5">Live Feed</p>
      </div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl text-primary dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 font-bold" strokeWidth={3} />
      </motion.button>
    </div>
    
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal text-center mb-4">&larr; Swipe left to clear</p>
      {[
        { title: 'New Proposal', desc: 'Sarah J. sent a co-sharing request for the asset.', time: '5m ago', type: 'request', unread: true },
        { title: 'Trust Index Updated', desc: 'Your Trust Index rose to 98% after a successful cycle.', time: '2h ago', type: 'system', unread: true },
        { title: 'Spot Available', desc: 'A spot opened up for your saved asset.', time: '1d ago', type: 'watchlist', unread: false },
        { title: 'Payment Confirmed', desc: 'Monthly equity for Porsche 911 was successfully processed.', time: '2d ago', type: 'billing', unread: false },
      ].map((note, i) => (
        <SwipableNotification key={i} note={note} onShowToast={onShowToast} />
      ))}
      
      <div className="py-8 text-center">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onShowToast('All notifications marked as read')}
          className="text-[12px] leading-tight text-accent font-bold uppercase tracking-normal hover:underline"
        >
          Mark all as read
        </motion.button>
      </div>
    </div>
  </div>
);

const HubAssetView = ({ asset, onBack, onChat, onDetails, onSettings }: { asset: AssetListing, onBack: () => void, onChat: () => void, onDetails: () => void, onSettings: () => void }) => {
  const [showValuation, setShowValuation] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // Users bookings mockup
  const bookings = [
    { start: 3, end: 5, user: 'John D.', color: 'bg-blue-400', isMe: false, isPrivate: false },
    { start: 12, end: 15, user: 'Me', color: 'bg-green-400', isMe: true, isPrivate: false },
    { start: 18, end: 20, user: 'Sarah J.', color: 'bg-yellow-400', isMe: false, isPrivate: false },
  ];

  // Mock allowance data
  const slotsOwned = 1; // Simulated slots owned by user for this asset
  const daysPerSlot = 44; 
  const totalDaysAllocated = slotsOwned * daysPerSlot;
  const daysUtilized = 12; // Mock used days
  const currentDaysRemaining = totalDaysAllocated - daysUtilized;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 animate-in fade-in duration-500">
      <div className="pt-12 pb-4 px-6 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl text-primary dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h2 className="text-xl font-black text-primary dark:text-gray-50 tracking-tight truncate max-w-[200px]">{asset.title}</h2>
            <p className="text-[10px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-0.5">Asset Dashboard</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onChat}
            className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl text-accent hover:bg-accent hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 space-y-6">
        {/* Banner */}
        <div className="relative h-48 w-full bg-white dark:bg-gray-900 shadow-sm overflow-hidden text-left">
          <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-end items-end gap-2">
            <div className="w-full flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/20 px-2 py-0.5 rounded backdrop-blur-sm w-fit mb-1">{asset.category}</p>
                <h3 className="text-white font-bold text-xl">{asset.title}</h3>
              </div>
              <div className="flex gap-2">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[12px] font-bold p-2.5 rounded-xl transition-colors shrink-0"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={onDetails}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[12px] font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-6">
          {/* Valuation Card */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-accent" />
                <h4 className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">My Equity Value</h4>
              </div>
              <button onClick={() => setShowValuation(!showValuation)} className="text-gray-400 hover:text-gray-600 transition-colors">
                {showValuation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div>
              <p className="text-2xl font-black text-primary dark:text-gray-50">
                {showValuation ? `AED ${((asset.totalValue || 0) * 0.25).toLocaleString('de-DE')}` : '••••••••'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on 25% ownership share</p>
            </div>
          </div>

          {/* Booking Allowance & History Card */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-left space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Booking Allowance</h4>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-lg"
                >
                  {showHistory ? 'View Allowance' : 'View History'}
                </button>
              </div>

              {!showHistory ? (
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl animate-in fade-in duration-300">
                   <div className="text-center flex-1">
                      <p className="text-xl font-black text-primary dark:text-gray-50">{totalDaysAllocated}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Allocated</p>
                   </div>
                   <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                   <div className="text-center flex-1">
                      <p className="text-xl font-black text-primary dark:text-gray-50">{daysUtilized}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Utilized</p>
                   </div>
                   <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                   <div className="text-center flex-1">
                      <p className={`text-xl font-black ${currentDaysRemaining === 0 ? 'text-red-500' : 'text-accent'}`}>{currentDaysRemaining}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wide mt-1 ${currentDaysRemaining === 0 ? 'text-red-500/70' : 'text-accent/70'}`}>Remaining</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-300">
                  {[
                    { id: 1, date: 'May 10 - May 14', days: 4, status: 'Completed' },
                    { id: 2, date: 'April 02 - April 05', days: 3, status: 'Completed' },
                    { id: 3, date: 'March 15 - March 20', days: 5, status: 'Completed' }
                  ].map(past => (
                    <div key={past.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
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
              )}
          </div>

          {/* Availability Calendar */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <h4 className="text-[12px] font-bold text-primary dark:text-gray-50 uppercase tracking-wide mb-4">Availability & Bookings</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold text-center text-gray-400 py-1">{d}</div>
                ))}
                {Array.from({ length: 28 }).map((_, i) => {
                  const day = i + 1;
                  const booking = bookings.find(b => day >= b.start && day <= b.end);
                  return (
                    <div 
                      key={day} 
                      className={`aspect-square rounded-lg flex items-center justify-center text-[12px] font-medium transition-colors ${
                        booking ? `${booking.color} text-white shadow-sm` : 'bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Legend</p>
                {bookings.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${b.color}`} />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      {b.isMe ? 'My Booking' : (asset.visibility === 'private' ? b.user : 'Co-owner')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* External Monetization Toggle */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="text-left flex-1">
              <h4 className="text-[12px] font-bold text-primary dark:text-gray-50 uppercase tracking-wide mb-1 flex items-center gap-2">
                External Monetization
                <span className="bg-accent/10 text-accent text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Optional</span>
              </h4>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">Allow verified non-owners to rent unused blocks of time at a specified rate to offset maintenance fees.</p>
            </div>
            <div className="ml-4 shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const CommunityView = ({ onOpenSettings, onOpenHandover, onBook, onOpenHubAsset, onResell, userRole = 'user', onOpenReviewQueue }: { onOpenSettings: () => void, onOpenHandover: () => void, onBook: (asset: any) => void, onOpenHubAsset: (asset: any) => void, onResell: (asset: any) => void, userRole?: 'user' | 'dealer', onOpenReviewQueue?: () => void }) => {
  const [scheduleView, setScheduleView] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 5, 1)); // Default to June 2024 for mockup
  const totalEquity = 1245000;
  
  const upcomingUsage = [
    { id: '1', title: 'Azimut 50 Flybridge', category: 'Boats', icon: 'Sailboat', date: 'June 12 - June 15', location: 'Dubai Marina', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80', startDay: 12, endDay: 15, month: 5, year: 2024 },
    { id: '1_overlap', title: 'Rolex Submariner', category: 'Watches', icon: 'Watch', date: 'June 14 - June 17', location: 'Dubai Marina', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80', startDay: 14, endDay: 17, month: 5, year: 2024 },
    { id: '2', title: 'Porsche 911 Carrera S', category: 'Cars', icon: 'CarFront', date: 'June 14 - June 14', location: 'Downtown Dubai', image: 'https://images.unsplash.com/photo-1503376712341-ea1d82ddffb5?w=800&q=80', startDay: 14, endDay: 14, month: 5, year: 2024 }
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // 0 is Monday, 6 is Sunday
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 animate-in fade-in duration-500">
      {/* Hangar Header */}
      <div className="pt-12 pb-4 px-6 sticky top-0 bg-white dark:bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight">
            {userRole === 'dealer' ? 'Dealer Dashboard' : 'The Hub'}<span className="text-accent">.</span>
          </h2>
          <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-0.5">{userRole === 'dealer' ? 'Co-ownership Management' : 'Asset Control & Equity'}</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSettings}
          className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl text-primary dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 pb-24">
        {userRole === 'dealer' ? (
          <>
            {/* Dealer Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary dark:bg-gray-900 p-5 rounded-3xl text-white shadow-xl shadow-primary/20 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Wallet className="w-12 h-12" />
                </div>
                <p className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal mb-1 relative z-10">Fraction Sales (YTD)</p>
                <p className="text-xl font-black relative z-10">AED 3,450,000</p>
              </div>
              <div className="bg-accent-light p-5 rounded-3xl border border-accent/20 text-left relative">
                <p className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal mb-1">Active Co-ownerships</p>
                <p className="text-xl font-black text-primary dark:text-gray-50">156</p>
              </div>
            </div>

            {/* Pending Applications */}
            <section className="space-y-4 text-left">
              <h3 className="text-sm font-bold text-primary dark:text-gray-50 uppercase tracking-tight px-1 pb-1">Review Queue</h3>
              <div 
                className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-left flex justify-between items-center cursor-pointer group hover:border-accent/30 transition-colors"
                onClick={onOpenReviewQueue}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex justify-center items-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary dark:text-gray-50 uppercase tracking-tight">12 Pending Applications</h4>
                    <p className="text-[12px] text-gray-500 font-medium">New KYC documents to review</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
              </div>
            </section>

            {/* Listed Assets */}
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-primary dark:text-gray-50 uppercase tracking-tight">Listed Assets</h3>
                <button className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal">Manage</button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[1, 3].map((id) => {
                  const asset = mockListings.find(l => l.id === id.toString());
                  if (!asset) return null;
                  return (
                    <div 
                      key={asset.id} 
                      className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-left hover:border-accent/30 transition-colors cursor-pointer group"
                      onClick={() => onOpenHubAsset(asset)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-gray-950 shadow-sm relative">
                            <img src={asset.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-primary dark:text-gray-50 group-hover:text-accent transition-colors">{asset.title}</h4>
                            <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">{asset.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase">Available</p>
                          <p className="text-xs font-black text-accent">3/4 Slots</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => alert("Asset Listing flow coming soon...")}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 font-bold text-[12px] uppercase tracking-wide hover:border-accent hover:text-accent transition-colors flex justify-center items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                List New Asset
              </motion.button>
            </section>
          </>
        ) : (
          <>
            {/* Equity Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary dark:bg-gray-900 p-5 rounded-3xl text-white shadow-xl shadow-primary/20 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Wallet className="w-12 h-12" />
                </div>
                <p className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal mb-1 relative z-10">Total Equity</p>
                <p className="text-xl font-black relative z-10">AED {totalEquity.toLocaleString('de-DE')}</p>
              </div>
              <div className="bg-accent-light p-5 rounded-3xl border border-accent/20 text-left">
                <p className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal mb-1">Active Shares</p>
                <p className="text-xl font-black text-primary dark:text-gray-50">4</p>
              </div>
            </div>

        {/* Upcoming Bookings */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-primary dark:text-gray-50 uppercase tracking-tight">Bookings</h3>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button 
                onClick={() => setScheduleView('list')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-all ${scheduleView === 'list' ? 'bg-white dark:bg-gray-950 text-primary dark:text-gray-50 shadow-sm' : 'text-gray-500 hover:text-primary dark:hover:text-gray-50'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                List
              </button>
              <button 
                onClick={() => setScheduleView('calendar')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-all ${scheduleView === 'calendar' ? 'bg-white dark:bg-gray-950 text-primary dark:text-gray-50 shadow-sm' : 'text-gray-500 hover:text-primary dark:hover:text-gray-50'}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Dates
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {scheduleView === 'calendar' && (
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 text-left shadow-sm">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h4 className="text-[12px] font-bold uppercase tracking-wide text-primary dark:text-gray-50">{monthName}</h4>
                  <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-1 text-gray-400 hover:text-primary transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={handleNextMonth} className="p-1 text-gray-400 hover:text-primary transition-colors"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-[10px] font-bold text-center text-gray-400 py-1">{d}</div>
                  ))}
                  {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[32px] aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    
                    const bookingsInThisDay = upcomingUsage.filter(b => 
                      b.year === currentMonth.getFullYear() && 
                      b.month === currentMonth.getMonth() &&
                      day >= b.startDay && day <= b.endDay
                    );
                    
                    let bgClass = "bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400";
                    let IconComponent = null;
                    
                    if (bookingsInThisDay.length === 1) {
                      bgClass = "bg-accent text-white shadow-sm ring-1 ring-accent-light";
                      IconComponent = IconMap[bookingsInThisDay[0].icon as keyof typeof IconMap] || null;
                    } else if (bookingsInThisDay.length > 1) {
                      bgClass = "bg-primary dark:bg-accent/80 text-white shadow-sm ring-1 ring-primary/20 bg-opacity-90";
                    }
                    
                    return (
                      <div 
                        key={day} 
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-colors relative p-1 ${bgClass}`}
                      >
                        <span className="text-[11px] font-bold leading-none z-10 mt-0.5">{day}</span>
                        <div className="flex-1 flex items-center justify-center min-h-[16px] w-full">
                          {bookingsInThisDay.length === 1 && IconComponent && <IconComponent className="w-4 h-4 opacity-90 z-10" strokeWidth={2.5} />}
                          {bookingsInThisDay.length > 1 && (
                            <div className="flex -space-x-1.5 items-center justify-center -mb-0.5 z-10 relative">
                              {bookingsInThisDay.slice(0, 2).map((b, i) => {
                                const Ico = IconMap[b.icon as keyof typeof IconMap];
                                return <div key={i} className="bg-white/20 p-[1.5px] rounded-full backdrop-blur-sm shadow-sm ring-1 ring-white/20">{Ico && <Ico className="w-[10px] h-[10px] opacity-100" strokeWidth={3} />}</div>
                              })}
                              {bookingsInThisDay.length > 2 && <div className="text-[8px] bg-accent/90 text-white rounded-full w-[14px] h-[14px] flex items-center justify-center ring-1 ring-white/20 font-black relative z-20">+{bookingsInThisDay.length - 2}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className={scheduleView === 'calendar' ? 'pt-2 space-y-3' : 'space-y-3'}>
                {upcomingUsage.map((item) => (
                  <motion.div 
                    key={item.id} 
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenHandover}
                    className="group bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-3 flex gap-4 hover:shadow-md transition-all cursor-pointer text-left"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-0.5">
                      <h4 className="text-sm font-bold text-primary dark:text-gray-50 truncate">{item.title}</h4>
                      <p className="text-[12px] leading-tight text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">{item.location}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3 text-accent" strokeWidth={2.5} />
                        <span className="text-[12px] leading-tight text-primary dark:text-gray-50 font-black uppercase tracking-tighter">{item.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center pr-2">
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-primary dark:text-gray-50 group-hover:bg-accent group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
          </div>
        </section>

        {/* Active Portfolio Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-primary dark:text-gray-50 uppercase tracking-tight">Asset Portfolio</h3>
            <button className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal">Details</button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[1, 3, 8, 4, 99].map((id) => {
              const asset = mockListings.find(l => l.id === id.toString());
              if (!asset) return null;
              return (
                <div 
                  key={asset.id} 
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-left hover:border-accent/30 transition-colors cursor-pointer group"
                  onClick={() => onOpenHubAsset(asset)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-gray-950 shadow-sm relative">
                        <img src={asset.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary dark:text-gray-50 group-hover:text-accent transition-colors">{asset.title}</h4>
                        <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">{asset.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase">Share</p>
                      <p className="text-xs font-black text-accent">
                        {Math.max(1, (Number(asset.totalSlots) || 4) - (Number(asset.availableSlots) || 0))} / {Number(asset.totalSlots) || 4} Slots
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700/50">
                    <div>
                      <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase">Equity Val.</p>
                      <p className="text-sm font-black text-primary dark:text-gray-50">
                        AED {(asset.totalValue ? (asset.totalValue / (Number(asset.totalSlots) || 4)) : (asset.pricePerMonth || 12000) * 12).toLocaleString('de-DE')}
                      </p>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onBook(asset); }}
                        className="px-4 py-1.5 bg-accent text-white rounded-lg text-[12px] leading-tight font-bold uppercase tracking-normal"
                      >
                        Book
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onResell(asset); }}
                        className="px-4 py-1.5 bg-primary dark:bg-gray-900 text-white rounded-lg text-[12px] leading-tight font-bold uppercase tracking-normal"
                      >
                        Resell
                      </motion.button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hub Integrity */}
        <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10 flex items-center gap-4 text-left">
          <ShieldCheck className="w-8 h-8 text-accent opacity-30" />
          <div className="flex-1">
            <h4 className="text-[12px] leading-tight font-bold text-primary dark:text-gray-50 uppercase tracking-tight">Portfolio Security</h4>
            <p className="text-[12px] leading-tight text-gray-500 dark:text-gray-400 font-medium">Your assets are managed by Coshare Trustee with 24/7 insurance coverage.</p>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

const ChatView = ({ conversation, onBack, onShowToast }: { conversation: any, onBack: () => void, onShowToast: (msg: string) => void }) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(conversation.messages);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText,
      timestamp: 'Just now',
      type: 'text'
    };
    
    // Ensure parent conversation maintains correct state
    conversation.messages.push(newMsg);
    conversation.lastMessage = messageText;
    conversation.lastMessageTime = 'Just now';
    
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const autoReplyMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: conversation.participantId || 'them',
        text: 'Thanks for the message. I will review and get back to you shortly!',
        timestamp: 'Just now',
        type: 'text'
      };
      
      conversation.messages.push(autoReplyMsg);
      conversation.lastMessage = autoReplyMsg.text;
      conversation.lastMessageTime = 'Just now';
      
      setMessages(prev => [...prev, autoReplyMsg]);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 500) {
          onBack();
        }
      }}
      className="absolute inset-0 bg-white dark:bg-gray-950 z-40 flex flex-col pt-safe"
    >
      <div className="pt-2 pb-4 px-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0 flex items-center justify-center ${conversation.isGroup ? 'bg-primary dark:bg-gray-900 text-white' : ''}`}>
            {conversation.isGroup ? <Users className="w-5 h-5" /> : <img src={conversation.participantAvatar} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="text-left w-full min-w-0">
            <h3 className="font-bold text-sm text-primary dark:text-gray-50 truncate w-full pr-4">{conversation.participantName}</h3>
            <p className="text-[12px] leading-tight text-accent font-medium uppercase tracking-wider truncate w-full pr-4">{conversation.listingTitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'offer' && msg.offer ? (
              <div className="max-w-[85%] bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-primary dark:bg-gray-900 p-4 text-white">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal">Formal Offer</p>
                    <div className="px-2 py-0.5 bg-accent text-primary dark:text-gray-50 rounded text-[12px] leading-tight font-black">{msg.offer.status.toUpperCase()}</div>
                  </div>
                  <p className="text-2xl font-black">AED {msg.offer.price.toLocaleString('de-DE')}</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {msg.offer.type === 'co-own' || msg.offer.shares ? (
                      <div className="col-span-2">
                        <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal mb-0.5">Shares</p>
                        <p className="text-xs font-bold text-primary dark:text-gray-50">{msg.offer.shares} Fraction{msg.offer.shares !== 1 ? 's' : ''}</p>
                      </div>
                    ) : (
                      <>
                        {msg.offer.startDate && (
                          <div>
                            <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal mb-0.5">Start Date</p>
                            <p className="text-xs font-bold text-primary dark:text-gray-50">{msg.offer.startDate}</p>
                          </div>
                        )}
                        {msg.offer.duration && (
                          <div>
                            <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal mb-0.5">Duration</p>
                            <p className="text-xs font-bold text-primary dark:text-gray-50">{msg.offer.duration} Months</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex gap-2">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onShowToast('Offer accepted!');
                        onBack();
                      }}
                      className="flex-1 py-3 bg-accent text-primary dark:text-gray-50 rounded-xl text-[12px] leading-tight font-black uppercase tracking-normal shadow-lg shadow-accent/10"
                    >
                      Accept
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onShowToast('Counter offer initiated')}
                      className="flex-1 py-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-xl text-[12px] leading-tight font-bold uppercase tracking-normal border border-gray-100 dark:border-gray-800"
                    >
                      Counter
                    </motion.button>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 italic">“{msg.text}”</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col max-w-[80%]">
                {conversation.isGroup && msg.senderId !== 'me' && msg.senderName && (
                  <span className="text-[10px] text-gray-500 mb-1 ml-2 font-bold">{msg.senderName}</span>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.senderId === 'me' 
                    ? 'bg-primary dark:bg-gray-900 text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed break-words">{msg.text}</p>
                  <div className="flex items-center justify-between mt-1 gap-4">
                    <span className={`text-[12px] leading-tight opacity-60 ${msg.senderId === 'me' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                      Read
                    </span>
                    <span className={`text-[12px] leading-tight opacity-60 ${msg.senderId === 'me' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 pt-2 pb-8 border-t border-gray-50 dark:border-gray-800 flex gap-3 items-center">
        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-accent">
          <Plus className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-2 flex items-center">
          <input 
            type="text" 
            enterKeyHint="send"
            placeholder="Type a message..." 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-[16px] font-medium text-gray-700 dark:text-gray-300 focus:outline-none placeholder-gray-400"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className={`ml-2 p-2 rounded-xl transition-all ${
              messageText.trim() ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            }`}
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const EditCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.93083 19.9598 4.18821C20.0665 4.44558 20.1213 4.72143 20.1213 5C20.1213 5.27857 20.0665 5.55441 19.9598 5.81179C19.8532 6.06917 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SwipableMessageItem: React.FC<{ chat: any, onSelectConversation: (id: string) => void }> = ({ chat, onSelectConversation }) => {
  const [removed, setRemoved] = useState(false);
  if (removed) return null;

  return (
    <div className="relative border-b border-gray-50 dark:border-gray-800 group overflow-hidden bg-red-500">
      <div className="absolute right-0 top-0 bottom-0 text-white flex justify-end items-center px-6 w-full z-0 h-full">
        <Trash2 className="w-5 h-5 mr-1" />
        <span className="font-bold text-xs uppercase tracking-normal opacity-90">Archive</span>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.8, right: 0 }}
        onDragEnd={(_e, { offset, velocity }) => {
          if (offset.x < -80 || velocity.x < -500) {
            setRemoved(true);
          }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectConversation(chat.id)}
        className="w-full px-6 py-4 flex items-center gap-4 bg-white dark:bg-gray-950 transition-colors relative z-10 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
      >
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-950 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 transition-transform group-hover:scale-105">
            <img src={chat.participantAvatar} alt={chat.participantName} className="w-full h-full object-cover" />
          </div>
          {chat.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[12px] leading-tight font-bold rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center shadow-sm">
              {chat.unreadCount}
            </div>
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex justify-between items-center mb-1 gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <h3 className="font-bold text-primary dark:text-gray-50 text-sm tracking-tight truncate">{chat.participantName}</h3>
              {chat.isGroup && <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            </div>
            <span className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-medium tracking-tight whitespace-nowrap shrink-0">{chat.lastMessageTime}</span>
          </div>
          <p className="text-[12px] leading-tight text-accent font-bold uppercase tracking-wider mb-1 truncate">{chat.listingTitle}</p>
          <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-primary dark:text-gray-50 font-semibold' : 'text-gray-500 dark:text-gray-400 font-medium'}`}>
            {chat.lastMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const MessagesView = ({ onSelectConversation }: { onSelectConversation: (id: string) => void }) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-950 animate-in slide-in-from-right duration-500">
    <div className="pt-12 pb-4 px-6 sticky top-0 bg-white dark:bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
      <div className="text-left">
        <h2 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight">Messages<span className="text-accent">.</span></h2>
        <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-0.5">Active Negotiations</p>
      </div>
      <motion.button whileTap={{ scale: 0.9 }} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-primary dark:text-gray-50">
        <EditCircle className="w-5 h-5" />
      </motion.button>
    </div>
    <div className="flex-1 overflow-y-auto pb-24">
      {mockConversations.length > 0 ? (
        mockConversations.map((chat) => (
          <SwipableMessageItem key={chat.id} chat={chat} onSelectConversation={onSelectConversation} />
        ))
      ) : (
        <div className="py-20 px-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[40px] m-4 border border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-white dark:bg-gray-950 rounded-3xl flex items-center justify-center text-gray-300 shadow-sm mx-auto mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-primary dark:text-gray-50 mb-3">No chats yet</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-[240px] mx-auto">
            Browse listings and reach out to owners to start your first conversation.
          </p>
        </div>
      )}
    </div>
  </div>
);

const SavedView = ({ onSelectListing, savedAssets, onToggleSave, onGoHome }: { onSelectListing: (listing: AssetListing) => void, savedAssets: AssetListing[], onToggleSave: (id: string) => void, onGoHome: () => void }) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-950 animate-in slide-in-from-right duration-500">
    <div className="pt-12 pb-4 px-6 sticky top-0 bg-white dark:bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
      <div className="text-left">
        <h2 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight">Saved<span className="text-accent">.</span></h2>
        <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-0.5">Watchlist & Favorites</p>
      </div>
      <div className="text-primary dark:text-gray-50/40 font-mono text-[12px] leading-tight uppercase tracking-normal">{savedAssets.length} Assets</div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      {savedAssets.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {savedAssets.map((listing) => (
            <div key={listing.id} className="bg-white dark:bg-gray-950 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer group" onClick={() => onSelectListing(listing)}>
              <div className="relative aspect-square">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(listing.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-950/80 backdrop-blur-md rounded-full flex items-center justify-center text-accent shadow-sm"
                >
                  <Heart className="w-4 h-4 fill-accent" />
                </motion.button>
              </div>
              <div className="p-3 text-left">
                <h4 className="text-[12px] leading-tight font-bold text-primary dark:text-gray-50 truncate uppercase tracking-tight">{listing.title}</h4>
                <p className="text-[12px] leading-tight text-accent font-black mt-1">AED {listing.pricePerMonth.toLocaleString('de-DE')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center px-4">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Heart className="w-6 h-6 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="font-bold text-primary dark:text-gray-50 mb-2">No saved assets</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[200px] mx-auto leading-relaxed mb-6">Save assets you're interested in to track them and negotiate later.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onGoHome}
            className="px-6 py-3 bg-primary dark:bg-gray-900 text-white shadow-xl shadow-primary/20 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors"
          >
            Explore Marketplace
          </motion.button>
        </div>
      )}
      {savedAssets.length > 0 && (
        <div className="bg-accent/5 p-6 rounded-[2rem] mt-6 border border-accent/10 text-center">
          <Star className="w-8 h-8 text-accent mx-auto mb-3 opacity-50" />
          <h4 className="text-sm font-bold text-primary dark:text-gray-50">Watchlist Notifications</h4>
          <p className="text-[12px] leading-tight text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">Get notified when co-owning spots open up for your saved assets.</p>
        </div>
      )}
    </div>
  </div>
);

const ProfileView: React.FC<{ 
  isLoggedIn: boolean; 
  userRole?: 'user' | 'dealer';
  dealerType?: string;
  onLogin: (role?: 'user' | 'dealer', dealerType?: string) => void;
  onLogout: () => void;
  onOpenSettings: (tab?: string) => void;
  onSetView: (view: ViewMode) => void;
  onShowToast: (msg: string) => void;
  onOpenReviewQueue?: () => void;
  pendingReviewsCount?: number;
}> = ({ isLoggedIn, userRole = 'user', dealerType, onLogin, onLogout, onOpenSettings, onSetView, onShowToast, onOpenReviewQueue, pendingReviewsCount = 4 }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'wallet'>('account');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authView, setAuthView] = useState<'options' | 'login' | 'signup-standard' | 'partner-options' | 'partner-login' | 'signup-dealer-type' | 'signup-dealer-details'>('options');
  const [selectedDealerType, setSelectedDealerType] = useState<string>('');

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-950 relative border-0 outline-none">
        <div className="pt-12 pb-4 px-6 sticky top-0 bg-white dark:bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
          {authView !== 'options' && (
            <button 
              onClick={() => {
                if (authView === 'partner-options' || authView === 'login' || authView === 'signup-standard') {
                  setAuthView('options');
                } else if (authView === 'partner-login' || authView === 'signup-dealer-type') {
                  setAuthView('partner-options');
                } else if (authView === 'signup-dealer-details') {
                  setAuthView('signup-dealer-type');
                } else {
                  setAuthView('options');
                }
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-primary dark:hover:text-gray-50 transition-colors shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="text-left">
            <h2 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight">
              {authView === 'options' ? 'Profile' : 
               authView === 'partner-options' ? 'Partner Portal' :
               authView === 'login' || authView === 'partner-login' ? 'Log In' : 'Sign Up'}
              <span className="text-accent">.</span>
            </h2>
            <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-0.5">
              {authView === 'options' ? 'Account Access' : 
               authView === 'partner-options' ? 'Network Integration' : 'Authentication'}
            </p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center pt-8 px-6 pb-20 w-full max-w-sm mx-auto overflow-y-auto text-center">
          {authView === 'options' && (
            <>
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-gray-50 mb-2">Create an Account</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[250px]">Log in or sign up to manage your assets, wallet, and preferences.</p>
              
              <div className="w-full space-y-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthView('login')}
                  className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal rounded-2xl shadow-xl shadow-primary/20"
                >
                  Log In
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthView('signup-standard')}
                  className="w-full py-4 bg-gray-50 dark:bg-gray-900 text-primary dark:text-gray-50 border border-gray-200 dark:border-gray-800 font-black text-[12px] uppercase tracking-normal rounded-2xl"
                >
                  Sign Up
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthView('partner-options')}
                  className="w-full py-4 text-gray-400 dark:text-gray-500 font-bold text-[12px] uppercase tracking-wide transition-colors hover:text-primary dark:hover:text-gray-50"
                >
                  Partners
                </motion.button>
              </div>

              <div className="pt-8 border-t border-gray-100 dark:border-gray-800 w-full">
                <p className="text-[10px] font-bold text-gray-400 text-center mb-3 uppercase tracking-wider">Demo Accounts</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onLogin('user')}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-bold text-primary dark:text-gray-50 hover:border-primary dark:hover:border-gray-700 transition-colors"
                  >
                    Individual Demo
                  </button>
                  <button 
                    onClick={() => onLogin('dealer', 'Cars')}
                    className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-[11px] font-bold text-accent hover:border-accent transition-colors"
                  >
                    Dealer Demo
                  </button>
                </div>
              </div>
            </>
          )}

          {authView === 'partner-options' && (
            <div className="w-full space-y-4">
              <div className="w-20 h-20 bg-accent/10 dark:bg-accent/20 rounded-full flex items-center justify-center mb-6 border border-accent/20 mx-auto">
                <Building2 className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-gray-50 mb-2">Partner Network</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[250px] mx-auto">Log in or apply to become a certified dealership partner.</p>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthView('partner-login')}
                className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal rounded-2xl shadow-xl shadow-primary/20"
              >
                Partner Log In
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthView('signup-dealer-type')}
                className="w-full py-4 bg-gray-50 dark:bg-gray-900 text-primary dark:text-gray-50 border border-gray-200 dark:border-gray-800 font-black text-[12px] uppercase tracking-normal rounded-2xl"
              >
                Apply as Partner
              </motion.button>
            </div>
          )}

          {(authView === 'login' || authView === 'partner-login') && (
            <div className="w-full space-y-4">
              <input type="email" placeholder="Email Address" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
              <input type="password" placeholder="Password" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
              <div className="flex justify-end -mt-2 mb-4">
                <button 
                  onClick={() => alert(`Password reset link sent to your email.`)}
                  className="text-[12px] font-bold text-accent hover:text-primary dark:hover:text-gray-50 transition-colors"
                >
                  Forgot my password?
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onLogin(authView === 'partner-login' ? 'dealer' : 'user')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal rounded-2xl shadow-xl shadow-primary/20 mt-4"
              >
                Log In <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {authView === 'signup-dealer-type' && (
            <div className="w-full space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['Real Estate', 'Cars', 'Boats', 'Watches'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedDealerType(type)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-colors ${selectedDealerType === type ? 'bg-primary dark:bg-gray-50 text-white dark:text-gray-950 border-primary dark:border-gray-50' : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-gray-700'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthView('signup-dealer-details')}
                disabled={!selectedDealerType}
                className="w-full py-4 rounded-2xl bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </motion.button>
            </div>
          )}

          {(authView === 'signup-standard' || authView === 'signup-dealer-details') && (
            <div className="w-full space-y-4">
              {authView === 'signup-dealer-details' && (
                <input type="text" placeholder="Dealership Name" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
              )}
              <input type="text" placeholder="Full Name" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
              <input type="tel" placeholder="Mobile Phone" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
              <input type="password" placeholder="Password" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onLogin(authView === 'signup-dealer-details' ? 'dealer' : 'user', selectedDealerType)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal rounded-2xl shadow-xl shadow-primary/20 mt-4"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 relative">
      <div className="pt-12 pb-4 px-6 sticky top-0 bg-white dark:bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight">Profile<span className="text-accent">.</span></h2>
          <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-0.5">Asset Management Center</p>
        </div>
        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(activeTab === 'account' ? 'wallet' : 'account')}
            className={`p-2.5 rounded-xl transition-all shadow-sm ${activeTab === 'wallet' ? 'bg-accent text-white' : 'bg-gray-50 dark:bg-gray-900 text-primary dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Wallet className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl text-primary dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
        {activeTab === 'account' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-accent-light p-1 shadow-2xl">
                  <img src={userRole === 'dealer' ? "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80" : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80"} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent text-white rounded-xl flex items-center justify-center border-[3px] border-white dark:border-gray-950 shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-gray-50">{userRole === 'dealer' ? 'Premium Dealership' : 'Alex Sterling'}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal mt-1">{userRole === 'dealer' ? `Verified ${dealerType || 'Dealer'} Partner` : 'Verified Member • Joined 2024'}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-8 mb-4 w-full px-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary dark:text-gray-50">{userRole === 'dealer' ? '24' : '12'}</p>
                  <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal">{userRole === 'dealer' ? 'Assets Listed' : 'Assets'}</p>
                </div>
                <div className="text-center border-x border-gray-100 dark:border-gray-800">
                  <p className="text-lg font-bold text-primary dark:text-gray-50">{userRole === 'dealer' ? '156' : '48'}</p>
                  <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal">{userRole === 'dealer' ? 'Co-ownerships' : 'Co-Sharers'}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary dark:text-gray-50">{userRole === 'dealer' ? '4.98' : '4.9'}</p>
                  <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-bold uppercase tracking-normal">Rating</p>
                </div>
              </div>
            </div>

            {/* Trust Progress Bar / Dealer Grade */}
            <div className="px-4">
              <div className="flex justify-between items-center mb-1.5 px-1">
                <span className="text-[12px] leading-tight font-bold text-primary dark:text-gray-50/40 uppercase tracking-tighter">{userRole === 'dealer' ? 'Dealer Trust Score' : 'Identity Integrity'}</span>
                <span className="text-[12px] leading-tight font-bold text-accent">{userRole === 'dealer' ? 'Tier 1' : '98/100'}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: userRole === 'dealer' ? '100%' : '98%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary dark:bg-gray-900 shadow-[0_0_8px_rgba(15,30,55,0.2)]"
                />
              </div>
              <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 text-left mt-2 px-1 font-medium leading-relaxed">
                {userRole === 'dealer' ? (
                   <>Your dealership is in the top 1% of the network. Keep up the high standards!</>
                ) : (
                   <>Complete your <span className="text-primary dark:text-gray-50 font-bold">Business Registry</span> to reach 100% and unlock VIP asset tiers.</>
                )}
              </p>
            </div>

            <div className="space-y-2 text-left">
              {(userRole === 'dealer' ? [
                { label: 'List New Asset', icon: Plus, action: () => onSetView('list-asset') },
                { label: 'Listed Assets', icon: LayoutGrid, count: 24, action: () => onSetView('community') },
                { label: 'Pending Applications', icon: Users, count: pendingReviewsCount, action: () => onOpenReviewQueue && onOpenReviewQueue() },
                { label: 'Payment Methods', icon: CreditCard, count: 4, action: () => onOpenSettings('payment_methods') },
                { label: 'Verification Identity', icon: Fingerprint, action: () => setIsVerifying(true), status: 'Verified' },
                { label: 'Security & Privacy', icon: Lock, action: () => onOpenSettings('privacy_security') },
                { label: 'Help Center', icon: HelpCircle, action: () => onOpenSettings('help_center') }
              ] : [
                { label: 'Saved Assets', icon: Heart, action: () => onSetView('saved') },
                { label: 'Payment Methods', icon: CreditCard, count: 2, action: () => onOpenSettings('payment_methods') },
                { label: 'ID Verification', icon: Fingerprint, action: () => setIsVerifying(true), status: 'Action Needed' },
                { label: 'Security & Privacy', icon: Lock, action: () => onOpenSettings('privacy_security') },
                { label: 'Help Center', icon: HelpCircle, action: () => onOpenSettings('help_center') },
                { label: 'How It Works', icon: Info, action: () => onOpenSettings('how_it_works') }
              ]).map((item) => (
                <motion.button 
                  key={item.label} 
                  whileTap={{ scale: 0.98 }}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl group hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-all border border-gray-50 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-950 shadow-sm flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-accent transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-primary dark:text-gray-50">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status && <span className="text-[8px] font-bold uppercase tracking-normal text-accent bg-accent/10 px-2 py-0.5 rounded-full">{item.status}</span>}
                    {item.count && <span className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500">{item.count}</span>}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors" />
                  </div>
                </motion.button>
              ))}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="w-full p-4 mt-4 text-red-500 text-[12px] leading-tight font-bold uppercase tracking-normal text-center opacity-60 hover:opacity-100 transition-opacity"
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Elite Wallet Card */}
            <div className="p-8 bg-primary dark:bg-gray-900 rounded-[32px] text-left relative overflow-hidden shadow-2xl shadow-primary/30 min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white dark:bg-gray-950/5 rounded-full blur-[40px] -ml-8 -mb-8"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal">Available Liquidity</p>
                  <div className="w-8 h-8 bg-white dark:bg-gray-950/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white dark:border-gray-950/20">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-white text-3xl font-bold">AED 124,500</span>
                  <span className="text-accent text-sm font-medium opacity-80">.00</span>
                </div>
              </div>

              <div className="relative z-10 flex gap-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3.5 bg-white dark:bg-gray-950 text-primary dark:text-gray-50 rounded-2xl text-[12px] leading-tight font-bold uppercase tracking-normal shadow-lg"
                >
                  Withdraw
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3.5 bg-white dark:bg-gray-950/10 text-white rounded-2xl text-[12px] leading-tight font-bold uppercase tracking-normal border border-white dark:border-gray-950/20 backdrop-blur-sm"
                >
                  Add Funds
                </motion.button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                  <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">Portfolio Value</p>
                </div>
                <p className="text-lg font-bold text-primary dark:text-gray-50">AED {(2440000).toLocaleString('de-DE')}</p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">Monthly Yield</p>
                </div>
                <p className="text-lg font-bold text-green-600">+8.4%</p>
              </div>
            </div>

            {/* Ledger Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[12px] leading-tight font-bold text-primary dark:text-gray-50 uppercase tracking-[0.1em]">Settlement Ledger</h3>
                <button className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal hover:underline">Full History</button>
              </div>
              <div className="space-y-2.5">
                {[
                  { title: 'Divident: Porsche 911', amount: '+AED 4,200', date: 'Yesterday', type: 'incoming', category: 'Divident' },
                  { title: 'Insurance: Hills Villa', amount: '-AED 850', date: 'Feb 12', type: 'outgoing', category: 'Ops' },
                  { title: 'Staking Reward', amount: '+AED 1,000', date: 'Feb 10', type: 'incoming', category: 'Bonus' }
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-2xl border border-gray-50 dark:border-gray-800 shadow-sm hover:border-accent/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'incoming' ? 'bg-green-50 text-green-600' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>
                        {tx.type === 'incoming' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-primary dark:text-gray-50">{tx.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold uppercase text-gray-300">{tx.category}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
                          <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 font-medium">{tx.date}</p>
                        </div>
                      </div>
                    </div>
                    <p className={`text-xs font-bold ${tx.type === 'incoming' ? 'text-green-600' : 'text-primary dark:text-gray-50'}`}>{tx.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Biometric Verification Modal */}
      <AnimatePresence>
        {isVerifying && (
          <div 
            onClick={() => setIsVerifying(false)}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-primary dark:bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
          >
            <motion.div 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-950 rounded-[40px] p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-accent/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-accent"
                />
              </div>
              <div className="w-20 h-20 bg-accent-light rounded-3xl flex items-center justify-center text-accent mx-auto mb-6 shadow-inner">
                <Fingerprint className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-gray-50 mb-2">Biometric Audit</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-8 font-medium">
                Scanning for secure identity markers. This process ensures the integrity of the cosharing pool.
              </p>
              <div className="space-y-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    alert('Simulation: Encryption complete. Identity integrity verified.');
                    setIsVerifying(false);
                  }}
                  className="w-full py-4 bg-primary dark:bg-gray-900 text-white rounded-2xl text-[12px] leading-tight font-bold uppercase tracking-normal shadow-xl shadow-primary/30"
                >
                  Verify Now
                </motion.button>
                <button 
                  onClick={() => setIsVerifying(false)}
                  className="w-full py-3 text-gray-400 dark:text-gray-500 text-[12px] leading-tight font-bold uppercase tracking-normal"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsModal = ({ onClose, darkMode, onToggleDarkMode, showToast, initialTab = 'main' }: { onClose: () => void, darkMode: boolean, onToggleDarkMode: () => void, showToast: (msg: string) => void, initialTab?: string }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const renderContent = () => {
    if (activeTab === 'personal_info') {
      return (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveTab('main')} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-primary dark:text-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary dark:text-gray-50">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-primary dark:text-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
              <input type="email" defaultValue="john@example.com" className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-primary dark:text-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
              <input type="tel" defaultValue="+1 234 567 8900" className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-primary dark:text-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <button className="w-full py-4 mt-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-900 font-bold rounded-2xl shadow-lg" onClick={() => { showToast('Information updated'); setActiveTab('main'); }}>
              Save Changes
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'push_notifications') {
      return (
        <div className="flex-1 overflow-y-auto space-y-4">
           <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveTab('main')} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-primary dark:text-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary dark:text-gray-50">Push Notifications</h3>
          </div>
          <div className="space-y-2">
            {[
              { id: 'messages', title: 'New Messages', desc: 'When you receive a new message' },
              { id: 'offers', title: 'Offers & Updates', desc: 'When you receive a new offer or update on an asset' },
              { id: 'marketing', title: 'Marketing', desc: 'Receive news, special offers, and promotional materials' }
            ].map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50">{setting.title}</h4>
                  <p className="text-[12px] leading-tight text-gray-500">{setting.desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors relative shadow-inner cursor-pointer ${setting.id !== 'marketing' ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${setting.id !== 'marketing' ? 'left-5' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'privacy_security') {
      return (
        <div className="flex-1 overflow-y-auto space-y-4">
           <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveTab('main')} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-primary dark:text-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary dark:text-gray-50">Privacy & Security</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div>
                <span className="font-bold text-sm text-primary dark:text-gray-50 block">Change Password</span>
                <span className="text-[12px] leading-tight text-gray-500">Update your account password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
            </button>
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div>
                <span className="font-bold text-sm text-primary dark:text-gray-50 block">Two-Factor Authentication</span>
                <span className="text-[12px] leading-tight text-gray-500">Add an extra layer of security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
            </button>
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div>
                <span className="font-bold text-sm text-primary dark:text-gray-50 block">Blocked Users</span>
                <span className="text-[12px] leading-tight text-gray-500">Manage blocked accounts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'payment_methods') {
      return (
        <div className="flex-1 overflow-y-auto space-y-4">
           <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveTab('main')} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-primary dark:text-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary dark:text-gray-50">Payment Methods</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-950 rounded-xl shadow-sm flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                </div>
                <div>
                  <span className="font-bold text-sm text-primary dark:text-gray-50 block">•••• •••• •••• 4242</span>
                  <span className="text-[12px] leading-tight text-gray-500">Expires 12/28</span>
                </div>
              </div>
              <span className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal bg-accent-light px-2 py-1 rounded-md">Default</span>
            </div>
            <button className="w-full text-left p-4 bg-dashed border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors" onClick={() => showToast('Add card dialog opened')}>
              <Plus className="w-4 h-4 text-gray-400" />
              <span className="font-bold text-sm text-gray-500 dark:text-gray-400 block">Add New Payment Method</span>
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'help_center') {
      return (
        <div className="flex-1 overflow-y-auto space-y-4">
           <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveTab('main')} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-primary dark:text-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary dark:text-gray-50">Help Center</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => showToast('Opening FAQs')}>
              <div>
                <span className="font-bold text-sm text-primary dark:text-gray-50 block">FAQs</span>
                <span className="text-[12px] leading-tight text-gray-500">Find answers to common questions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
            </button>
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => showToast('Opening Contact Support')}>
              <div>
                <span className="font-bold text-sm text-primary dark:text-gray-50 block">Contact Support</span>
                <span className="text-[12px] leading-tight text-gray-500">Get in touch with our team</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
            </button>
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => showToast('Opening Report an Issue')}>
              <div>
                <span className="font-bold text-sm text-primary dark:text-gray-50 block">Report an Issue</span>
                <span className="text-[12px] leading-tight text-gray-500">Let us know if something isn't working</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'how_it_works') {
      return (
        <div className="flex-1 overflow-y-auto space-y-4">
           <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveTab('main')} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-primary dark:text-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary dark:text-gray-50">How It Works</h3>
          </div>
          <div className="space-y-6">
            {[
              {
                title: 'How Co-own Works',
                color: 'text-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                steps: [
                  { title: 'Step 01: Explore or List', desc: 'Find an asset you love in the marketplace or list your own to find co-owners.' },
                  { title: 'Step 02: Form a Group', desc: 'Join an existing pool of verified users, or invite a private circle of friends to co-own the asset together.' },
                  { title: 'Step 03: Secure Ownership', desc: 'Finalize the shareholder agreement and checkout securely your share through our escrow registry.' },
                  { title: 'Step 04: Book & Enjoy', desc: 'Schedule your fractional time using the AI booking system and easily split ongoing costs. Add-on extra services if you want, and enjoy the asset.' }
                ]
              },
              {
                title: 'How Share Works',
                color: 'text-green-500',
                bg: 'bg-green-50 dark:bg-green-900/20',
                steps: [
                  { title: 'Step 01: Offer or Access', desc: 'List your asset\'s details and idle time to monetize it, or browse for assets you want to experience.' },
                  { title: 'Step 02: Set the Rules', desc: 'Define available times and usage limits clearly; interested users will apply to share the asset.' },
                  { title: 'Step 03: Review Members', desc: 'Verified users will apply to book time with your asset once both parties agree to the terms set by the owner.' },
                  { title: 'Step 04: Earn & Maintain', desc: 'Approved users request to enjoy the asset, while owners effortlessly collect payments to cover running costs.' }
                ]
              },
              {
                title: 'How Swap Works',
                color: 'text-purple-500',
                bg: 'bg-purple-50 dark:bg-purple-900/20',
                steps: [
                  { title: 'Step 01: Deposit Time', desc: 'Add unused time from your owned asset fractions into the swap pool.' },
                  { title: 'Step 02: Browse Assets', desc: 'Explore other amazing assets available in the global swap network.' },
                  { title: 'Step 03: Request a Swap', desc: 'Propose a fair exchange of dates with another verified network member.' },
                  { title: 'Step 04: Confirm & Go', desc: 'Once approved, pack your bags or grab the keys for your new experience.' }
                ]
              }
            ].map((section, sidx) => (
              <div key={sidx} className="space-y-3">
                <h4 className={`text-lg font-black tracking-tight ${section.color}`}>{section.title}</h4>
                <div className="space-y-3">
                  {section.steps.map((step, idx) => (
                    <div key={idx} className={`flex gap-4 p-4 rounded-2xl ${section.bg}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-white dark:bg-gray-950 shadow-sm ${section.color} shrink-0`}>
                        0{idx + 1}
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-sm text-primary dark:text-gray-50 tracking-tight">{step.title.split(': ')[1]}</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="text-left mb-8 shrink-0">
          <h3 className="text-2xl font-bold text-primary dark:text-gray-50 mb-2">Settings<span className="text-accent">.</span></h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage your account preferences and app settings.</p>
        </div>
        
        <div className="space-y-6 text-left flex-1 overflow-y-auto pb-4">
          <div className="space-y-3">
            <label className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal pl-2">Account</label>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-2 space-y-1 border border-gray-100 dark:border-gray-800">
              <button onClick={() => setActiveTab('personal_info')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-950 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-50 transition-all shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-gray-50">Personal Information</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
              </button>
              <button onClick={() => setActiveTab('payment_methods')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-950 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-50 transition-all shadow-sm">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-gray-50">Payment Methods</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal pl-2">Preferences</label>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-2 space-y-1 border border-gray-100 dark:border-gray-800">
              <button onClick={() => setActiveTab('push_notifications')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-950 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-50 transition-all shadow-sm">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-gray-50">Push Notifications</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
              </button>
              <button onClick={() => setActiveTab('privacy_security')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-950 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-50 transition-all shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-gray-50">Privacy & Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
              </button>
              <button onClick={onToggleDarkMode} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-950 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-50 transition-all shadow-sm">
                    {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-gray-50">Dark Mode</span>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors relative shadow-inner ${darkMode ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${darkMode ? 'left-5' : 'left-1'}`} />
                </div>
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-2 space-y-1 border border-gray-100 dark:border-gray-800">
              <button onClick={() => setActiveTab('help_center')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-950 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-50 transition-all shadow-sm">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-gray-50">Help Center</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
              </button>
              <button onClick={() => setActiveTab('how_it_works')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-950 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-50 transition-all shadow-sm">
                    <Info className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-gray-50">How It Works</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-50 transition-colors" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <button className="w-full py-4 text-center text-sm font-bold text-red-500 dark:text-red-400 rounded-2xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
              Log Out
            </button>
            
            <AnimatePresence mode="wait">
              {!confirmDelete ? (
                <motion.button 
                  key="delete-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-3 text-center text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal hover:text-red-500 transition-colors"
                >
                  Delete Account
                </motion.button>
              ) : (
                <motion.div 
                  key="confirm-delete"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-red-500 rounded-2xl p-4 text-center space-y-3 shadow-lg shadow-red-500/20"
                >
                  <p className="text-[12px] leading-tight font-bold text-white uppercase tracking-normal px-2 leading-relaxed">
                    Account deletion is permanent. All equity and chat data will be wiped.
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] leading-tight font-bold uppercase tracking-normal border border-white/20"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        showToast('Account successfully deleted.');
                        onClose();
                      }}
                      className="flex-1 py-2 bg-white text-red-600 rounded-xl text-[12px] leading-tight font-black uppercase tracking-normal shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-primary/40 dark:bg-gray-900/40 backdrop-blur-sm ${darkMode ? 'dark' : ''}`}
    >
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
            onClose();
          }
        }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-950 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col"
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-6 shrink-0 cursor-grab active:cursor-grabbing" onClick={onClose} />
        
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};

const categorySpecs: Record<string, string[]> = {
  '1': ['Condition', 'Mileage', 'Fuel Type', 'Specs', 'Engine Size', 'Transmission'], // Cars
  '2': ['Condition', 'Mileage', 'Engine Type', 'Specs', 'Frame Size'], // Bikes
  '3': ['Engine Hours', 'Length', 'Beam', 'Draft', 'Year', 'Vessel Type'], // Boats
  '4': ['Bedrooms', 'Bathrooms', 'Area (sqft)', 'Feature', 'Furnishing Status'], // Homes
  '5': ['Case Size', 'Material', 'Movement', 'Year', 'Water Resistance'], // Watches
  '6': ['Condition', 'Material', 'Authenticity', 'Year'], // Fashion
  '7': ['Condition', 'Usage Stats', 'Specs', 'Year'], // Others
};

const specOptions: Record<string, string[]> = {
  'Condition': ['Brand New', 'Pre-owned', 'Classic / Vintage'],
  'Fuel Type': ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
  'Specs': ['GCC Specs', 'European Specs', 'American Specs', 'Japanese Specs'],
  'Transmission': ['Automatic', 'Manual', 'PDK', 'Direct Drive'],
  'Movement': ['Automatic', 'Manual Wind', 'Quartz'],
  'Vessel Type': ['Motor Boat', 'Sailing Vessel', 'Catamaran', 'Speedboat'],
  'Furnishing Status': ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'],
  'Engine Type': ['2-Stroke', '4-Stroke', 'Electric'],
};

const goalDescriptions: Record<ListingGoal, string> = {
  'Co-own': 'Sell fractions and legally own a fractional share of this asset.',
  'Share': 'Rent out and pay for usage rights without equity ownership.',
  'Swap': 'Exchange and trade usage cycles within our verified community.',
  'All': 'Flexible options for ownership, sharing, and swapping.'
};





const DisputeFlow = ({ listing, onComplete, onCancel }: { listing: AssetListing, onComplete: () => void, onCancel: () => void }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reasons = [
    'Condition Mismatch',
    'Operational Failure',
    'Late Return',
    'Cleanliness Issue',
    'Financial Dispute',
    'Other Community Concern'
  ];

  const handleComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
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
      className="absolute inset-0 bg-white dark:bg-gray-950 z-40 flex flex-col pt-safe overflow-hidden"
    >
      <div className="w-full flex justify-center pt-3 pb-1">
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
      </div>
      <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="font-black text-lg text-primary dark:text-gray-50 uppercase tracking-tight">
            Raise<span className="text-red-500">Dispute.</span>
          </h2>
        </div>
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="text-center space-y-3 pb-4">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <Hammer className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-black text-primary dark:text-gray-50 uppercase tracking-tight">Formal Complaint</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-[240px] mx-auto">
            Disputes are mediated by Coshare Arbitration. Please provide accurate details.
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-normal text-gray-400 dark:text-gray-500 ml-1">Reason for Dispute</label>
          <div className="grid grid-cols-1 gap-2">
            {reasons.map(r => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  reason === r ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold' : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">{r}</span>
                  {reason === r && <CheckCircle2 className="w-4 h-4 text-red-500 dark:text-red-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-normal text-gray-400 dark:text-gray-500 ml-1">Evidence Description</label>
          <textarea 
            placeholder="Please describe the issue in detail..."
            className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-transparent dark:border-transparent focus:border-red-50 focus:bg-white dark:focus:bg-gray-950 outline-none text-[16px] font-medium resize-none transition-all"
          />
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          disabled={!reason || isSubmitting}
          className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-normal flex justify-center items-center gap-2 shadow-xl transition-all disabled:opacity-80 disabled:cursor-not-allowed ${
            reason ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-50'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit for Review'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const HandoverProtocol = ({ listing, onComplete, onCancel }: { listing: AssetListing, onComplete: () => void, onCancel: () => void }) => {
  const [stage, setStage] = useState<'type' | 'addons' | 'check-in' | 'check-out'>('type');
  const [protocolType, setProtocolType] = useState<'check-in' | 'check-out' | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const ADDON_SERVICES = [
    { id: 'cleaning', title: 'Cleaning', desc: 'Exterior and interior cleaning', price: 50 },
    { id: 'fueling', title: 'Fueling', desc: 'Return full or let us top it up', price: 30 },
    { id: 'delivery', title: 'Delivery', desc: 'Asset delivery to your location', price: 100 }
  ];

  // Check-in requirements based on category
  const checkInSteps = [
    { id: 1, title: 'External Inspection', desc: 'Capture all 4 angles of the asset', icon: Camera },
    { id: 2, title: 'Internal / Detail Check', desc: 'Focus on dashboard, seats or movement', icon: Gauge },
    { id: 3, title: 'Fuel / Battery Level', desc: 'Verification of operational levels', icon: Zap },
    { id: 4, title: 'Signature & Confirmation', desc: 'Verification by community member', icon: ClipboardCheck },
  ];

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setMedia([...media, `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=400`]);
      setIsCapturing(false);
    }, 1500);
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      setIsCompleting(false);
      onComplete();
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
      className="absolute inset-0 bg-white dark:bg-gray-950 z-40 flex flex-col pt-safe overflow-hidden"
    >
      <div className="w-full flex justify-center pt-3 pb-1">
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
      </div>
      {/* Header */}
      <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (stage === 'check-in' || stage === 'check-out') setStage('addons');
              else if (stage === 'addons') setStage('type');
              else onCancel();
            }}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="font-black text-lg text-primary dark:text-gray-50 uppercase tracking-tight">
            Handover<span className="text-accent">Protocol.</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal">Secured</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {stage === 'type' ? (
          <div className="p-6 space-y-8 h-full flex flex-col justify-center">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-primary dark:bg-gray-900/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <History className="w-10 h-10 text-primary dark:text-gray-50" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-primary dark:text-gray-50 uppercase tracking-tight">Select Protocol Type</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                Choose the phase of your asset usage to begin legal integrity verification.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setProtocolType('check-in');
                  setStage('addons');
                }}
                className="group relative p-6 bg-primary dark:bg-gray-900 rounded-[2.5rem] border-2 border-primary overflow-hidden text-left shadow-2xl shadow-primary/20"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white dark:bg-gray-950/10 rounded-2xl flex items-center justify-center text-white mb-4">
                    <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-black text-xl uppercase tracking-tight mb-1">Check-In</h4>
                  <p className="text-white/60 text-xs font-medium">Verify asset condition before usage starts.</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Camera className="w-24 h-24 text-white" />
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setProtocolType('check-out');
                  setStage('addons');
                }}
                className="group relative p-6 bg-white dark:bg-gray-950 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-800 overflow-hidden text-left hover:border-accent/30 transition-all"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-primary dark:text-gray-50 mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <h4 className="text-primary dark:text-gray-50 font-black text-xl uppercase tracking-tight mb-1">Check-Out</h4>
                  <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Log return condition and session summary.</p>
                </div>
              </motion.button>
            </div>
          </div>
        ) : stage === 'addons' ? (
          <div className="p-6 space-y-8 h-full flex flex-col justify-between">
            <div>
              <div className="text-center space-y-3 mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><line x1="12" y1="22" x2="12" y2="12"></line><line x1="12" y1="12" x2="22.5" y2="6"></line><line x1="12" y1="12" x2="1.5" y2="6"></line></svg>
                  </span>
                </div>
                <h3 className="text-2xl font-black text-primary dark:text-gray-50 uppercase tracking-tight">Add-on Services</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Enhance your experience with additional professional services.
                </p>
              </div>

              <div className="space-y-4">
                {ADDON_SERVICES.map(addon => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                        } else {
                          setSelectedAddons([...selectedAddons, addon.id]);
                        }
                      }}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center ${
                        isSelected ? 'border-accent bg-accent/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 bg-gray-50 dark:bg-gray-900'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className={`font-bold text-lg ${isSelected ? 'text-accent' : 'text-primary dark:text-gray-50'}`}>
                            {addon.title}
                          </h4>
                          <span className="font-black text-primary dark:text-gray-50">${addon.price}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{addon.desc}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-accent bg-accent text-white' : 'border-gray-300 dark:border-gray-700'
                        }`}>
                          {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (protocolType) setStage(protocolType);
              }}
              className="w-full h-14 bg-accent text-white rounded-2xl font-black uppercase tracking-normal shadow-lg shadow-accent/20 flex items-center justify-center gap-2 mt-8"
            >
              Continue Protocol
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className="text-[12px] leading-tight font-black text-accent uppercase tracking-normal">Step {step} of 4</span>
                <h3 className="text-xl font-black text-primary dark:text-gray-50 uppercase tracking-tight">{checkInSteps[step-1].title}</h3>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'w-6 bg-primary dark:bg-gray-900' : 'w-2 bg-gray-100 dark:bg-gray-800'}`} />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-8 text-center space-y-6 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="relative z-10 py-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white dark:bg-gray-950 rounded-3xl shadow-xl flex items-center justify-center mb-6 text-primary dark:text-gray-50 group-active:scale-95 transition-transform">
                  {React.createElement(checkInSteps[step-1].icon, { className: "w-10 h-10", strokeWidth: 1.5 })}
                </div>
                <p className="text-sm font-bold text-primary dark:text-gray-50 mb-2">{checkInSteps[step-1].desc}</p>
                <p className="text-[12px] leading-tight text-gray-400 dark:text-gray-500 leading-relaxed max-w-[200px]">
                  Requires {stage === 'check-in' ? 'check-in' : 'check-out'} validation photos.
                </p>
              </div>
              
              {step < 4 ? (
                <div className="flex gap-2 overflow-x-auto pb-4 px-2 snap-x">
                  {media.map((img, i) => (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={i} 
                      className="w-24 h-24 rounded-2xl border-2 border-white dark:border-gray-950 shadow-md overflow-hidden shrink-0 snap-center"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  {isCapturing && (
                    <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 animate-pulse">
                      <Camera className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {step < 4 ? (
              <div className="space-y-4">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCapture}
                  className="w-full py-5 bg-primary dark:bg-gray-900 text-white rounded-[2rem] font-bold uppercase tracking-normal flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                <p className="text-xs font-bold text-primary dark:text-gray-50 uppercase tracking-normal text-center mb-2">Digital Signature</p>
                <div 
                  className="w-full h-32 bg-white dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center relative cursor-crosshair overflow-hidden"
                  onClick={() => !media.length && setMedia(['signature_signed'])}
                >
                  {media.length > 0 ? (
                    <svg className="w-32 h-16 text-primary dark:text-gray-50 animate-in fade-in zoom-in" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 50 Q 40 10 60 50 T 100 50 T 140 30 T 180 70" />
                    </svg>
                  ) : (
                    <>
                      <PenTool className="w-6 h-6 text-gray-300 mb-2" />
                      <span className="text-[12px] leading-tight uppercase font-bold text-gray-400">Tap to Sign</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {stage !== 'type' && (
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            {step > 1 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}
            {step < 4 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (media.length > 0) {
                    setStep(step + 1);
                    setMedia([]);
                  }
                }}
                disabled={media.length === 0}
                className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-normal flex items-center justify-center gap-2 transition-all ${
                  media.length > 0 ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-50'
                }`}
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex-1 h-14 bg-green-500 text-white rounded-2xl font-black uppercase tracking-normal shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Completing...
                  </>
                ) : (
                  'Complete Protocol'
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};



const CategoryNav = ({ activeCategories, onSelectCategory }: { activeCategories: string[], onSelectCategory: (id: string) => void }) => (
  <div className="pt-3 pb-0">
    <div className="flex overflow-x-auto hide-scrollbar px-4 gap-2.5 snap-x">
      {categories.map((category) => {
        const Icon = IconMap[category.icon];
        const isActive = activeCategories.includes(category.id);
        
        return (
          <motion.button 
            key={category.id}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -1 }}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center justify-center gap-0.5 p-2 w-[68px] h-[76px] rounded-2xl snap-start shrink-0 transition-all outline-none border-2 shadow-sm ${
              isActive 
                ? 'bg-accent-light border-accent text-accent' 
                : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-primary dark:text-gray-50 hover:border-gray-200 dark:border-gray-700 dark:hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} strokeWidth={1.5} />
            </div>
            <span className={`text-[9px] font-bold text-center leading-[1] transition-colors mt-0.5 flex flex-col items-center justify-center min-h-[16px] ${isActive ? 'text-accent' : 'text-gray-500 dark:text-gray-400'}`}>
              {category.name.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </span>
          </motion.button>
        );
      })}
    </div>
  </div>
);



const BottomNav = ({ currentView, onSetView, onHomeDoubleTap, userRole = 'user' }: { 
  currentView: ViewMode, 
  onSetView: (v: ViewMode) => void, 
  onHomeDoubleTap: () => void,
  userRole?: 'user' | 'dealer'
}) => {
  const [lastTap, setLastTap] = useState(0);

  const handleHomeClick = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      onHomeDoubleTap();
    } else {
      onSetView('marketplace');
    }
    setLastTap(now);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-md w-full shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-5 items-center px-2">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center gap-1.5 transition-colors group ${currentView === 'marketplace' ? 'text-primary dark:text-gray-50' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-50'}`}
        >
          <motion.div animate={{ rotate: currentView === 'marketplace' ? 360 : 0 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
            <CircleDashed className={`w-6 h-6 transition-transform group-hover:scale-110 ${currentView === 'marketplace' ? 'text-primary dark:text-gray-50' : ''}`} />
          </motion.div>
          <span className="text-[12px] leading-tight tracking-[0.05em] font-bold">Explore</span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => onSetView('community')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-colors group ${currentView === 'community' ? 'text-primary dark:text-gray-50' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-50'}`}
        >
          <LayoutGrid className={`w-6 h-6 transition-transform group-hover:scale-110 ${currentView === 'community' ? 'text-accent' : ''}`} />
          <span className="text-[12px] leading-tight tracking-[0.05em] font-bold">Hub</span>
        </motion.button>
        
        <div className="flex justify-center -mt-8 relative z-30">
          <motion.button 
            whileTap={{ scale: 0.9, y: 0 }}
            whileHover={{ y: -4 }}
            onClick={() => onSetView('list-asset')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border-[4px] border-white dark:border-gray-950 bg-primary dark:bg-gray-900 ${
              currentView === 'list-asset' ? 'ring-4 ring-accent/20' : ''
            }`}
          >
            <Plus className="w-7 h-7 text-[#71ccff]" strokeWidth={2.5} />
          </motion.button>
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => onSetView('messages')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-colors group ${currentView === 'messages' ? 'text-primary dark:text-gray-50' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-50'}`}
        >
          <MessageCircle className={`w-6 h-6 transition-transform group-hover:scale-110 ${currentView === 'messages' ? 'text-accent fill-accent/10' : ''}`} />
          <span className="text-[12px] leading-tight tracking-[0.05em] font-bold">Messages</span>
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => onSetView('profile')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-colors group ${currentView === 'profile' ? 'text-primary dark:text-gray-50' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-50'}`}
        >
          <User className={`w-6 h-6 transition-transform group-hover:scale-110 ${currentView === 'profile' ? 'text-accent' : ''}`} />
          <span className="text-[12px] leading-tight tracking-[0.05em] font-bold">Profile</span>
        </motion.button>
      </div>
    </div>
  );
};


const ReviewQueueModal = ({ 
  reviews, 
  onCancel, 
  onApprove, 
  onDecline 
}: { 
  reviews: any[], 
  onCancel: () => void, 
  onApprove: (id: string) => void, 
  onDecline: (id: string) => void 
}) => {
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

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
      className="absolute inset-0 bg-white dark:bg-gray-950 z-[100] flex flex-col pt-safe overflow-hidden text-left"
    >
      <div className="w-full flex justify-center pt-3 pb-1">
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
      </div>
      
      <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => selectedReview ? setSelectedReview(null) : onCancel()}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="font-black text-lg text-primary dark:text-gray-50 uppercase tracking-tight">
            Review Queue<span className="text-accent">.</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full">
          <Layers className="w-4 h-4 text-accent" />
          <span className="text-[12px] leading-tight font-bold text-accent uppercase tracking-normal">Dealer Admin</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {selectedReview ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 text-left border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] bg-accent/15 text-accent font-bold px-2 py-0.5 rounded uppercase tracking-wide inline-block mb-3">
                {selectedReview.type}
              </span>
              <h3 className="text-xl font-black text-primary dark:text-gray-50 uppercase tracking-tight mb-1">{selectedReview.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">{selectedReview.date}</p>
              
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
              
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Verification Details</h4>
              <p className="text-sm font-bold text-primary dark:text-gray-50 leading-relaxed mb-6">
                {selectedReview.detail}
              </p>
              
              <div className="p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center text-green-500">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary dark:text-gray-50">Identity Matching: 98.7%</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Liveliness check passed</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-900 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-yellow-800 dark:text-yellow-300 font-medium leading-relaxed">
                By approving, you verify that this application meets all legal requirements of the CoShare framework.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onDecline(selectedReview.id);
                  setSelectedReview(null);
                }}
                className="py-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-100 dark:border-gray-800 text-[12px] leading-tight font-black uppercase text-center shrink-0"
              >
                Reject
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onApprove(selectedReview.id);
                  setSelectedReview(null);
                }}
                className="py-4 rounded-xl bg-accent text-primary dark:text-gray-50 text-[12px] leading-tight font-black uppercase text-center shadow-lg shadow-accent/15"
              >
                Approve
              </motion.button>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-xs text-center font-bold text-gray-400 uppercase tracking-widest mb-2">
              {reviews.length} application{reviews.length !== 1 ? 's' : ''} awaiting review
            </p>
            
            {reviews.map(rev => (
              <div 
                key={rev.id}
                onClick={() => setSelectedReview(rev)}
                className="p-5 bg-gray-50 dark:bg-gray-900 hover:border-accent/40 rounded-3xl border border-gray-100 dark:border-gray-800 text-left cursor-pointer transition-all hover:scale-[1.01] flex justify-between items-center group"
              >
                <div className="space-y-2 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-accent bg-accent/15 px-1.5 py-0.5 rounded tracking-normal uppercase">
                      {rev.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{rev.date}</span>
                  </div>
                  <h4 className="font-bold text-base text-primary dark:text-gray-50">{rev.name}</h4>
                  <p className="text-xs text-gray-500 truncate max-w-[240px] font-medium">{rev.detail}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center border border-green-100 dark:border-green-900 mx-auto text-green-500">
              <Check className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-black text-primary dark:text-gray-50 uppercase tracking-tight">All Cleared</h3>
              <p className="text-sm text-gray-500 max-w-[220px] mx-auto leading-relaxed mt-1">Excellent job! The pending review application queue is completely empty.</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-6 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black uppercase text-gray-500"
            >
              Close
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const [activeCategories, setActiveCategories] = useState<string[]>(['0']);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'dealer'>('user');
  const [dealerType, setDealerType] = useState<string>('');
  const [isReviewQueueOpen, setIsReviewQueueOpen] = useState(false);
  const [pendingReviews, setPendingReviews] = useState([
    { id: '1', name: 'Zayn Malik', type: 'KYC Document Verification', detail: 'Passport Verification (UAE National ID)', date: '3 hours ago', status: 'Pending' },
    { id: '2', name: 'Yousuf Al-Hosani', type: 'Co-Ownership Application', detail: 'Aston Martin DB11 - 1 Fraction Slot', date: '5 hours ago', status: 'Pending' },
    { id: '3', name: 'Al Maha Marina Ltd', type: 'Dealership Registry', detail: 'Commercial Yacht License', date: '1 day ago', status: 'Pending' },
    { id: '4', name: 'Sarah Ken', type: 'Credit & Capital Approval', detail: 'Fraction purchase line of credit approval', date: '2 days ago', status: 'Pending' }
  ]);

  useEffect(() => {
    // The splash flow now handles loading completion
  }, []);

  const handleSelectCategory = (id: string) => {
    if (id === '0') {
      setActiveCategories(['0']);
    } else {
      setActiveCategories(prev => {
        let next = prev.filter(c => c !== '0');
        if (next.includes(id)) {
          next = next.filter(c => c !== id);
        } else {
          next.push(id);
        }
        return next.length === 0 ? ['0'] : next;
      });
    }
  };
  const [view, setView] = useState<ViewMode>('marketplace');
  const [navPreference, setNavPreference] = useState<NavPreference>('messages');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('main');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<AssetListing | null>(null);
  const [showingHubDetails, setShowingHubDetails] = useState(false);
  const [handoverListing, setHandoverListing] = useState<AssetListing | null>(null);
  const [bookingListing, setBookingListing] = useState<AssetListing | null>(null);
  const [acquireListing, setAcquireListing] = useState<AssetListing | null>(null);
  const [resellListing, setResellListing] = useState<AssetListing | null>(null);
  const [offerListing, setOfferListing] = useState<AssetListing | null>(null);
  const [disputeListing, setDisputeListing] = useState<AssetListing | null>(null);
  const [listAssetGoals, setListAssetGoals] = useState<ListingGoal[]>(['Co-own']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    minPrice: '',
    maxPrice: '',
    goals: [],
    verifiedOnly: false,
    minRating: 0
  });
  const activeFilterCount = (filters.location ? 1 : 0) + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + filters.goals.length + (filters.verifiedOnly ? 1 : 0) + (filters.minRating > 0 ? 1 : 0);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [savedAssetIds, setSavedAssetIds] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<AssetListing[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleCompare = (listing: AssetListing) => {
    setCompareList(prev => {
      const exists = prev.find(l => l.id === listing.id);
      if (exists) return prev.filter(l => l.id !== listing.id);
      if (prev.length >= 3) return prev;
      return [...prev, listing];
    });
  };

  const toggleSaveAsset = (id: string) => {
    setSavedAssetIds(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const filteredListings = mockListings.filter(listing => {
    if (listing.visibility === 'private') return false;
    const activeCategoryNames = activeCategories.map(catId => categories.find(c => c.id === catId)?.name).filter(Boolean);
    const matchesCategory = activeCategories.includes('0') || activeCategoryNames.includes(listing.category);
    const matchesMinPrice = !filters.minPrice || listing.pricePerMonth >= parseInt(filters.minPrice.replace(/[^0-9]/g, '') || '0');
    const matchesMaxPrice = !filters.maxPrice || listing.pricePerMonth <= parseInt(filters.maxPrice.replace(/[^0-9]/g, '') || '999999');
    const matchesGoal = !filters.goals || filters.goals.length === 0 || 
                        filters.goals.includes('All' as any) ||
                        (listing.goal && (filters.goals.includes(listing.goal as any) || listing.goal === 'All')) ||
                        (listing.goals && listing.goals.some(g => filters.goals.includes(g as any) || g === 'All'));
    const matchesVerified = !filters.verifiedOnly || !!listing.isVerified;
    const matchesLocation = !filters.location || (listing.location && listing.location.toLowerCase().includes(filters.location.toLowerCase()));
    const matchesSearch = !searchQuery || listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || listing.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = !filters.minRating || filters.minRating === 0 || (listing.rating && listing.rating >= filters.minRating);
    const matchesSlots = !filters.minSlotsAvailable || (listing.availableSlots && listing.availableSlots >= filters.minSlotsAvailable);
    
    return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesGoal && matchesVerified && matchesLocation && matchesSearch && matchesRating && matchesSlots;
  });

  const listingsInCurrentCategory = mockListings.filter(listing => {
    const activeCategoryNames = activeCategories.map(catId => categories.find(c => c.id === catId)?.name).filter(Boolean);
    return activeCategories.includes('0') || activeCategoryNames.includes(listing.category);
  });
  const availableGoalsInCategory = Array.from(new Set(listingsInCurrentCategory.flatMap(l => {
    const goalsList = [];
    if (l.goal) goalsList.push(l.goal);
    if (l.goals) goalsList.push(...l.goals);
    return goalsList;
  }))).filter(Boolean) as ListingGoal[];


  if (isAppLoading) {
    return (
      <div className={`h-[100dvh] bg-background flex justify-center overflow-hidden ${darkMode ? 'dark' : ''}`}>
        <div className="w-full max-w-md bg-white dark:bg-gray-950 shadow-xl h-full relative overflow-hidden flex flex-col translate-x-0">
          <SplashFlow 
            onComplete={() => setIsAppLoading(false)} 
            onLogin={(role, type) => {
              setIsLoggedIn(true);
              if (role) setUserRole(role);
              if (type) setDealerType(type);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[100dvh] bg-background flex justify-center overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Shell Constraint */}
      <div className="w-full max-w-md bg-white dark:bg-gray-950 shadow-xl h-full relative overflow-hidden flex flex-col translate-x-0">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-safe-top pt-4 left-0 right-0 mx-auto w-max max-w-[90%] z-50`}
            >
              <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
                toast.type === 'success' ? 'bg-green-500/90 text-white' : 
                toast.type === 'error' ? 'bg-red-500/90 text-white' : 
                'bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-950'
              }`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-bold tracking-wide">{toast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Overlay */}
        <AnimatePresence>
          {showCompareView && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="absolute inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col p-6"
            >
            <div className="flex justify-between items-center mb-8 pt-6">
              <h2 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight uppercase">Side-By-Side</h2>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCompareView(false)}
                className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-x-auto pb-20 no-scrollbar">
              <div className="flex gap-4 min-w-max">
                {compareList.map(asset => (
                  <div key={asset.id} className="w-64 flex flex-col gap-6">
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                      <img src={asset.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-4 text-left">
                      <div>
                        <h3 className="font-bold text-primary dark:text-gray-50">{asset.title}</h3>
                        <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">{asset.category}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                          <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Total Value</p>
                          <p className="text-sm font-black text-primary dark:text-gray-50">AED {asset.totalValue?.toLocaleString('de-DE') || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-accent/10">
                          <p className="text-[12px] leading-tight font-bold text-accent uppercase mb-1">Monthly Cost</p>
                          <p className="text-sm font-black text-primary dark:text-gray-50">AED {asset.pricePerMonth.toLocaleString('de-DE')}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                          <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Cost / Hour (Est)</p>
                          <p className="text-sm font-black text-primary dark:text-gray-50">AED {Math.round(asset.pricePerMonth / 40).toLocaleString('de-DE')}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                          <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Equity %</p>
                          <p className="text-sm font-black text-primary dark:text-gray-50">{Math.round(100 / (asset.totalSlots || 1))}% Share</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Filter & Compare Tray */}
      {view === 'marketplace' && !selectedListing && (
        <div className="absolute bottom-24 left-0 right-0 z-[50] pointer-events-none flex flex-col items-center justify-end gap-3 px-4">
          <AnimatePresence>
            {compareList.length > 0 && !showCompareView && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="pointer-events-auto bg-primary dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-white dark:border-gray-950/10 w-full max-w-[400px] mx-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {compareList.map(l => (
                      <div key={l.id} className="w-10 h-10 rounded-xl border-2 border-primary bg-white dark:bg-gray-950 overflow-hidden shadow-lg">
                        <img src={l.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {compareList.length < 3 && (
                      <div className="w-10 h-10 rounded-xl border-2 border-dashed border-white dark:border-gray-950/30 flex items-center justify-center text-white/30 bg-primary dark:bg-gray-900/50">
                        <Plus className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-[12px] leading-tight font-bold text-white uppercase tracking-normal ml-1">
                    {compareList.length}/3 to compare
                  </p>
                </div>
                <motion.button
                  disabled={compareList.length < 2}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCompareView(true)}
                  className={`px-5 py-2.5 rounded-xl text-[12px] leading-tight font-black uppercase tracking-normal transition-all ${
                    compareList.length >= 2 ? 'bg-accent text-primary dark:text-gray-50 shadow-lg shadow-accent/20' : 'bg-white dark:bg-gray-950/10 text-white/40 border border-white dark:border-gray-950/5 cursor-not-allowed'
                  }`}
                >
                  Analyze
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
            className="pointer-events-auto flex items-center gap-2 px-6 py-3.5 bg-primary shadow-xl shadow-primary/30 dark:bg-gray-50 text-white dark:text-gray-950 rounded-full font-bold border border-white/10 dark:border-gray-900/10 transition-transform"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-accent text-white rounded-full text-[12px] leading-tight flex items-center justify-center font-black ml-1">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        </div>
      )}
        
        {view === 'marketplace' ? (
          <>
            <Header 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenNotifications={() => setView('notifications')} 
              onOpenFilters={() => setIsFilterOpen(true)}
              onOpenSaved={() => setView('saved')}
            />
            <main className="flex-1 pb-24 overflow-y-auto">
              <CategoryNav activeCategories={activeCategories} onSelectCategory={handleSelectCategory} />
              
              {/* Active Filter Chips */}
              <AnimatePresence>
                {(filters.location || filters.minPrice || filters.maxPrice || filters.goals.length > 0 || filters.verifiedOnly) && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-4 py-2 flex overflow-x-auto hide-scrollbar gap-2"
                  >
                    {filters.location && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-[12px] leading-tight font-bold text-primary dark:text-gray-50 shrink-0 whitespace-nowrap">
                        <span>LOC: {filters.location}</span>
                        <button onClick={() => setFilters({ ...filters, location: '' })} className="text-gray-400 dark:text-gray-500 hover:text-accent">
                          <Plus className="w-3 h-3 rotate-45" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                    {filters.verifiedOnly && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-100 rounded-lg text-[12px] leading-tight font-bold text-green-600 shrink-0 whitespace-nowrap">
                        <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                        <span>VERIFIED</span>
                        <button onClick={() => setFilters({ ...filters, verifiedOnly: false })} className="text-green-400 hover:text-green-600">
                          <Plus className="w-3 h-3 rotate-45" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                    {filters.minRating > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-100 rounded-lg text-[12px] leading-tight font-bold text-yellow-600 shrink-0 whitespace-nowrap">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{filters.minRating}+ STARS</span>
                        <button onClick={() => setFilters({ ...filters, minRating: 0 })} className="text-yellow-400 hover:text-yellow-600">
                          <Plus className="w-3 h-3 rotate-45" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                    {filters.minPrice && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-[12px] leading-tight font-bold text-primary dark:text-gray-50 shrink-0 whitespace-nowrap">
                        <span>MIN: {filters.minPrice}</span>
                        <button onClick={() => setFilters({ ...filters, minPrice: '' })} className="text-gray-400 dark:text-gray-500 hover:text-accent">
                          <Plus className="w-3 h-3 rotate-45" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                    {filters.maxPrice && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-[12px] leading-tight font-bold text-primary dark:text-gray-50 shrink-0 whitespace-nowrap">
                        <span>MAX: {filters.maxPrice}</span>
                        <button onClick={() => setFilters({ ...filters, maxPrice: '' })} className="text-gray-400 dark:text-gray-500 hover:text-accent">
                          <Plus className="w-3 h-3 rotate-45" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                    {filters.goals.length > 0 && filters.goals.map((g) => (
                      <div key={g} className="flex items-center gap-1.5 px-3 py-1 bg-accent/5 border border-accent/10 rounded-lg text-[12px] leading-tight font-bold text-accent shrink-0 whitespace-nowrap">
                        <span>GOAL: {g}</span>
                        <button onClick={() => setFilters({ ...filters, goals: filters.goals.filter(goal => goal !== g) })} className="text-accent hover:text-primary dark:hover:text-gray-50">
                          <Plus className="w-3 h-3 rotate-45" strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="px-4 mt-4">
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-lg font-bold text-primary dark:text-gray-50 text-left">Popular Listings</h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilters({ location: '', minPrice: '', maxPrice: '', goals: [], verifiedOnly: false, minRating: 0 })}
          className="text-sm font-bold text-accent hover:opacity-80 transition-opacity"
        >
          Clear Filters
        </motion.button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {filteredListings.length > 0 ? (
                    filteredListings.map(listing => (
                      <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        isSaved={savedAssetIds.includes(listing.id)}
                        onToggleSave={() => toggleSaveAsset(listing.id)}
                        isInCompare={compareList.some(l => l.id === listing.id)}
                        onToggleCompare={() => toggleCompare(listing)}
                        onClick={() => setSelectedListing(listing)} 
                      />
                    ))
                  ) : filters.goals.length > 0 && availableGoalsInCategory.length > 0 ? (
                    <div className="col-span-2 py-14 px-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-16 h-16 bg-white dark:bg-gray-950 rounded-3xl flex items-center justify-center text-accent shadow-sm mx-auto mb-6">
                        <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-bold text-primary dark:text-gray-50 mb-3">No exact matches<span className="text-accent">.</span></h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed mb-6 max-w-[240px] mx-auto">
                        No active pools match your specific preferences in this category. However, other assets check the required mark!
                      </p>
                      
                      <div className="mb-8">
                        <p className="text-[12px] leading-tight font-bold text-primary dark:text-gray-50 uppercase tracking-normal mb-3">Available in this category:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {availableGoalsInCategory.map(goal => (
                            <button 
                              key={goal}
                              onClick={() => {
                                setFilters(prev => ({ ...prev, goals: [goal] }));
                              }}
                              className="px-3 py-1.5 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-primary dark:text-gray-50 shadow-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                            >
                              {goal === 'Co-own' ? <Users className="w-3.5 h-3.5 text-blue-500" /> : 
                               goal === 'Share' ? <Handshake className="w-3.5 h-3.5 text-green-500" /> : 
                               goal === 'Swap' ? <RefreshCcw className="w-3.5 h-3.5 text-orange-500" /> :
                               <Layers className="w-3.5 h-3.5 text-accent" />}
                              {goal}
                            </button>
                          ))}
                        </div>
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilters(prev => ({ ...prev, goals: [] }))}
                        className="py-4 px-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-primary dark:text-gray-50 rounded-2xl text-[12px] leading-tight font-bold uppercase tracking-normal shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        Clear Filters
                      </motion.button>
                    </div>
                  ) : (
                    <div className="col-span-2 py-14 px-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-16 h-16 bg-white dark:bg-gray-950 rounded-3xl flex items-center justify-center text-accent shadow-sm mx-auto mb-6">
                        <Plus className="w-8 h-8" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-bold text-primary dark:text-gray-50 mb-3">Be the pioneer<span className="text-accent">.</span></h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed mb-10 max-w-[240px] mx-auto">
                        No active pools here yet. Start the first co-sharing cycle and define the market for this category.
                      </p>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setView('list-asset')}
                        className="py-4 px-8 bg-primary dark:bg-gray-900 text-accent rounded-2xl text-[12px] leading-tight font-bold uppercase tracking-normal shadow-2xl shadow-primary/30"
                      >
                        Launch First Listing
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-4 mt-8 flex flex-col gap-8 pb-8">
                {filteredListings.length >= 5 && (
                  <div className="text-center">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveCategories(['0']);
                        setFilters({ location: '', minPrice: '', maxPrice: '', goals: [], verifiedOnly: false, minRating: 0 });
                      }}
                      className="group flex flex-col items-center gap-2 mx-auto"
                    >
                      <span className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] group-hover:text-accent transition-colors">Explore All Assets</span>
                      <div className="w-8 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="w-0 group-hover:w-full h-full bg-accent transition-all duration-500" />
                      </div>
                    </motion.button>
                  </div>
                )}

                <div className="bg-accent-light rounded-2xl p-4 flex items-center justify-between border border-accent/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center text-accent shadow-sm">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-primary dark:text-gray-50">Don't see what you need?</h4>
                      <p className="text-xs text-slate-500 mt-0.5">List your item and invite cosharers.</p>
                    </div>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setView('list-asset')}
                    className="bg-primary dark:bg-gray-900 text-accent hover:bg-primary dark:hover:bg-gray-900/95 transition-colors text-xs font-bold py-2.5 px-4 rounded-xl whitespace-nowrap shadow-sm border border-accent/20"
                  >
                    List an Item
                  </motion.button>
                </div>
              </div>
            </main>
          </>
        ) : view === 'community' ? (
          <CommunityView 
            userRole={userRole}
            onOpenSettings={() => setIsSettingsOpen(true)} 
            onOpenHandover={() => setView('handover')}
            onBook={(asset) => setBookingListing(asset)}
            onResell={(asset) => setResellListing(asset)}
            onOpenHubAsset={(asset) => {
              setSelectedListing(asset);
              setView('hub-asset');
            }}
            onOpenReviewQueue={() => setIsReviewQueueOpen(true)}
          />
        ) : view === 'hub-asset' && selectedListing ? (
          <HubAssetView 
            asset={selectedListing}
            onBack={() => {
              setSelectedListing(null);
              setView('community');
            }}
            onChat={() => {
              if (selectedListing) {
                const chatName = `${selectedListing.title} Co-owners`;
                const chatAvatar = selectedListing.image;
                
                let conv = mockConversations.find(c => c.participantName === chatName);
                if (!conv) {
                  conv = {
                    id: `cosharer-${selectedListing.id}`,
                    participantName: chatName,
                    participantAvatar: chatAvatar,
                    isGroup: true,
                    groupMembers: ['Sarah Jenkins', 'Marco Rossi', 'Me'],
                    lastMessage: 'Welcome to the co-owners group!',
                    lastMessageTime: 'Just now',
                    unreadCount: 0,
                    listingTitle: selectedListing.title,
                    messages: [
                      { id: '1', senderId: 'them', senderName: 'Sarah J.', text: 'Hi all! Glad to be part of the pool.', timestamp: 'Just now', type: 'text' }
                    ]
                  };
                  mockConversations.unshift(conv);
                }
                
                setView('messages');
                setSelectedConversationId(conv.id);
              } else {
                setView('messages');
                setSelectedConversationId('1');
              }
            }}
            onDetails={() => setShowingHubDetails(true)}
            onSettings={() => setIsSettingsOpen(true)}
          />
        ) : view === 'handover' ? (
          <div className="flex flex-col h-full bg-white dark:bg-gray-950 flex-1 overflow-hidden">
            <div className="pt-8 px-6 pb-2">
              <button onClick={() => setView('community')} className="w-10 h-10 mb-4 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-black text-primary dark:text-gray-50 uppercase tracking-tight">Active Usage<span className="text-accent">.</span></h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-normal mt-1">Pending Handover Protocols</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {mockListings.slice(0, 2).map((asset) => (
                <div key={asset.id} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                      <img src={asset.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary dark:text-gray-50">{asset.title}</h4>
                      <p className="text-[12px] leading-tight font-bold text-gray-400 dark:text-gray-500 uppercase tracking-normal">{asset.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setHandoverListing(asset)}
                      className="flex-1 py-3 bg-primary dark:bg-gray-900 text-white rounded-xl text-[12px] leading-tight font-black uppercase tracking-normal flex items-center justify-center gap-2"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      Begin Handover
                    </motion.button>
                    <button 
                      onClick={() => setDisputeListing(asset)}
                      className="w-12 h-12 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                    <button className="w-12 h-12 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-primary dark:text-gray-50">
                      <History className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="pt-10 text-center space-y-2 opacity-30">
                <ShieldCheck className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500" />
                <p className="text-[12px] leading-tight font-bold uppercase tracking-normal">End-to-End Asset Verification</p>
              </div>
            </div>
          </div>
        ) : view === 'messages' ? (
          <div className="flex-1 relative overflow-hidden flex flex-col h-full">
            <MessagesView onSelectConversation={setSelectedConversationId} />
            <AnimatePresence>
              {selectedConversationId && (
                <ChatView 
                  conversation={mockConversations.find(c => c.id === selectedConversationId)!} 
                  onBack={() => setSelectedConversationId(null)}
                  onShowToast={showToast}
                />
              )}
            </AnimatePresence>
          </div>
        ) : view === 'saved' ? (
          <SavedView 
            onSelectListing={(listing) => setSelectedListing(listing)} 
            savedAssets={mockListings.filter(l => savedAssetIds.includes(l.id))}
            onToggleSave={toggleSaveAsset}
            onGoHome={() => setView('marketplace')}
          />
        ) : view === 'profile' ? (
          <ProfileView 
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            dealerType={dealerType}
            onLogin={(role, type) => {
              setIsLoggedIn(true);
              if (role) setUserRole(role);
              if (type) setDealerType(type);
              showToast('Successfully logged in.');
            }}
            onLogout={() => {
              setIsLoggedIn(false);
              setUserRole('user');
              setDealerType('');
              showToast('Successfully logged out.');
              setView('marketplace');
            }}
            onOpenSettings={(tab = 'main') => {
              setSettingsTab(tab);
              setIsSettingsOpen(true);
            }} 
            onSetView={setView} 
            onShowToast={showToast} 
            onOpenReviewQueue={() => setIsReviewQueueOpen(true)}
            pendingReviewsCount={pendingReviews.length}
          />
        ) : view === 'notifications' ? (
          <NotificationsView onBack={() => setView('marketplace')} onShowToast={showToast} />
        ) : (
          <ListAssetFlow 
            initialGoals={listAssetGoals}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onCancel={() => setView('marketplace')} 
            onComplete={(data, images) => {
              setView('community');
              showToast('Asset listed successfully!');
              if (data) {
                const nextId = (Math.max(...mockListings.map(l => Number(l.id) || 0)) + 1).toString();
                const newListing = {
                  id: nextId,
                  title: data.name || 'Custom Asset',
                  image: images && images[0] ? images[0] : 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
                  images: images && images.length ? images : ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80'],
                  rating: 5.0,
                  reviewCount: 0,
                  subtitle: data.description ? (data.description.substring(0, 40) + '...') : 'Verification pending',
                  pricePerMonth: Number(data.askingPrice) || 12000,
                  totalSlots: Number(data.totalFractions) || 8,
                  availableSlots: Number(data.totalFractions) || 8,
                  isFeatured: false,
                  type: userRole === 'dealer' ? 'dealer' : 'user',
                  visibility: data.visibility || 'public',
                  category: data.category === '0' || !data.category ? 'Cars' : (categories.find(c => c.id === data.category)?.name || 'Cars'),
                  goal: data.goals && data.goals[0] ? data.goals[0] : 'Co-own',
                  isVerified: true,
                  totalValue: (Number(data.askingPrice) || 12000) * (Number(data.totalFractions) || 8),
                  coOwnersCount: 0,
                  agent: {
                    name: userRole === 'dealer' ? 'Premium Dealership' : 'Alex Sterling',
                    avatar: userRole === 'dealer' ? 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80' : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
                    isVerified: true,
                    rating: 5.0
                  },
                  specifications: data.specifications || {}
                };
                mockListings.unshift(newListing as any);
              }
            }} 
          />
        )}
        
        {view !== 'list-asset' && view !== 'notifications' && (
          <BottomNav 
            currentView={view} 
            onSetView={setView}
            userRole={userRole}
            onHomeDoubleTap={() => {
              setActiveCategories(['0']);
              setView('marketplace');
            }}
          />
        )}

        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsModal 
              onClose={() => {
                setIsSettingsOpen(false);
                setTimeout(() => setSettingsTab('main'), 300);
              }} 
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              showToast={showToast}
              initialTab={settingsTab}
            />
          )}

          {isFilterOpen && (
            <FilterModal 
              filters={filters} 
              onUpdate={setFilters} 
              onClose={() => setIsFilterOpen(false)} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedListing && (view !== 'hub-asset' || showingHubDetails) && (
            <ListingDetailModal 
              listing={selectedListing} 
              isLoggedIn={isLoggedIn}
              isOwned={view === 'hub-asset' || (isLoggedIn && [1, 3, 8, 4, 99].includes(Number(selectedListing.id)))}
              isSaved={savedAssetIds.includes(selectedListing.id)}
              onToggleSave={() => toggleSaveAsset(selectedListing.id)}
              isInCompare={compareList.some(l => l.id === selectedListing.id)}
              onToggleCompare={() => toggleCompare(selectedListing)}
              onShowToast={showToast}
              onClose={() => {
                if (showingHubDetails) {
                  setShowingHubDetails(false);
                } else {
                  setSelectedListing(null);
                }
              }} 
              onBook={() => setBookingListing(selectedListing)}
              onBuyFraction={() => setAcquireListing(selectedListing)}
              onDispute={() => setDisputeListing(selectedListing)}
              onCosharerChat={() => {
                if (selectedListing) {
                  const chatName = `${selectedListing.title} Co-owners`;
                  const chatAvatar = selectedListing.image;
                  
                  let conv = mockConversations.find(c => c.participantName === chatName);
                  if (!conv) {
                    conv = {
                      id: `cosharer-${selectedListing.id}`,
                      participantName: chatName,
                      participantAvatar: chatAvatar,
                      isGroup: true,
                      groupMembers: ['Sarah Jenkins', 'Marco Rossi', 'Me'],
                      lastMessage: 'Welcome to the co-owners group!',
                      lastMessageTime: 'Just now',
                      unreadCount: 0,
                      listingTitle: selectedListing.title,
                      messages: [
                        { id: '1', senderId: 'them', senderName: 'Sarah J.', text: 'Hi all! Glad to be part of the pool.', timestamp: 'Just now', type: 'text' }
                      ]
                    };
                    mockConversations.unshift(conv);
                  }
                  
                  setSelectedListing(null);
                  setView('messages');
                  setSelectedConversationId(conv.id);
                } else {
                  setSelectedListing(null);
                  setView('messages');
                  setSelectedConversationId('1');
                }
              }}
              onHostChat={() => {
                if (selectedListing && selectedListing.agent) {
                  const hostName = selectedListing.agent.name;
                  const hostAvatar = selectedListing.agent.avatar;
                  
                  let conv = mockConversations.find((c: any) => c.participantName === hostName);
                  if (!conv) {
                    conv = {
                      id: `host-${selectedListing.id}-${Date.now()}`,
                      participantName: hostName,
                      participantAvatar: hostAvatar,
                      lastMessage: 'Let me know if you have any questions!',
                      lastMessageTime: 'Just now',
                      unreadCount: 0,
                      listingTitle: selectedListing.title,
                      messages: [
                        { id: '1', senderId: 'them', text: `Hi there! Thanks for your interest in the ${selectedListing.title}. Let me know if you have any questions!`, timestamp: 'Just now', type: 'text' }
                      ]
                    };
                    mockConversations.unshift(conv);
                  }
                  
                  setSelectedListing(null);
                  setView('messages');
                  setSelectedConversationId(conv.id);
                }
              }}
              onMakeOffer={() => setOfferListing(selectedListing)}
              onLogin={() => {
                setIsLoggedIn(true);
                showToast('Successfully logged in.');
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {handoverListing && (
            <HandoverProtocol 
              listing={handoverListing}
              onCancel={() => setHandoverListing(null)}
              onComplete={() => {
                setHandoverListing(null);
                setView('marketplace');
                showToast('Handover protocol completed successfully.');
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bookingListing && (
            <BookingFlow
              listing={bookingListing}
              onCancel={() => setBookingListing(null)}
              onComplete={() => {
                setBookingListing(null);
                showToast('Booking request sent.');
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {acquireListing && (
            <AcquireFractionFlow
              asset={acquireListing}
              onCancel={() => setAcquireListing(null)}
              onComplete={() => {
                setAcquireListing(null);
                showToast('Fraction successfully acquired! Calendar unlocked.');
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {resellListing && (
            <ResellFlow
              asset={resellListing}
              onCancel={() => setResellListing(null)}
              onComplete={(askingPrice, sharesToSell) => {
                const isPrivate = resellListing.visibility === 'private';
                setResellListing(null);
                
                if (isPrivate) {
                  showToast('Formal offer sent to co-owners.');
                  // Find the conversation ID based on the listing title, or hardcode it
                  const conversation = mockConversations.find(c => c.listingTitle === resellListing.title);
                  if (conversation) {
                    // Push the new message into the global mock data so it appears
                    if (!conversation.messages.find((m: any) => m.type === 'offer' && m.senderId === 'me')) {
                      conversation.messages.push({
                        id: Date.now().toString(),
                        senderId: 'me',
                        text: `I am looking to resell ${sharesToSell} of my fraction(s) in the ${resellListing.title} to the group.`,
                        timestamp: 'Just now',
                        type: 'offer',
                        offer: {
                          price: askingPrice || resellListing.pricePerMonth, 
                          type: 'co-own',
                          shares: sharesToSell,
                          status: 'pending'
                        }
                      });
                    }
                    setSelectedConversationId(conversation.id);
                    setView('messages');
                  }
                } else {
                  showToast('Fraction listed on the marketplace.');
                }
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {offerListing && (
            <MakeOfferFlow
              asset={offerListing}
              onCancel={() => setOfferListing(null)}
              onComplete={(offer) => {
                setOfferListing(null);
                
                // Find or create chat with host
                let conv = null;
                if (offerListing.agent) {
                  const hostName = offerListing.agent.name;
                  const hostAvatar = offerListing.agent.avatar;
                  
                  conv = mockConversations.find((c: any) => c.participantName === hostName);
                  if (!conv) {
                    conv = {
                      id: `host-${offerListing.id}-${Date.now()}`,
                      participantName: hostName,
                      participantAvatar: hostAvatar,
                      lastMessage: 'Formal offer sent.',
                      lastMessageTime: 'Just now',
                      unreadCount: 0,
                      listingTitle: offerListing.title,
                      messages: []
                    };
                    mockConversations.unshift(conv);
                  }
                  
                  const isCoown = offer.type === 'co-own';
                  const textContent = isCoown 
                    ? `I am offering AED ${offer.price.toLocaleString('de-DE')} for ${offer.shares} share(s) of the ${offerListing.title}.`
                    : `I am offering AED ${offer.price.toLocaleString('de-DE')} to ${offer.type} the ${offerListing.title} for ${offer.duration} month(s) starting ${new Date(offer.startDate!).toLocaleDateString()}.`;

                  if (!conv.messages.find((m: any) => m.type === 'offer' && m.senderId === 'me' && m.text === textContent)) {
                    conv.messages.push({
                      id: Date.now().toString(),
                      senderId: 'me',
                      text: textContent,
                      timestamp: 'Just now',
                      type: 'offer',
                      offer: offer
                    });
                    conv.lastMessage = `Formal offer sent.`;
                    conv.lastMessageTime = 'Just now';
                  }
                }
                
                showToast('Formal offer submitted.');
                setView('messages');
                setSelectedConversationId(conv ? conv.id : '1');
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {disputeListing && (
            <DisputeFlow
              listing={disputeListing}
              onCancel={() => setDisputeListing(null)}
              onComplete={() => {
                setDisputeListing(null);
                showToast('Issue reported successfully.');
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReviewQueueOpen && (
            <ReviewQueueModal
              reviews={pendingReviews}
              onCancel={() => setIsReviewQueueOpen(false)}
              onApprove={(id) => {
                setPendingReviews(prev => prev.filter(r => r.id !== id));
                showToast('Application approved!');
              }}
              onDecline={(id) => {
                setPendingReviews(prev => prev.filter(r => r.id !== id));
                showToast('Application rejected.', 'error');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
