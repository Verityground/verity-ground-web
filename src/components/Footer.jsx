import React, { useState } from 'react';
import { Shield, ArrowUp, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Footer() {
  const { data, setIsAdminOpen } = useData();
  const [tapCount, setTapCount] = useState(0);

  const handleSecretTap = () => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
    setTimeout(() => setTapCount(0), 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Layanan', href: '#services' },
    { name: 'Testimoni', href: '#testimonials' },
    { name: 'Dewan Auditor', href: '#team' },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#08090a]/90 backdrop-blur-xl py-14 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/[0.06]">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3 micro-bounce select-none">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                {data.name}
              </span>
              <p className="text-xs text-slate-500 font-mono">
                Enterprise Audit, Compliance & Risk Advisory
              </p>
            </div>
          </div>

          {/* Quick Nav Links with micro-bounce */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-400 hover:text-white transition-colors micro-bounce inline-block"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-all flex items-center gap-2 text-xs font-mono micro-bounce cursor-pointer"
            aria-label="Back to top"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p
            onClick={handleSecretTap}
            className="cursor-pointer select-none active:opacity-75 transition-opacity hover:text-slate-400"
            title="Ketuk 3x untuk membuka Portal Konfigurasi"
          >
            © {new Date().getFullYear()} {data.name}. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Audit & Assurance Network: Active</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
