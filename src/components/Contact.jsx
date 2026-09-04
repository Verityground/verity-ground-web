import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, HelpCircle, ChevronDown, ChevronUp, Phone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import BentoSpotlightCard from './BentoSpotlightCard';
import MagneticButton from './MagneticButton';

export default function Contact() {
  const { data } = useData();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    serviceType: 'Audit & Assurance Komprehensif',
    framework: 'Kepatuhan OJK / BI / ISO 27001',
    timeline: '1-3 Bulan (Siap Audit Regulasi)',
    notes: '',
  });

  const [faqOpen, setFaqOpen] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email || 'contact@verityground.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedMsg = `Halo ${data.name},\n\nNama PIC: ${formData.name || 'Calon Klien'}\nPerusahaan / Entitas: ${formData.company || '-'}\nLayanan Yang Dibutuhkan: ${formData.serviceType}\nFokus Regulasi: ${formData.framework}\nEkspektasi Timeline: ${formData.timeline}\nCatatan Tambahan: ${formData.notes || '-'}\n\nSaya ingin menjadwalkan Preliminary Diagnostic & Scoping Meeting.`;
    const waUrl = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(formattedMsg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="contact" className="py-24 relative border-t border-white/[0.06] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase">Audit Scoping & Consultation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Konsultasikan Kebutuhan Tata Kelola & Risiko
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Mulai penugasan dengan Preliminary Scoping & Diagnostic Assessment. Tim partner dan lead auditor kami siap mendampingi persiapan institusi Anda.
          </p>
        </div>

        {/* 2 Column Layout: Quick Form & Studio Info / FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Box (7 cols) */}
          <div className="lg:col-span-7">
            <BentoSpotlightCard className="p-7 sm:p-9">
              <div className="mb-7">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Formulir Inisiasi Penugasan</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Isi informasi entitas Anda untuk menerima rekomendasi ruang lingkup dan estimasi timeline audit terstruktur.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono text-slate-300 mb-2 uppercase font-medium">
                      Nama PIC / Jabatan *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Contoh: Rian (Chief Risk Officer)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-mono text-slate-300 mb-2 uppercase font-medium">
                      Nama Perusahaan / Entitas *
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      required
                      placeholder="Contoh: PT Finansial Prima Tbk"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-mono text-slate-300 mb-2 uppercase font-medium">
                      Fokus Layanan
                    </label>
                    <select
                      id="contact-service"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/[0.1] text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                    >
                      <option value="Audit & Assurance Komprehensif">Audit & Assurance Komprehensif</option>
                      <option value="Kepatuhan & Tata Kelola Regulasi">Kepatuhan & Tata Kelola Regulasi</option>
                      <option value="Manajemen Risiko Terpadu (ERM)">Manajemen Risiko Terpadu (ERM)</option>
                      <option value="Audit Forensik & Investigasi Fraud">Audit Forensik & Investigasi Fraud</option>
                      <option value="Kesiapan Sertifikasi SOC 2 / ISO 27001">Kesiapan Sertifikasi SOC 2 / ISO 27001</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-framework" className="block text-xs font-mono text-slate-300 mb-2 uppercase font-medium">
                      Target Regulasi Utama
                    </label>
                    <select
                      id="contact-framework"
                      name="framework"
                      value={formData.framework}
                      onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/[0.1] text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                    >
                      <option value="OJK & Bank Indonesia (Perbankan/Fintech)">OJK & Bank Indonesia (Perbankan/Fintech)</option>
                      <option value="ISO 27001 / ISO 37001 (SMAP)">ISO 27001 / ISO 37001 (SMAP)</option>
                      <option value="SOC 1 & SOC 2 Type II Readiness">SOC 1 & SOC 2 Type II Readiness</option>
                      <option value="UU Perlindungan Data Pribadi (PDP) / GDPR">UU Perlindungan Data Pribadi (PDP) / GDPR</option>
                      <option value="COSO / Enterprise Internal Control">COSO / Enterprise Internal Control</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-timeline" className="block text-xs font-mono text-slate-300 mb-2 uppercase font-medium">
                    Target Jadwal Kesiapan
                  </label>
                  <select
                    id="contact-timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/[0.1] text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                  >
                    <option value="Mendesak (< 1 Bulan - Deadline Regulator)">Mendesak (&lt; 1 Bulan - Deadline Regulator)</option>
                    <option value="1 - 3 Bulan (Siap Audit Regulasi)">1 - 3 Bulan (Siap Audit Regulasi)</option>
                    <option value="3 - 6 Bulan (Transformasi Holistik)">3 - 6 Bulan (Transformasi Holistik)</option>
                    <option value="Audit Berkala / Tahunan">Audit Berkala / Tahunan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-notes" className="block text-xs font-mono text-slate-300 mb-2 uppercase font-medium">
                    Konteks Tambahan atau Ringkasan Scope (Opsional)
                  </label>
                  <textarea
                    id="contact-notes"
                    name="notes"
                    rows="3"
                    placeholder="Sebutkan skala entitas, jumlah pengguna/transaksi, atau area pengujian khusus..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    className="w-full py-4 text-sm font-mono font-bold"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Inisiasi Konsultasi via WhatsApp Resmi</span>
                  </MagneticButton>
                </div>
              </form>
            </BentoSpotlightCard>
          </div>

          {/* Contact Details & FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Cards */}
            <BentoSpotlightCard className="p-6 sm:p-7 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <span>Saluran Resmi Verity Ground</span>
              </h3>
              
              <a
                href={`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Halo Verity Ground')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-sky-400/40 transition-all micro-bounce group/wa"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover/wa:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-slate-400">Saluran Konsultasi Cepat</div>
                  <div className="text-sm font-bold text-white group-hover/wa:text-sky-300 transition-colors">
                    +{data.whatsappNumber}
                  </div>
                </div>
              </a>

              <div
                onClick={handleCopyEmail}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-sky-400/40 transition-all cursor-pointer micro-bounce group/mail"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover/mail:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-slate-400">Email Inquiry Resmi</div>
                  <div className="text-sm font-bold text-white group-hover/mail:text-blue-300 transition-colors">
                    {data.email || 'contact@verityground.com'}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded-md border border-sky-500/20">
                  {copiedEmail ? 'Tersalin!' : 'Salin'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">Headquarters Advisory</div>
                  <div className="text-xs font-semibold text-slate-200">
                    {data.location}
                  </div>
                </div>
              </div>
            </BentoSpotlightCard>

            {/* FAQs Accordion */}
            <BentoSpotlightCard className="p-6 sm:p-7 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  FAQ Prosedur Audit & Penugasan
                </h4>
              </div>

              <div className="space-y-2.5">
                {data.faqs?.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.02] hover:border-sky-500/30 transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      {faqOpen === idx ? (
                        <ChevronUp className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                      )}
                    </button>
                    {faqOpen === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/[0.06] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </BentoSpotlightCard>

          </div>

        </div>

      </div>
    </section>
  );
}
