import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Sparkles, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import { demoStore } from '../../lib/dataService';

export const DemoBanner: React.FC = () => {
  const { user, role, switchRole, isDemoMode } = useAuth();

  if (!isDemoMode) return null;

  const roles: { id: UserRole; label: string; icon: string; name: string }[] = [
    { id: 'student', label: 'Student', icon: '🎓', name: 'Aarav (CS Sem 6)' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫', name: 'Dr. Ramesh' },
    { id: 'parent', label: 'Parent', icon: '👨‍👧', name: 'S. Sharma' },
    { id: 'hod', label: 'HOD', icon: '🏛️', name: 'Dr. Sunita (CSE)' },
    { id: 'admin', label: 'Admin', icon: '⚙️', name: 'Admin Block' },
    { id: 'principal', label: 'Principal', icon: '🎖️', name: 'Dr. Nambiar' },
  ];

  const handleReset = () => {
    if (confirm('Reset demo data to initial mock state?')) {
      demoStore.resetDemo();
      window.location.reload();
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white border-b border-indigo-800/60 px-4 py-2 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide text-brand-200 uppercase text-[10px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Interactive Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-300">
            Switch role to test live RBAC & features:
          </span>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchRole(r.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 shrink-0 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm ring-1 ring-white/30 font-semibold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
                title={`Switch to ${r.label} view`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            );
          })}

          <button
            onClick={handleReset}
            className="ml-2 px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] flex items-center gap-1 transition"
            title="Reset demo data to defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
