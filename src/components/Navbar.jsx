import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
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
  const { currentUser, isAuthenticated, logout, navigate } = useAuth();

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

          {/* Auth Actions (Login & Register or User Controls) */}
          <div className="hidden md:flex items-center gap-2.5">
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer min-h-[36px]"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="bg-white text-black px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md hover:bg-zinc-200 transition-all cursor-pointer shadow-xs min-h-[36px]"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                {(currentUser?.role === 'superadmin' || currentUser?.role === 'staff') && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="bg-white text-black px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md hover:bg-zinc-200 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs min-h-[36px]"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </button>
                )}
                {currentUser?.role === 'viewer' && (
                  <span className="text-xs text-zinc-400 font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                    {currentUser.name || 'Viewer'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-zinc-400 hover:text-rose-400 px-2.5 py-1.5 rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer min-h-[36px] inline-flex items-center gap-1"
                  title={`Logout (${currentUser?.name || ''})`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle & Auth Quick Link */}
          <div className="flex md:hidden items-center gap-2">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors"
              >
                Login
              </button>
            ) : (
              (currentUser?.role === 'superadmin' || currentUser?.role === 'staff') && (
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-2.5 py-1.5 text-xs font-medium text-black bg-white rounded-md hover:bg-zinc-200 transition-colors inline-flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              )
            )}

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
            
            {/* Mobile Drawer Auth Actions */}
            <div className="pt-3 border-t border-zinc-800/80">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); navigate('/login'); }}
                    className="w-full py-2.5 px-3 text-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); navigate('/register'); }}
                    className="w-full py-2.5 px-3 text-center rounded-md bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {(currentUser?.role === 'superadmin' || currentUser?.role === 'staff') && (
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); navigate('/admin'); }}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 px-4 rounded-md text-xs font-medium hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Buka Admin Panel</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="w-full flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900 text-rose-400 py-2.5 px-4 rounded-md text-xs font-medium hover:bg-zinc-850 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout ({currentUser?.name || 'User'})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
