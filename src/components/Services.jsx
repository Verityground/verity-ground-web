import React from 'react';
import { Code2, LayoutTemplate, Cpu, Wrench, ArrowRight, Layers, Smartphone, Database, Cloud } from 'lucide-react';
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
    <section id="services" className="py-24 md:py-32 bg-transparent border-b border-zinc-800/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Services
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Solusi Rekayasa Web & Perangkat Lunak Skalabel
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Kami membangun arsitektur digital berperforma kilat, modular, aman, dan siap scale-up untuk bisnis modern.
          </p>
        </div>

        {/* Empty State */}
        {(!data.services || data.services.length === 0) && (
          <div className="text-center py-16 px-4 max-w-md mx-auto border border-zinc-800/60 rounded-lg p-8 space-y-3">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto rounded-md">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Layanan Sedang Diperbarui</h3>
            <p className="text-xs text-zinc-400">
              Silakan hubungi kami via WhatsApp untuk kebutuhan arsitektur kustom.
            </p>
          </div>
        )}

        {/* Services Grid (Clean Modern Cards, Typography-First) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.services?.map((service) => {
            const Icon = iconMap[service.icon] || Code2;
            const waCustomMsg = `Halo ${data.name}, saya ingin konsultasi mengenai layanan ${service.title}.`;
            const waServiceLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(waCustomMsg)}`;

            return (
              <div
                key={service.id}
                className="p-8 rounded-xl border border-zinc-800/50 hover:border-zinc-700/80 bg-zinc-900/15 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 mb-8 pt-4 border-t border-zinc-800/40">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                          <span className="text-zinc-500 font-bold select-none">•</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tech Badges (Monospace Allowed Here) & CTA */}
                <div className="pt-6 border-t border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {service.techStack?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-0.5 text-[11px] font-mono text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={waServiceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors shrink-0 group/link"
                  >
                    <span>Consult Scope</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
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
