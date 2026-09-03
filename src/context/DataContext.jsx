import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Save to localStorage on changes
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

  // --- Portfolio CRUD ---
  const addPortfolio = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: Date.now(),
      status: newProject.status || 'Live Production'
    };
    setData((prev) => ({
      ...prev,
      portfolio: [projectWithId, ...prev.portfolio]
    }));
  };

  const updatePortfolio = (id, updatedProject) => {
    setData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
    }));
  };

  const deletePortfolio = (id) => {
    setData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((p) => p.id !== id)
    }));
  };

  // --- Services CRUD ---
  const addService = (newService) => {
    const serviceWithId = {
      ...newService,
      id: newService.id || `service-${Date.now()}`,
      icon: newService.icon || 'Code2'
    };
    setData((prev) => ({
      ...prev,
      services: [...prev.services, serviceWithId]
    }));
  };

  const updateService = (id, updatedService) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updatedService } : s))
    }));
  };

  const deleteService = (id) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id)
    }));
  };

  // --- About Us & Values & Workflow CRUD ---
  const updateAboutStory = (aboutStory, aboutVision) => {
    setData((prev) => ({
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
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: [...prev.about.values, valueWithId]
      }
    }));
  };

  const updateValuePillar = (id, updatedValue) => {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        values: prev.about.values.map((v) => (v.id === id || v.title === id ? { ...v, ...updatedValue } : v))
      }
    }));
  };

  const deleteValuePillar = (id) => {
    setData((prev) => ({
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
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: [...prev.about.workflow, stepWithId]
      }
    }));
  };

  const updateWorkflowStep = (id, updatedStep) => {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        workflow: prev.about.workflow.map((w) => (w.id === id || w.step === id ? { ...w, ...updatedStep } : w))
      }
    }));
  };

  const deleteWorkflowStep = (id) => {
    setData((prev) => ({
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
    setData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, faqWithId]
    }));
  };

  const updateFaq = (id, updatedFaq) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id || f.q === id ? { ...f, ...updatedFaq } : f))
    }));
  };

  const deleteFaq = (id) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id && f.q !== id)
    }));
  };

  // --- Stats CRUD & General Settings ---
  const updateStats = (statsArray) => {
    setData((prev) => ({
      ...prev,
      stats: statsArray
    }));
  };

  const updateGeneralSettings = (newSettings) => {
    setData((prev) => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset to default factory data
  const resetToDefault = () => {
    setData(initialCompanyData);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('verity_studio_data_v2');
    localStorage.removeItem('verity_studio_data_v1');
  };

  return (
    <DataContext.Provider
      value={{
        data,
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


