import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import MagneticButton from './MagneticButton';
import BentoSpotlightCard from './BentoSpotlightCard';
import StatCounter from './StatCounter';
import RiskCompliance3D from './RiskCompliance3D';

export default function Hero() {
  const { data } = useData();
  const waLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground, saya tertarik untuk konsultasi audit, kepatuhan, atau manajemen risiko.')}`;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* Background Radial Glow Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Main Bento Grid: Hero Proposition (Left) + 3D Ecosystem Model (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Magnetic Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-sky-400 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="tracking-wider uppercase font-medium">
                {data.heroBadge || "Enterprise Risk & Assurance Standards"}
              </span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {data.heroHeadline1 || "Audit Presisi. Kepatuhan Tanpa Cela."} <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {data.heroHeadlineHighlight1 || "Mitigasi Risiko"}
              </span>{' '}
              <span className="text-slate-300">
                {data.heroHeadlineHighlight2 || "Terukur & Tepercaya"}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              {data.subHeadline}
            </p>

            {/* Magnetic CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <MagneticButton
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="w-full sm:w-auto"
              >
                <span>Konsultasi Tata Kelola (Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href="#services"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Eksplorasi Layanan Audit</span>
              </MagneticButton>
            </div>

            {/* Trust Highlights Tag Row */}
            {data.trustHighlights && data.trustHighlights.length > 0 && (
              <div className="pt-4 flex flex-wrap items-center gap-y-2.5 gap-x-5 text-xs text-slate-400 font-mono">
                {data.trustHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Interactive 3D Model Ecosystem (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <RiskCompliance3D />
          </div>

        </div>

        {/* Bento Grid: Interactive Stat Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
          {data.stats?.map((stat) => (
            <BentoSpotlightCard
              key={stat.id}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <StatCounter
                  numericValue={stat.numericValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={1800}
                />
                <h4 className="text-sm font-semibold text-white mt-3 flex items-center gap-1.5">
                  {stat.label}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {stat.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-sky-400/80">
                <span>Verified Data</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </BentoSpotlightCard>
          ))}
        </div>

      </div>
    </section>
  );
}
