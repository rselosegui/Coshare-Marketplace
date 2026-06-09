import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Wallet, Loader2, FileText, CheckCircle2, ShieldCheck, Fingerprint, CreditCard, PenTool, Check, X } from 'lucide-react';
import { AssetListing } from '../types';

export const AcquireFractionFlow = ({ asset, onComplete, onCancel }: { asset: AssetListing, onComplete: () => void, onCancel: () => void }) => {
  const [step, setStep] = useState<'commitment' | 'kyc' | 'signOff'>('commitment');
  const [isLoading, setIsLoading] = useState(false);
  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [signature, setSignature] = useState('');
  const [showSHAPopup, setShowSHAPopup] = useState(false);
  const [shaAgreed, setShaAgreed] = useState(false);
  const [shaChecks, setShaChecks] = useState([false, false, false, false, false]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showFullSHAModal, setShowFullSHAModal] = useState(false);

  const allChecksAgreed = shaChecks.every(Boolean);

  const handleNext = () => {
    if (step === 'commitment') setStep('kyc');
    else if (step === 'kyc') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (!shaAgreed) {
          setShowSHAPopup(true);
        } else {
          setStep('signOff');
        }
      }, 1500); // Simulate KYC verification
    } else if (step === 'signOff') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 2000); // Simulate payment and signing
    }
  };

  const costPerShare = (asset.totalValue || 0) / (asset.totalSlots || 8);
  const totalCost = costPerShare * sharesToBuy;
  const platformFee = totalCost * 0.025;
  const totalPayable = totalCost + platformFee;

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
              if (step === 'signOff') setStep('kyc');
              else if (step === 'kyc') setStep('commitment');
              else onCancel();
            }}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary dark:text-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <h2 className="font-black text-lg text-primary dark:text-gray-50 uppercase tracking-tight">
            Acquire Fraction<span className="text-accent">.</span>
          </h2>
        </div>
        <div className="flex gap-1">
          <div className={`h-1.5 w-6 rounded-full ${step === 'commitment' || step === 'kyc' || step === 'signOff' ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-800'}`} />
          <div className={`h-1.5 w-6 rounded-full ${step === 'kyc' || step === 'signOff' ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-800'}`} />
          <div className={`h-1.5 w-6 rounded-full ${step === 'signOff' ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-800'}`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 p-6">
        <AnimatePresence mode="wait">
          {step === 'commitment' && (
            <motion.div 
              key="commitment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-5 flex items-center gap-4">
                 <img src={asset.image} alt={asset.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                 <div>
                   <h3 className="font-bold text-primary dark:text-gray-50 text-lg leading-tight mb-1 truncate max-w-[200px]">{asset.title}</h3>
                   <p className="text-[12px] font-bold text-accent uppercase tracking-tight">{asset.category}</p>
                 </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-primary dark:text-gray-50 mb-3 flex items-center justify-between uppercase tracking-tight">
                  <span>Fractions to Acquire</span>
                  {asset.totalSlots && (
                    <span className="text-accent text-xs">{(sharesToBuy / asset.totalSlots * 100).toFixed(1)}% Ownership</span>
                  )}
                </h3>
                <div className="flex bg-gray-50 dark:bg-gray-900 rounded-xl p-2 max-w-full overflow-x-auto gap-2 scrollbar-none">
                  {Array.from({ length: asset.availableSlots || 4 }).map((_, i) => {
                     const num = i + 1;
                     return (
                       <button 
                         key={num}
                         onClick={() => setSharesToBuy(num)}
                         className={`min-w-[60px] flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${sharesToBuy === num ? 'bg-white dark:bg-gray-950 text-primary dark:text-gray-50 shadow-sm' : 'text-gray-400 hover:text-primary'}`}
                       >
                         {num} {num === 1 ? 'Share' : 'Shares'}
                       </button>
                     );
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 space-y-4 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Fraction Cost</span>
                  <span className="font-black text-primary dark:text-gray-50">AED {totalCost.toLocaleString('de-DE')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Platform Fee (2.5%)</span>
                  <span className="font-bold text-gray-500">AED {platformFee.toLocaleString('de-DE')}</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-primary dark:text-gray-50 uppercase tracking-tight">Total Required</span>
                  <span className="font-black text-xl text-accent">AED {totalPayable.toLocaleString('de-DE')}</span>
                </div>
              </div>

              <div className="bg-accent/5 rounded-3xl p-5 border border-accent/20 flex gap-4 items-start">
                <FileText className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 uppercase tracking-tight mb-1">Automated Shareholder Agreement</h4>
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed mb-3">
                    A legally binding Shareholder Agreement (SHA) will be generated. You will be designated as an "Authorized User/Driver" under the Lead Owner framework.
                  </p>
                  <button 
                    onClick={() => setShowTermsModal(true)} 
                    className="text-[12px] font-black text-accent uppercase tracking-tight hover:underline cursor-pointer"
                  >
                    Review Terms & Conditions
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'kyc' && (
            <motion.div 
              key="kyc"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center pt-8"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Fingerprint className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-bold text-2xl text-primary dark:text-gray-50 mb-2 tracking-tight">Identity Verification</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[280px] mx-auto font-medium mb-8">
                To maintain the integrity of our verified community and comply with regulations, we need to verify your identity.
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="font-bold text-sm text-primary dark:text-gray-50">Government ID Scan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="font-bold text-sm text-primary dark:text-gray-50">Liveness Self-Check</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-accent/50 animate-pulse" />
                  </div>
                  <span className="font-bold text-sm text-primary dark:text-gray-50">AML & Background Screening</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'signOff' && (
            <motion.div 
              key="signOff"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-2"
            >
              <h3 className="font-bold text-xl text-primary dark:text-gray-50 mb-4 tracking-tight text-center">Transaction & Sign-Off</h3>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
                <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight mb-3">Payment Method</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary dark:text-gray-50" />
                    <div>
                      <div className="font-bold text-sm text-primary dark:text-gray-50">Apple Pay</div>
                      <div className="text-[12px] text-gray-400">**** **** **** 1234</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-primary dark:text-gray-50">AED {totalPayable.toLocaleString('de-DE')}</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
                <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-tight mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Digital Signature
                </h4>
                <p className="text-[12px] text-gray-500 font-medium leading-relaxed mb-4">
                  By signing below, you agree to the Automated Shareholder Agreement (SHA). You commit to acquiring {sharesToBuy} fraction(s) of {asset.title}.
                </p>
                <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 relative">
                  {!signature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <PenTool className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <input 
                    type="text"
                    placeholder="Type your full legal name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full bg-transparent outline-none font-custom block border-none font-bold text-lg text-primary dark:text-gray-50 placeholder:text-gray-300 dark:placeholder:text-gray-700 text-center py-2" 
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                  <div className="h-px bg-gray-200 dark:bg-gray-800 w-3/4 mx-auto mt-2" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pt-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-10 mx-auto max-w-md w-full">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={isLoading || (step === 'signOff' && signature.length < 3)}
          className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 rounded-2xl font-black text-[12px] uppercase tracking-normal shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 'commitment' ? (
            'Continue to Verification'
          ) : step === 'kyc' ? (
            'Initiate Trust Scan'
          ) : (
            'Complete Acquisition'
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSHAPopup && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 dark:bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-primary dark:text-gray-50 tracking-tight">Shareholder Agreement <br/><span className="text-accent text-sm">Key Highlights</span></h3>
                <button onClick={() => setShowSHAPopup(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-primary dark:hover:text-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 pb-4 space-y-3 flex-1 scrollbar-thin">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-4">
                  Please acknowledge the top 5 highlights of the Shareholder Agreement (SHA) tailored to {asset.title}. You will receive the full document upon signing.
                </p>

                {[
                  "I understand that co-ownership represents a secured equity stake, not a timeshare.",
                  "Operating expenses (insurance, maintenance) are divided proportionally based on fraction ownership.",
                  "Usage scheduling is governed by the smart calendar system with rotation logic.",
                  "Resale of fractions is permitted after the initial 60-day lock-up period.",
                  "The designated Lead Owner holds administrative rights for major operational decisions."
                ].map((text, i) => (
                  <label key={i} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <div className="relative flex items-center justify-center w-6 h-6 mt-0.5 mt-0 shrink-0">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-700 rounded-md checked:bg-accent checked:border-accent transition-colors"
                        checked={shaChecks[i]}
                        onChange={(e) => {
                          const newChecks = [...shaChecks];
                          newChecks[i] = e.target.checked;
                          setShaChecks(newChecks);
                        }}
                      />
                      <Check className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                    </div>
                    <span className="text-[12px] font-bold text-primary dark:text-gray-50 leading-relaxed pt-0.5">{text}</span>
                  </label>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 shrink-0">
                <button 
                  onClick={() => setShowFullSHAModal(true)} 
                  className="w-full py-2 text-[12px] font-bold text-gray-500 hover:text-primary dark:hover:text-gray-50 transition-colors underline cursor-pointer"
                >
                  Read Full Agreement
                </button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  disabled={!allChecksAgreed}
                  onClick={() => {
                    setShaAgreed(true);
                    setShowSHAPopup(false);
                    setStep('signOff');
                  }}
                  className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 rounded-2xl font-black text-[12px] uppercase tracking-normal shadow-lg disabled:opacity-50 transition-opacity"
                >
                  I Acknowledge & Agree
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {showTermsModal && (
          <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-primary/40 dark:bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-primary dark:text-gray-50 tracking-tight">Terms of Service</h3>
                <button onClick={() => setShowTermsModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-primary dark:hover:text-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 space-y-4 flex-1 text-left font-medium text-xs text-gray-500 dark:text-gray-400 leading-relaxed scrollbar-thin">
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">1. Scope of Coshare Services</h4>
                  <p>Coshare provides a fractional registry and compliance infrastructure allowing users to acquire, manage, and book shared lifestyle assets. We do not personally hold the deeds; we manage the programmatic governance & smart calendars.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">2. Platform Fees</h4>
                  <p>A non-refundable 2.5% platform fee is levied on all secondary transfer transactions of fractional units to cover automated secure payments, multi-party dispute monitoring, and ongoing compliance auditing.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">3. KYC Validation</h4>
                  <p>All members must successfully complete the advanced biometric verification prior to unlocking usage calendars or inspecting asset locations. Provided identity materials are securely stored under bank-grade encryption protocols.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">4. Reservation Compliance</h4>
                  <p>Members agree to book only available slots according to seasonal fractional limits. Booking allocations automatically reset annually.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">5. Liability Protocol</h4>
                  <p>Damage arising from mechanical wear-and-tear is proportionally covered by the collective maintenance reserve. Damage arising from direct operator negligence remains the sole liability of the booking member.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTermsModal(false)}
                  className="w-full py-4 bg-accent text-white rounded-2xl font-black text-[12px] uppercase tracking-normal shadow-lg shadow-accent/20"
                >
                  Close & Proceed
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {showFullSHAModal && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center p-6 bg-primary/40 dark:bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-black text-lg text-primary dark:text-gray-50 tracking-tight leading-tight">Shareholder Agreement</h3>
                  <p className="text-[10px] uppercase font-bold text-accent tracking-wider leading-none mt-1">Ref: {asset.title}</p>
                </div>
                <button onClick={() => setShowFullSHAModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-primary dark:hover:text-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 space-y-4 flex-1 text-left font-medium text-xs text-gray-500 dark:text-gray-400 leading-relaxed scrollbar-thin">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">FRACTIONAL ALLOCATION</p>
                  <p className="font-bold text-primary dark:text-gray-50">{sharesToBuy} Shares ({((sharesToBuy / (asset.totalSlots || 8)) * 100).toFixed(1)}% Ownership)</p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">SECTION 1: RECITALS</h4>
                  <p>Whereas the collective Shareholders have partnered to acquire co-ownership interests in the asset designated "<strong>{asset.title}</strong>", styled as fractional equity nodes managed through the automated secure consensus registry of Coshare.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">SECTION 2: RESALE & LIQUIDATION</h4>
                  <p>No Shareholder may liquidate, lease, or pledge their fractions as collateral without initiating a right of first refusal via the group forum. Resale transactions are subject to standard verification protocols and the Platform smart escrow fee.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">SECTION 3: USAGE COVENANTS</h4>
                  <p>The reservation rules are programmatically allocated with high-fidelity rotation calendar logic. Cleanliness, fuel replenishment, and location checklists must be certified upon each fractional checkout.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-gray-50 mb-1">SECTION 4: OPERABILITY ASSESSMENTS</h4>
                  <p>Operating costs, registration, insurance, logistics fees, and dockage or garage expenses are shared strictly in proportion to the fractional ownership percentage outlined above.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFullSHAModal(false)}
                  className="w-full py-4 bg-primary dark:bg-gray-50 text-white dark:text-gray-950 rounded-2xl font-black text-[12px] uppercase tracking-normal shadow-lg transition-opacity"
                >
                  Back to Checklist
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
