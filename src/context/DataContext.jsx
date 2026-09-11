import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { companyData as initialCompanyData } from '../data/companyData';

const DataContext = createContext();

const STORAGE_KEY = 'verity_ground_data_v1';

// Helper to merge loaded data with initial defaults and auto-migrate legacy name
function mergeWithDefaults(savedData, defaults) {
  if (!savedData || typeof savedData !== 'object') return defaults;
  
  const updatedData = { ...savedData };
  if (updatedData.name === 'Verity Studio' || !updatedData.name) {
    updatedData.name = defaults.name;
  }
  if (updatedData.whatsappMessage?.includes('Verity Studio')) {
    updatedData.whatsappMessage = updatedData.whatsappMessage.replace(/Verity Studio/g, 'Verity Ground');
  }
  if (updatedData.email?.includes('veritystudio.dev') || updatedData.email?.includes('verityground.dev')) {
    updatedData.email = 'verityground@gmail.com';
  }
  if (updatedData.about?.story?.includes('Verity Studio')) {
    updatedData.about = {
      ...updatedData.about,
      story: updatedData.about.story.replace(/Verity Studio/g, 'Verity Ground')
    };
  }
  if (
    !updatedData.heroHeadline1 ||
    updatedData.heroHeadline1 === 'Jasa Pembuatan' ||
    updatedData.heroHeadlineHighlight2 !== 'Gass Bareng Kitaa Ajaa!'
  ) {
    updatedData.heroHeadline1 = defaults.heroHeadline1;
    updatedData.heroHeadlineHighlight1 = defaults.heroHeadlineHighlight1;
    updatedData.heroHeadlineHighlight2 = defaults.heroHeadlineHighlight2;
  }
  if (updatedData.subHeadline?.includes('kelas dunia')) {
    updatedData.subHeadline = defaults.subHeadline;
  }
  // Migrate stats: keep only the 2 cards and keep Proyek Selesai count synced
  if (
    !Array.isArray(updatedData.stats) ||
    updatedData.stats.length > 2 ||
    updatedData.stats.some(s => s.label?.includes('Satisfaction') || s.label?.includes('Page Load'))
  ) {
    const portfolioLen = Array.isArray(updatedData.portfolio) ? updatedData.portfolio.length : defaults.portfolio.length;
    updatedData.stats = [
      { id: "stat-1", value: String(portfolioLen), label: "Proyek Selesai", desc: "Produk web & app live" },
      { id: "stat-4", value: "24/7", label: "Monitoring & Support", desc: "Garansi pasca-peluncuran" },
    ];
  } else {
    const portfolioLen = Array.isArray(updatedData.portfolio) ? updatedData.portfolio.length : defaults.portfolio.length;
    updatedData.stats = updatedData.stats.map(s =>
      s.id === 'stat-1' || s.label?.toLowerCase().includes('proyek')
        ? { ...s, value: String(portfolioLen) }
        : s
    );
  }

  return {
    ...defaults,
    ...updatedData,
    about: {
      ...defaults.about,
      ...(updatedData.about || {}),
      values: Array.isArray(updatedData.about?.values) ? updatedData.about.values : defaults.about.values,
      workflow: Array.isArray(updatedData.about?.workflow) ? updatedData.about.workflow : defaults.about.workflow
    },
    stats: Array.isArray(updatedData.stats) ? updatedData.stats : defaults.stats,
    trustHighlights: Array.isArray(updatedData.trustHighlights) ? updatedData.trustHighlights : defaults.trustHighlights,
    services: Array.isArray(updatedData.services) && updatedData.services.length > 0 ? updatedData.services : defaults.services,
    portfolio: Array.isArray(updatedData.portfolio) && updatedData.portfolio.length > 0 ? updatedData.portfolio : defaults.portfolio,
    faqs: Array.isArray(updatedData.faqs) ? updatedData.faqs : defaults.faqs
  };
}

