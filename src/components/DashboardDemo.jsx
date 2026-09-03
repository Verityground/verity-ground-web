import React, { useState } from 'react';
import { LayoutDashboard, CheckCircle2, Clock, PlayCircle, AlertCircle, Shield, Activity, GitCommit, FileText, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function DashboardDemo() {
  const { data } = useData();
  const demoData = data.clientDashboardDemo || {};
  const projectInfo = demoData.projectInfo || {};
  const statsCards = demoData.statsCards || [];
  const sprints = demoData.sprints || [];
  const tasks = demoData.tasks || [];
  const activityLog = demoData.activityLog || [];

  const [activeTaskFilter, setActiveTaskFilter] = useState('All');

  const filteredTasks = activeTaskFilter === 'All'
    ? tasks
    : tasks.filter(t => t.status?.toLowerCase() === activeTaskFilter.toLowerCase());


  const getStatusBadge = (status) => {
    switch (status) {
      case 'Done':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
            <PlayCircle className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
            Backlog
          </span>
        );
    }
  };

  return (
    <section id="dashboard-demo" className="py-20 bg-[#f8fbff] border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 mb-3 shadow-xs">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>TRANSPARENT CLIENT PORTAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Pantau Proyek Anda Secara Real-Time
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4">
            Tak ada lagi rasa cemas atau proses gelap. Klien Verity Ground mendapatkan akses langsung ke portal progress, sprint task, dan live staging.
          </p>
        </div>

        {/* Dashboard Frame Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden backdrop-blur-xl">
          
          {/* Top Mock Window Bar */}
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="ml-2 text-xs font-mono text-slate-500 hidden sm:inline">
                portal.verityground.dev / client / <span className="text-slate-800 font-semibold">sinergi-portal</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Syncing Live: Active Sprint</span>
            </div>
          </div>

          {/* Dashboard Content Body */}
          <div className="p-5 sm:p-8 space-y-8">
            
            {/* Project Overview Card */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-500">Client: {projectInfo.clientName}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                  {projectInfo.projectName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-mono">
                  <span>Mulai: {projectInfo.startDate}</span>
                  <span>•</span>
                  <span>Target Rilis: {projectInfo.targetLaunch}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Lead: {projectInfo.leadEngineer}</span>
                </div>
              </div>

              {/* Overall Progress Gauge */}
              <div className="lg:w-72 bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Overall Progress</span>
                  <span className="font-bold text-emerald-700 text-sm">{projectInfo.overallProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${projectInfo.overallProgress}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 text-right font-mono">
                  Estimasi rilis tepat waktu
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs"
                >
                  <div className="text-xs font-mono text-slate-500">{card.label}</div>
                  <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{card.value}</div>
                  <div className="text-xs text-emerald-700 mt-1 font-mono">{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Sprints & Milestones Progression */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Roadmap Sprint & Milestone
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sprints.map((sp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        sp.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sp.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {sp.status}
                      </span>
                      <span className="text-slate-600 font-bold">{sp.progress}%</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">{sp.name}</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${sp.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${sp.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split: Task Tracker & Recent Live Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Task Tracker (2 cols) */}
              <div className="lg:col-span-2 bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
                    Daftar Task Sprint Saat Ini
                  </h4>
                  
                  {/* Task Filter */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-xs">
                    {['All', 'Done', 'In Progress', 'In Review'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveTaskFilter(f)}
                        className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                          activeTaskFilter === f
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-950'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors shadow-xs"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {task.id}
                        </span>
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-slate-900">{task.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {task.tag}
                            </span>
                            <span className={`text-[10px] font-mono ${
                              task.priority === 'High' ? 'text-rose-600 font-semibold' : 'text-slate-500'
                            }`}>
                              Priority: {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 self-start sm:self-center">
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Activity Feed (1 col) */}
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Live Activity Log</span>
                    </h4>
                  </div>

                  <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {activityLog.map((act, idx) => (
                      <div key={idx} className="relative pl-6 space-y-1">
                        <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 -translate-x-1/2 ring-4 ring-white"></div>
                        <div className="text-[11px] font-mono text-slate-500">{act.time}</div>
                        <div className="text-xs font-semibold text-slate-800">{act.user}</div>
                        <div className="text-xs text-slate-600">{act.action}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      Transparansi penuh: Setiap commit dan milestone diuji sebelum di-merge ke branch utama.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
