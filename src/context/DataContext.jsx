import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { companyData as initialCompanyData } from '../data/companyData';

const DataContext = createContext();

const STORAGE_KEY = 'verity_ground_data_v1';

// Helper to merge loaded Firestore data with initial fallback without overriding user custom edits
function mergeWithDefaults(savedData, defaults) {
  if (!savedData || typeof savedData !== 'object') return defaults;

  return {
    ...defaults,
    ...savedData,
    name: savedData.name ?? defaults.name,
    tagline: savedData.tagline ?? defaults.tagline,
    heroHeadline1: savedData.heroHeadline1 ?? defaults.heroHeadline1,
    heroHeadlineHighlight1: savedData.heroHeadlineHighlight1 ?? defaults.heroHeadlineHighlight1,
    heroHeadlineHighlight2: savedData.heroHeadlineHighlight2 ?? defaults.heroHeadlineHighlight2,
    subHeadline: savedData.subHeadline ?? defaults.subHeadline,
    whatsappNumber: savedData.whatsappNumber ?? defaults.whatsappNumber,
    whatsappMessage: savedData.whatsappMessage ?? defaults.whatsappMessage,
    email: savedData.email ?? defaults.email,
    location: savedData.location ?? defaults.location,
    availability: savedData.availability ?? defaults.availability,
    trustHighlights: Array.isArray(savedData.trustHighlights) ? savedData.trustHighlights : defaults.trustHighlights,
    stats: Array.isArray(savedData.stats) && savedData.stats.length > 0 ? savedData.stats : defaults.stats,
    services: Array.isArray(savedData.services) ? savedData.services : defaults.services,
    portfolio: Array.isArray(savedData.portfolio) ? savedData.portfolio : defaults.portfolio,
    faqs: Array.isArray(savedData.faqs) ? savedData.faqs : defaults.faqs,
    about: {
      ...defaults.about,
      ...(savedData.about || {}),
      values: Array.isArray(savedData.about?.values) ? savedData.about.values : defaults.about.values,
      workflow: Array.isArray(savedData.about?.workflow) ? savedData.about.workflow : defaults.about.workflow
    }
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

  // Sync data payload directly to Cloud Firestore
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
      return true;
    } catch (err) {
      console.error('Error syncing to Firestore:', err);
      setSyncStatus('error');
      throw err;
    } finally {
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 300);
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

  // Combined state updater that mutates locally and persists to Firestore asynchronously
  const updateDataAndSync = useCallback(async (updater) => {
    let nextValue;
    setData((prev) => {
      nextValue = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return nextValue;
    });

    if (nextValue) {
      return await syncToFirestore(nextValue);
    }
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
  const addPortfolio = async (newProject) => {
    const projectWithId = {
      ...newProject,
      id: Date.now(),
      status: newProject.status || 'Live Production'
    };
    return await updateDataAndSync((prev) => {
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

  const updatePortfolio = async (id, updatedProject) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
    }));
  };

  const deletePortfolio = async (id) => {
    return await updateDataAndSync((prev) => {
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
  const addService = async (newService) => {
    const serviceWithId = {
      ...newService,
      id: newService.id || `service-${Date.now()}`,
      icon: newService.icon || 'Code2'
    };
    return await updateDataAndSync((prev) => ({
      ...prev,
      services: [...prev.services, serviceWithId]
    }));
  };

  const updateService = async (id, updatedService) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updatedService } : s))
    }));
  };

  const deleteService = async (id) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id)
    }));
  };

  // --- About Us & Values & Workflow CRUD ---
  const updateAboutStory = async (aboutStory, aboutVision) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        story: aboutStory !== undefined ? aboutStory : prev.about.story,
        vision: aboutVision !== undefined ? aboutVision : prev.about.vision
      }
    }));
  };

  const addValuePillar = async (newValue) => {
    const valueWithId = {
      ...newValue,
      id: newValue.id || `val-${Date.now()}`
    };
    return await updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: [...prev.about.values, valueWithId]
      }
    }));
  };

  const updateValuePillar = async (id, updatedValue) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: prev.about.values.map((v) => (v.id === id || v.title === id ? { ...v, ...updatedValue } : v))
      }
    }));
  };

  const deleteValuePillar = async (id) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: prev.about.values.filter((v) => v.id !== id && v.title !== id)
      }
    }));
  };

  const addWorkflowStep = async (newStep) => {
    const stepWithId = {
      ...newStep,
      id: newStep.id || `wf-${Date.now()}`
    };
    return await updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: [...prev.about.workflow, stepWithId]
      }
    }));
  };

  const updateWorkflowStep = async (id, updatedStep) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: prev.about.workflow.map((w) => (w.id === id || w.step === id ? { ...w, ...updatedStep } : w))
      }
    }));
  };

  const deleteWorkflowStep = async (id) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: prev.about.workflow.filter((w) => w.id !== id && w.step !== id)
      }
    }));
  };

  // --- FAQs CRUD ---
  const addFaq = async (newFaq) => {
    const faqWithId = {
      ...newFaq,
      id: newFaq.id || `faq-${Date.now()}`
    };
    return await updateDataAndSync((prev) => ({
      ...prev,
      faqs: [...prev.faqs, faqWithId]
    }));
  };

  const updateFaq = async (id, updatedFaq) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id || f.q === id ? { ...f, ...updatedFaq } : f))
    }));
  };

  const deleteFaq = async (id) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id && f.q !== id)
    }));
  };

  // --- Stats CRUD & General Settings ---
  const updateStats = async (statsArray) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      stats: statsArray
    }));
  };

  const updateGeneralSettings = async (newSettings) => {
    return await updateDataAndSync((prev) => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset to default factory data
  const resetToDefault = async () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('verity_studio_data_v2');
    localStorage.removeItem('verity_studio_data_v1');
    return await updateDataAndSync(initialCompanyData);
  };

  // Force sync manually
  const forceSync = async () => {
    return await syncToFirestore(data);
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
