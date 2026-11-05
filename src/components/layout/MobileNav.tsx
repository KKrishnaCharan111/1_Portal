import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, QrCode, MessageSquare, Bot } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Academics', path: '/academics', icon: BookOpen },
    { title: 'QR Scan', path: '/attendance', icon: QrCode, isSpecial: true },
    { title: 'Chat', path: '/messages', icon: MessageSquare },
    { title: 'AI Copilot', path: '/ai-assistant', icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                item.isSpecial
                  ? 'text-white'
                  : isActive
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            {({ isActive }) =>
              item.isSpecial ? (
                <div className="w-10 h-10 -mt-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 ring-4 ring-white dark:ring-slate-950">
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{item.title}</span>
                </>
              )
            }
          </NavLink>
        );
      })}
    </nav>
  );
};
