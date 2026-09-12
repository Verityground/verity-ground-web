import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers, Wrench, Settings, AlertTriangle, Image as ImageIcon, Code2,
  HelpCircle, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake,
  Clock, Zap, Award, Phone, Mail, MapPin, Eye, Upload,
  Users, Search, Filter, ChevronLeft, ChevronRight, Menu, ShieldAlert,
  Sliders, User, AlertCircle, Info, LogOut, ArrowLeft, ExternalLink,
  Plus, Edit2, Trash2, Save, RefreshCw, X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

/**
 * Abstraksi helper upload gambar yang siap diintegrasikan dengan Cloud Storage
 * (Firebase Storage / Cloudinary). Dilengkapi dengan validasi tipe, kompresi canvas
 * client-side untuk gambar besar, dan fallback DataURL.
 */
export async function uploadImage(file, maxSizeMB = 2) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File gambar tidak ditemukan.'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Format file tidak didukung. Harap unggah format JPG, PNG, WEBP, atau SVG.'));
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      reject(new Error(`Ukuran gambar maksimal ${maxSizeMB}MB agar kecepatan muat web tetap optimal.`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar dari perangkat Anda.'));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => resolve(e.target.result);
      img.onload = () => {
        if (file.type === 'image/svg+xml' || file.size < 400 * 1024) {
          resolve(e.target.result);
          return;
        }

        try {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
          resolve(compressedDataUrl);
        } catch {
          resolve(e.target.result);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function AdminPanel() {
  const {
    data,
    syncStatus,
    forceSync,
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

  const {
    currentUser,
    users,
    updateUserRole,
    deleteUser,
    logout,
    navigate
  } = useAuth();

  // Active Tab: 'portfolio' | 'services' | 'about' | 'faqs' | 'settings' | 'users'
  const [activeTab, setActiveTab] = useState('portfolio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);

  // RBAC Privileges: Only superadmin & staff can be here
  const userRole = currentUser?.role || 'staff';
  const isSuperAdmin = userRole === 'superadmin';
  const isStaff = userRole === 'staff';

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // ==========================================
  // 1. PORTFOLIO STATE & SEARCH / PAGINATION
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

  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [portfolioCategory, setPortfolioCategory] = useState('All');
  const [portfolioPage, setPortfolioPage] = useState(1);
  const PORTFOLIO_PER_PAGE = 6;

  const filteredPortfolio = useMemo(() => {
    const list = Array.isArray(data?.portfolio) ? data.portfolio : [];
    return list.filter((p) => {
      const matchSearch =
        (p.title || '').toLowerCase().includes(portfolioSearch.toLowerCase()) ||
        (p.client || '').toLowerCase().includes(portfolioSearch.toLowerCase()) ||
        (p.shortDesc || '').toLowerCase().includes(portfolioSearch.toLowerCase()) ||
        (Array.isArray(p.tech) ? p.tech.join(' ') : p.tech || '').toLowerCase().includes(portfolioSearch.toLowerCase());

      const matchCategory = portfolioCategory === 'All' || p.category === portfolioCategory;
      return matchSearch && matchCategory;
    });
  }, [data?.portfolio, portfolioSearch, portfolioCategory]);

  const totalPortfolioPages = Math.ceil(filteredPortfolio.length / PORTFOLIO_PER_PAGE) || 1;
  const paginatedPortfolio = useMemo(() => {
    const start = (portfolioPage - 1) * PORTFOLIO_PER_PAGE;
    return filteredPortfolio.slice(start, start + PORTFOLIO_PER_PAGE);
  }, [filteredPortfolio, portfolioPage]);

  // ==========================================
  // 2. SERVICES STATE & SEARCH / PAGINATION
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

  const [serviceSearch, setServiceSearch] = useState('');
  const [servicePage, setServicePage] = useState(1);
  const SERVICES_PER_PAGE = 6;

  const filteredServices = useMemo(() => {
    const list = Array.isArray(data?.services) ? data.services : [];
    return list.filter((s) => {
      return (
        (s.title || '').toLowerCase().includes(serviceSearch.toLowerCase()) ||
        (s.shortDesc || '').toLowerCase().includes(serviceSearch.toLowerCase()) ||
        (Array.isArray(s.techStack) ? s.techStack.join(' ') : s.techStack || '').toLowerCase().includes(serviceSearch.toLowerCase())
      );
    });
  }, [data?.services, serviceSearch]);

  const totalServicePages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE) || 1;
  const paginatedServices = useMemo(() => {
    const start = (servicePage - 1) * SERVICES_PER_PAGE;
    return filteredServices.slice(start, start + SERVICES_PER_PAGE);
  }, [filteredServices, servicePage]);

  // ==========================================
  // 3. ABOUT & VALUES & WORKFLOW STATE
  // ==========================================
  const [aboutStoryForm, setAboutStoryForm] = useState(data?.about?.story || '');
  const [aboutVisionForm, setAboutVisionForm] = useState(data?.about?.vision || '');
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editingValueId, setEditingValueId] = useState(null);
  const [valueForm, setValueForm] = useState({ title: '', desc: '', icon: 'CheckCircle2' });
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [editingStepId, setEditingStepId] = useState(null);
  const [stepForm, setStepForm] = useState({ step: '01', title: '', desc: '' });

  // ==========================================
  // 4. FAQ STATE
  // ==========================================
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqForm, setFaqForm] = useState({ q: '', a: '' });

  // ==========================================
  // 5. SETTINGS STATE
  // ==========================================
  const [settingsForm, setSettingsForm] = useState({
    name: data?.name || '',
    tagline: data?.tagline || '',
    heroHeadline1: data?.heroHeadline1 || 'Butuh Website?',
    heroHeadlineHighlight1: data?.heroHeadlineHighlight1 || 'Butuh Aplikasi?',
    heroHeadlineHighlight2: data?.heroHeadlineHighlight2 || 'Gass Bareng Kitaa Ajaa!',
    subHeadline: data?.subHeadline || '',
    trustHighlights: Array.isArray(data?.trustHighlights) ? data.trustHighlights.join('\n') : '',
    whatsappNumber: data?.whatsappNumber || '',
    whatsappMessage: data?.whatsappMessage || '',
    email: data?.email || '',
    location: data?.location || '',
    availability: data?.availability || ''
  });
  const [statsForm, setStatsForm] = useState(data?.stats || []);

  useEffect(() => {
    if (data) {
      setSettingsForm({
        name: data.name || '',
        tagline: data.tagline || '',
        heroHeadline1: data.heroHeadline1 || 'Butuh Website?',
        heroHeadlineHighlight1: data.heroHeadlineHighlight1 || 'Butuh Aplikasi?',
        heroHeadlineHighlight2: data.heroHeadlineHighlight2 || 'Gass Bareng Kitaa Ajaa!',
        subHeadline: data.subHeadline || '',
        trustHighlights: Array.isArray(data.trustHighlights) ? data.trustHighlights.join('\n') : '',
        whatsappNumber: data.whatsappNumber || '',
        whatsappMessage: data.whatsappMessage || '',
        email: data.email || '',
        location: data.location || '',
        availability: data.availability || ''
      });
      setStatsForm(data.stats || []);
      setAboutStoryForm(data.about?.story || '');
      setAboutVisionForm(data.about?.vision || '');
    }
  }, [data]);

  // If staff attempts to enter restricted tab, fallback to portfolio
  useEffect(() => {
    if (isStaff && activeTab !== 'portfolio' && activeTab !== 'services') {
      setActiveTab('portfolio');
    }
  }, [isStaff, activeTab]);

  // ==========================================
  // PORTFOLIO HANDLERS
  // ==========================================
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

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
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
        await updatePortfolio(editingProjectId, payload);
        showToast('Portofolio berhasil diperbarui di Cloud Firestore!');
      } else {
        await addPortfolio(payload);
        showToast('Portofolio baru berhasil ditambahkan!');
      }
      setIsEditingProject(false);
    } catch (err) {
      console.error('Error saving project:', err);
      showToast('Gagal menyimpan portofolio: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!isSuperAdmin && !isStaff) {
      showToast('Akses Ditolak: Anda tidak memiliki izin menghapus portofolio.', 'error');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus portofolio "${title}" secara permanen?`)) {
      setIsSaving(true);
      try {
        await deletePortfolio(id);
        showToast('Portofolio berhasil dihapus dari Cloud Firestore!');
      } catch (err) {
        console.error('Error deleting project:', err);
        showToast('Gagal menghapus portofolio: ' + (err.message || 'Error'), 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleImageUpload = async (file) => {
    try {
      showToast('Memproses & mengoptimasi gambar...', 'info');
      const optimizedUrl = await uploadImage(file);
      setProjectForm((prev) => ({ ...prev, image: optimizedUrl }));
      showToast('Gambar berhasil dimuat dan dioptimasi!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal memproses gambar.', 'error');
    }
  };

  // ==========================================
  // SERVICES HANDLERS
  // ==========================================
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

  const handleSaveService = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
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
        await updateService(editingServiceId, payload);
        showToast('Layanan berhasil diperbarui!');
      } else {
        await addService(payload);
        showToast('Layanan baru berhasil ditambahkan!');
      }
      setIsEditingService(false);
    } catch (err) {
      console.error('Error saving service:', err);
      showToast('Gagal menyimpan layanan: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id, title) => {
    if (!isSuperAdmin && !isStaff) {
      showToast('Akses Ditolak: Anda tidak memiliki izin menghapus layanan.', 'error');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus layanan "${title}" secara permanen?`)) {
      setIsSaving(true);
      try {
        await deleteService(id);
        showToast('Layanan berhasil dihapus dari Cloud Firestore!');
      } catch (err) {
        console.error('Error deleting service:', err);
        showToast('Gagal menghapus layanan: ' + (err.message || 'Error'), 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // ==========================================
  // ABOUT HANDLERS (SUPER ADMIN ONLY)
  // ==========================================
  const handleSaveAboutStory = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berhak mengubah narasi studio.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await updateAboutStory(aboutStoryForm, aboutVisionForm);
      showToast('Narasi Tentang Kami & Visi berhasil disimpan!');
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveValuePillar = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berhak mengubah pilar nilai.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      if (editingValueId) {
        await updateValuePillar(editingValueId, valueForm);
        showToast('Pilar nilai berhasil diperbarui!');
      } else {
        await addValuePillar(valueForm);
        showToast('Pilar nilai baru berhasil ditambahkan!');
      }
      setIsEditingValue(false);
    } catch (err) {
      showToast('Gagal menyimpan pilar: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteValuePillar = async (id, title) => {
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berhak menghapus pilar nilai.', 'error');
      return;
    }
    if (window.confirm(`Hapus pilar "${title || id}"?`)) {
      setIsSaving(true);
      try {
        await deleteValuePillar(id);
        showToast('Pilar nilai berhasil dihapus.');
      } catch (err) {
        showToast('Gagal menghapus: ' + (err.message || 'Error'), 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveWorkflowStep = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berhak mengubah alur kerja.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      if (editingStepId) {
        await updateWorkflowStep(editingStepId, stepForm);
        showToast('Tahapan alur berhasil diperbarui!');
      } else {
        await addWorkflowStep(stepForm);
        showToast('Tahapan alur baru berhasil ditambahkan!');
      }
      setIsEditingStep(false);
    } catch (err) {
      showToast('Gagal menyimpan alur: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWorkflowStep = async (id, title) => {
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berhak menghapus alur kerja.', 'error');
      return;
    }
    if (window.confirm(`Hapus tahapan alur "${title || id}"?`)) {
      setIsSaving(true);
      try {
        await deleteWorkflowStep(id);
        showToast('Tahapan alur berhasil dihapus.');
      } catch (err) {
        showToast('Gagal menghapus alur: ' + (err.message || 'Error'), 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // ==========================================
  // FAQS HANDLERS
  // ==========================================
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

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingFaqId) {
        await updateFaq(editingFaqId, faqForm);
        showToast('Pertanyaan FAQ berhasil diperbarui!');
      } else {
        await addFaq(faqForm);
        showToast('Pertanyaan FAQ baru berhasil ditambahkan!');
      }
      setIsEditingFaq(false);
    } catch (err) {
      showToast('Gagal menyimpan FAQ: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFaq = async (id, q) => {
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berhak menghapus FAQ.', 'error');
      return;
    }
    if (window.confirm(`Hapus pertanyaan: "${q}"?`)) {
      setIsSaving(true);
      try {
        await deleteFaq(id);
        showToast('Pertanyaan FAQ berhasil dihapus.');
      } catch (err) {
        showToast('Gagal menghapus: ' + (err.message || 'Error'), 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // ==========================================
  // SETTINGS & RESET HANDLERS (SUPER ADMIN ONLY)
  // ==========================================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berhak mengubah konfigurasi studio.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const trustArray = settingsForm.trustHighlights
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      await updateGeneralSettings({
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
        availability: settingsForm.availability,
        stats: statsForm
      });
      showToast('Pengaturan studio & statistik berhasil diperbarui!');
    } catch (err) {
      showToast('Gagal menyimpan pengaturan: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Super Admin yang berwenang me-reset data pabrik.', 'error');
      return;
    }
    if (window.confirm('PERINGATAN KRUSIAL: Semua konten akan di-reset kembali ke data bawaan awal. Lanjutkan?')) {
      setIsSaving(true);
      try {
        await resetToDefault();
        showToast('Data berhasil di-reset ke nilai default.');
      } catch (err) {
        showToast('Gagal me-reset data: ' + (err.message || 'Error'), 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white relative">
      
      {/* Dynamic Toast Feedback Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 animate-fade-in ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : toast.type === 'info'
              ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
              : 'bg-zinc-900/95 border-zinc-700 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-zinc-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar Header Bar */}
      <header className="px-4 sm:px-8 py-3.5 bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-between shrink-0 sticky top-0 z-40 backdrop-blur-md">
        
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center p-1 group-hover:border-zinc-500 transition-colors shrink-0">
              <img src="/logo.png" alt="Verity Ground" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Verity Ground
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Admin Panel
                </span>
              </div>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Firestore Sync Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
            {syncStatus === 'saving' && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="hidden sm:inline">Menyimpan...</span>
              </span>
            )}
            {syncStatus === 'synced' && (
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Firestore Synced</span>
              </span>
            )}
            {syncStatus === 'error' && (
              <button
                type="button"
                onClick={() => forceSync?.()}
                className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Klik untuk mencoba sinkron ulang"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Sync Error</span>
              </button>
            )}
            {syncStatus === 'connecting' && (
              <span className="flex items-center gap-1.5 text-zinc-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="hidden sm:inline">Menghubungkan...</span>
              </span>
            )}
          </div>

          {/* Logged-In User Profile & Role Badge */}
          {currentUser && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-300 font-medium hidden sm:inline">{currentUser.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                  currentUser.role === 'superadmin'
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
          )}

          {/* View Website Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 text-xs flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            title="Lihat Website Utama"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden md:inline">Website Utama</span>
          </button>

          {/* Mobile Navigation Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu Navigasi"
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            aria-label="Keluar dari akun"
            className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors border border-zinc-800 text-xs flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-4 animate-fade-in flex flex-col gap-2">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Pilih Menu Navigasi
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => { setActiveTab('portfolio'); setIsEditingProject(false); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left text-sm font-medium flex items-center gap-2.5 ${activeTab === 'portfolio' ? 'bg-white text-black' : 'text-zinc-300 bg-zinc-900/60'}`}
            >
              <Layers className="w-4 h-4" /> Portofolio ({data?.portfolio?.length || 0})
            </button>
            <button
              onClick={() => { setActiveTab('services'); setIsEditingService(false); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left text-sm font-medium flex items-center gap-2.5 ${activeTab === 'services' ? 'bg-white text-black' : 'text-zinc-300 bg-zinc-900/60'}`}
            >
              <Wrench className="w-4 h-4" /> Layanan ({data?.services?.length || 0})
            </button>
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
                  className={`p-3 rounded-lg text-left text-sm font-medium flex items-center gap-2.5 ${activeTab === 'about' ? 'bg-white text-black' : 'text-zinc-300 bg-zinc-900/60'}`}
                >
                  <Sparkles className="w-4 h-4" /> Tentang & Alur
                </button>
                <button
                  onClick={() => { setActiveTab('faqs'); setIsEditingFaq(false); setMobileMenuOpen(false); }}
                  className={`p-3 rounded-lg text-left text-sm font-medium flex items-center gap-2.5 ${activeTab === 'faqs' ? 'bg-white text-black' : 'text-zinc-300 bg-zinc-900/60'}`}
                >
                  <HelpCircle className="w-4 h-4" /> FAQ ({data?.faqs?.length || 0})
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                  className={`p-3 rounded-lg text-left text-sm font-medium flex items-center gap-2.5 ${activeTab === 'settings' ? 'bg-white text-black' : 'text-zinc-300 bg-zinc-900/60'}`}
                >
                  <Settings className="w-4 h-4" /> Pengaturan Studio
                </button>
                <button
                  onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                  className={`p-3 rounded-lg text-left text-sm font-medium flex items-center gap-2.5 ${activeTab === 'users' ? 'bg-white text-black' : 'text-zinc-300 bg-zinc-900/60'}`}
                >
                  <ShieldCheck className="w-4 h-4" /> Manajemen User ({users?.length || 0})
                </button>
              </>
            )}
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800/80 p-4 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto">
          
          <button
            type="button"
            onClick={() => { setActiveTab('portfolio'); setIsEditingProject(false); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'portfolio'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Portofolio ({data?.portfolio?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('services'); setIsEditingService(false); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'services'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>Layanan ({data?.services?.length || 0})</span>
          </button>

          {/* SUPER ADMIN ONLY TABS */}
          {isSuperAdmin && (
            <>
              <button
                type="button"
                onClick={() => { setActiveTab('about'); setIsEditingValue(false); setIsEditingStep(false); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer min-h-[44px] ${
                  activeTab === 'about'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Tentang & Alur</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('faqs'); setIsEditingFaq(false); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer min-h-[44px] ${
                  activeTab === 'faqs'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>FAQ ({data?.faqs?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer min-h-[44px] ${
                  activeTab === 'settings'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Pengaturan Studio</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full text-left whitespace-nowrap cursor-pointer min-h-[44px] ${
                  activeTab === 'users'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
                <span>Manajemen User ({users?.length || 0})</span>
              </button>

              <div className="mt-auto hidden md:block pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-900/60 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Data Factory</span>
                </button>
              </div>
            </>
          )}

        </aside>

        {/* Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          
          {/* Quick Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-900/30">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Total Proyek</span>
              <div className="text-xl font-bold text-white mt-0.5">{data?.portfolio?.length || 0}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-900/30">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Layanan Aktif</span>
              <div className="text-xl font-bold text-white mt-0.5">{data?.services?.length || 0}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-900/30">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Tanya Jawab FAQ</span>
              <div className="text-xl font-bold text-white mt-0.5">{data?.faqs?.length || 0}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-900/30">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Hak Akses</span>
              <div className="text-sm font-bold text-zinc-200 mt-1 uppercase font-mono">{userRole}</div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* TAB 1: PORTFOLIO                                     */}
          {/* ==================================================== */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 max-w-5xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Kelola Portofolio Proyek</h2>
                  <p className="text-xs text-zinc-400">Atur karya unggulan, metrik performa, dan teknologi stack.</p>
                </div>

                {!isEditingProject && (
                  <button
                    type="button"
                    onClick={handleOpenNewProject}
                    className="py-2.5 px-4 rounded-lg bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Proyek Baru</span>
                  </button>
                )}
              </div>

              {!isEditingProject && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan judul, klien, atau teknologi..."
                      value={portfolioSearch}
                      onChange={(e) => { setPortfolioSearch(e.target.value); setPortfolioPage(1); }}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Web App', 'SaaS', 'Mobile', 'Landing Page'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setPortfolioCategory(cat); setPortfolioPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          portfolioCategory === cat
                            ? 'bg-zinc-200 text-black font-semibold'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Create / Edit Project */}
              {isEditingProject && (
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-zinc-400" />
                      {editingProjectId ? 'Edit Portofolio Proyek' : 'Tambah Portofolio Proyek Baru'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProject(false)}
                      className="text-xs text-zinc-400 hover:text-white p-1"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Judul Proyek *</label>
                        <input
                          type="text"
                          required
                          placeholder="Nama aplikasi / proyek"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Kategori</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none cursor-pointer"
                        >
                          <option value="Web App">Web App</option>
                          <option value="SaaS Platform">SaaS Platform</option>
                          <option value="ERP & Internal Tools">ERP & Internal Tools</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Mobile App">Mobile App</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">URL Gambar / Upload File</label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="flex-1 px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                        <label className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-white flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]">
                          <Upload className="w-4 h-4" />
                          <span>Pilih File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Deskripsi Singkat *</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="Deskripsi singkat produk dan dampak bisnis..."
                        value={projectForm.shortDesc}
                        onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Tech Stack (Pisahkan dengan koma)</label>
                        <input
                          type="text"
                          placeholder="React, Tailwind CSS, Node.js, PostgreSQL"
                          value={projectForm.tech}
                          onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Klien Partner</label>
                        <input
                          type="text"
                          placeholder="PT Maju Digital"
                          value={projectForm.client}
                          onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Metrik Performa (Opsional)</label>
                        <input
                          type="text"
                          placeholder="Lighthouse 99+, -40% Latency"
                          value={projectForm.metrics}
                          onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">URL Demo / Website</label>
                        <input
                          type="text"
                          placeholder="https://domain.com"
                          value={projectForm.demoUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Status Proyek</label>
                        <select
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none cursor-pointer"
                        >
                          <option value="Live Production">Live Production</option>
                          <option value="Under Development">Under Development</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsEditingProject(false)}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium min-h-[44px]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 min-h-[44px]"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Proyek'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Portfolio Items List */}
              {filteredPortfolio.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/30 rounded-xl border border-zinc-800/80">
                  <Layers className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-300">Tidak ada proyek yang cocok.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedPortfolio.map((p) => (
                    <div
                      key={p.id}
                      className="bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/50">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {p.category}
                            </span>
                            <span className="text-xs text-zinc-400">Klien: {p.client || '-'}</span>
                            {p.metrics && (
                              <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">
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
                          type="button"
                          onClick={() => handleOpenEditProject(p)}
                          aria-label={`Edit proyek ${p.title}`}
                          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer min-h-[44px]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        
                        {/* Delete button: SUPER ADMIN & STAFF */}
                        {(isSuperAdmin || isStaff) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(p.id, p.title)}
                            aria-label={`Hapus proyek ${p.title}`}
                            className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-rose-400 border border-zinc-800 hover:border-rose-500/30 transition-colors text-xs flex items-center gap-1 cursor-pointer min-h-[44px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPortfolioPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 text-xs text-zinc-400">
                      <span>Halaman {portfolioPage} dari {totalPortfolioPages}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={portfolioPage <= 1}
                          onClick={() => setPortfolioPage((prev) => Math.max(prev - 1, 1))}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 font-mono text-zinc-200">{portfolioPage}</span>
                        <button
                          type="button"
                          disabled={portfolioPage >= totalPortfolioPages}
                          onClick={() => setPortfolioPage((prev) => Math.min(prev + 1, totalPortfolioPages))}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: SERVICES                                      */}
          {/* ==================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-5xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Kelola Layanan / Services</h2>
                  <p className="text-xs text-zinc-400">Atur cakupan pekerjaan, deskripsi, teknologi, dan badge promosi.</p>
                </div>

                {!isEditingService && (
                  <button
                    type="button"
                    onClick={handleOpenNewService}
                    className="py-2.5 px-4 rounded-lg bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Layanan Baru</span>
                  </button>
                )}
              </div>

              {!isEditingService && (
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Cari layanan berdasarkan judul atau teknologi..."
                    value={serviceSearch}
                    onChange={(e) => { setServiceSearch(e.target.value); setServicePage(1); }}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              )}

              {/* Form Create / Edit Service */}
              {isEditingService && (
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-zinc-400" />
                      {editingServiceId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingService(false)}
                      className="text-xs text-zinc-400 hover:text-white p-1"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Judul Layanan *</label>
                        <input
                          type="text"
                          required
                          placeholder="Web App & Platform SaaS"
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Badge Highlight</label>
                        <input
                          type="text"
                          placeholder="Populer / Enterprise"
                          value={serviceForm.badge}
                          onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Deskripsi Singkat Layanan *</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="Penjelasan keunggulan layanan bagi klien..."
                        value={serviceForm.shortDesc}
                        onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Fitur / Cakupan Pekerjaan (1 Baris = 1 Poin)
                        </label>
                        <textarea
                          rows="4"
                          placeholder="Arsitektur Scalable&#10;Database Real-time&#10;Autentikasi Ketat"
                          value={serviceForm.features}
                          onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Tech Stack (Pisahkan dengan koma)
                        </label>
                        <textarea
                          rows="4"
                          placeholder="React, Next.js, Node.js, PostgreSQL"
                          value={serviceForm.techStack}
                          onChange={(e) => setServiceForm({ ...serviceForm, techStack: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsEditingService(false)}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium min-h-[44px]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 min-h-[44px]"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Layanan'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedServices.map((s) => (
                  <div
                    key={s.id}
                    className="bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between transition-colors h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {s.badge || 'Service'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditService(s)}
                            aria-label={`Edit layanan ${s.title}`}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {(isSuperAdmin || isStaff) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteService(s.id, s.title)}
                              aria-label={`Hapus layanan ${s.title}`}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/40 text-rose-400 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white">{s.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{s.shortDesc}</p>

                      {s.features && s.features.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">Cakupan:</div>
                          <ul className="text-xs text-zinc-400 list-disc list-inside">
                            {(Array.isArray(s.features) ? s.features : []).slice(0, 3).map((feat, idx) => (
                              <li key={idx} className="truncate">{feat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/50 flex flex-wrap gap-1">
                      {(Array.isArray(s.techStack) ? s.techStack : []).map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {totalServicePages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 text-xs text-zinc-400">
                  <span>Halaman {servicePage} dari {totalServicePages}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={servicePage <= 1}
                      onClick={() => setServicePage((prev) => Math.max(prev - 1, 1))}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 font-mono text-zinc-200">{servicePage}</span>
                    <button
                      type="button"
                      disabled={servicePage >= totalServicePages}
                      onClick={() => setServicePage((prev) => Math.min(prev + 1, totalServicePages))}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: ABOUT US & WORKFLOW                           */}
          {/* ==================================================== */}
          {activeTab === 'about' && isSuperAdmin && (
            <div className="space-y-6 max-w-4xl">
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Tentang Kami & Alur Pengerjaan</h2>
                <p className="text-xs text-zinc-400">Kelola narasi manifesto studio, nilai inti, dan tahapan pengerjaan proyek.</p>
              </div>

              {/* Narrative Section */}
              <form onSubmit={handleSaveAboutStory} className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Narasi Studio & Visi</h3>
                  {!isSuperAdmin && (
                    <span className="text-[11px] text-zinc-500 font-mono">Mode Baca (Hanya Superadmin)</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cerita / Manifesto</label>
                  <textarea
                    rows="3"
                    readOnly={!isSuperAdmin}
                    value={aboutStoryForm}
                    onChange={(e) => setAboutStoryForm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Visi & Misi Utama</label>
                  <textarea
                    rows="2"
                    readOnly={!isSuperAdmin}
                    value={aboutVisionForm}
                    onChange={(e) => setAboutVisionForm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none resize-none"
                  />
                </div>
                {isSuperAdmin && (
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all min-h-[44px]"
                    >
                      Simpan Narasi
                    </button>
                  </div>
                )}
              </form>

              {/* Value Pillars */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Pilar Nilai Studio</h3>
                  {isSuperAdmin && !isEditingValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingValue(true);
                        setEditingValueId(null);
                        setValueForm({ title: '', desc: '', icon: 'CheckCircle2' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white text-xs font-medium min-h-[36px]"
                    >
                      Tambah Nilai
                    </button>
                  )}
                </div>

                {isEditingValue && (
                  <form onSubmit={handleSaveValuePillar} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Judul Pilar Nilai"
                      value={valueForm.title}
                      onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm"
                    />
                    <textarea
                      rows="2"
                      required
                      placeholder="Deskripsi nilai..."
                      value={valueForm.desc}
                      onChange={(e) => setValueForm({ ...valueForm, desc: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingValue(false)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 text-xs"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs"
                      >
                        Simpan Nilai
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(data?.about?.values || []).map((val, idx) => (
                    <div key={val.id || idx} className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-zinc-400 font-mono text-[11px]">[{val.icon || 'Pillar'}]</span>
                          <span>{val.title}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{val.desc}</p>
                      </div>
                      {isSuperAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingValue(true);
                              setEditingValueId(val.id || val.title);
                              setValueForm({ title: val.title, desc: val.desc, icon: val.icon || 'CheckCircle2' });
                            }}
                            aria-label={`Edit pilar ${val.title}`}
                            className="p-1.5 rounded bg-zinc-800 text-zinc-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteValuePillar(val.id || val.title, val.title)}
                            aria-label={`Hapus pilar ${val.title}`}
                            className="p-1.5 rounded bg-zinc-800 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Alur Pengerjaan (Workflow)</h3>
                  {isSuperAdmin && !isEditingStep && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingStep(true);
                        setEditingStepId(null);
                        setStepForm({ step: '01', title: '', desc: '' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white text-xs font-medium min-h-[36px]"
                    >
                      Tambah Tahap
                    </button>
                  )}
                </div>

                {isEditingStep && (
                  <form onSubmit={handleSaveWorkflowStep} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="01"
                          value={stepForm.step}
                          onChange={(e) => setStepForm({ ...stepForm, step: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Judul Tahapan"
                          value={stepForm.title}
                          onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm"
                        />
                      </div>
                    </div>
                    <textarea
                      rows="2"
                      required
                      placeholder="Deskripsi tahapan..."
                      value={stepForm.desc}
                      onChange={(e) => setStepForm({ ...stepForm, desc: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingStep(false)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 text-xs"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs"
                      >
                        Simpan Tahap
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {(data?.about?.workflow || []).map((flow, idx) => (
                    <div key={flow.id || idx} className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          Tahap {flow.step}
                        </span>
                        <h4 className="text-sm font-semibold text-white mt-1">{flow.title}</h4>
                        <p className="text-xs text-zinc-400">{flow.desc}</p>
                      </div>
                      {isSuperAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingStep(true);
                              setEditingStepId(flow.id || flow.step);
                              setStepForm({ step: flow.step, title: flow.title, desc: flow.desc });
                            }}
                            aria-label={`Edit alur ${flow.title}`}
                            className="p-1.5 rounded bg-zinc-800 text-zinc-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWorkflowStep(flow.id || flow.step, flow.title)}
                            aria-label={`Hapus alur ${flow.title}`}
                            className="p-1.5 rounded bg-zinc-800 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: FAQS                                          */}
          {/* ==================================================== */}
          {activeTab === 'faqs' && isSuperAdmin && (
            <div className="space-y-6 max-w-4xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Kelola Tanya Jawab (FAQ)</h2>
                  <p className="text-xs text-zinc-400">Pertanyaan umum klien seputar alur kerja, garansi, dan teknologi.</p>
                </div>
                {!isEditingFaq && (
                  <button
                    type="button"
                    onClick={handleOpenNewFaq}
                    className="py-2.5 px-4 rounded-lg bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah FAQ Baru</span>
                  </button>
                )}
              </div>

              {isEditingFaq && (
                <form onSubmit={handleSaveFaq} className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    {editingFaqId ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Pertanyaan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Berapa lama estimasi pengerjaan proyek?"
                      value={faqForm.q}
                      onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Jawaban *</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Penjelasan transparan dan solutif..."
                      value={faqForm.a}
                      onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingFaq(false)}
                      className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300 text-xs min-h-[44px]"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 min-h-[44px]"
                    >
                      Simpan FAQ
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {(data?.faqs || []).map((faq, idx) => (
                  <div
                    key={faq.id || idx}
                    className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">{faq.q}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditFaq(faq)}
                        aria-label={`Edit pertanyaan ${faq.q}`}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(faq.id || faq.q, faq.q)}
                          aria-label={`Hapus pertanyaan ${faq.q}`}
                          className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-rose-400 min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: STUDIO SETTINGS (SUPER ADMIN ONLY)            */}
          {/* ==================================================== */}
          {activeTab === 'settings' && isSuperAdmin && (
            <div className="space-y-6 max-w-4xl">
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Pengaturan Studio & Kontak</h2>
                <p className="text-xs text-zinc-400">Konfigurasi nama brand, nomor WhatsApp resmi, email, dan statistik.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Nama Studio</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">WhatsApp Resmi (Format 62xxx)</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Email Resmi</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Lokasi Studio</label>
                    <input
                      type="text"
                      value={settingsForm.location}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Status Ketersediaan</label>
                    <input
                      type="text"
                      value={settingsForm.availability}
                      onChange={(e) => setSettingsForm({ ...settingsForm, availability: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="text-right pt-2 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all min-h-[44px]"
                  >
                    Simpan Pengaturan
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: USER MANAGEMENT (SUPER ADMIN ONLY)            */}
          {/* ==================================================== */}
          {activeTab === 'users' && isSuperAdmin && (
            <div className="space-y-6 max-w-4xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Manajemen Pengguna & RBAC</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      Eksklusif Super Admin
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tingkatkan hak akses pengguna (Role Elevation) menjadi Staff atau Superadmin.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-200">Panduan Tingkatan Hak Akses Internal:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    <li><strong className="text-purple-300">Super Admin:</strong> Hak penuh CRUD seluruh konten, reset pabrik, serta manajemen pengguna.</li>
                    <li><strong className="text-blue-300">Staff / Editor:</strong> Dapat menambah dan memperbarui konten portofolio dan layanan (tanpa izin hapus atau pengaturan studio).</li>
                    <li><strong className="text-zinc-300">Viewer:</strong> Akun publik yang hanya dapat melihat landing page utama (tidak diizinkan masuk ke admin).</li>
                  </ul>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                {(users || []).map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <div
                      key={u.id}
                      className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                          {u.name?.slice(0, 2).toUpperCase() || 'US'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{u.name}</h4>
                            {isSelf && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                                (Anda)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">{u.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400 hidden sm:inline">Role:</span>
                          <select
                            value={u.role}
                            disabled={isSelf}
                            onChange={(e) => {
                              const res = updateUserRole(u.id, e.target.value);
                              if (res.success) {
                                showToast(`Role pengguna "${u.name}" diubah menjadi ${e.target.value}.`, 'success');
                              } else {
                                showToast(res.error, 'error');
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-zinc-500 focus:outline-none cursor-pointer disabled:opacity-50 min-h-[36px]"
                          >
                            <option value="viewer">Viewer (Publik)</option>
                            <option value="staff">Staff (Editor)</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => {
                            if (window.confirm(`Hapus pengguna "${u.name}" (${u.email})?`)) {
                              const res = deleteUser(u.id);
                              if (res.success) {
                                showToast(`Pengguna "${u.name}" berhasil dihapus.`, 'success');
                              } else {
                                showToast(res.error, 'error');
                              }
                            }
                          }}
                          aria-label={`Hapus user ${u.name}`}
                          className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-rose-400 border border-zinc-800 hover:border-rose-500/30 transition-colors disabled:opacity-20 disabled:cursor-not-allowed min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                          title={isSelf ? 'Tidak dapat menghapus akun sendiri yang sedang aktif' : 'Hapus Pengguna'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}
