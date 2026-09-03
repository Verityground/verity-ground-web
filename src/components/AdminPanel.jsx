import React, { useState } from 'react';
import {
  X, Plus, Edit2, Trash2, Save, RefreshCw, Lock, LogOut, Check,
  Layers, Wrench, Settings, AlertTriangle, ExternalLink, Image, Code2,
  HelpCircle, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake,
  Clock, Zap, Award, Phone, Mail, MapPin, Eye, EyeOff, Upload
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function AdminPanel() {
  const {
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
  } = useData();

  // Active tab state: 'portfolio' | 'services' | 'about' | 'faqs' | 'settings'
  const [activeTab, setActiveTab] = useState('portfolio');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [notification, setNotification] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(passwordInput)) {
      setLoginError(false);
      setPasswordInput('');
      showToast('Login Administrator Berhasil!');
    } else {
      setLoginError(true);
    }
  };

  // ==========================================
  // 1. PORTFOLIO STATE & HANDLERS
  // ==========================================
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Web App',
    image: '',
    shortDesc: '',
    tech: '',
    demoUrl: '',
    client: '',
    metrics: '',
    status: 'Live Production'
  });

  const handleOpenNewProject = () => {
    setIsEditingProject(true);
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Web App',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      shortDesc: '',
      tech: 'React, Tailwind CSS, Node.js',
      demoUrl: 'https://example.com',
      client: '',
      metrics: '',
      status: 'Live Production'
    });
  };

  const handleOpenEditProject = (p) => {
    setIsEditingProject(true);
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title || '',
      category: p.category || 'Web App',
      image: p.image || '',
      shortDesc: p.shortDesc || '',
      tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech || '',
      demoUrl: p.demoUrl || '',
      client: p.client || '',
      metrics: p.metrics || '',
      status: p.status || 'Live Production'
    });
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    const techArray = projectForm.tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: projectForm.title,
      category: projectForm.category,
      image: projectForm.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      shortDesc: projectForm.shortDesc,
      tech: techArray,
      demoUrl: projectForm.demoUrl || '#',
      client: projectForm.client || 'Client Partner',
      metrics: projectForm.metrics || '',
      status: projectForm.status || 'Live Production'
    };

    if (editingProjectId) {
      updatePortfolio(editingProjectId, payload);
      showToast('Portofolio berhasil diperbarui!');
    } else {
      addPortfolio(payload);
      showToast('Portofolio baru berhasil ditambahkan!');
    }
    setIsEditingProject(false);
  };

  const handleDeleteProject = (id, title) => {
    if (window.confirm(`Yakin ingin menghapus portofolio "${title}"?`)) {
      deletePortfolio(id);
      showToast('Portofolio telah dihapus.');
    }
  };

  // ==========================================
  // 2. SERVICES STATE & HANDLERS
  // ==========================================
  const [isEditingService, setIsEditingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    shortDesc: '',
    icon: 'Code2',
    badge: 'Paling Populer',
    features: '',
    techStack: ''
  });

  const handleOpenNewService = () => {
    setIsEditingService(true);
    setEditingServiceId(null);
    setServiceForm({
      title: '',
      shortDesc: '',
      icon: 'Code2',
      badge: 'Layanan Baru',
      features: 'Fitur 1\nFitur 2\nFitur 3',
      techStack: 'React, Node.js, Tailwind CSS'
    });
  };

  const handleOpenEditService = (s) => {
    setIsEditingService(true);
    setEditingServiceId(s.id);
    setServiceForm({
      title: s.title || '',
      shortDesc: s.shortDesc || '',
      icon: s.icon || 'Code2',
      badge: s.badge || '',
      features: Array.isArray(s.features) ? s.features.join('\n') : s.features || '',
      techStack: Array.isArray(s.techStack) ? s.techStack.join(', ') : s.techStack || ''
    });
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    const featuresArray = serviceForm.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const techArray = serviceForm.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: serviceForm.title,
      shortDesc: serviceForm.shortDesc,
      icon: serviceForm.icon || 'Code2',
      badge: serviceForm.badge,
      features: featuresArray,
      techStack: techArray
    };

    if (editingServiceId) {
      updateService(editingServiceId, payload);
      showToast('Layanan berhasil diperbarui!');
    } else {
      addService(payload);
      showToast('Layanan baru berhasil ditambahkan!');
    }
    setIsEditingService(false);
  };

  const handleDeleteService = (id, title) => {
    if (window.confirm(`Yakin ingin menghapus layanan "${title}"?`)) {
      deleteService(id);
      showToast('Layanan telah dihapus.');
    }
  };

  // ==========================================
  // 3. ABOUT & VALUES & WORKFLOW STATE
  // ==========================================
  const [aboutStoryForm, setAboutStoryForm] = useState(data.about?.story || '');
  const [aboutVisionForm, setAboutVisionForm] = useState(data.about?.vision || '');
  
  // Value Pillar Form State
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editingValueId, setEditingValueId] = useState(null);
  const [valueForm, setValueForm] = useState({ title: '', desc: '', icon: 'CheckCircle2' });

  // Workflow Step Form State
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [editingStepId, setEditingStepId] = useState(null);
  const [stepForm, setStepForm] = useState({ step: '01', title: '', desc: '' });

  const handleSaveAboutStory = (e) => {
    e.preventDefault();
    updateAboutStory(aboutStoryForm, aboutVisionForm);
    showToast('Narasi Tentang Kami berhasil diperbarui!');
  };

  const handleSaveValuePillar = (e) => {
    e.preventDefault();
    if (editingValueId) {
      updateValuePillar(editingValueId, valueForm);
      showToast('Pilar nilai berhasil diperbarui!');
    } else {
      addValuePillar(valueForm);
      showToast('Pilar nilai baru berhasil ditambahkan!');
    }
    setIsEditingValue(false);
  };

  const handleSaveWorkflowStep = (e) => {
    e.preventDefault();
    if (editingStepId) {
      updateWorkflowStep(editingStepId, stepForm);
      showToast('Tahapan alur berhasil diperbarui!');
    } else {
      addWorkflowStep(stepForm);
      showToast('Tahapan alur baru berhasil ditambahkan!');
    }
    setIsEditingStep(false);
  };

  // ==========================================
  // 4. FAQ STATE & HANDLERS
  // ==========================================
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqForm, setFaqForm] = useState({ q: '', a: '' });

  const handleOpenNewFaq = () => {
    setIsEditingFaq(true);
    setEditingFaqId(null);
    setFaqForm({ q: '', a: '' });
  };

  const handleOpenEditFaq = (f) => {
    setIsEditingFaq(true);
    setEditingFaqId(f.id || f.q);
    setFaqForm({ q: f.q, a: f.a });
  };

  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (editingFaqId) {
      updateFaq(editingFaqId, faqForm);
      showToast('FAQ berhasil diperbarui!');
    } else {
      addFaq(faqForm);
      showToast('FAQ baru berhasil ditambahkan!');
    }
    setIsEditingFaq(false);
  };

  const handleDeleteFaq = (id, q) => {
    if (window.confirm(`Hapus pertanyaan: "${q}"?`)) {
      deleteFaq(id);
      showToast('FAQ telah dihapus.');
    }
  };

  // ==========================================
  // 5. HERO, STATS & CONTACT SETTINGS
  // ==========================================
  const [settingsForm, setSettingsForm] = useState({
    name: data.name || '',
    tagline: data.tagline || '',
    heroHeadline1: data.heroHeadline1 || 'Jasa Pembuatan',
    heroHeadlineHighlight1: data.heroHeadlineHighlight1 || 'Website & Aplikasi Web',
    heroHeadlineHighlight2: data.heroHeadlineHighlight2 || 'Modern & Berperforma Tinggi',
    subHeadline: data.subHeadline || '',
    trustHighlights: Array.isArray(data.trustHighlights) ? data.trustHighlights.join('\n') : '',
    whatsappNumber: data.whatsappNumber || '',
    whatsappMessage: data.whatsappMessage || '',
    email: data.email || '',
    location: data.location || '',
    availability: data.availability || ''
  });

  const [statsForm, setStatsForm] = useState(data.stats || []);

  const handleStatChange = (index, field, value) => {
    const updated = [...statsForm];
    updated[index] = { ...updated[index], [field]: value };
    setStatsForm(updated);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const trustArray = settingsForm.trustHighlights
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    updateGeneralSettings({
      name: settingsForm.name,
      tagline: settingsForm.tagline,
      heroHeadline1: settingsForm.heroHeadline1,
      heroHeadlineHighlight1: settingsForm.heroHeadlineHighlight1,
      heroHeadlineHighlight2: settingsForm.heroHeadlineHighlight2,
      subHeadline: settingsForm.subHeadline,
      trustHighlights: trustArray,
      whatsappNumber: settingsForm.whatsappNumber,
      whatsappMessage: settingsForm.whatsappMessage,
      email: settingsForm.email,
      location: settingsForm.location,
      availability: settingsForm.availability
    });
    updateStats(statsForm);
    showToast('Pengaturan studio & stats berhasil disimpan!');
  };

  const handleResetData = () => {
    if (window.confirm('PERINGATAN: Semua perubahan custom akan di-reset kembali ke data awal kosong / bawaan. Lanjutkan?')) {
      resetToDefault();
      showToast('Data berhasil di-reset.');
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-emerald-500 text-zinc-950 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/30">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Admin Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Verity Ground Admin Control
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Custom CMS
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono hidden sm:block">Kelola portofolio, layanan, alur pengerjaan, dan kontak</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              <span className="text-zinc-500">Shortcut:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px] font-semibold">Ctrl + `</kbd>
            </div>
            {isAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors border border-zinc-800 text-xs flex items-center gap-1.5 cursor-pointer"
                title="Logout Admin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800 cursor-pointer"
              title="Tutup (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Login View */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl space-y-6 text-center shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Login Administrator</h3>
                <p className="text-xs text-zinc-400 mt-1.5">
                  Masukkan password untuk mengakses kendali CRUD seluruh konten.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Password Admin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      required
                      placeholder="••••••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-zinc-800/60"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                  </div>
                  {loginError && (
                    <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Password yang Anda masukkan salah.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Masuk Control Panel
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Management Tabs */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Tab Navigation */}
            <div className="w-full md:w-60 bg-zinc-900/70 border-b md:border-b-0 md:border-r border-zinc-800 p-3 sm:p-4 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto">
              
              <button
                onClick={() => { setActiveTab('portfolio'); setIsEditingProject(false); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>Portofolio ({data.portfolio?.length || 0})</span>
              </button>

              <button
                onClick={() => { setActiveTab('services'); setIsEditingService(false); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Wrench className="w-4 h-4 shrink-0" />
                <span>Layanan / Services ({data.services?.length || 0})</span>
              </button>

              <button
                onClick={() => { setActiveTab('about'); setIsEditingValue(false); setIsEditingStep(false); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer ${
                  activeTab === 'about'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Tentang Kami & Alur</span>
              </button>

              <button
                onClick={() => { setActiveTab('faqs'); setIsEditingFaq(false); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer ${
                  activeTab === 'faqs'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>FAQ ({data.faqs?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Hero & Kontak Studio</span>
              </button>

              <div className="mt-auto hidden md:block pt-4 border-t border-zinc-800">
                <button
                  onClick={handleResetData}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>

            {/* Main Tab Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-950">
              
              {/* ==================================================== */}
              {/* TAB 1: PORTFOLIO MANAGER                             */}
              {/* ==================================================== */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">Kelola Portofolio Proyek</h3>
                      <p className="text-xs text-zinc-400">Tambah proyek, atur pencapaian/dampak, kategori, dan teknologi stack.</p>
                    </div>
                    {!isEditingProject && (
                      <button
                        onClick={handleOpenNewProject}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Portofolio</span>
                      </button>
                    )}
                  </div>

                  {/* Portfolio Form (Add / Edit) */}
                  {isEditingProject ? (
                    <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                          {editingProjectId ? '✏️ Edit Portofolio' : '✨ Tambah Portofolio Baru'}
                        </h4>
                        <button
                          onClick={() => setIsEditingProject(false)}
                          className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Nama Web / Aplikasi *</label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: FinPulse — Smart Invoicing & SaaS"
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Kategori *</label>
                            <input
                              type="text"
                              required
                              placeholder="Web App / Landing Page / Sistem Kustom / Mobile"
                              value={projectForm.category}
                              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Nama Klien / Brand</label>
                            <input
                              type="text"
                              placeholder="Contoh: PT FinTek Nusantara"
                              value={projectForm.client}
                              onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Pencapaian & Dampak (Metrics)</label>
                            <input
                              type="text"
                              placeholder="Contoh: Peningkatan efisiensi +40% / 5.000+ Siswa Aktif"
                              value={projectForm.metrics}
                              onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Upload File Gambar (.svg, .png, .jpg) */}
                        <div className="space-y-2">
                          <label className="block text-xs font-mono text-zinc-400 uppercase">
                            File Gambar Portofolio (.SVG, .PNG, .JPG, .WEBP) *
                          </label>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                            {/* Preview Thumbnail */}
                            <div className="w-24 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0 relative group">
                              {projectForm.image ? (
                                <img
                                  src={projectForm.image}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Image className="w-8 h-8 text-zinc-600" />
                              )}
                            </div>

                            {/* File Upload Controls */}
                            <div className="flex-1 space-y-2 w-full">
                              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold cursor-pointer transition-colors">
                                <Upload className="w-4 h-4" />
                                <span>Pilih File Gambar (.svg, .png, .jpg)</span>
                                <input
                                  type="file"
                                  accept=".svg,.png,.jpg,.jpeg,.webp,image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Size validation (Max 3MB for smooth localStorage storage)
                                    if (file.size > 3 * 1024 * 1024) {
                                      showToast('Ukuran gambar maksimal 3MB agar performa tetap cepat.');
                                      return;
                                    }

                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const base64String = event.target?.result;
                                      if (base64String) {
                                        setProjectForm((prev) => ({
                                          ...prev,
                                          image: base64String
                                        }));
                                        showToast(`File ${file.name} berhasil dimuat!`);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                  className="hidden"
                                />
                              </label>

                              <p className="text-[11px] text-zinc-500">
                                Mendukung format SVG, PNG, JPG/JPEG, dan WEBP (Maksimal 3MB).
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Deskripsi Singkat *</label>
                          <textarea
                            rows="2"
                            required
                            placeholder="Platform manajemen invoice otomatis, pembayaran digital, dan analitik kas..."
                            value={projectForm.shortDesc}
                            onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Tech Stack (Pisahkan koma)</label>
                            <input
                              type="text"
                              placeholder="React, Tailwind CSS, Node.js, PostgreSQL"
                              value={projectForm.tech}
                              onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Status Proyek</label>
                            <input
                              type="text"
                              placeholder="Live Production / Beta"
                              value={projectForm.status}
                              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">URL Live Demo</label>
                          <input
                            type="text"
                            placeholder="https://example.com"
                            value={projectForm.demoUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsEditingProject(false)}
                            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                          >
                            <Save className="w-4 h-4" />
                            <span>Simpan Portofolio</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : null}

                  {/* Portfolio List */}
                  {(!data.portfolio || data.portfolio.length === 0) ? (
                    <div className="text-center py-10 bg-zinc-900/40 rounded-2xl border border-zinc-800/80">
                      <p className="text-sm text-zinc-400">Belum ada portofolio. Klik tombol "Tambah Portofolio" di atas.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.portfolio.map((p) => (
                        <div
                          key={p.id}
                          className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {p.category}
                                </span>
                                <span className="text-xs font-mono text-zinc-500">Klien: {p.client || '-'}</span>
                                {p.metrics && (
                                  <span className="text-[10px] font-mono text-emerald-300 bg-zinc-800 px-1.5 py-0.5 rounded">
                                    ⚡ {p.metrics}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-white mt-1">{p.title}</h4>
                              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{p.shortDesc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => handleOpenEditProject(p)}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              className="p-2 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 2: SERVICES MANAGER                              */}
              {/* ==================================================== */}
              {activeTab === 'services' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">Kelola Layanan (Services)</h3>
                      <p className="text-xs text-zinc-400">Atur cakupan fitur, ikon, badge keunggulan, dan daftar teknologi.</p>
                    </div>
                    {!isEditingService && (
                      <button
                        onClick={handleOpenNewService}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Layanan</span>
                      </button>
                    )}
                  </div>

                  {/* Service Form */}
                  {isEditingService ? (
                    <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                          {editingServiceId ? '✏️ Edit Layanan' : '✨ Tambah Layanan Baru'}
                        </h4>
                        <button
                          onClick={() => setIsEditingService(false)}
                          className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>

                      <form onSubmit={handleSaveService} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Nama Layanan *</label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Web App Development"
                              value={serviceForm.title}
                              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Badge Tag</label>
                            <input
                              type="text"
                              placeholder="Contoh: Paling Populer"
                              value={serviceForm.badge}
                              onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Nama Ikon Lucide</label>
                            <select
                              value={serviceForm.icon}
                              onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            >
                              <option value="Code2">Code2 (Web Development)</option>
                              <option value="LayoutTemplate">LayoutTemplate (Landing Page)</option>
                              <option value="Cpu">Cpu (Sistem & Otomasi)</option>
                              <option value="Wrench">Wrench (Maintenance & Fix)</option>
                              <option value="Layers">Layers (Fullstack)</option>
                              <option value="Smartphone">Smartphone (Mobile)</option>
                              <option value="Database">Database (Backend & Data)</option>
                              <option value="Cloud">Cloud (DevOps & Server)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Tech Stack (Pisahkan koma)</label>
                            <input
                              type="text"
                              placeholder="React, Next.js, Node.js, PostgreSQL"
                              value={serviceForm.techStack}
                              onChange={(e) => setServiceForm({ ...serviceForm, techStack: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Deskripsi Singkat Layanan *</label>
                          <textarea
                            rows="2"
                            required
                            placeholder="Aplikasi web interaktif dengan arsitektur modern yang responsif, cepat, dan siap scale up..."
                            value={serviceForm.shortDesc}
                            onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Fitur & Cakupan Layanan (1 baris per poin fitur)</label>
                          <textarea
                            rows="4"
                            placeholder="Single Page Application (SPA) & SSR&#10;Integrasi API & Database Real-time&#10;Autentikasi Aman & Role-based Access&#10;Testing & Optimasi Performa"
                            value={serviceForm.features}
                            onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-sans"
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsEditingService(false)}
                            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                          >
                            <Save className="w-4 h-4" />
                            <span>Simpan Layanan</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : null}

                  {/* Services List */}
                  {(!data.services || data.services.length === 0) ? (
                    <div className="text-center py-10 bg-zinc-900/40 rounded-2xl border border-zinc-800/80">
                      <p className="text-sm text-zinc-400">Belum ada layanan. Klik tombol "Tambah Layanan" di atas.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.services.map((s) => (
                        <div
                          key={s.id}
                          className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                                {s.badge || 'Service'}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditService(s)}
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(s.id, s.title)}
                                  className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h4 className="text-base font-bold text-white">{s.title}</h4>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{s.shortDesc}</p>
                            
                            {/* Cakupan Preview */}
                            {s.features && s.features.length > 0 && (
                              <div className="mt-3 space-y-1">
                                <div className="text-[10px] font-mono text-zinc-500 uppercase">Cakupan ({s.features.length} poin):</div>
                                <ul className="text-xs text-zinc-400 list-disc list-inside">
                                  {s.features.slice(0, 3).map((f, idx) => (
                                    <li key={idx} className="truncate">{f}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-1">
                              {s.techStack?.map((t, idx) => (
                                <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 3: ABOUT US & WORKFLOW                           */}
              {/* ==================================================== */}
              {activeTab === 'about' && (
                <div className="space-y-8 max-w-4xl">
                  
                  {/* Story & Vision */}
                  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Narasi Tentang Studio & Visi</span>
                    </h3>
                    
                    <form onSubmit={handleSaveAboutStory} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Cerita / Story Studio</label>
                        <textarea
                          rows="3"
                          value={aboutStoryForm}
                          onChange={(e) => setAboutStoryForm(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Visi Studio</label>
                        <input
                          type="text"
                          value={aboutVisionForm}
                          onChange={(e) => setAboutVisionForm(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Narasi</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Value Pillars CRUD */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                          Pilar Nilai Studio (Value Pillars)
                        </h4>
                        <p className="text-xs text-zinc-400">Pilar utama yang tampil di section Tentang Kami.</p>
                      </div>
                      {!isEditingValue && (
                        <button
                          onClick={() => {
                            setIsEditingValue(true);
                            setEditingValueId(null);
                            setValueForm({ title: '', desc: '', icon: 'CheckCircle2' });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Pilar</span>
                        </button>
                      )}
                    </div>

                    {isEditingValue && (
                      <form onSubmit={handleSaveValuePillar} className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 mb-1">Judul Pilar</label>
                            <input
                              type="text"
                              required
                              placeholder="Clean Code & Scalable"
                              value={valueForm.title}
                              onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 mb-1">Pilih Ikon</label>
                            <select
                              value={valueForm.icon}
                              onChange={(e) => setValueForm({ ...valueForm, icon: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                            >
                              <option value="CheckCircle2">CheckCircle2 (Code & Quality)</option>
                              <option value="ShieldCheck">ShieldCheck (Transparansi & Keamanan)</option>
                              <option value="HeartHandshake">HeartHandshake (Garansi & Mitra)</option>
                              <option value="Clock">Clock (Deadline & Waktu)</option>
                              <option value="Zap">Zap (Kecepatan & Performa)</option>
                              <option value="Award">Award (Standar Tinggi)</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 mb-1">Deskripsi Pilar</label>
                          <textarea
                            rows="2"
                            required
                            placeholder="Penjelasan pilar nilai ini..."
                            value={valueForm.desc}
                            onChange={(e) => setValueForm({ ...valueForm, desc: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none resize-none"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingValue(false)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs cursor-pointer"
                          >
                            Simpan Pilar
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.about?.values?.map((val, idx) => (
                        <div key={val.id || idx} className="p-3.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="text-emerald-400 font-mono text-[11px]">[{val.icon || 'Icon'}]</span>
                              <span>{val.title}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{val.desc}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setIsEditingValue(true);
                                setEditingValueId(val.id || val.title);
                                setValueForm({ title: val.title, desc: val.desc, icon: val.icon || 'CheckCircle2' });
                              }}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus pilar "${val.title}"?`)) {
                                  deleteValuePillar(val.id || val.title);
                                  showToast('Pilar telah dihapus.');
                                }
                              }}
                              className="p-1 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workflow Steps CRUD */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                          Alur Pengerjaan (Workflow Steps)
                        </h4>
                        <p className="text-xs text-zinc-400">Tahapan kerja terstruktur dari discovery hingga deployment.</p>
                      </div>
                      {!isEditingStep && (
                        <button
                          onClick={() => {
                            setIsEditingStep(true);
                            setEditingStepId(null);
                            setStepForm({ step: '05', title: '', desc: '' });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Alur</span>
                        </button>
                      )}
                    </div>

                    {isEditingStep && (
                      <form onSubmit={handleSaveWorkflowStep} className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 mb-1">Nomor Step (01, 02..)</label>
                            <input
                              type="text"
                              required
                              placeholder="01"
                              value={stepForm.step}
                              onChange={(e) => setStepForm({ ...stepForm, step: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none font-mono"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono text-zinc-400 mb-1">Nama Tahapan</label>
                            <input
                              type="text"
                              required
                              placeholder="Discovery & Scope"
                              value={stepForm.title}
                              onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 mb-1">Deskripsi Tahapan</label>
                          <textarea
                            rows="2"
                            required
                            placeholder="Penjelasan detail tahapan alur..."
                            value={stepForm.desc}
                            onChange={(e) => setStepForm({ ...stepForm, desc: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-emerald-500 focus:outline-none resize-none"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingStep(false)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs cursor-pointer"
                          >
                            Simpan Alur
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.about?.workflow?.map((flow, idx) => (
                        <div key={flow.id || idx} className="p-3.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-black text-emerald-400">{flow.step}</span>
                              <span className="text-xs font-bold text-white">{flow.title}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{flow.desc}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setIsEditingStep(true);
                                setEditingStepId(flow.id || flow.step);
                                setStepForm({ step: flow.step, title: flow.title, desc: flow.desc });
                              }}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus tahapan "${flow.title}"?`)) {
                                  deleteWorkflowStep(flow.id || flow.step);
                                  showToast('Tahapan alur telah dihapus.');
                                }
                              }}
                              className="p-1 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 4: FAQ MANAGER                                   */}
              {/* ==================================================== */}
              {activeTab === 'faqs' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">Kelola FAQ (Tanya Jawab)</h3>
                      <p className="text-xs text-zinc-400">Pertanyaan dan jawaban yang ditampilkan pada section Kontak.</p>
                    </div>
                    {!isEditingFaq && (
                      <button
                        onClick={handleOpenNewFaq}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Pertanyaan Baru</span>
                      </button>
                    )}
                  </div>

                  {/* FAQ Form */}
                  {isEditingFaq && (
                    <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-4">
                      <h4 className="text-base font-bold text-emerald-400">
                        {editingFaqId ? '✏️ Edit Pertanyaan FAQ' : '✨ Tambah Pertanyaan Baru'}
                      </h4>

                      <form onSubmit={handleSaveFaq} className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Pertanyaan (Question) *</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Berapa lama estimasi pengerjaan proyek?"
                            value={faqForm.q}
                            onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Jawaban (Answer) *</label>
                          <textarea
                            rows="3"
                            required
                            placeholder="Tuliskan jawaban yang ramah, jelas, dan meyakinkan..."
                            value={faqForm.a}
                            onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsEditingFaq(false)}
                            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold cursor-pointer shadow-lg shadow-emerald-500/20"
                          >
                            Simpan FAQ
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* FAQ List */}
                  {(!data.faqs || data.faqs.length === 0) ? (
                    <div className="text-center py-10 bg-zinc-900/40 rounded-2xl border border-zinc-800/80">
                      <p className="text-sm text-zinc-400">Belum ada FAQ. Klik tombol "Tambah Pertanyaan Baru" di atas.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.faqs.map((faq, idx) => (
                        <div
                          key={faq.id || idx}
                          className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl flex items-start justify-between gap-4 transition-colors"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span className="text-emerald-400 font-mono text-xs">Q:</span>
                              <span>{faq.q}</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed pl-5">{faq.a}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenEditFaq(faq)}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(faq.id || faq.q, faq.q)}
                              className="p-2 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 5: HERO, STATS & GENERAL CONTACT SETTINGS        */}
              {/* ==================================================== */}
              {activeTab === 'settings' && (
                <div className="space-y-8 max-w-4xl">
                  <div className="pb-4 border-b border-zinc-800">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Hero, Statistik & Kontak Studio</h3>
                    <p className="text-xs text-zinc-400">Atur judul headline utama, stats metric cards, WhatsApp, dan kontak resmi.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    
                    {/* Brand Info */}
                    <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
                      <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Identitas Studio</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Nama Studio</label>
                          <input
                            type="text"
                            value={settingsForm.name}
                            onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Status Ketersediaan</label>
                          <input
                            type="text"
                            value={settingsForm.availability}
                            onChange={(e) => setSettingsForm({ ...settingsForm, availability: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Headlines */}
                    <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
                      <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Teks Hero Banner</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Prefix Judul</label>
                          <input
                            type="text"
                            placeholder="Jasa Pembuatan"
                            value={settingsForm.heroHeadline1}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline1: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Teks Utama Putih</label>
                          <input
                            type="text"
                            placeholder="Website & Aplikasi Web"
                            value={settingsForm.heroHeadlineHighlight1}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadlineHighlight1: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Highlight Hijau/Teal</label>
                          <input
                            type="text"
                            placeholder="Modern & Berperforma Tinggi"
                            value={settingsForm.heroHeadlineHighlight2}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadlineHighlight2: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Sub-Headline Deskripsi</label>
                        <textarea
                          rows="2"
                          value={settingsForm.subHeadline}
                          onChange={(e) => setSettingsForm({ ...settingsForm, subHeadline: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Trust Highlights (1 baris per poin)</label>
                        <textarea
                          rows="3"
                          value={settingsForm.trustHighlights}
                          onChange={(e) => setSettingsForm({ ...settingsForm, trustHighlights: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Stats Cards (4 items) */}
                    <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
                      <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Statistik Studio (Stats Grid)</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {statsForm.map((stat, idx) => (
                          <div key={idx} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase">Nilai / Angka</label>
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold text-sm focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase">Label</label>
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase">Keterangan</label>
                              <input
                                type="text"
                                value={stat.desc}
                                onChange={(e) => handleStatChange(idx, 'desc', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact & Socials */}
                    <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-4">
                      <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Informasi Kontak & Integrasi</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Nomor WhatsApp (Format: 628xxx)</label>
                          <input
                            type="text"
                            value={settingsForm.whatsappNumber}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Email Resmi</label>
                          <input
                            type="email"
                            value={settingsForm.email}
                            onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Lokasi Studio</label>
                          <input
                            type="text"
                            value={settingsForm.location}
                            onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Pesan Pembuka WhatsApp Default</label>
                          <input
                            type="text"
                            value={settingsForm.whatsappMessage}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappMessage: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Seluruh Pengaturan</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
