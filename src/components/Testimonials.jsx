import React, { useEffect, useRef, useState } from 'react';
import { MessageSquareQuote, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import BentoSpotlightCard from './BentoSpotlightCard';

export default function Testimonials() {
  const { data } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = data.testimonials || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-24 relative border-t border-white/[0.06] scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase">Institutional Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Pengakuan Dari Para Pemimpin Risiko & Kepatuhan
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Dampak nyata kemitraan audit independen dalam menjamin keandalan kontrol, transparansi tata kelola, dan kelulusan pengawasan regulator.
          </p>
        </div>

        {/* Bento Grid with Cascade Entry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testi, idx) => (
            <div
              key={testi.id}
              className={`transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${idx * 180}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <BentoSpotlightCard className="p-7 sm:p-8 h-full flex flex-col justify-between">
                <div>
                  {/* Top Row: Client Type & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Building2 className="w-4 h-4 text-sky-400" />
                      <span className="truncate">{testi.clientType}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Audit</span>
                    </span>
                  </div>

                  {/* Impact Highlight Badge */}
                  {testi.verifiedMetric && (
                    <div className="mb-5 inline-block px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-mono font-medium text-sky-300">
                      🎯 {testi.verifiedMetric}
                    </div>
                  )}

                  {/* Quote Body */}
                  <blockquote className="text-sm sm:text-[15px] text-slate-300 leading-relaxed font-normal mb-6">
                    "{testi.quote}"
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      {testi.author}
                    </div>
                    <div className="text-xs text-sky-400 font-mono mt-0.5">
                      {testi.role}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {testi.clientName}
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sky-400 group-hover:border-sky-500/40 group-hover:scale-110 transition-all">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </BentoSpotlightCard>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
