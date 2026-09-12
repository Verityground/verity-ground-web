import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';

function Contact() {
  const { data } = useData();

  const [formData, setFormData] = useState({
    name: '',
    serviceType: data?.services?.[0]?.title || 'Website & Web App Development',
    budgetRange: 'Rp 5jt - 15jt',
    timeline: '1 Bulan',
    notes: '',
  });

  const [faqOpen, setFaqOpen] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleCopyEmail = () => {
    if (data?.email) {
      navigator.clipboard.writeText(data.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedMsg = `Halo ${data?.name || 'Verity Ground'},\n\nNama: ${formData.name || 'Calon Klien'}\nLayanan: ${formData.serviceType}\nPerkiraan Budget: ${formData.budgetRange}\nTarget Timeline: ${formData.timeline}\nCatatan Proyek: ${formData.notes || '-'}\n\nSaya ingin konsultasi detail proyek ini.`;
    const waUrl = `https://wa.me/${data?.whatsappNumber || '6285693131477'}?text=${encodeURIComponent(formattedMsg)}`;
    window.open(waUrl, '_blank');
  };

  const safeFaqs = Array.isArray(data?.faqs) ? data.faqs : [];

  return (
    <section id="contact" className="py-24 md:py-32 bg-transparent border-b border-zinc-800/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Contact
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Konsultasikan Kebutuhan Proyek Anda
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Diskusikan spesifikasi teknis website atau sistem aplikasi Anda secara transparan. Kami siap memberikan estimasi realistis dan arsitektur solutif.
          </p>
        </div>

        {/* 2 Column Layout: Quick Form & Studio Info / FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form Box (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-zinc-800/50 bg-zinc-900/15 p-6 sm:p-8 space-y-6 relative">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Spesifikasi Kebutuhan Proyek
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Data akan otomatis dirangkum ke format pesan WhatsApp.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="client-name" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nama Anda / Organisasi *
                </label>
                <input
                  id="client-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Contoh: Budi Pratama (PT Maju Jaya)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-md text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="service-type" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Kategori Layanan
                  </label>
                  <select
                    id="service-type"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-white"
                  >
                    {data?.services && data.services.length > 0 ? (
                      data.services.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))
                    ) : (
                      <>
                        <option value="Website & Web App Development">Website & Web App Development</option>
                        <option value="Landing Page High-Conversion">Landing Page High-Conversion</option>
                        <option value="Sistem Kustom / ERP">Sistem Kustom / ERP</option>
                        <option value="Konsultasi Arsitektur Software">Konsultasi Arsitektur Software</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget-range" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Alokasi Budget
                  </label>
                  <select
                    id="budget-range"
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-white"
                  >
                    <option value="< Rp 5 Juta">&lt; Rp 5 Juta (Landing Page Simpel)</option>
                    <option value="Rp 5jt - 15jt">Rp 5 Juta - 15 Juta</option>
                    <option value="Rp 15jt - 35jt">Rp 15 Juta - 35 Juta</option>
                    <option value="> Rp 35jt">&gt; Rp 35 Juta (Enterprise / Sistem Kompleks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="target-timeline" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Target Waktu Pengerjaan
                </label>
                <select
                  id="target-timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-white"
                >
                  <option value="Sangat Mendesak (< 2 Minggu)">Sangat Mendesak (&lt; 2 Minggu)</option>
                  <option value="1 Bulan">1 Bulan</option>
                  <option value="1 - 3 Bulan">1 - 3 Bulan</option>
                  <option value="Fleksibel / Sesuai Scope">Fleksibel / Sesuai Scope</option>
                </select>
              </div>

              <div>
                <label htmlFor="project-notes" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Ringkasan Kebutuhan / Referensi (Opsional)
                </label>
                <textarea
                  id="project-notes"
                  name="notes"
                  rows="3"
                  placeholder="Deskripsikan gambaran fitur utama atau arsitektur yang Anda butuhkan..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-md text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-white text-black font-semibold text-sm rounded-md hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Kirim & Mulai Konsultasi WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Contact Details & FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Studio Contact */}
            <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/15 p-6 space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">
                Informasi Kontak
              </h3>
              
              <a
                href={`https://wa.me/${data?.whatsappNumber || '6285693131477'}?text=${encodeURIComponent(data?.whatsappMessage || 'Halo Verity Ground')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi kami via WhatsApp resmi"
                className="flex items-center gap-3 p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-colors group min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-md bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-zinc-400">WhatsApp Resmi</div>
                  <div className="text-sm font-semibold text-white">
                    +{data?.whatsappNumber || '6285693131477'}
                  </div>
                </div>
              </a>

              <div
                onClick={handleCopyEmail}
                role="button"
                tabIndex={0}
                aria-label="Salin alamat email studio"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopyEmail(); }}
                className="flex items-center gap-3 p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-colors cursor-pointer group min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-md bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-zinc-400">Email Resmi</div>
                  <div className="text-sm font-semibold text-white">
                    {data?.email || 'verityground@gmail.com'}
                  </div>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                  {copiedEmail ? 'Disalin!' : 'Salin'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 min-h-[44px]">
                <div className="w-9 h-9 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400">Lokasi Studio</div>
                  <div className="text-sm font-semibold text-white">
                    {data?.location || 'Jakarta & Tangerang, Indonesia'}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/15 p-6 space-y-4">
              <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                Pertanyaan Umum (FAQ)
              </h4>

              <div className="divide-y divide-zinc-800/60">
                {safeFaqs.map((faq, idx) => (
                  <div key={faq.id || idx} className="py-3">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={faqOpen === idx}
                      className="w-full text-left flex items-center justify-between text-sm font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer gap-2 py-1 min-h-[36px]"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      {faqOpen === idx ? (
                        <ChevronUp className="w-4 h-4 text-zinc-300 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                    </button>
                    {faqOpen === idx && (
                      <div className="pt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;
