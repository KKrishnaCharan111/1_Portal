import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  QrCode,
  Calendar,
  FileCheck2,
  Sparkles,
  Briefcase,
  Library,
  CreditCard,
  FileText,
  MessageSquare,
  Bot,
  HelpCircle,
  Settings,
  GraduationCap,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
    },
    {
      title: 'My Academics',
      path: '/academics',
      icon: BookOpen,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
    },
    {
      title: 'Attendance',
      path: '/attendance',
      icon: QrCode,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
      badge: 'QR Live',
    },
    {
      title: 'Timetable',
      path: '/timetable',
      icon: Calendar,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
    },
    {
      title: 'Examinations',
      path: '/examinations',
      icon: FileCheck2,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
    },
    {
      title: 'Campus Life',
      path: '/campus',
      icon: Sparkles,
      roles: ['student', 'faculty', 'hod', 'admin', 'principal'],
    },
    {
      title: 'Career',
      path: '/career',
      icon: Briefcase,
      roles: ['student', 'hod', 'admin', 'principal'],
    },
    {
      title: 'Library',
      path: '/library',
      icon: Library,
      roles: ['student', 'faculty', 'admin', 'principal'],
    },
    {
      title: 'Fees & Payments',
      path: '/fees',
      icon: CreditCard,
      roles: ['student', 'parent', 'admin', 'principal'],
    },
    {
      title: 'Documents',
      path: '/documents',
      icon: FileText,
      roles: ['student', 'hod', 'admin'],
    },
    {
      title: 'Messages',
      path: '/messages',
      icon: MessageSquare,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin'],
    },
    {
      title: 'AI Assistant',
      path: '/ai-assistant',
      icon: Bot,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
      badge: 'AI',
    },
    {
      title: 'Help & Support',
      path: '/support',
      icon: HelpCircle,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['student', 'faculty', 'parent', 'hod', 'admin', 'principal'],
    },
  ];

  const permittedItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Campus Title */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                UniSphere
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Campus Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Navigation
          </div>

          {permittedItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Role Profile Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={user?.full_name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {user?.full_name}
              </div>
              <div className="text-[10px] text-brand-600 dark:text-brand-400 font-medium capitalize">
                {role} {user?.section ? `• Sec ${user.section}` : ''}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
