import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Settings,
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  Key,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Account & Security Settings
          </h1>
          <Badge variant="brand">{role.toUpperCase()}</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, credentials, two-factor authentication, and portal preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> Profile updates saved successfully!
        </div>
      )}

      {/* Profile Details Form */}
      <Card className="p-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-600" />
          Personal Profile Information
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20"
            />
            <div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => alert('Change profile photo: file dialog simulated.')}
              >
                Change Avatar
              </Button>
              <span className="block text-[11px] text-slate-400 mt-1">JPG, PNG up to 2MB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                University Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role & Identifier
              </label>
              <input
                type="text"
                disabled
                value={`${role.toUpperCase()} • ${user?.usn || user?.employee_id || 'ID Verified'}`}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Security & 2FA */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          Security & Authentication
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Two-Factor Authentication (TOTP)
            </div>
            <div className="text-[11px] text-slate-500">
              Secure your account using Google Authenticator or hardware security keys
            </div>
          </div>
          <button
            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              is2FAEnabled ? 'bg-brand-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Password Reset
            </div>
            <div className="text-[11px] text-slate-500">
              Sends an encrypted password reset email via Supabase Auth
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Password reset instructions sent to ${user?.email}!`)}
          >
            Send Reset Link
          </Button>
        </div>
      </Card>

      {/* Preferences & Theme */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          Preferences & Appearance
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Appearance Theme
            </div>
            <div className="text-[11px] text-slate-500">
              Current mode: <span className="capitalize font-semibold text-slate-800 dark:text-slate-200">{theme}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            onClick={toggleTheme}
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Low Attendance Realtime Warnings
            </div>
            <div className="text-[11px] text-slate-500">
              Alerts you immediately if any course attendance drops below 75%
            </div>
          </div>
          <button
            onClick={() => setAttendanceAlerts(!attendanceAlerts)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              attendanceAlerts ? 'bg-brand-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>
      </Card>

      {/* Session Sign Out */}
      <div className="pt-2 flex justify-end">
        <Button
          variant="danger"
          size="md"
          icon={<LogOut className="w-4 h-4" />}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Sign Out of Portal
        </Button>
      </div>
    </div>
  );
};
