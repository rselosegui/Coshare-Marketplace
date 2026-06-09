import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoshareLogo } from './CoshareLogo';
import { ArrowRight, X, ChevronRight } from 'lucide-react';

export const SplashFlow = ({ onComplete, onLogin }: { onComplete: () => void, onLogin: (role: 'user' | 'dealer', dealerType?: string) => void }) => {
  const [frame, setFrame] = useState<'logo' | 'welcome' | 'bullets' | 'auth'>('logo');
  const [authView, setAuthView] = useState<'options' | 'login' | 'signup-standard' | 'partner-options' | 'partner-login' | 'signup-dealer-type' | 'signup-dealer-details'>('options');
  const [selectedDealerType, setSelectedDealerType] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'coown' | 'share' | 'swap' | null>(null);

  const howItWorks = {
    coown: {
      title: 'How Co-own Works',
      color: 'text-blue-500',
      steps: [
        { title: 'Step 01: Explore or List', desc: 'Find an asset you love in the marketplace or list your own to find co-owners.' },
        { title: 'Step 02: Form a Group', desc: 'Join an existing pool of verified users, or invite a private circle of friends to co-own the asset together.' },
        { title: 'Step 03: Secure Ownership', desc: 'Finalize the shareholder agreement and checkout securely your share through our escrow registry.' },
        { title: 'Step 04: Book & Enjoy', desc: 'Schedule your fractional time using the AI booking system and easily split ongoing costs. Add-on extra services if you want, and enjoy the asset.' }
      ]
    },
    share: {
      title: 'How Share Works',
      color: 'text-green-500',
      steps: [
        { title: 'Step 01: Offer or Access', desc: 'List your asset\'s details and idle time to monetize it, or browse for assets you want to experience.' },
        { title: 'Step 02: Set the Rules', desc: 'Define available times and usage limits clearly; interested users will apply to share the asset.' },
        { title: 'Step 03: Review Members', desc: 'Verified users will apply to book time with your asset once both parties agree to the terms set by the owner.' },
        { title: 'Step 04: Earn & Maintain', desc: 'Approved users request to enjoy the asset, while owners effortlessly collect payments to cover running costs.' }
      ]
    },
    swap: {
      title: 'How Swap Works',
      color: 'text-purple-500',
      steps: [
        { title: 'Step 01: Deposit Time', desc: 'Add unused time from your owned asset fractions into the swap pool.' },
        { title: 'Step 02: Browse Assets', desc: 'Explore other amazing assets available in the global swap network.' },
        { title: 'Step 03: Request a Swap', desc: 'Propose a fair exchange of dates with another verified network member.' },
        { title: 'Step 04: Confirm & Go', desc: 'Once approved, pack your bags or grab the keys for your new experience.' }
      ]
    }
  };

  useEffect(() => {
    let t1: any, t2: any;
    if (frame === 'logo') {
      t1 = setTimeout(() => setFrame('welcome'), 1500);
    } else if (frame === 'welcome') {
      t2 = setTimeout(() => setFrame('bullets'), 1500);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [frame]);

  return (
    <div className="absolute inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col justify-center items-center overflow-hidden">
      <AnimatePresence mode="wait">
        {(frame === 'logo' || frame === 'welcome') && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center absolute inset-0"
          >
            <motion.div
              animate={{ y: frame === 'welcome' ? -10 : 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <CoshareLogo className="w-32 h-32 mb-6" />
            </motion.div>
            
            <AnimatePresence>
              {frame === 'welcome' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-3xl font-black text-primary dark:text-gray-50 tracking-tight">Welcome to <span className="text-accent">Coshare</span></h1>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {frame === 'bullets' && (
          <motion.div
            key="bullets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full h-full p-8 pt-safe pb-safe"
          >
            <div className="flex flex-col items-center mt-12 mb-16">
              <CoshareLogo className="w-20 h-20 mb-4" />
              <h1 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight">Welcome to <span className="text-accent">Coshare</span></h1>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { id: 'coown' as const, n: '👥', t: <><span className="text-blue-500 dark:text-blue-400">Co-own</span> the asset you want</>, i: 'Building equity in high-value assets securely.', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop' },
                { id: 'share' as const, n: '🤝', t: <><span className="text-blue-500 dark:text-blue-400">Share</span> the asset you own</>, i: 'Monetize unused time and cover running costs.', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=400&auto=format&fit=crop' },
                { id: 'swap' as const, n: '🔄', t: <><span className="text-blue-500 dark:text-blue-400">Swap</span> for the experiences you love</>, i: 'Trade time in your asset for access to others.', img: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=400&auto=format&fit=crop' }
              ].map((b, i) => (
                <motion.div 
                  key={b.n}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.15) }}
                  onClick={() => setSelectedMode(b.id)}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:scale-[1.02] cursor-pointer transition-transform"
                >
                  <img src={b.img} alt={typeof b.t === 'string' ? b.t : "lifestyle"} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-primary dark:text-gray-50 mb-1 text-sm">{b.t}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{b.i}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              onClick={() => setFrame('auth')}
              className="mt-8 mb-8 w-full py-4 rounded-2xl bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal flex items-center justify-center gap-2 shadow-xl shadow-primary/20 shrink-0"
            >
              Let's Coshare <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedMode && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 top-1/6 bg-white dark:bg-gray-950 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-none dark:border-t dark:border-gray-800 z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-6 pb-2">
                <h2 className={`text-xl font-black ${howItWorks[selectedMode].color} tracking-tight`}>{howItWorks[selectedMode].title}</h2>
                <button onClick={() => setSelectedMode(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-primary dark:hover:text-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {howItWorks[selectedMode].steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-white dark:bg-gray-950 shadow-sm ${howItWorks[selectedMode].color} shrink-0`}>
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary dark:text-gray-50 tracking-tight">{step.title.split(': ')[1]}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 pt-2 shrink-0 border-t border-gray-100 dark:border-gray-800">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMode(null)}
                  className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 rounded-2xl font-black text-[12px] uppercase tracking-normal"
                >
                  Got It
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {frame === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center w-full h-full p-8 relative"
          >
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
                className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-primary dark:hover:text-gray-50 transition-colors"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            )}

            <CoshareLogo className="w-24 h-24 mb-6" />
            <h1 className="text-2xl font-black text-primary dark:text-gray-50 tracking-tight text-center mb-4">
              {authView === 'options' ? (
                <>Welcome to <span className="text-accent">Coshare</span></>
              ) : authView === 'partner-options' ? (
                'Partner Portal'
              ) : authView === 'login' || authView === 'partner-login' ? (
                'Welcome Back'
              ) : (
                'Create an Account'
              )}
            </h1>
            
            {authView !== 'options' && (
              <p className="text-sm text-gray-500 text-center mb-8">
                {authView === 'partner-options' ? 'Log in or apply to become a certified dealership partner.' :
                 authView === 'login' || authView === 'partner-login' ? 'Enter your credentials to continue.' : 
                 authView === 'signup-dealer-type' ? 'What kind of assets do you manage?' :
                 'Sign up to co-own, share, and swap.'}
              </p>
            )}

            <div className="w-full space-y-4 max-w-sm">
              {authView === 'options' ? (
                <>
                  <button 
                    onClick={() => setAuthView('login')}
                    className="w-full py-4 rounded-2xl bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => setAuthView('signup-standard')}
                    className="w-full py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-primary dark:text-gray-50 font-black text-[12px] uppercase tracking-normal"
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => setAuthView('partner-options')}
                    className="w-full py-4 text-gray-400 dark:text-gray-500 font-bold text-[12px] uppercase tracking-wide transition-colors hover:text-primary dark:hover:text-gray-50"
                  >
                    Partners
                  </button>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={onComplete}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-bold text-primary dark:text-gray-50 hover:border-primary dark:hover:border-gray-700 transition-colors"
                    >
                      Explore as Guest
                    </button>
                    <button 
                      onClick={() => { onLogin('user'); onComplete(); }}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-bold text-primary dark:text-gray-50 hover:border-primary dark:hover:border-gray-700 transition-colors"
                    >
                      Individual Demo
                    </button>
                  </div>
                </>
              ) : authView === 'partner-options' ? (
                <>
                  <button 
                    onClick={() => setAuthView('partner-login')}
                    className="w-full py-4 rounded-2xl bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal"
                  >
                    Partner Log In
                  </button>
                  <button 
                    onClick={() => setAuthView('signup-dealer-type')}
                    className="w-full py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-primary dark:text-gray-50 font-black text-[12px] uppercase tracking-normal"
                  >
                    Apply as Partner
                  </button>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 w-full">
                    <p className="text-[10px] font-bold text-gray-400 text-center mb-3 uppercase tracking-wider">Demo Account</p>
                    <button 
                      onClick={() => { onLogin('dealer', 'Cars'); onComplete(); }}
                      className="w-full p-4 rounded-xl bg-accent/5 border border-accent/20 text-[11px] font-bold text-accent hover:border-accent transition-colors uppercase"
                    >
                      Dealer Demo
                    </button>
                  </div>
                </>
              ) : authView === 'login' || authView === 'partner-login' ? (
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
                  <button 
                    onClick={() => {
                      onLogin(authView === 'partner-login' ? 'dealer' : 'user');
                      onComplete();
                    }}
                    className="w-full py-4 rounded-2xl bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal mt-2"
                  >
                    Sign In
                  </button>
                </div>
              ) : authView === 'signup-dealer-type' ? (
                <>
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
                  <button 
                    onClick={() => setAuthView('signup-dealer-details')}
                    disabled={!selectedDealerType}
                    className="w-full py-4 rounded-2xl bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </>
              ) : (
                <div className="w-full space-y-4">
                  {authView === 'signup-dealer-details' && (
                     <input type="text" placeholder="Dealership Name" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors mb-4" />
                  )}
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
                  <input type="tel" placeholder="Mobile Phone" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
                  <input type="password" placeholder="Password" className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-gray-700 outline-none transition-colors" />
                  <button 
                    onClick={() => {
                      onLogin(authView === 'signup-dealer-details' ? 'dealer' : 'user', selectedDealerType);
                      onComplete();
                    }}
                    className="w-full py-4 rounded-2xl bg-primary dark:bg-gray-50 text-white dark:text-gray-950 font-black text-[12px] uppercase tracking-normal mt-2"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
