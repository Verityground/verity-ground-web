import React, { useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { TransitionProvider } from './context/TransitionContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import TeamMembers from './components/TeamMembers';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AnimatedSection from './components/AnimatedSection';
import MeshGradientBackground from './components/MeshGradientBackground';

function MainContent() {
  const { isAdminOpen, setIsAdminOpen } = useData();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shortcut Ctrl + ` (Backquote / Tilde) or Cmd + `
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~' || e.code === 'Backquote')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsAdminOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminOpen]);

  // Global mousemove coordinator for Linear border spotlight effect on all cards
  useEffect(() => {
    let frameId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const cards = document.querySelectorAll('.linear-bento-card');
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          // Check if cursor is reasonably close to avoid calculating offscreen cards
          if (
            e.clientX >= rect.left - 150 &&
            e.clientX <= rect.right + 150 &&
            e.clientY >= rect.top - 150 &&
            e.clientY <= rect.bottom + 150
          ) {
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          }
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08090a] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200 relative overflow-x-hidden">
      {/* Mesh Gradient Wave Background */}
      <MeshGradientBackground />

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
          <Testimonials />
        </AnimatedSection>

        <AnimatedSection>
          <TeamMembers />
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
