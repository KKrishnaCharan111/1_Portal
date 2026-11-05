import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login, loginAsDemoRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsDemoRole(role);
    navigate('/dashboard');
  };

  const demoRoles: { id: UserRole; label: string; icon: string; desc: string }[] = [
    { id: 'student', label: 'Student', icon: '🎓', desc: 'Aarav Sharma (B.Tech CSE)' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫', desc: 'Dr. Ramesh Kumar (Professor)' },
    { id: 'parent', label: 'Parent', icon: '👨‍👧', desc: 'Sanjay Sharma (Guardian)' },
    { id: 'hod', label: 'HOD', icon: '🏛️', desc: 'Dr. Sunita Deshmukh (CSE)' },
    { id: 'admin', label: 'Admin', icon: '⚙️', desc: 'Campus Administrator' },
    { id: 'principal', label: 'Principal', icon: '🎖️', desc: 'Dr. V. K. Nambiar (Executive)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-brand-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-brand-500/25 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          UniSphere Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
          One Campus • One Portal • Next-Gen Education
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="p-6 sm:p-8 shadow-2xl">
          {/* One-Click Role Switcher Section */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900 dark:text-brand-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant Demo Sign-In (Select Role):</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Experience role-based access control (RBAC), secure QR attendance, exams, and AI assistant without setup.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoRoles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleDemoLogin(r.id)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 text-left transition group shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{r.icon}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {r.label}
                    </span>
                  </div>
                  <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or Sign In With College Email
            </span>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="student@demo.unisphere"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password123!"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              type="submit"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to UniSphere
            </Button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              type="button"
              onClick={() => {
                loginAsDemoRole('student');
                navigate('/dashboard');
              }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google Workspace
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
