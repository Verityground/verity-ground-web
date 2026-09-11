import React from 'react';
import {
  CheckCircle2, ShieldCheck, HeartHandshake, Clock, Sparkles,
  Zap, Award, Code2, Shield, Star, Rocket, Check, Layers, Cpu
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function About() {
  const { data } = useData();

  const iconMap = {
    CheckCircle2,
    ShieldCheck,
    HeartHandshake,
    Clock,
    Sparkles,
    Zap,
    Award,
    Code2,
    Shield,
    Star,
    Rocket,
    Check,
    Layers,
    Cpu
  };

  return (
    <section id="about" className="py-24 md:py-32 bg-transparent border-b border-zinc-800/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            About Us
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Engineering Precision, Transparansi Penuh, & Clean Architecture
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed pt-1">
            {data.about?.story}
          </p>
          {data.about?.vision && (
            <p className="text-sm text-zinc-300 pt-2 border-l-2 border-zinc-700 pl-4 italic">
              {data.about?.vision}
            </p>
          )}
        </div>

        {/* 4 Value Pillars (Clean Minimalist Transparent Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-zinc-800/40">
          {data.about?.values?.map((val, idx) => {
            const Icon = iconMap[val.icon] || CheckCircle2;
            return (
              <div
                key={idx}
                className="space-y-3 p-4 rounded-lg hover:bg-zinc-900/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-white mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  {val.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Workflow Steps (Clean Pipeline Layout) */}
        <div className="mt-24">
          <div className="mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Alur Pengerjaan Rekayasa Perangkat Lunak
            </h3>
            <p className="text-sm text-zinc-400">
              Tahapan kerja terstruktur dari perumusan spesifikasi hingga implementasi dan peluncuran.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.about?.workflow?.map((flow, idx) => (
              <div
                key={idx}
                className="space-y-3 p-5 rounded-lg border border-zinc-800/40 hover:border-zinc-700 transition-colors"
              >
                <div className="text-2xl font-bold text-zinc-500 font-mono">
                  {flow.step}
                </div>
                <h4 className="font-semibold text-white text-base tracking-tight">
                  {flow.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {flow.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
