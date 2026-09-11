import React from 'react';
import { Code2, LayoutTemplate, Cpu, Wrench, Check, ArrowRight, Layers, Smartphone, Database, Cloud } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Services() {
  const { data } = useData();

  const iconMap = {
    Code2: Code2,
    LayoutTemplate: LayoutTemplate,
    Cpu: Cpu,
    Wrench: Wrench,
    Layers: Layers,
    Smartphone: Smartphone,
    Database: Database,
    Cloud: Cloud,
  };

  return (
    <section id="services" className="py-20 bg-transparent border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0073ea]/15 border border-[#0073ea]/35 text-xs font-mono text-[#0073ea] mb-3 shadow-xs">
            <span>OUR CORE SERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Solusi Rekayasa Web & Perangkat Lunak Sesuai Kebutuhan Anda
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4">
            Kami menghadirkan solusi teknologi mutakhir dengan arsitektur tangguh, performa kilat, dan desain yang memikat.
          </p>
        </div>

        {/* Empty State */}
        {(!data.services || data.services.length === 0) && (
          <div className="text-center py-16 px-4 max-w-md mx-auto glass-panel rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0073ea]/15 border border-[#0073ea]/30 flex items-center justify-center text-[#0073ea] mx-auto">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Layanan Sedang Diperbarui</h3>
              <p className="text-xs text-slate-400 mt-1">
                Daftar paket layanan kami sedang dalam penyesuaian. Silakan hubungi kami langsung via WhatsApp untuk penawaran kustom.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {data.services?.map((service) => {
            const Icon = iconMap[service.icon] || Code2;
            const waCustomMsg = `Halo ${data.name}, saya ingin konsultasi mengenai layanan ${service.title}.`;
            const waServiceLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(waCustomMsg)}`;

            return (
              <div
                key={service.id}
                className="glass-panel p-7 sm:p-8 rounded-3xl glass-panel-hover flex flex-col justify-between relative overflow-hidden group shadow-sm"
              >
                {/* Top Subtle Gradient Light */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0073ea]/10 rounded-full blur-2xl group-hover:bg-[#0073ea]/20 transition-all pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#0073ea] group-hover:border-[#0073ea]/50 group-hover:bg-[#0073ea]/15 transition-colors shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    {service.badge && (
                      <span className="text-[11px] font-mono font-medium px-3 py-1 rounded-full bg-[#0073ea]/15 text-[#0073ea] border border-[#0073ea]/30 shadow-xs">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#0073ea] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-800">
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">Fitur & Cakupan:</div>
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <div className="w-4 h-4 rounded-full bg-[#0073ea]/20 text-[#0073ea] flex items-center justify-center mt-0.5 shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tech Badges & CTA */}
                <div className="pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {service.techStack?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={waServiceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0073ea] hover:text-sky-300 transition-colors shrink-0 group/link"
                  >
                    <span>Konsultasikan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
