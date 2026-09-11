import React, { useState, useCallback } from 'react';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTransition } from '../context/TransitionContext';

// Individual stat card with its own hover/tap behavior
function StatCard({ stat, displayValue }) {
  const [tapped, setTapped] = useState(false);

  const isTouchDevice = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const handleTap = () => {
    if (isTouchDevice()) {
      setTapped((prev) => !prev);
    }
  };

  return (
    <div
      className="group/stat relative p-5 rounded-2xl text-center cursor-pointer"
      onClick={handleTap}
      onBlur={() => setTapped(false)}
      tabIndex={0}
    >
      {/* Glass box backdrop — CSS hover (desktop) + tap state (mobile) */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ease-out glass-panel
          opacity-0 scale-95 group-hover/stat:opacity-100 group-hover/stat:scale-100
          ${tapped ? '!opacity-100 !scale-100' : ''}`}
      />
      {/* Text content — always visible */}
      <div className="relative z-10">
        <div className="text-2xl sm:text-3xl font-extrabold font-mono bg-gradient-to-br from-[#0073ea] via-sky-400 to-cyan-300 bg-clip-text text-transparent">
          {displayValue}
        </div>
        <div className="text-sm font-semibold text-white mt-1">{stat.label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{stat.desc}</div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { data } = useData();
  const { navigateTo } = useTransition();
  const waLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground, saya tertarik untuk konsultasi pembuatan proyek website/aplikasi.')}`;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-glow">

      {/* Background Decorative Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.2] flex flex-col items-center gap-1 sm:gap-2">
            <span className="block">{data.heroHeadline1 || 'Butuh Website?'}</span>
            <span className="block bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {data.heroHeadlineHighlight1 || 'Butuh Aplikasi?'}
            </span>
            <span className="block bg-gradient-to-r from-[#0073ea] via-sky-400 to-cyan-300 bg-clip-text text-transparent mt-0.5 sm:mt-1">
              {data.heroHeadlineHighlight2 || 'Gass Bareng Kitaa Ajaa!'}
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {data.subHeadline}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#portfolio', 'Proyek');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0073ea] text-white font-semibold hover:bg-[#0060c4] transition-all duration-200 shadow-lg shadow-[#0073ea]/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Lihat Proyek</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#0073ea]" />
              <span>Konsultasi Proyek (Gratis)</span>
            </a>
          </div>

          {/* Trust Highlights */}
          {data.trustHighlights && data.trustHighlights.length > 0 && (
            <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
              {data.trustHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0073ea] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Studio Metrics Stats Grid — Per-card hover/tap */}
        <div className="mt-14 md:mt-18 grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
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
