import React, { useState, useRef, useEffect } from 'react';
import { Layers, X, CheckCircle2, ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { useData } from '../context/DataContext';

/**
 * 3D Magnetic Interactive Project Card (Noomo Agency Style)
 * - 3D Tilt calculation based on mouse coordinates relative to card center
 * - Dynamic spotlight glare effect following cursor
 * - Multi-layer parallax depth (translateZ)
 */
function ProjectCard({ project, onSelect }) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-9deg to 9deg for subtle, high-end feel)
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.45
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 group relative"
      style={{ willChange: 'transform' }}
    >
      <div
        className="relative rounded-3xl bg-white/90 border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-300 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 24px -2px rgba(16, 185, 129, 0.18)'
            : '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
        }}
      >
        {/* Dynamic Light Sheen / Spotlight Glare Effect */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.7), transparent 80%)`,
            opacity: glare.opacity
          }}
        />

        {/* Ambient Subtle Border Glow */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(14, 165, 233, 0.3), transparent 70%)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px'
          }}
        />

        {/* Top Media Area */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 preserve-3d">
          <img
            src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Floating Badges with 3D Depth */}
          <div
            className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 transition-transform duration-300"
            style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)' }}
          >
            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white font-medium shadow-sm">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {project.status || 'Live'}
            </span>
          </div>

          {/* Metrics Highlight with Parallax Pop */}
          {project.metrics && (
            <div
              className="absolute bottom-3.5 left-3.5 right-3.5 z-20 transition-transform duration-300"
              style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)' }}
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-md">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{project.metrics}</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Body Content */}
        <div className="p-6 flex flex-col flex-grow justify-between bg-white relative z-10">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
              <span>{project.client ? `Klien: ${project.client}` : 'Showcase Study'}</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">Verified</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1 mb-2">
              {project.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-5">
              {project.shortDesc}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tech?.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 group-hover:border-emerald-200 group-hover:bg-emerald-50/40 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => onSelect(project)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white text-xs font-semibold border border-slate-200/80 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail Proyek</span>
            </button>

            <a
              href={project.demoUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80 hover:border-emerald-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs group/btn cursor-pointer"
            >
              <span>Live Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { data } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Dynamically compute available categories
  const categories = ['All', ...new Set(data.portfolio?.map((p) => p.category).filter(Boolean))];

  const filteredProjects = activeCategory === 'All'
    ? data.portfolio
    : data.portfolio?.filter((p) => p.category === activeCategory);

  return (
    <section
      id="portfolio"
      className="py-24 bg-[#f8fbff] border-t border-slate-200/80 relative overflow-hidden select-none sm:select-auto"
    >
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 mb-3.5 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span className="tracking-wide font-semibold">PORTFOLIO & CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Karya & Produk Digital Unggulan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            Eksplorasi website, web application berskala besar, dan sistem kustom yang kami bangun dengan standar engineering kelas dunia dan estetika interaktif modern.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/25 scale-105'
                    : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-xs'
                }`}
              >
                {cat === 'All' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Empty State Fallback */}
        {(!filteredProjects || filteredProjects.length === 0) && (
          <div className="text-center py-20 px-4 max-w-md mx-auto glass-panel rounded-3xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Portofolio Segera Hadir</h3>
              <p className="text-xs text-slate-600 mt-1">
                Karya dan studi kasus proyek pilihan kami sedang dalam tahap kurasi dan rilis.
              </p>
            </div>
          </div>
        )}

        {/* Portfolio 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
          {filteredProjects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 w-full bg-slate-900 relative">
                <img
                  src={selectedProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-mono border border-white/20">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-emerald-700 font-semibold">{selectedProject.client || 'Partner'}</span>
                  <span className="text-xs font-mono text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-500">{selectedProject.status || 'Live Production'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{selectedProject.title}</h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {selectedProject.shortDesc}
                </p>
              </div>

              {selectedProject.metrics && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
                  <div className="text-xs font-mono uppercase text-emerald-800 font-semibold tracking-wider">Pencapaian & Dampak:</div>
                  <div className="text-sm text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{selectedProject.metrics}</span>
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-mono uppercase text-slate-500 mb-2.5 font-semibold tracking-wider">Teknologi & Stack Digunakan:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech?.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-950 cursor-pointer"
                >
                  Tutup
                </button>
                <a
                  href={selectedProject.demoUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center gap-2 hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <span>Kunjungi Live URL</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
