import React, { useState, useCallback } from 'react';
import { ArrowRight, MessageCircle, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTransition } from '../context/TransitionContext';

// Stat item: Clean, transparent, typography-first
function StatCard({ stat, displayValue }) {
  const [tapped, setTapped] = useState(false);

  const isTouchDevice = useCallback(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleTap = () => {
    if (isTouchDevice()) {
      setTapped((prev) => !prev);
    }
  };

  return (
    <div
      className={`p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 rounded-lg ${
        tapped ? 'bg-zinc-900/40' : 'hover:bg-zinc-900/25'
      }`}
      onClick={handleTap}
      tabIndex={0}
    >
      <div className="text-3xl sm:text-5xl font-bold tracking-tight text-white transition-colors">
        {displayValue}
      </div>
      <div className="text-sm font-medium text-zinc-300 mt-2 uppercase tracking-wide">
        {stat.label}
      </div>
      <div className="text-xs text-zinc-500 mt-1">
        {stat.desc}
      </div>
    </div>
  );
}

export default function Hero() {
  const { data } = useData();
  const { navigateTo } = useTransition();
  const waLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground, saya tertarik untuk konsultasi pembuatan proyek website/aplikasi.')}`;

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-transparent border-b border-zinc-800/40">

      {/* Subtle clean glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-7">

          {/* Clean Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400">
            <span>High-Performance Software Studio</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12] flex flex-col items-center gap-2">
            <span>{data.heroHeadline1 || 'Butuh Website?'}</span>
            <span className="text-zinc-400">
              {data.heroHeadlineHighlight1 || 'Butuh Aplikasi?'}
            </span>
            <span className="text-white">
              {data.heroHeadlineHighlight2 || 'Gass Bareng Kitaa Ajaa!'}
            </span>
          </h1>

          {/* Clean Description */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {data.subHeadline}
          </p>

          {/* Action CTA Buttons (Clean Minimalist as Requested) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#portfolio', 'Work');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-2.5 font-medium rounded-md hover:bg-zinc-200 transition-all cursor-pointer shadow-sm"
            >
              <span>Explore Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-800 text-zinc-300 px-6 py-2.5 font-medium rounded-md hover:bg-zinc-900 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Initiate Consultation</span>
            </a>
          </div>

          {/* Trust Highlights */}
          {data.trustHighlights && data.trustHighlights.length > 0 && (
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400">
              {data.trustHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800/60 bg-zinc-900/20 text-zinc-400"
                >
                  <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clean Transparent Stats Grid */}
        <div className="mt-16 sm:mt-20 max-w-2xl mx-auto grid grid-cols-2 divide-x divide-zinc-800/40 border-y border-zinc-800/40">
          {data.stats?.map((stat, idx) => {
            const displayValue =
              stat.id === 'stat-1' || stat.label?.toLowerCase().includes('proyek')
                ? (data.portfolio?.length ?? stat.value)
                : stat.value;

            return <StatCard key={idx} stat={stat} displayValue={displayValue} />;
          })}
        </div>
      </div>
    </section>
  );
}
