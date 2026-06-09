const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const s1 = `              {step < 4 ? (
              <>
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
              </div>

              <div className="space-y-4">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCapture}
                  className="w-full py-5 bg-primary dark:bg-gray-900 text-white rounded-[2rem] font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </motion.button>
              </div>
              </>
            ) : (
              </div>
              <div className="space-y-4 mt-6">
                <p className="text-xs font-bold text-primary dark:text-gray-50 uppercase tracking-widest text-center mb-2">Digital Signature</p>
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
                      <span className="text-[10px] uppercase font-bold text-gray-400">Tap to Sign</span>
                    </>
                  )}
                </div>
              </div>
            )}`;

const r1 = `              {step < 4 ? (
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
                  className="w-full py-5 bg-primary dark:bg-gray-900 text-white rounded-[2rem] font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                <p className="text-xs font-bold text-primary dark:text-gray-50 uppercase tracking-widest text-center mb-2">Digital Signature</p>
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
                      <span className="text-[10px] uppercase font-bold text-gray-400">Tap to Sign</span>
                    </>
                  )}
                </div>
              </div>
            )}`;

content = content.replace(s1, r1);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed tags');
