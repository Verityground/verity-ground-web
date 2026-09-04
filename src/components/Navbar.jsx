import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, MessageCircle, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import MagneticButton from './MagneticButton';

export default function Navbar() {
  const { data } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'Tentang Kami', href: '#about', id: 'about' },
    { name: 'Layanan', href: '#services', id: 'services' },
    { name: 'Testimoni', href: '#testimonials', id: 'testimonials' },
    { name: 'Dewan Auditor', href: '#team', id: 'team' },
    { name: 'Kontak', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (window.scrollY < 200) {
        setActiveSection('hero');
        return;
      }

      const scrollPos = window.scrollY + 250;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.getElementById(navLinks[i].id);
        if (el) {
          const docTop = el.getBoundingClientRect().top + window.scrollY;
          if (docTop <= scrollPos) {
            setActiveSection(navLinks[i].id);
            return;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground, saya tertarik untuk konsultasi audit dan kepatuhan.')}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090a]/80 backdrop-blur-xl border-b border-white/[0.08] py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Branding */}
          <a
            href="#"
            className="flex items-center gap-3 group select-none micro-bounce"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:border-sky-400 group-hover:scale-105 transition-all shadow-lg shadow-sky-500/10">
              <Shield className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {data.name}
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Audit & Risk Advisory
              </span>
            </div>
          </a>

          {/* Desktop Floating Pill Navigation (Linear Reference) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-3 py-1.5 backdrop-blur-xl shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/[0.12] border border-white/[0.15] shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Status & Magnetic WhatsApp Button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Audit Ready 2026</span>
            </div>

            <MagneticButton
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="py-2 px-4 text-xs font-mono"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Konsultasi Cepat</span>
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-sky-400 bg-white/[0.05] border border-white/10 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 rounded-xl cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#08090a]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-5 space-y-3 mt-2 shadow-2xl animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-300 font-semibold border border-sky-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-xs font-mono shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
