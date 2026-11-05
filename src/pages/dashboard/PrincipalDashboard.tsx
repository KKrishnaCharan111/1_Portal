import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  CreditCard,
  Building2,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';

export const PrincipalDashboard: React.FC = () => {
  const { user } = useAuth();

  const departmentComparison = [
    { name: 'Computer Science (CSE)', students: 540, attendance: 91.2, passRate: 96.5, avgCTC: '₹14.8 LPA' },
    { name: 'Electronics & Comm (ECE)', students: 420, attendance: 88.4, passRate: 94.0, avgCTC: '₹11.2 LPA' },
    { name: 'AI & Data Science (AIML)', students: 310, attendance: 92.5, passRate: 97.2, avgCTC: '₹16.4 LPA' },
    { name: 'Mechanical & Auto (MECH)', students: 280, attendance: 86.0, passRate: 91.8, avgCTC: '₹8.9 LPA' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-sky-400">
                  Office of the Principal
                </span>
                <Badge variant="brand" size="sm">
                  Executive Analytics (Read-Only)
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {user?.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Director & Principal • UniSphere Autonomous Institute of Technology
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="glass"
              size="sm"
              icon={<Download className="w-4 h-4 text-sky-400" />}
              onClick={() => window.print()}
            >
              Print Executive Summary
            </Button>
          </div>
        </div>
      </div>

      {/* High-Level Institutional KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Total Enrolled Strength</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            1,550
          </div>
          <div className="text-[11px] text-slate-500 mt-1">99.1% Retention Rate</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Overall Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            89.8%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Across all 4 branches</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Placement Offers (2026)</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            412 Offers
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Highest: ₹44 LPA (Google)</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Institutional Fee Realization</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            98.2%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">₹13.95 Cr collected</div>
        </Card>
      </div>

      {/* Department Comparison Table */}
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Cross-Department Performance Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Comparative metrics across Attendance, Pass Rates, and Placement CTC
            </p>
          </div>
          <Badge variant="brand">Autonomous Batch 2026</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Student Count</th>
                <th className="py-3 px-3">Average Attendance</th>
                <th className="py-3 px-3">Pass Percentage</th>
                <th className="py-3 px-3">Average CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departmentComparison.map((dept) => (
                <tr key={dept.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {dept.name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    {dept.students}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {dept.attendance}%
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-indigo-600 dark:text-indigo-400">
                    {dept.passRate}%
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {dept.avgCTC}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
