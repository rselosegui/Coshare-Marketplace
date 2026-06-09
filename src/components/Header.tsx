import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart, Bell, Search, SlidersHorizontal } from 'lucide-react';
import { mockListings } from '../data';

export const Header = ({ searchQuery, onSearchChange, onOpenNotifications, onOpenFilters, onOpenSaved }: { searchQuery: string, onSearchChange: (q: string) => void, onOpenNotifications: () => void, onOpenFilters: () => void, onOpenSaved: () => void }) => {
  const [placeholder, setPlaceholder] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = useMemo(() => {
    const titles = mockListings.map(l => l.title);
    return titles.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    if (!currentPhrase) return;
    const typingSpeed = isDeleting ? 50 : 120;
    const pauseTime = isDeleting ? 50 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setPlaceholder(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholder(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  return (
    <div className="pt-6 pb-2 px-4 bg-white dark:bg-gray-950 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
      <div className="grid grid-cols-3 items-center mb-3 px-2">
        <div className="flex items-center"></div>
        <div className="text-center font-bold text-xl tracking-tight text-primary dark:text-gray-50 flex justify-center items-center">
          {/* We'll change the text later if we want the actual logo, but user just said "Make sure 'coshare.' logo at the top in centered" */}
          <span>coshare<span className="text-accent">.</span></span>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSaved}
            className="w-11 h-11 flex items-center justify-center text-primary dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-full transition-colors"
          >
            <Heart className="w-6 h-6" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onOpenNotifications}
            className="relative w-11 h-11 flex items-center justify-center text-primary dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></span>
          </motion.button>
        </div>
      </div>
      
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input 
            type="search" 
            enterKeyHint="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${placeholder}...`} 
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900/80 rounded-2xl text-[16px] font-medium text-primary dark:text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:bg-white dark:focus:bg-gray-900 transition-all border border-gray-100 dark:border-gray-800"
          />
        </div>
      </div>
    </div>
  );
};