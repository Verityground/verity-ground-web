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
    <section id="about" className="py-20 bg-transparent border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0073ea]/15 border border-[#0073ea]/35 text-xs font-mono text-[#0073ea] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT OUR STUDIO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Software Studio yang Mengutamakan Kualitas & Transparansi
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            {data.about?.story}
          </p>
        </div>

        {/* 4 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.about?.values?.map((val, idx) => {
            const Icon = iconMap[val.icon] || CheckCircle2;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0073ea]/15 border border-[#0073ea]/30 flex items-center justify-center text-[#0073ea] mb-5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Steps */}
        <div className="mt-20 p-8 rounded-3xl bg-[#19222c]/80 backdrop-blur-md border border-slate-800 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xl font-bold text-white">Alur Pengerjaan yang Terstruktur</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Dari konsepsi hingga peluncuran, setiap tahap dilakukan dengan standar engineering ketat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {data.about?.workflow?.map((flow, idx) => (
              <div key={idx} className="relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-[#0073ea]">{flow.step}</span>
                  <span className="w-2 h-2 rounded-full bg-[#0073ea]"></span>
                </div>
                <h4 className="font-semibold text-white text-base">{flow.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{flow.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
