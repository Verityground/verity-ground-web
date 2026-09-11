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
        {/* Seamless Fullscreen White Curtain Wipe (No Seams, No Black Lines) */}
        <div
          className={`absolute inset-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            phase === 'enter'
              ? 'translate-y-0'
              : phase === 'exit'
              ? '-translate-y-full'
              : 'translate-y-full'
          }`}
        />

        {/* Center Logo with Dark Blue Pulse & Refined Soft Shadow */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-300 ${
            phase === 'enter' ? 'opacity-100 scale-100 delay-150' : 'opacity-0 scale-95'
          }`}
        >
          <div className="relative flex items-center justify-center p-6">
            {/* Soft, clean diffused shadow in subtle dark-blue behind the logo */}
            <div className="absolute -inset-6 rounded-full bg-[#022859]/10 blur-2xl pointer-events-none -z-10" />
            <div className="absolute -inset-2 rounded-2xl bg-slate-900/5 blur-md pointer-events-none -z-10" />

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
