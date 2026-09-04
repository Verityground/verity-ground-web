import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, UserCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import BentoSpotlightCard from './BentoSpotlightCard';

export default function TeamMembers() {
  const { data } = useData();
  const [morphedMemberId, setMorphedMemberId] = useState(null);

  const team = data.teamMembers || [];

  return (
    <section id="team" className="py-24 relative border-t border-white/[0.06] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <Award className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase">Senior Advisory Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Lead Auditor & Dewan Pakar Regulasi
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Dikelola oleh para praktisi terakreditasi internasional dengan rekam jejak memimpin tata kelola audit di institusi keuangan terkemuka dan korporasi multinasional.
          </p>
        </div>

        {/* Bento Grid Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {team.map((member) => {
            const isMorphed = morphedMemberId === member.id;

            return (
              <BentoSpotlightCard
                key={member.id}
                className="p-7 sm:p-8 flex flex-col justify-between cursor-pointer group"
                onMouseEnter={() => setMorphedMemberId(member.id)}
                onMouseLeave={() => setMorphedMemberId(null)}
              >
                <div>
                  {/* Top Header: Avatar with Icon State Morphing */}
                  <div className="flex items-start justify-between mb-6">
                    
                    {/* Morphing Icon / Avatar Container */}
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-0.5 shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:border-sky-400/60">
                      {/* State A: Monogram / Shield Profile */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/90 transition-all duration-500 ${
                          isMorphed
                            ? 'opacity-0 rotate-12 scale-75 pointer-events-none'
                            : 'opacity-100 rotate-0 scale-100'
                        }`}
                      >
                        <span className="font-mono font-bold text-lg text-sky-400">
                          {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </span>
                      </div>

                      {/* State B: Morphed Certified Auditor Seal */}
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600/30 to-blue-700/40 border border-sky-400/40 transition-all duration-500 ${
                          isMorphed
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-12 scale-75 pointer-events-none'
                        }`}
                      >
                        <ShieldCheck className="w-6 h-6 text-sky-300 animate-pulse" />
                        <span className="text-[9px] font-mono text-sky-200 mt-0.5 font-bold">VERIFIED</span>
                      </div>
                    </div>

                    {/* Verified Badges */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        <CheckCircle2 className="w-3 h-3 text-sky-400" />
                        <span>{member.experience}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {member.pastAffiliation}
                      </span>
                    </div>
                  </div>

                  {/* Member Name & Role */}
                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors duration-200 flex items-center gap-2">
                    {member.name}
                  </h3>
                  <div className="text-xs font-mono text-sky-400/90 mt-1 font-medium">
                    {member.title}
                  </div>

                  {/* Certifications Badge Row */}
                  <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-wrap gap-1.5">
                    {member.certifications?.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white/[0.04] text-slate-200 border border-white/[0.08] group-hover:border-sky-500/40 group-hover:text-sky-200 transition-colors"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* Specialty Focus */}
                  <div className="mt-4 text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-300 font-medium">Spesialisasi: </span>
                    {member.specialty}
                  </div>
                </div>

                {/* Bottom Quote with Morphed State Visibility */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] relative min-h-[50px] flex items-center">
                  <p
                    className={`text-xs italic text-slate-400 transition-all duration-300 leading-relaxed ${
                      isMorphed ? 'text-sky-200 font-medium' : ''
                    }`}
                  >
                    "{member.quote}"
                  </p>
                </div>
              </BentoSpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
