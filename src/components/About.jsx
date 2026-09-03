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
    <section id="about" className="py-20 bg-[#f8fbff] border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT OUR STUDIO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Software Studio yang Mengutamakan Kualitas & Transparansi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
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
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Steps */}
        <div className="mt-20 p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xl font-bold text-slate-900">Alur Pengerjaan yang Terstruktur</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Dari konsepsi hingga peluncuran, setiap tahap dilakukan dengan standar engineering ketat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {data.about?.workflow?.map((flow, idx) => (
              <div key={idx} className="relative p-5 rounded-xl bg-[#f0f6fc]/70 border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-emerald-600/70">{flow.step}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <h4 className="font-semibold text-slate-900 text-base">{flow.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{flow.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
