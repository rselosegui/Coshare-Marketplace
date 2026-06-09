import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, ShoppingBag, 
  MapPin, Loader2, Camera, Upload, X, Trash2, Plus, Image as LucideImage,
  CarFront, Bike, Sailboat, Home, Watch, LayoutGrid, Shapes, Eye
} from 'lucide-react';
import { categories } from '../data';
import { ListingGoal, EntityType, ListingForm as ListingFormType } from '../types';

const IconMap: Record<string, React.ElementType> = {
  CarFront, Bike, Sailboat, Home, Watch, ShoppingBag, LayoutGrid, Shapes
};

const MAIN_SPECS: Record<string, { label: string, key: string, type: 'text' | 'number' | 'select', options?: string[] }[]> = {
  '1': [ // Cars
    { label: 'Condition', key: 'condition', type: 'select', options: ['Brand New', 'Pre-owned', 'Certified Pre-owned'] }
  ],
  '2': [ // Bikes
    { label: 'Condition', key: 'condition', type: 'select', options: ['Brand New', 'Pre-owned'] }
  ],
  '3': [ // Boats
    { label: 'Condition', key: 'condition', type: 'select', options: ['Brand New', 'Pre-owned'] }
  ],
  '4': [ // Real Estate
    { label: 'Condition', key: 'condition', type: 'select', options: ['Brand New', 'Ready', 'Off-Plan', 'Pre-owned'] },
    { label: 'Bedrooms', key: 'beds', type: 'number' },
    { label: 'Bathrooms', key: 'baths', type: 'number' }
  ],
  '5': [ // Watches
    { label: 'Condition', key: 'condition', type: 'select', options: ['Brand New', 'Unworn', 'Pre-owned'] },
    { label: 'Year', key: 'year', type: 'number' },
    { label: 'Box & Papers', key: 'boxpapers', type: 'select', options: ['Complete Set', 'Watch only', 'Box Only', 'Papers Only'] }
  ],
  '6': [ // Fashion
    { label: 'Condition', key: 'condition', type: 'select', options: ['Brand New', 'Boutique New', 'Pristine', 'Excellent', 'Good', 'Fair'] },
    { label: 'Includes', key: 'includes', type: 'text' }
  ],
  '7': [ // Others
    { label: 'Condition', key: 'condition', type: 'select', options: ['Brand New', 'Like New', 'Pre-owned', 'Fair'] },
    { label: 'Main Spec', key: 'spec', type: 'text' }
  ]
};

