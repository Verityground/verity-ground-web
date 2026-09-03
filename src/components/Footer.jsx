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
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#f8fbff] border-t border-slate-200/80 py-12 text-slate-600 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">{data.name}</span>
              <p className="text-xs text-slate-500 font-mono">Modern Software Studio & Engineering Agency</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(link.href, link.name);
                }}
                className="text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-xs"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} {data.name}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with React, Vite & Tailwind CSS</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Systems Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
