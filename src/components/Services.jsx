import React, { useState } from 'react';
import { ShieldCheck, Scale, Activity, ArrowRight, CheckCircle2, FileCheck, Layers, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import BentoSpotlightCard from './BentoSpotlightCard';

export default function Services() {
  const { data } = useData();
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const iconMap = {
    ShieldCheck: ShieldCheck,
    Scale: Scale,
    Activity: Activity,
  };

  const services = data.services || [];

  return (
    <section id="services" className="py-24 relative border-t border-white/[0.06] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <Layers className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase">Pilar Layanan Utama</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Audit Presisi, Kepatuhan Regulasi & Rekayasa Risiko
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Arsitektur tata kelola menyeluruh yang dirancang untuk melindungi nilai entitas bisnis, mengamankan lisensi regulasi, dan memperkuat integritas data.
          </p>
        </div>

        {/* Bento Grid Services with Glassmorphism Backdrop Filter Transitions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || ShieldCheck;
            const isExpanded = selectedServiceId === service.id;
            const waCustomMsg = `Halo Verity Ground, saya ingin berdiskusi mengenai layanan ${service.title}.`;
            const waLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(waCustomMsg)}`;

            return (
              <BentoSpotlightCard
                key={service.id}
                className="p-7 sm:p-8 flex flex-col justify-between glass-backdrop-panel group relative"
              >
                {/* Top Subtle Rim Gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/20 transition-all duration-500" />

                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:bg-sky-500/10 group-hover:scale-105 transition-all duration-300 shadow-lg">
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className="text-[10px] font-mono tracking-wider font-semibold px-3 py-1 rounded-full bg-white/[0.04] text-sky-300 border border-white/[0.08]">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Dynamic Progress Metric Bar */}
                  {service.progressMetric && (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6 space-y-2 backdrop-blur-md group-hover:border-sky-500/30 transition-colors">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">{service.progressMetric.label}</span>
                        <span className="text-sky-400 font-bold text-sm">
                          {service.progressMetric.value}{service.progressMetric.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: typeof service.progressMetric.value === 'number'
                              ? `${Math.min(service.progressMetric.value > 10 ? service.progressMetric.value : service.progressMetric.value * 20, 100)}%`
                              : '95%'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Scope & Features Checklist */}
                  <div className="space-y-2.5 mb-6 pt-4 border-t border-white/[0.08]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                      Cakupan Penugasan:
                    </div>
                    {service.features?.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Framework Badges & Interactive CTA */}
                <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {service.frameworks?.map((fw, fwIdx) => (
                      <span
                        key={fwIdx}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-400 hover:text-sky-300 transition-colors group/link shrink-0"
                  >
                    <span>Konsultasi Lingkup</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </BentoSpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
