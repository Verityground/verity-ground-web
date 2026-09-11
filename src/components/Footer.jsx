import React from 'react';
import { Terminal, ArrowUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTransition } from '../context/TransitionContext';

export default function Footer() {
  const { data } = useData();
  const { navigateTo } = useTransition();

  const scrollToTop = () => {
    navigateTo('#top', 'Back to Top');
  };

  const navLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-transparent border-t border-slate-800/80 py-12 text-slate-400 text-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-8 border-b border-slate-800">
          <div className="flex items-start gap-3 max-w-sm">
            <div className="w-9 h-9 rounded-xl bg-[#0073ea]/15 border border-[#0073ea]/30 flex items-center justify-center text-[#0073ea] shadow-xs shrink-0 mt-0.5">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">{data.name}</span>
              <p className="text-xs text-slate-400 font-mono mt-1">Modern Software Studio & Engineering Agency</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Membangun solusi rekayasa web berkinerja tinggi, arsitektur kokoh, dan estetika visual interaktif modern.
              </p>
            </div>
          </div>

          {/* Vertical Navigation Links */}
          <div className="flex flex-col items-start gap-2.5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
              Menu Navigasi
            </span>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(link.href, link.name);
                }}
                className="text-xs sm:text-sm font-medium text-slate-400 hover:text-[#0073ea] hover:translate-x-1 transition-all duration-150 cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-[#0073ea]/40 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-xs"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} {data.name}. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
