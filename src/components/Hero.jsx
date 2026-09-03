import React from 'react';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTransition } from '../context/TransitionContext';
import BinaryArithmeticBackground from './BinaryArithmeticBackground';

export default function Hero() {
  const { data } = useData();
  const { navigateTo } = useTransition();
  const waLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground, saya tertarik untuk konsultasi pembuatan proyek website/aplikasi.')}`;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-glow">
      {/* Animated Binary Byte & Arithmetic Background */}
      <BinaryArithmeticBackground />

      {/* Background Decorative Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {data.heroHeadline1 || 'Jasa Pembuatan'} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              {data.heroHeadlineHighlight1 || 'Website & Aplikasi Web'}
            </span>{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {data.heroHeadlineHighlight2 || 'Modern & Berperforma Tinggi'}
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {data.subHeadline}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#portfolio', 'Portfolio');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all duration-200 shadow-md shadow-slate-900/15 hover:scale-[1.02] cursor-pointer"
            >
              <span>Lihat Portofolio</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Konsultasi Proyek (Gratis)</span>
            </a>
          </div>

          {/* Trust Highlights */}
          {data.trustHighlights && data.trustHighlights.length > 0 && (
            <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-600 font-mono">
              {data.trustHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Studio Metrics Stats Grid */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {data.stats?.map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl text-center glass-panel-hover"
            >
              <div className="text-2xl sm:text-3xl font-extrabold font-mono bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-1">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
