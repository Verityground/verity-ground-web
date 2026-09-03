import React, { createContext, useContext, useState, useCallback } from 'react';

const TransitionContext = createContext();

/**
 * TransitionProvider:
 * Controls the full-screen kinetic curtain wipe transition (inspired by Noomo Agency & Awwwards studios).
 * When navigateTo(targetSelector, pageTitle) is called:
 * 1. Curtains wipe up from bottom to top with staggered timing.
 * 2. Center shows dynamic studio title / section name.
 * 3. Behind the curtain, window scrolls instantly to the target section.
 * 4. Curtains wipe out upwards towards the ceiling, cleanly revealing the newly arrived page/section.
 */
export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'enter' | 'exit'
  const [sectionLabel, setSectionLabel] = useState('');

  const navigateTo = useCallback((selector, label = '') => {
    if (isTransitioning) return;

    setSectionLabel(label);
    setIsTransitioning(true);
    setPhase('enter');

    // Step 1: Curtain sweeps up and covers viewport (400ms)
    setTimeout(() => {
      // Step 2: Jump/scroll behind curtain
      if (selector === '#top' || selector === '#') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        const el = document.querySelector(selector);
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }

      // Step 3: Switch curtain to exit phase (wipe upwards)
      setPhase('exit');

      // Step 4: Complete transition and reset
      setTimeout(() => {
        setIsTransitioning(false);
        setPhase('idle');
        setSectionLabel('');
      }, 650);
    }, 550);
  }, [isTransitioning]);

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning, phase, sectionLabel }}>
      {children}
      {/* Fullscreen Noomo-style Curtain Transition Overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none ${
          isTransitioning ? 'pointer-events-auto' : ''
        }`}
        aria-hidden="true"
      >
        {/* Multi-staggered Curtain Columns */}
        <div className="absolute inset-0 flex">
          {[0, 1, 2, 3, 4].map((colIndex) => {
            const delay = phase === 'enter' ? colIndex * 50 : colIndex * 40;
            return (
              <div
                key={colIndex}
                className={`flex-1 bg-slate-950 border-r border-slate-900/50 noomo-curtain-strip ${
                  phase === 'enter'
                    ? 'scale-y-100 origin-bottom'
                    : phase === 'exit'
                    ? 'scale-y-0 origin-top'
                    : 'scale-y-0 origin-bottom'
                }`}
                style={{
                  transitionDelay: `${delay}ms`
                }}
              />
            );
          })}
        </div>

        {/* Center Agency Headline & Indicator */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 z-10 ${
            phase === 'enter' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>VERITY GROUND • STUDIO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono uppercase tracking-tight">
            {sectionLabel || 'NAVIGATING'}
          </h2>
          <div className="w-12 h-0.5 bg-emerald-500 mt-4 rounded-full animate-pulse" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return ctx;
}