const VERIFICATION_FIELDS: Record<string, { label: string, key: string, type: 'text' | 'number' | 'select' | 'file', options?: string[], optional?: boolean, showIf?: (sub: string) => boolean }[]> = {
  '1': [ // Cars
    { label: 'VIN/Chassis Number', key: 'vin', type: 'text', optional: true },
    { label: 'Mileage (km)', key: 'mileage', type: 'number' },
    { label: 'Fuel Type', key: 'fuel', type: 'select', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
    { label: 'Motor Specs', key: 'specs', type: 'select', options: ['GCC', 'American', 'EU', 'Chinese', 'Japanese'] },
    { label: 'Mulkiya (RTA)', key: 'mulkiya', type: 'file', optional: true }
  ],
  '2': [ // Bikes
    { label: 'VIN/Chassis Number', key: 'vin', type: 'text', optional: true },
    { label: 'Mileage (km)', key: 'mileage', type: 'number' },
    { label: 'Fuel Type', key: 'fuel', type: 'select', options: ['Petrol', 'Diesel', 'Electric'] },
    { label: 'Motor Specs', key: 'specs', type: 'select', options: ['GCC', 'American', 'EU', 'Japanese', 'Other'] },
    { label: 'Engine Size (cc)', key: 'cc', type: 'number' },
    { label: 'Mulkiya (RTA)', key: 'mulkiya', type: 'file', optional: true }
  ],
  '3': [ // Boats
    { label: 'Engine hours', key: 'hours', type: 'number' },
    { label: 'Fuel Type', key: 'fuel', type: 'select', options: ['Petrol', 'Diesel', 'Electric'] },
    { label: 'Length (ft)', key: 'length', type: 'number' },
    { label: 'Beam (ft)', key: 'beam', type: 'number' },
    { label: 'Draft (ft)', key: 'draft', type: 'number' },
    { label: 'Berthing location', key: 'berthing', type: 'text' },
    { label: 'Tropical Aircon', key: 'aircon', type: 'select', options: ['Yes', 'No'] }
  ],
  '4': [ // Real Estate
    { label: 'Square Footage', key: 'sqft', type: 'number' },
    { label: 'Plot Number', key: 'plot', type: 'text' },
    { label: 'Orientation View', key: 'orientation', type: 'text', optional: true }
  ],
  '5': [ // Watches
    { label: 'Additional Documents Name', key: 'docName', type: 'text', optional: true },
    { label: 'Additional Documents', key: 'docFile', type: 'file', optional: true }
  ],
  '6': [ // Fashion
    { label: 'Additional Documents Name', key: 'docName', type: 'text', optional: true },
    { label: 'Additional Documents', key: 'docFile', type: 'file', optional: true }
  ],
  '7': [ // Others
    { label: 'Additional Documents Name', key: 'docName', type: 'text', optional: true },
    { label: 'Additional Documents', key: 'docFile', type: 'file', optional: true }
  ]
};

const SUGGESTED_LOCATIONS = [
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Sharjah, UAE",
  "London, UK",
  "Miami, FL, USA",
  "Los Angeles, CA, USA",
  "New York, NY, USA",
  "Monaco",
  "Paris, France",
  "Milan, Italy",
  "Rome, Italy",
  "Geneva, Switzerland",
  "Zurich, Switzerland",
  "Ibiza, Spain",
  "Marbella, Spain",
];

export const ListAssetFlow = ({ onCancel, onComplete, initialGoals = ['Co-own'], isLoggedIn = false, userRole = 'user' }: { onCancel: () => void, onComplete: (data?: any, images?: string[]) => void, initialGoals?: ListingGoal[], isLoggedIn?: boolean, userRole?: 'user' | 'dealer' }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ListingFormType>({
    entityType: isLoggedIn && userRole === 'dealer' ? 'business' : 'individual',
    category: '',
    subcategory: '',
    name: '',
    description: '',
    location: '',
    specifications: {},
    goals: initialGoals,
    isVerified: false,
    visibility: 'public',
    totalFractions: 8,
    maintenanceAllocation: 'proportional',
    usageRules: 'booking-system'
  });

  const activeCategory = categories.find(c => c.id === formData.category);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [step]);

  const isStep3Valid = () => {
    if (!formData.name || !formData.description || !formData.location) return false;
    
    if (formData.goals.includes('Co-own') || formData.goals.includes('All')) {
      if (!formData.askingPrice || !formData.annualOperatingCosts) return false;
    }

    const mainSpecs = MAIN_SPECS[formData.category] || [];
    return mainSpecs.every(f => {
      const val = formData.specifications[f.key];
      return val !== undefined && val !== '';
    });
  };

  const isStep4Valid = () => {
    const verifFields = VERIFICATION_FIELDS[formData.category] || [];
    const subCat = formData.subcategory;

    return verifFields.every(f => {
      if (f.showIf && !f.showIf(subCat)) return true;
      if (f.optional) return true;
      const val = formData.specifications[f.key];
      return val !== undefined && val !== '';
    });
  };

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete(formData, uploadedImages);
    }, 1500);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div 
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
            onCancel();
          }
        }}
        className="bg-white dark:bg-gray-950 w-full sm:max-w-md rounded-t-[2rem] sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="w-full flex justify-center pt-3 pb-1 bg-white dark:bg-gray-950 sticky top-0 z-20">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        <div className="px-4 pb-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-7 z-10">
        <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="p-2 -ml-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 text-primary dark:text-gray-50 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-primary dark:text-gray-50">List Asset</h1>
          <div className="flex gap-1 mt-1.5">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-accent' : 'bg-gray-100 dark:bg-gray-800'}`} />
            ))}
          </div>
        </div>
        <button onClick={onCancel} className="p-2 -mr-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 text-primary dark:text-gray-50 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto w-full pb-32">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              {!isLoggedIn && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-primary dark:text-gray-50">Who is listing this asset?</h2>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      { id: 'individual', label: 'Individual Owner', desc: 'I own this asset and want to share or swap it' },
                      { id: 'business', label: 'Business / Dealership', desc: 'I manage multiple assets professionally' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ 
                          ...formData, 
                          entityType: type.id as EntityType,
                          ...(type.id === 'business' ? { visibility: 'public' } : {})
                        })}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                          formData.entityType === type.id 
                            ? 'border-accent bg-accent/5' 
                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className={`font-bold text-lg ${formData.entityType === type.id ? 'text-accent' : 'text-primary dark:text-gray-50'}`}>{type.label}</div>
                          {formData.entityType === type.id && <CheckCircle2 className="w-5 h-5 text-accent" />}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}

                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-gray-50">Listing Goals <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-1">(Select all that apply)</span></h2>
              <div className="space-y-4 text-[16px]">
                {[
                  { id: 'All', label: 'All', desc: 'Flexible options for ownership, sharing, and swapping' },
                  { id: 'Co-own', label: 'Co-own', desc: 'Sell fractions to find partners to split ownership & costs' },
                  { id: 'Share', label: 'Share', desc: 'Rent out to earn money when you aren\'t using it' },
                  { id: 'Swap', label: 'Swap', desc: 'Exchange to trade time for other assets' }
                ].map((goal) => {
                  const isSelected = formData.goals.includes(goal.id as ListingGoal);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => {
                        let nextGoals: ListingGoal[] = [];
                        if (goal.id === 'All') {
                          nextGoals = isSelected ? [] : ['All'];
                        } else {
                          const otherGoals = formData.goals.filter(g => g !== 'All' && g !== goal.id);
                          const toggledGoal = goal.id as ListingGoal;
                          
                          if (isSelected) {
                            nextGoals = otherGoals;
                          } else {
                            nextGoals = [...otherGoals, toggledGoal];
                            // Check if all core goals are selected
                            const coreGoals = ['Co-own', 'Share', 'Swap'];
                            const hasAllCore = coreGoals.every(cg => nextGoals.includes(cg as ListingGoal));
                            if (hasAllCore) {
                              nextGoals = ['All'];
                            }
                          }
                        }
                        setFormData({ ...formData, goals: nextGoals });
                      }}
                      className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? 'border-accent bg-accent/5' 
                          : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-accent/10 text-accent' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className={`font-bold text-lg mb-0.5 ${isSelected ? 'text-accent' : 'text-primary dark:text-gray-50'}`}>{goal.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{goal.desc}</div>
                      </div>
                      {isSelected && (
                        <div className="pt-2 shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-2xl font-bold mb-6 text-primary dark:text-gray-50">What are you listing?</h2>
              
              {!formData.category ? (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: '4', name: 'Properties', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop' },
                    { id: '1', name: 'Mobility', img: 'https://images.unsplash.com/photo-1503376712344-652d2f1f51ee?q=80&w=300&auto=format&fit=crop' },
                    { id: '5', name: 'Luxury', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=300&auto=format&fit=crop' },
                    { id: '7', name: 'Others', img: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=300&auto=format&fit=crop' }
                  ].map(cat => {
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className="relative flex flex-col items-center justify-center h-32 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden group border-2 border-transparent hover:border-accent transition-colors"
                      >
                        <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                        <span className="relative z-10 font-bold text-white text-center text-sm uppercase tracking-wider">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      {activeCategory?.icon && (() => {
                        const CatIcon = IconMap[activeCategory.icon as string] || ShoppingBag;
                        return <CatIcon className="w-6 h-6 text-accent" />;
                      })()}
                      <span className="font-bold text-primary dark:text-gray-50">{activeCategory?.name}</span>
                    </div>
                    <button 
                      onClick={() => setFormData({ ...formData, category: '', subcategory: '' })}
                      className="text-sm font-bold text-accent"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-sm mb-3 px-1 text-primary dark:text-gray-50">Select Subtype</h3>
                    <div className="space-y-2">
                      {activeCategory?.subcategories.map(sub => (
                        <button
                          key={sub}
                          onClick={() => setFormData({ ...formData, subcategory: sub })}
                          className={`w-full text-left p-4 rounded-xl font-medium transition-all ${
                            formData.subcategory === sub
                              ? 'bg-accent text-white shadow-md shadow-accent/20'
                              : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-gray-50'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-2xl font-bold mb-6 text-primary dark:text-gray-50">Asset Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-normal text-gray-400 mb-2">Asset Name</label>
                  <input 
                    type="text"
                    placeholder={
                      {
                        '1': 'e.g. Porsche 911 Carrera S',
                        '2': 'e.g. Ducati Panigale V4',
                        '3': 'e.g. Azimut 50 Flybridge',
                        '4': 'e.g. Palm Jumeirah Villa',
                        '5': 'e.g. Rolex Submariner',
                        '6': 'e.g. Hermès Birkin 35',
                        '7': 'e.g. Leica M11 Camera',
                      }[formData.category] || 'e.g. Enter Asset Name'
                    }
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-normal text-gray-400 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about the condition, history, and why you're listing it..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-normal text-gray-400 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="e.g. Dubai Marina, UAE"
                      value={formData.location || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                        setShowLocationSuggestions(true);
                      }}
                      onFocus={() => setShowLocationSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                    />
                    <AnimatePresence>
                      {showLocationSuggestions && formData.location && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden z-20"
                        >
                          {SUGGESTED_LOCATIONS.filter(loc => loc.toLowerCase().includes((formData.location || '').toLowerCase())).slice(0, 5).map(loc => (
                            <div 
                              key={loc}
                              onClick={() => {
                                setFormData({ ...formData, location: loc });
                                setShowLocationSuggestions(false);
                              }}
                              className="px-4 py-3 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer flex items-center gap-3 transition-colors"
                            >
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-sm text-primary dark:text-gray-50">{loc}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {(formData.goals.includes('Co-own') || formData.goals.includes('All')) && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <h3 className="font-bold text-sm text-primary dark:text-gray-50 uppercase tracking-tight">Co-ownership Details</h3>
                    
                    <div>
                      <label className="block text-xs font-black uppercase tracking-normal text-gray-400 mb-2">Total Asking Price (AED)</label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 500.000"
                        value={formData.askingPrice || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const formatted = val ? Number(val).toLocaleString('de-DE') : '';
                          setFormData({ ...formData, askingPrice: formatted });
                        }}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-normal text-gray-400 mb-2">Annual Operating Costs (Est. AED)</label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 25.000"
                        value={formData.annualOperatingCosts || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const formatted = val ? Number(val).toLocaleString('de-DE') : '';
                          setFormData({ ...formData, annualOperatingCosts: formatted });
                        }}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                      />
                    </div>

                     <div>
                      <label className="block text-xs font-black uppercase tracking-normal text-gray-400 mb-2">Total Fractions (Shares)</label>
                      <select 
                        value={formData.totalFractions || 8}
                        onChange={(e) => setFormData({ ...formData, totalFractions: Number(e.target.value) })}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium appearance-none"
                      >
                        {[2, 4, 6, 8, 10, 12].map(num => (
                          <option key={num} value={num}>{num} fractions</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-4 space-y-4">
                      <h4 className="font-bold text-[12px] text-gray-500 uppercase tracking-tight mb-2">Legal Setup (SHA)</h4>
                      
                      <div>
                        <label className="block text-[12px] font-black uppercase tracking-normal text-gray-400 mb-1.5">Maintenance Allocation</label>
                        <select 
                          value={formData.maintenanceAllocation}
                          onChange={(e) => setFormData({ ...formData, maintenanceAllocation: e.target.value as any })}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium appearance-none text-sm"
                        >
                          <option value="proportional">Proportional (Based on shares)</option>
                          <option value="equal">Equal split among all owners</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-black uppercase tracking-normal text-gray-400 mb-1.5">Usage Rules</label>
                        <select 
                          value={formData.usageRules}
                          onChange={(e) => setFormData({ ...formData, usageRules: e.target.value as any })}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium appearance-none text-sm"
                        >
                          <option value="booking-system">Dynamic Booking (Calendar allocations)</option>
                          <option value="fixed-schedule">Fixed Schedule (Set dates per share)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {MAIN_SPECS[formData.category] && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <h3 className="font-bold text-sm text-primary dark:text-gray-50 uppercase tracking-tight">Main Specifications</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {MAIN_SPECS[formData.category].map(field => (
                        <div key={field.key}>
                          <label className="block text-[12px] leading-tight font-black uppercase tracking-normal text-gray-400 mb-1.5">{field.label}</label>
                          {field.type === 'select' ? (
                            <select
                              value={formData.specifications[field.key] || ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                specifications: { ...formData.specifications, [field.key]: e.target.value } 
                              })}
                              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium appearance-none"
                            >
                              <option value="">Select Option</option>
                              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : (
                            <input 
                              type={field.type}
                              placeholder={field.label}
                              value={formData.specifications[field.key] || ''}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                specifications: { ...formData.specifications, [field.key]: e.target.value } 
                              })}
                              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-2xl font-bold mb-2 text-primary dark:text-gray-50">Specs & Verification</h2>
              <p className="text-xs text-gray-500 mb-6 font-medium">Additional details to build trust within the community.</p>
              
              <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 mb-6 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <p className="text-[12px] leading-tight font-bold text-green-700 dark:text-green-400">
                  <span className="uppercase tracking-normal font-black block mb-1">Coshare Green Badge</span>
                  If you fill all details perfectly, your asset may receive a Green Badge, boosting its visibility and trust!
                </p>
              </div>

              <div className="space-y-4">
                {VERIFICATION_FIELDS[formData.category] && VERIFICATION_FIELDS[formData.category].map(field => {
                  if (field.showIf && !field.showIf(formData.subcategory)) return null;
                  return (
                    <div key={field.key}>
                      <label className="flex items-center gap-2 text-[12px] leading-tight font-black uppercase tracking-normal text-gray-400 mb-1.5">
                        {field.label}
                        {field.optional && <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">Optional</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={formData.specifications[field.key] || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            specifications: { ...formData.specifications, [field.key]: e.target.value } 
                          })}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium appearance-none"
                        >
                          <option value="">Select Option</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === 'file' ? (
                        <div className="relative">
                          <input 
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData({
                                  ...formData,
                                  specifications: { ...formData.specifications, [field.key]: `Uploaded: ${file.name}` }
                                });
                              }
                            }}
                            className="hidden"
                            id={`file-${field.key}`}
                          />
                          <label 
                            htmlFor={`file-${field.key}`}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="text-gray-500 dark:text-gray-400 truncate pr-4">
                              {formData.specifications[field.key] || 'Choose a file...'}
                            </span>
                            <Upload className="w-5 h-5 text-gray-400 shrink-0" />
                          </label>
                        </div>
                      ) : (
                        <input 
                          type={field.type}
                          placeholder={field.label}
                          value={formData.specifications[field.key] || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            specifications: { ...formData.specifications, [field.key]: e.target.value } 
                          })}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-2xl font-bold mb-2 text-primary dark:text-gray-50">Upload Photos</h2>
              <p className="text-xs text-gray-500 mb-8 font-medium italic">Landscape photos work best for high engagement.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {uploadedImages.length < 6 && (
                    <button 
                      onClick={() => {
                        const mockImages = [
                          'https://images.unsplash.com/photo-1503376712344-652d2f1f51ee?q=80&w=600',
                          'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600',
                          'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600'
                        ];
                        setUploadedImages([...uploadedImages, mockImages[uploadedImages.length % 3]]);
                      }}
                      className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <Plus className="w-6 h-6 text-gray-300" />
                      <span className="text-[12px] leading-tight font-black uppercase tracking-normal text-gray-400">Add Photo</span>
                    </button>
                  )}
                </div>

                {uploadedImages.length === 0 && (
                  <div 
                    onClick={() => setUploadedImages(['https://images.unsplash.com/photo-1503376712344-652d2f1f51ee?q=80&w=600'])}
                    className="py-12 px-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-primary dark:text-gray-50 mb-1">Drag & Drop or Click</h3>
                    <p className="text-xs text-gray-400">Up to 6 high-resolution photos</p>
                  </div>
                )}

                <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10 flex items-center gap-3">
                  <LucideImage className="w-5 h-5 text-accent opacity-50" />
                  <p className="text-[12px] leading-tight font-bold text-primary dark:text-gray-50 uppercase tracking-normal leading-relaxed">
                    AI Enhanced: Our system will automatically optimize lighting and contrast for your photos.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div 
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-2xl font-bold mb-6 text-primary dark:text-gray-50">Visibility Settings</h2>
              
              <div className="space-y-4 mb-8">
                {formData.entityType === 'business' ? (
                  <div className="w-full text-left p-5 rounded-2xl border-2 border-accent bg-accent/5">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-lg text-accent">Public Marketplace</div>
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">As a Commercial Dealer, your listing is automatically published to the Public Marketplace.</div>
                  </div>
                ) : (
                  [
                    { id: 'public', label: 'Public Marketplace', desc: 'Visible to everyone in the Coshare marketplace' },
                    { id: 'private', label: 'Private Circle', desc: 'Hidden from the marketplace. Only visible to people you invite' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, visibility: type.id as 'public' | 'private' })}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                        formData.visibility === type.id 
                          ? 'border-accent bg-accent/5' 
                          : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className={`font-bold text-lg ${formData.visibility === type.id ? 'text-accent' : 'text-primary dark:text-gray-50'}`}>{type.label}</div>
                        {formData.visibility === type.id && <CheckCircle2 className="w-5 h-5 text-accent" />}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{type.desc}</div>
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-col items-center justify-center text-center py-6 px-4">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 flex items-center justify-center rounded-full mb-6">
                  <ShieldCheck className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-primary dark:text-gray-50 mb-3">Almost Finished</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                  Your listing for <span className="font-bold text-primary dark:text-gray-50">{formData.name || 'your asset'}</span> looks great. Once published, it will be reviewed by our team for authenticity.
                </p>
                
                <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 text-left space-y-4 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-normal">Name</span>
                    <span className="font-black text-primary dark:text-gray-50 uppercase max-w-[150px] truncate text-right">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-normal">Type</span>
                    <span className="font-black text-primary dark:text-gray-50 uppercase text-right">{formData.subcategory}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-normal">Location</span>
                    <span className="font-black text-primary dark:text-gray-50 uppercase max-w-[150px] truncate text-right">{formData.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-normal">Visibility</span>
                    <span className="font-black text-primary dark:text-gray-50 uppercase max-w-[150px] truncate text-right">{formData.visibility}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-normal">Goals</span>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[150px]">
                      {formData.goals.map(g => (
                        <span key={g} className="px-2 py-0.5 bg-accent/10 text-accent rounded font-black uppercase text-[9px]">{g}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-normal">Photos</span>
                    <span className="font-black text-primary dark:text-gray-50">{uploadedImages.length} Uploaded</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-primary dark:text-gray-50 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 mb-8"
                >
                  <Eye className="w-5 h-5" />
                  Preview Listing
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex gap-3 w-full pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {step > 1 && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step === 5 ? 3 : step - 1)}
              className="px-6 py-4 rounded-xl font-bold bg-gray-100 dark:bg-gray-900 text-primary dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </motion.button>
          )}
          
          {step < 6 ? (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step === 3 ? 5 : step + 1)}
              disabled={
                (step === 2 && !formData.subcategory) ||
                (step === 3 && !isStep3Valid()) ||
                (step === 5 && uploadedImages.length === 0)
              }
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Next Step
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl font-black uppercase tracking-normal shadow-lg shadow-green-200 disabled:opacity-80"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Listing'
              )}
            </motion.button>
          )}
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <button onClick={() => setShowPreview(false)} className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <X className="w-6 h-6 text-primary dark:text-gray-50" />
              </button>
              <h2 className="font-bold text-lg text-primary dark:text-gray-50">Preview</h2>
              <div className="w-10"></div>
            </div>
            <div className="flex-1 overflow-y-auto w-full">
              {uploadedImages.length > 0 ? (
                 <img src={uploadedImages[0]} alt="Asset Preview" className="w-full h-64 object-cover" />
              ) : (
                 <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                   <LucideImage className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                 </div>
              )}
              <div className="p-5 space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-black text-primary dark:text-gray-50 leading-tight">{formData.name || 'Untitled Asset'}</h1>
                    <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4 uppercase">
                      {formData.subcategory || 'Category'}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {formData.location || 'Location not specified'}
                  </div>
                  <div className="flex gap-2 flex-wrap mb-6">
                    {formData.goals.map((goal, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-primary dark:text-gray-50 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {goal}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wide">
                      {formData.visibility}
                    </span>
                  </div>
                  {formData.description && (
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-primary dark:text-gray-50">Description</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                        {formData.description}
                      </p>
                    </div>
                  )}
                  
                  {Object.keys(formData.specifications).length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                       <h3 className="font-bold text-lg mb-4 text-primary dark:text-gray-50">Specifications</h3>
                       <div className="grid grid-cols-2 gap-4">
                         {Object.entries(formData.specifications).map(([key, val]) => {
                           if (!val) return null;
                           return (
                             <div key={key} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                               <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{key}</div>
                               <div className="text-sm font-medium text-primary dark:text-gray-50 truncate">{val as string}</div>
                             </div>
                           );
                         })}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
              <button 
                onClick={() => {
                  setShowPreview(false);
                  handleComplete();
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-black uppercase rounded-xl tracking-wide shadow-lg shadow-green-500/20 disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Confirm & Publish'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
