import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Sliders,
  Grid3X3,
  TrendingUp,
  GitMerge,
  FlaskConical,
  BarChart3,
  Info,
  ChevronRight,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import type { PageId } from '../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  group: 'core' | 'quantum' | 'analysis';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',        label: 'Dashboard',       icon: <LayoutDashboard size={15} />, group: 'core' },
  { id: 'suspension-state', label: 'Suspension State', icon: <Activity size={15} />,        group: 'core' },
  { id: 'damping-control',  label: 'Damping Control',  icon: <Sliders size={15} />,         group: 'core' },
  { id: 'stress-operator',  label: 'Stress Operator',  icon: <Grid3X3 size={15} />,         group: 'quantum' },
  { id: 'eigen-analysis',   label: 'Eigen Analysis',   icon: <TrendingUp size={15} />,      group: 'quantum' },
  { id: 'tensor-state',     label: 'Tensor State',     icon: <GitMerge size={15} />,        group: 'quantum' },
  { id: 'measurement-lab',  label: 'Measurement Lab',  icon: <FlaskConical size={15} />,    group: 'analysis' },
  { id: 'system-analysis',  label: 'System Analysis',  icon: <BarChart3 size={15} />,       group: 'analysis' },
  { id: 'about-model',      label: 'About Model',      icon: <Info size={15} />,            group: 'analysis' },
];

const GROUPS = [
  { key: 'core',     label: 'SIMULATION',   color: 'text-cyan-400/50' },
  { key: 'quantum',  label: 'QUANTUM MATH', color: 'text-violet-400/50' },
  { key: 'analysis', label: 'ANALYSIS',     color: 'text-green-400/50' },
] as const;

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  mobileOpen,
  onMobileToggle,
}) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    if (mobileOpen) onMobileToggle();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={onMobileToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40
          flex flex-col
          bg-[#06090f] border-r border-[#0d1f3c]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-auto
        `}
        aria-label="Main navigation"
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#0d1f3c] relative overflow-hidden">
          {/* Corner accent */}
          <div
            className="accent-blink absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/40"
            aria-hidden="true"
          />

          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-sm bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center"
                style={{ boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              >
                <Zap size={13} className="text-cyan-400" />
              </div>
              <span
                className="text-cyan-400 font-bold text-xl tracking-[0.2em]"
                style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}
              >
                Q-SUSPEND
              </span>
            </div>
            <p className="text-[8px] tracking-[0.3em] text-slate-500 mt-1.5 ml-9.5 leading-none">
              MR ADAPTIVE SUSPENSION
            </p>
          </div>

          <button
            onClick={onMobileToggle}
            className="lg:hidden text-slate-500 hover:text-slate-300 p-1.5 rounded hover:bg-white/5 transition-colors"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto py-3 scrollbar-thin"
          aria-label="Site navigation"
        >
          {GROUPS.map((group) => (
            <div key={group.key} className="mb-2">
              <p className={`text-[8px] tracking-[0.25em] ${group.color} px-5 py-2 font-semibold`}>
                {group.label}
              </p>
              {NAV_ITEMS.filter((item) => item.group === group.key).map((item) => {
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-5 py-2.5 text-left
                      text-sm transition-all duration-150 relative group
                      focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40 focus-visible:ring-inset
                      ${active
                        ? 'text-cyan-400 bg-cyan-400/[0.06]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400"
                        style={{ boxShadow: '2px 0 8px rgba(0,212,255,0.5)' }}
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className={`transition-colors duration-150 ${
                        active ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>

                    <span className="font-medium tracking-tight text-[13px]">
                      {item.label}
                    </span>

                    {active && (
                      <ChevronRight
                        size={11}
                        className="ml-auto text-cyan-400/50"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#0d1f3c] shrink-0">
          {/* Separator line with corner bits */}
          <div className="flex flex-col gap-2">
            <div className="text-[8px] text-slate-600 leading-relaxed space-y-0.5">
              <p className="text-slate-500 tracking-[0.15em] font-medium">QUANTUM-INSPIRED MODEL</p>
              <p>Classical simulation using quantum</p>
              <p>mathematical framework.</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="live-dot w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
              <span className="text-[8px] tracking-[0.2em] text-slate-600">SIMULATION ACTIVE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={onMobileToggle}
        className="fixed top-3 left-3 z-20 lg:hidden p-2 rounded-sm bg-[#0a0d14]/90 border border-[#1a2744] text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors backdrop-blur-sm"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu size={17} />
      </button>
    </>
  );
};