export function DataProvider({ children }) {
  // Initial local state from localStorage cache or initialCompanyData for instant hydration
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('verity_studio_data_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeWithDefaults(parsed, initialCompanyData);
      }
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
    }
    return initialCompanyData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('verity_admin_auth') === 'true';
  });

  // Sync status: 'connecting' | 'synced' | 'saving' | 'error'
  const [syncStatus, setSyncStatus] = useState('connecting');
  const isSyncingRef = useRef(false);

  // Sync data to Cloud Firestore
  const syncToFirestore = useCallback(async (payload) => {
    setSyncStatus('saving');
    try {
      isSyncingRef.current = true;
      const docRef = doc(db, 'content', 'company');
      // Clean payload of any undefined values
      const cleaned = JSON.parse(JSON.stringify(payload));
      await setDoc(docRef, {
        ...cleaned,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error syncing to Firestore:', err);
      setSyncStatus('error');
    } finally {
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 500);
    }
  }, []);

  // Listen to real-time changes from Firebase Firestore
  useEffect(() => {
    const docRef = doc(db, 'content', 'company');

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          const merged = mergeWithDefaults(remoteData, initialCompanyData);
          setData(merged);
          setSyncStatus('synced');
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.error('Failed to cache data to localStorage', e);
          }
        } else {
          // Document does not exist in Firestore yet: seed it automatically
          syncToFirestore(initialCompanyData);
        }
      },
      (error) => {
        console.error('Firestore onSnapshot subscription error:', error);
        setSyncStatus('error');
      }
    );

    return () => unsubscribe();
  }, [syncToFirestore]);

  // Combined state updater that mutates locally and syncs to Firestore
  const updateDataAndSync = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      syncToFirestore(next);
      return next;
    });
  }, [syncToFirestore]);

  // Auth handler
  const loginAdmin = (password) => {
    if (password === 'yukngodinglah123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('verity_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('verity_admin_auth');
  };

  // --- Portfolio CRUD ---
  const addPortfolio = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: Date.now(),
      status: newProject.status || 'Live Production'
    };
    updateDataAndSync((prev) => {
      const newPortfolio = [projectWithId, ...prev.portfolio];
      const updatedStats = prev.stats?.map((s) =>
        s.id === 'stat-1' || s.label?.toLowerCase().includes('proyek')
          ? { ...s, value: String(newPortfolio.length) }
          : s
      );
      return {
        ...prev,
        portfolio: newPortfolio,
        stats: updatedStats
      };
    });
  };

  const updatePortfolio = (id, updatedProject) => {
    updateDataAndSync((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
    }));
  };

  const deletePortfolio = (id) => {
    updateDataAndSync((prev) => {
      const newPortfolio = prev.portfolio.filter((p) => p.id !== id);
      const updatedStats = prev.stats?.map((s) =>
        s.id === 'stat-1' || s.label?.toLowerCase().includes('proyek')
          ? { ...s, value: String(newPortfolio.length) }
          : s
      );
      return {
        ...prev,
        portfolio: newPortfolio,
        stats: updatedStats
      };
    });
  };

  // --- Services CRUD ---
  const addService = (newService) => {
    const serviceWithId = {
      ...newService,
      id: newService.id || `service-${Date.now()}`,
      icon: newService.icon || 'Code2'
    };
    updateDataAndSync((prev) => ({
      ...prev,
      services: [...prev.services, serviceWithId]
    }));
  };

  const updateService = (id, updatedService) => {
    updateDataAndSync((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updatedService } : s))
    }));
  };

  const deleteService = (id) => {
    updateDataAndSync((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id)
    }));
  };

  // --- About Us & Values & Workflow CRUD ---
  const updateAboutStory = (aboutStory, aboutVision) => {
    updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        story: aboutStory !== undefined ? aboutStory : prev.about.story,
        vision: aboutVision !== undefined ? aboutVision : prev.about.vision
      }
    }));
  };

  const addValuePillar = (newValue) => {
    const valueWithId = {
      ...newValue,
      id: newValue.id || `val-${Date.now()}`
    };
    updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: [...prev.about.values, valueWithId]
      }
    }));
  };

  const updateValuePillar = (id, updatedValue) => {
    updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: prev.about.values.map((v) => (v.id === id || v.title === id ? { ...v, ...updatedValue } : v))
      }
    }));
  };

  const deleteValuePillar = (id) => {
    updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: prev.about.values.filter((v) => v.id !== id && v.title !== id)
      }
    }));
  };

  const addWorkflowStep = (newStep) => {
    const stepWithId = {
      ...newStep,
      id: newStep.id || `wf-${Date.now()}`
    };
    updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: [...prev.about.workflow, stepWithId]
      }
    }));
  };

  const updateWorkflowStep = (id, updatedStep) => {
    updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: prev.about.workflow.map((w) => (w.id === id || w.step === id ? { ...w, ...updatedStep } : w))
      }
    }));
  };

  const deleteWorkflowStep = (id) => {
    updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: prev.about.workflow.filter((w) => w.id !== id && w.step !== id)
      }
    }));
  };

  // --- FAQs CRUD ---
  const addFaq = (newFaq) => {
    const faqWithId = {
      ...newFaq,
      id: newFaq.id || `faq-${Date.now()}`
    };
    updateDataAndSync((prev) => ({
      ...prev,
      faqs: [...prev.faqs, faqWithId]
    }));
  };

  const updateFaq = (id, updatedFaq) => {
    updateDataAndSync((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id || f.q === id ? { ...f, ...updatedFaq } : f))
    }));
  };

  const deleteFaq = (id) => {
    updateDataAndSync((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id && f.q !== id)
    }));
  };

  // --- Stats CRUD & General Settings ---
  const updateStats = (statsArray) => {
    updateDataAndSync((prev) => ({
      ...prev,
      stats: statsArray
    }));
  };

  const updateGeneralSettings = (newSettings) => {
    updateDataAndSync((prev) => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset to default factory data
  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('verity_studio_data_v2');
    localStorage.removeItem('verity_studio_data_v1');
    updateDataAndSync(initialCompanyData);
  };

  // Force sync manually
  const forceSync = () => {
    return syncToFirestore(data);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        syncStatus,
        forceSync,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticated,
        loginAdmin,
        logoutAdmin,
        // Portfolio
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        // Services
        addService,
        updateService,
        deleteService,
        // About
        updateAboutStory,
        addValuePillar,
        updateValuePillar,
        deleteValuePillar,
        addWorkflowStep,
        updateWorkflowStep,
        deleteWorkflowStep,
        // FAQs
        addFaq,
        updateFaq,
        deleteFaq,
        // Stats & Settings
        updateStats,
        updateGeneralSettings,
        resetToDefault
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
