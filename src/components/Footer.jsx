import React from 'react';
import { ArrowUp } from 'lucide-react';
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
    <footer className="bg-black border-t border-zinc-800/40 py-12 text-zinc-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-8 border-b border-zinc-800/40">
          <div className="flex items-start gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1 shrink-0 mt-0.5">
              <img src="/logo.png" alt="Verity Ground" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white tracking-tight">{data.name}</span>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Software studio berdedikasi membangun aplikasi web modern, sistem perangkat lunak modular, dan arsitektur berkinerja tinggi.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-start gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
              Navigasi
            </span>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(link.href, link.name);
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div>
            <button
              onClick={scrollToTop}
              className="px-3.5 py-2 rounded-md bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} {data.name}. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full" />
            <span className="uppercase tracking-wider">All Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
