import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { companyData as initialCompanyData } from '../data/companyData';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const DataContext = createContext();

const STORAGE_KEY = 'verity_ground_data_v2';
const FIRESTORE_COLLECTION = 'settings';
const FIRESTORE_DOC_ID = 'company_profile';

// Helper to merge loaded data with initial defaults and auto-migrate legacy name
function mergeWithDefaults(savedData, defaults) {
  if (!savedData || typeof savedData !== 'object') return defaults;
  
  const updatedData = { ...savedData };

  // If saved data is from legacy web development agency, use fresh audit defaults
  const isLegacyWebAgency = updatedData.tagline?.includes('Web Development') ||
    (Array.isArray(updatedData.services) && updatedData.services.some(s => s.title?.includes('Web') || s.title?.includes('Aplikasi')));

  if (isLegacyWebAgency) {
    return defaults;
  }

  return {
    ...defaults,
    ...updatedData,
    stats: Array.isArray(updatedData.stats) && updatedData.stats.length > 0 && updatedData.stats[0]?.numericValue !== undefined
      ? updatedData.stats
      : defaults.stats,
    services: Array.isArray(updatedData.services) && updatedData.services.length > 0 && updatedData.services[0]?.progressMetric
      ? updatedData.services
      : defaults.services,
    testimonials: Array.isArray(updatedData.testimonials) && updatedData.testimonials.length > 0
      ? updatedData.testimonials
      : defaults.testimonials,
    teamMembers: Array.isArray(updatedData.teamMembers) && updatedData.teamMembers.length > 0
      ? updatedData.teamMembers
      : defaults.teamMembers,
    trustHighlights: Array.isArray(updatedData.trustHighlights) && updatedData.trustHighlights.length > 0
      ? updatedData.trustHighlights
      : defaults.trustHighlights,
    about: {
      story: updatedData.about?.story || defaults.about?.story || '',
      vision: updatedData.about?.vision || defaults.about?.vision || '',
      values: Array.isArray(updatedData.about?.values) && updatedData.about.values.length > 0
        ? updatedData.about.values
        : (defaults.about?.values || []),
      workflow: Array.isArray(updatedData.about?.workflow) && updatedData.about.workflow.length > 0
        ? updatedData.about.workflow
        : (defaults.about?.workflow || [])
    },
    faqs: Array.isArray(updatedData.faqs) && updatedData.faqs.length > 0 ? updatedData.faqs : defaults.faqs
  };
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      // Clear obsolete legacy keys that contain old mock projects
      localStorage.removeItem('verity_ground_data_v1');
      localStorage.removeItem('verity_studio_data_v3');
      localStorage.removeItem('verity_studio_data_v2');
      localStorage.removeItem('verity_studio_data_v1');

      const saved = localStorage.getItem(STORAGE_KEY);
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

  const isSyncingFromCloud = useRef(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const hasLoadedFromCloud = useRef(false);

  // 1. Subscribe to real-time changes from Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            console.log('[Firestore] Data loaded from Cloud Firestore:', cloudData);
            isSyncingFromCloud.current = true;
            hasLoadedFromCloud.current = true;
            setData(mergeWithDefaults(cloudData, initialCompanyData));
            setIsCloudSynced(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
            } catch (err) {
              // ignore
            }
            setTimeout(() => {
              isSyncingFromCloud.current = false;
            }, 300);
          } else {
            console.log('[Firestore] No company_profile document found. Initializing with default data...');
            isSyncingFromCloud.current = true;
            hasLoadedFromCloud.current = true;
            setDoc(docRef, initialCompanyData)
              .then(() => {
                console.log('[Firestore] Successfully initialized company_profile on Firestore!');
                setIsCloudSynced(true);
                setTimeout(() => {
                  isSyncingFromCloud.current = false;
                }, 300);
              })
              .catch((err) => {
                console.error('[Firestore ERROR] Failed to initialize document:', err);
                setIsCloudSynced(false);
                isSyncingFromCloud.current = false;
              });
          }
        },
        (error) => {
          console.error('[Firestore ERROR] Subscription failed:', error);
          setIsCloudSynced(false);
        }
      );
    } catch (e) {
      console.error('[Firestore ERROR] Failed to connect:', e);
      setIsCloudSynced(false);
    }

    return () => unsubscribe();
  }, []);

  // 2. Cache locally to localStorage when data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

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

  // Helper to persist data to Firestore & localStorage
  const saveAndSync = async (updatedData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (e) {
      console.warn('localStorage save error:', e);
    }
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      await setDoc(docRef, updatedData);
      console.log('[Firestore DIRECT SUCCESS] Successfully saved to Cloud Firestore!');
      setIsCloudSynced(true);
    } catch (err) {
      console.error('[Firestore DIRECT ERROR] Failed to save to Firestore:', err);
      setIsCloudSynced(false);
    }
  };

  // --- Portfolio CRUD ---
  const addPortfolio = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: Date.now(),
      status: newProject.status || 'Live Production'
    };
    setData((prev) => {
      const nextData = {
        ...prev,
        portfolio: [projectWithId, ...(prev.portfolio || [])]
      };
      saveAndSync(nextData);
      return nextData;
    });
  };

  const updatePortfolio = (id, updatedProject) => {
    setData((prev) => {
      const nextData = {
        ...prev,
        portfolio: (prev.portfolio || []).map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
      };
      saveAndSync(nextData);
      return nextData;
    });
  };

  const deletePortfolio = (id) => {
    setData((prev) => {
      const nextData = {
        ...prev,
        portfolio: (prev.portfolio || []).filter((p) => p.id !== id)
      };
      saveAndSync(nextData);
      return nextData;
    });
  };

  // --- Services CRUD ---
  const addService = (newService) => {
    const serviceWithId = {
      ...newService,
      id: newService.id || `service-${Date.now()}`,
      icon: newService.icon || 'Code2'
    };
    setData((prev) => {
      const next = { ...prev, services: [...prev.services, serviceWithId] };
      saveAndSync(next);
      return next;
    });
  };

  const updateService = (id, updatedService) => {
    setData((prev) => {
      const next = { ...prev, services: prev.services.map((s) => (s.id === id ? { ...s, ...updatedService } : s)) };
      saveAndSync(next);
      return next;
    });
  };

  const deleteService = (id) => {
    setData((prev) => {
      const next = { ...prev, services: prev.services.filter((s) => s.id !== id) };
      saveAndSync(next);
      return next;
    });
  };

  // --- About Us & Values & Workflow CRUD ---
  const updateAboutStory = (aboutStory, aboutVision) => {
    setData((prev) => {
      const next = {
        ...prev,
        about: {
          ...prev.about,
          story: aboutStory !== undefined ? aboutStory : prev.about.story,
          vision: aboutVision !== undefined ? aboutVision : prev.about.vision
        }
      };
      saveAndSync(next);
      return next;
    });
  };

  const addValuePillar = (newValue) => {
    const valueWithId = {
      ...newValue,
      id: newValue.id || `val-${Date.now()}`
    };
    setData((prev) => {
      const next = {
        ...prev,
        about: {
          ...prev.about,
          values: [...prev.about.values, valueWithId]
        }
      };
      saveAndSync(next);
      return next;
    });
  };

  const updateValuePillar = (id, updatedValue) => {
    setData((prev) => {
      const next = {
        ...prev,
        about: {
          ...prev.about,
          values: prev.about.values.map((v) => (v.id === id || v.title === id ? { ...v, ...updatedValue } : v))
        }
      };
      saveAndSync(next);
      return next;
    });
  };

  const deleteValuePillar = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        about: {
          ...prev.about,
          values: prev.about.values.filter((v) => v.id !== id && v.title !== id)
        }
      };
      saveAndSync(next);
      return next;
    });
  };

  const addWorkflowStep = (newStep) => {
    const stepWithId = {
      ...newStep,
      id: newStep.id || `wf-${Date.now()}`
    };
    setData((prev) => {
      const next = {
        ...prev,
        about: {
          ...prev.about,
          workflow: [...prev.about.workflow, stepWithId]
        }
      };
      saveAndSync(next);
      return next;
    });
  };

  const updateWorkflowStep = (id, updatedStep) => {
    setData((prev) => {
      const next = {
        ...prev,
        about: {
          ...prev.about,
          workflow: prev.about.workflow.map((w) => (w.id === id || w.step === id ? { ...w, ...updatedStep } : w))
        }
      };
      saveAndSync(next);
      return next;
    });
  };

  const deleteWorkflowStep = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        about: {
          ...prev.about,
          workflow: prev.about.workflow.filter((w) => w.id !== id && w.step !== id)
        }
      };
      saveAndSync(next);
      return next;
    });
  };

  // --- FAQs CRUD ---
  const addFaq = (newFaq) => {
    const faqWithId = {
      ...newFaq,
      id: newFaq.id || `faq-${Date.now()}`
    };
    setData((prev) => {
      const next = { ...prev, faqs: [...prev.faqs, faqWithId] };
      saveAndSync(next);
      return next;
    });
  };

  const updateFaq = (id, updatedFaq) => {
    setData((prev) => {
      const next = { ...prev, faqs: prev.faqs.map((f) => (f.id === id || f.q === id ? { ...f, ...updatedFaq } : f)) };
      saveAndSync(next);
      return next;
    });
  };

  const deleteFaq = (id) => {
    setData((prev) => {
      const next = { ...prev, faqs: prev.faqs.filter((f) => f.id !== id && f.q !== id) };
      saveAndSync(next);
      return next;
    });
  };

  // --- Stats CRUD & General Settings ---
  const updateStats = (statsArray) => {
    setData((prev) => {
      const next = { ...prev, stats: statsArray };
      saveAndSync(next);
      return next;
    });
  };

  const updateGeneralSettings = (newSettings) => {
    setData((prev) => {
      const next = { ...prev, ...newSettings };
      saveAndSync(next);
      return next;
    });
  };

  // Reset to default factory data
  const resetToDefault = () => {
    setData(initialCompanyData);
    saveAndSync(initialCompanyData);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('verity_studio_data_v2');
    localStorage.removeItem('verity_studio_data_v1');
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isCloudSynced,
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


