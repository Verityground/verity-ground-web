import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { TransitionProvider } from './context/TransitionContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';
import BinaryArithmeticBackground from './components/BinaryArithmeticBackground';
import Login from './components/Login';
import StaffLogin from './components/StaffLogin';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

// Public Landing Page View (Accessible to all visitors & viewers)
function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white relative overflow-x-hidden">
      <BinaryArithmeticBackground />
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
    </div>
  );
}

// Router View Switcher
function AppRouter() {
  const { currentRoute, currentUser, navigate } = useAuth();

  // Shortcut key (Ctrl + ') for Super Admin & Staff quick access
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === "'" || e.code === 'Quote')) {
        e.preventDefault();

        // If already on /admin, toggle back to home
        if (currentRoute === '/admin') {
          navigate('/');
          return;
        }

        // If authenticated as superadmin or staff, jump directly to /admin
        if (currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'staff')) {
          navigate('/admin');
        } else {
          // If not logged in as admin/staff, go to staff portal
          navigate('/staff-portal');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRoute, currentUser, navigate]);

  if (currentRoute === '/login') {
    return <Login />;
  }

  if (currentRoute === '/staff-portal' || currentRoute === '/staff-login' || currentRoute === '/staff') {
    return <StaffLogin />;
  }

  if (currentRoute === '/register') {
    return <Register />;
  }

  if (currentRoute === '/admin') {
    return (
      <ProtectedRoute allowedRoles={['superadmin', 'staff']}>
        <AdminPanel />
      </ProtectedRoute>
    );
  }

  // Default: Public Landing Page ('/' or any unmatched path)
  return <PublicLandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <TransitionProvider>
          <AppRouter />
        </TransitionProvider>
      </DataProvider>
    </AuthProvider>
  );
}
