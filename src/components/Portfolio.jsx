import React, { useState } from 'react';
import { Layers, X, ArrowUpRight, ExternalLink, Lock } from 'lucide-react';
import { useData } from '../context/DataContext';

const getTechList = (tech) => {
  if (Array.isArray(tech)) return tech;
  if (typeof tech === 'string') return tech.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

export default function Portfolio() {
  const { data } = useData();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');


  const categories = ['All', ...new Set((data.portfolio || []).map((p) => p.category).filter(Boolean))];

  const filteredProjects = activeCategory === 'All'
    ? (data.portfolio || [])
    : (data.portfolio || []).filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-transparent border-b border-zinc-800/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Selected Work
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Produk Digital & Sistem Perangkat Lunak Terpilih
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Setiap proyek dibangun dengan standar clean code, arsitektur modular, dan optimasi performa tinggi.
            </p>
          </div>

          {/* Clean Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900/60 rounded-lg border border-zinc-800/60 self-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white text-black shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {(!filteredProjects || filteredProjects.length === 0) && (
          <div className="text-center py-20 border border-zinc-800/60 rounded-xl bg-zinc-900/10 p-8 space-y-3">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto rounded-md">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Belum Ada Proyek</h3>
            <p className="text-xs text-zinc-400">
              Proyek portofolio dapat ditambahkan langsung melalui Panel Admin.
            </p>
          </div>
        )}

        {/* Work Grid (Clean Modern Cards) */}
        {filteredProjects && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id || idx}
                className="rounded-xl border border-zinc-800/50 hover:border-zinc-700/80 bg-zinc-900/15 overflow-hidden transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Media Area */}
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/40">
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Clean Subtle Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-black/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-zinc-300 border border-zinc-800/80">
                        {project.category}
                      </span>
                      {project.status && (
                        <span className="rounded-md bg-black/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-zinc-300 border border-zinc-800/80">
                          {project.status}
                        </span>
                      )}
                    </div>

                    {project.metrics && (
                      <div className="absolute bottom-3.5 left-3.5 pointer-events-none">
                        <span className="rounded-md bg-black/85 backdrop-blur-xs px-3 py-1 text-xs font-medium text-zinc-200 border border-zinc-800/80">
                          {project.metrics}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-6 sm:p-8">
                    {project.client && (
                      <div className="text-xs font-medium text-zinc-500 mb-2">
                        {project.client}
                      </div>
                    )}

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-zinc-200 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-6">
                      {project.shortDesc}
                    </p>

                    {/* Tech Stack Chips (Monospace font allowed here) */}
                    <div className="flex flex-wrap gap-1.5">
                      {getTechList(project.tech).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-0.5 text-[11px] font-mono text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>System Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {project.demoUrl && project.demoUrl.trim() !== '' && project.demoUrl.trim() !== '#' ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>
                        {project.category === 'Mobile App' || project.kategori === 'Mobile App'
                          ? 'Lihat Aplikasi'
                          : 'Live Demo'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400">
                      <Lock className="w-3 h-3 text-zinc-500" />
                      <span>Internal Project / Confidential</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Modal: Clean System Architecture Preview */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-[#09090b] border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-56 sm:h-64 w-full rounded-lg overflow-hidden border border-zinc-800">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Deskripsi Sistem
                  </h4>
                  <p className="text-zinc-400">{selectedProject.shortDesc}</p>
                </div>

                {selectedProject.metrics && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                      Pencapaian & Dampak
                    </h4>
                    <p className="text-white font-medium">{selectedProject.metrics}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Teknologi yang Digunakan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getTechList(selectedProject.tech).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                {selectedProject.demoUrl && selectedProject.demoUrl.trim() !== '' && selectedProject.demoUrl.trim() !== '#' ? (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-medium rounded-md transition-colors"
                  >
                    <span>
                      {selectedProject.category === 'Mobile App' || selectedProject.kategori === 'Mobile App'
                        ? 'Lihat Aplikasi'
                        : 'Kunjungi Live Demo'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Internal Project / Confidential</span>
                  </span>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 rounded-md border border-zinc-800 text-zinc-300 text-xs sm:text-sm font-medium hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
