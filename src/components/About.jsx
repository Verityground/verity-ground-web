import React from 'react';
import { Shield, Sparkles, CheckCircle2, Lock, FileSearch, CheckCheck, Landmark } from 'lucide-react';
import { useData } from '../context/DataContext';
import BentoSpotlightCard from './BentoSpotlightCard';

export default function About() {
  const { data } = useData();

  const auditPillars = [
    {
      title: "Independensi & Standar Big-4",
      desc: "Menjunjung integritas audit tanpa kompromi, mengadopsi standar IIA (Institute of Internal Auditors) dan ISACA.",
      icon: Shield,
      tag: "INDEPENDENCE"
    },
    {
      title: "Kepatuhan Regulasi Multi-Yurisdiksi",
      desc: "Pemetaan kepatuhan proaktif terhadap POJK, PBI, UU PDP, ISO 27001, serta regulasi lintas batas seperti GDPR.",
      icon: Landmark,
      tag: "COMPLIANCE"
    },
    {
      title: "Uji Penetrasi & Forensik Digital",
      desc: "Investigasi mendalam terhadap arsitektur kontrol keuangan dan keamanan sistem dari potensi kecurangan atau insiden siber.",
      icon: FileSearch,
      tag: "INTEGRITY"
    },
    {
      title: "Pemantauan Risiko Prediktif",
      desc: "Analitik kuantitatif mendeteksi anomali transaksi dan kerentanan kepatuhan secara dini sebelum memicu temuan regulator.",
      icon: Lock,
      tag: "GOVERNANCE"
    }
  ];

  const auditWorkflow = [
    {
      step: "01",
      title: "Diagnostic & Scoping",
      desc: "Analisis lanskap regulasi, pemetaan aset kritis, dan penetapan Audit Charter serta Risk Appetite korporasi."
    },
    {
      step: "02",
      title: "Controls & Gap Assessment",
      desc: "Pengujian kepatuhan terhadap 114+ kontrol ISO/OJK, wawancara pemangku kepentingan, dan audit forensik data."
    },
    {
      step: "03",
      title: "Remediation & Stress Testing",
      desc: "Penyusunan Corrective Action Plan (CAP), mitigasi celah kerentanan, dan simulasi skenario krisis kepatuhan."
    },
    {
      step: "04",
      title: "Final Assurance & Attestation",
      desc: "Penerbitan Laporan Audit Independen, sertifikasi kepatuhan, dan pendampingan formal di hadapan regulator."
    }
  ];

  return (
    <section id="about" className="py-24 relative border-t border-white/[0.06] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase">Metodologi & Filosofi Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Fondasi Kepercayaan & Ketahanan Institusi
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {data.about?.story || "Verity Ground menggabungkan ketelitian audit finansial, keahlian hukum regulasi, dan teknologi audit siber untuk memberikan kepastian tata kelola mutlak bagi para pemimpin korporasi."}
          </p>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {auditPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <BentoSpotlightCard
                key={idx}
                className="p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:scale-105 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 font-semibold">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] font-mono text-sky-400">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Standardized Control</span>
                </div>
              </BentoSpotlightCard>
            );
          })}
        </div>

        {/* Structured Audit Workflow Bento Section */}
        <div className="mt-16">
          <BentoSpotlightCard className="p-8 sm:p-10">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Alur Siklus Audit & Penjaminan Terstruktur
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Dari penentuan ruang lingkup awal hingga atestasi formal di hadapan regulator dan dewan komisaris.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {auditWorkflow.map((flow, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-sky-500/30 transition-all duration-300 space-y-3 group/flow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-sky-400/60 group-hover/flow:text-sky-400 transition-colors">
                      {flow.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  </div>
                  <h4 className="font-semibold text-white text-sm group-hover/flow:text-sky-300 transition-colors">
                    {flow.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {flow.desc}
                  </p>
                </div>
              ))}
            </div>
          </BentoSpotlightCard>
        </div>

      </div>
    </section>
  );
}
