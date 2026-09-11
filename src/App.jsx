import React, { useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { TransitionProvider } from './context/TransitionContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AnimatedSection from './components/AnimatedSection';
import BinaryArithmeticBackground from './components/BinaryArithmeticBackground';

function MainContent() {
  const { isAdminOpen, setIsAdminOpen } = useData();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shortcut Ctrl + ' (Single quote) or Cmd + '
      if ((e.ctrlKey || e.metaKey) && (e.key === "'" || e.key === '"' || e.code === 'Quote')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsAdminOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminOpen]);

  return (
    <div className="min-h-screen bg-[#19222c] text-slate-100 flex flex-col selection:bg-[#0073ea]/30 selection:text-white relative overflow-x-hidden">
      {!isAdminOpen && <BinaryArithmeticBackground />}
      <Navbar />
      <main className="flex-grow relative z-10">
        <Hero />

        <AnimatedSection>
          <About />
        </AnimatedSection>

        <AnimatedSection>
          <Services />
        </AnimatedSection>

        <AnimatedSection>
          <Portfolio />
        </AnimatedSection>

        <AnimatedSection>
          <Contact />
        </AnimatedSection>
      </main>
      <Footer />
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <TransitionProvider>
        <MainContent />
      </TransitionProvider>
    </DataProvider>
  );
}
