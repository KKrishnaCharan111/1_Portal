import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
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
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const items = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { title: 'My Academics (Notes, Assignments, Question Bank)', path: '/academics', icon: BookOpen, category: 'Academics' },
    { title: 'Secure Attendance & QR Scanner', path: '/attendance', icon: QrCode, category: 'Academics' },
    { title: 'Weekly Timetable & Classrooms', path: '/timetable', icon: Calendar, category: 'Academics' },
    { title: 'Examinations, Hall Tickets & Results', path: '/examinations', icon: FileCheck2, category: 'Examinations' },
    { title: 'Campus Life (Events, Clubs, Communities)', path: '/campus', icon: Sparkles, category: 'Campus' },
    { title: 'Career, Placements & Resume Builder', path: '/career', icon: Briefcase, category: 'Career' },
    { title: 'Library Catalogue & Book Loans', path: '/library', icon: Library, category: 'Campus' },
    { title: 'Fees, Dues & Receipts', path: '/fees', icon: CreditCard, category: 'Finance' },
    { title: 'Document Requests (Bonafide, Transcripts)', path: '/documents', icon: FileText, category: 'Services' },
    { title: 'Messages & Realtime Chat', path: '/messages', icon: MessageSquare, category: 'Communication' },
    { title: 'AI Campus Assistant', path: '/ai-assistant', icon: Bot, category: 'AI Tools' },
    { title: 'Help & Support Tickets', path: '/support', icon: HelpCircle, category: 'Support' },
    { title: 'Profile & Account Settings', path: '/settings', icon: Settings, category: 'Account' },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, page, or search term... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-3.5 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No matching pages found</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/40">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Jump →</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
