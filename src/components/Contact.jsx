import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, HelpCircle, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Contact() {
  const { data } = useData();

  const [formData, setFormData] = useState({
    name: '',
    serviceType: data.services?.[0]?.title || 'Web App Development',
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
    navigator.clipboard.writeText(data.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedMsg = `Halo ${data.name},\n\nNama: ${formData.name || 'Calon Klien'}\nLayanan: ${formData.serviceType}\nPerkiraan Budget: ${formData.budgetRange}\nTarget Timeline: ${formData.timeline}\nCatatan Proyek: ${formData.notes || '-'}\n\nSaya ingin konsultasi detail proyek ini.`;
    const waUrl = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(formattedMsg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-transparent border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0073ea]/15 border border-[#0073ea]/35 text-xs font-mono text-[#0073ea] mb-3 shadow-xs">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>START A CONVERSATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Siap Mewujudkan Ide Digital Anda?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4">
            Konsultasikan kebutuhan website atau sistem aplikasi Anda secara gratis. Kami siap memberikan masukan arsitektur teknis dan estimasi yang transparan.
          </p>
        </div>

        {/* 2 Column Layout: Quick Form & Studio Info / FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Box (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl shadow-sm relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Formulir Konsultasi Singkat</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Isi detail berikut dan kami akan langsung membuka chat WhatsApp dengan rangkuman rapi.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="client-name" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase font-medium">
                  Nama Anda / Perusahaan *
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/20 transition-colors shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="service-type" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase font-medium">
                    Jenis Layanan
                  </label>
                  <select
                    id="service-type"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/20 transition-colors shadow-xs [&>option]:bg-[#19222c] [&>option]:text-white cursor-pointer"
                  >
                    {data.services && data.services.length > 0 ? (
                      data.services.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))
                    ) : (
                      <>
                        <option value="Website & Web App">Website & Web App Development</option>
                        <option value="Landing Page">Landing Page</option>
                        <option value="Sistem Kustom">Sistem Kustom / ERP</option>
                        <option value="Konsultasi Umum">Konsultasi Umum</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget-range" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase font-medium">
                    Perkiraan Budget
                  </label>
                  <select
                    id="budget-range"
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/20 transition-colors shadow-xs [&>option]:bg-[#19222c] [&>option]:text-white cursor-pointer"
                  >
                    <option value="< Rp 5 Juta">&lt; Rp 5 Juta (Landing Page Simpel)</option>
                    <option value="Rp 5jt - 15jt">Rp 5 Juta - 15 Juta</option>
                    <option value="Rp 15jt - 35jt">Rp 15 Juta - 35 Juta</option>
                    <option value="> Rp 35jt">&gt; Rp 35 Juta (Enterprise / Sistem Kompleks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="target-timeline" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase font-medium">
                  Target Deadline
                </label>
                <select
                  id="target-timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/20 transition-colors shadow-xs [&>option]:bg-[#19222c] [&>option]:text-white cursor-pointer"
                >
                  <option value="Sangat Mendesak (< 2 Minggu)">Sangat Mendesak (&lt; 2 Minggu)</option>
                  <option value="1 Bulan">1 Bulan</option>
                  <option value="1 - 3 Bulan">1 - 3 Bulan</option>
                  <option value="Fleksibel / Sesuai Scope">Fleksibel / Sesuai Scope</option>
                </select>
              </div>

              <div>
                <label htmlFor="project-notes" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase font-medium">
                  Deskripsi Kebutuhan Singkat (Opsional)
                </label>
                <textarea
                  id="project-notes"
                  name="notes"
                  rows="3"
                  placeholder="Ceritakan gambaran fitur utama atau referensi website yang Anda sukai..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/20 transition-colors resize-none shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#0073ea] hover:bg-[#0060c4] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-[#0073ea]/25 hover:shadow-[#0073ea]/40 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Kirim & Mulai Konsultasi via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Contact Details & FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-2">Kontak Langsung Studio</h3>
              
              <a
                href={`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-[#0073ea]/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0073ea]/15 text-[#0073ea] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-slate-400">WhatsApp Resmi</div>
                  <div className="text-sm font-bold text-white group-hover:text-[#0073ea] transition-colors">
                    +{data.whatsappNumber}
                  </div>
                </div>
              </a>

              <div
                onClick={handleCopyEmail}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopyEmail(); }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-[#0073ea]/40 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0073ea]/15 text-[#0073ea] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-slate-400">Email Inquiry</div>
                  <div className="text-sm font-bold text-white group-hover:text-[#0073ea] transition-colors">
                    {data.email}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {copiedEmail ? 'Tersalin!' : 'Klik Salin'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-[#0073ea]/15 text-[#0073ea] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">Lokasi Tim</div>
                  <div className="text-sm font-bold text-white">
                    {data.location}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="glass-panel p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-[#0073ea]" />
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Frequently Asked Questions
                </h4>
              </div>

              <div className="space-y-2">
                {data.faqs?.map((faq, idx) => (
                  <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {faqOpen === idx ? (
                        <ChevronUp className="w-4 h-4 text-[#0073ea] shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      )}
                    </button>
                    {faqOpen === idx && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2.5">
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
