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

    // Step 1: Curtain sweeps up and covers viewport
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
    }, 700);
  }, [isTransitioning]);

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning, phase, sectionLabel }}>
      {children}
      {/* Fullscreen Transition Overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none ${
          isTransitioning ? 'pointer-events-auto' : ''
        }`}
        aria-hidden="true"
      >
        {/* Multi-staggered Curtain Columns in Clean White */}
        <div className="absolute inset-0 flex">
          {[0, 1, 2, 3, 4].map((colIndex) => {
            const delay = phase === 'enter' ? colIndex * 40 : colIndex * 30;
            return (
              <div
                key={colIndex}
                className={`flex-1 bg-white border-r border-slate-100/80 noomo-curtain-strip ${
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

        {/* Center Logo with Dark Blue Pulse & Soft Ambient Shadow */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 z-10 ${
            phase === 'enter' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="relative flex items-center justify-center p-6">
            {/* Soft ambient diffused shadow behind the logo */}
            <div className="absolute -inset-10 rounded-full bg-slate-900/10 blur-3xl pointer-events-none -z-10" />
            <div className="absolute -inset-4 rounded-3xl bg-[#022859]/15 blur-2xl pointer-events-none -z-10" />

            <img
              src="/logo.png"
              alt="Verity Ground"
              className="w-36 sm:w-48 h-auto object-contain animate-darkblue-pulse select-none"
            />
          </div>
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
