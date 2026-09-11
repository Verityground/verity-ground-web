import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTransition } from '../context/TransitionContext';

export default function Navbar() {
  const { data } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'About Us', href: '#about', id: 'about' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Work', href: '#portfolio', id: 'portfolio' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scrollspy active section detection
      if (window.scrollY < 150) {
        setActiveSection('hero');
        return;
      }

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.getElementById(navLinks[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250) {
            setActiveSection(navLinks[i].id);
            return;
          }
        }
      }
      setActiveSection('hero');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { navigateTo } = useTransition();

  const handleNavClick = (e, href, label) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo(href === '#' ? '#top' : href, label);
  };

  const waLink = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground, saya tertarik untuk konsultasi pembuatan proyek website/aplikasi.')}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-black/85 backdrop-blur-md border-zinc-800/60 py-3.5'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Studio Identity */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1 transition-colors group-hover:border-zinc-600 shrink-0">
              <img src="/logo.png" alt="Verity Ground" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white">
                {data.name}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Software Studio
              </span>
            </div>
          </a>

          {/* Clean Minimalist Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.name)}
                  className={`text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Clean Primary CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-200 transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Initiate Chat</span>
            </a>
          </div>

          {/* Mobile Menu Toggle & WhatsApp CTA */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md text-xs"
              title="Chat WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors border border-zinc-800 bg-black cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-40 md:hidden bg-[#09090b] border-b border-zinc-800 px-5 pt-3 pb-6 mt-3 shadow-2xl space-y-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href, link.name)}
                    className={`px-3 py-2.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
            <div className="pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 px-4 rounded-md text-sm font-medium hover:bg-zinc-200 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
