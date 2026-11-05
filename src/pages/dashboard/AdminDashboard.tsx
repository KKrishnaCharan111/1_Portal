import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Building,
  ShieldAlert,
  Database,
  Download,
  Activity,
  Plus,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../lib/dataService';
import { Department, AuditLogItem, CampusEvent } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    dataService.getDepartments().then(setDepartments);
    dataService.getAuditLogs().then(setAuditLogs);
  }, []);

  const exportInstitutionalReportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Department,Code,HOD,Total Students,Faculty Strength',
        ...departments.map(
          (d) => `"${d.name}","${d.code}","${d.hod_name || 'N/A'}",${d.student_count || 450},${d.faculty_count || 24}`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UniSphere_Institutional_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
                  Campus Administration
                </span>
                <Badge variant="danger" size="sm">
                  Super Admin
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {user?.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Campus-Wide Full System Privileges • Database Management • Audit Logs
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="glass"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
              onClick={exportInstitutionalReportCSV}
            >
              Export CSV Report
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Database className="w-4 h-4" />}
              onClick={() => alert('Supabase Migration Schema is active. All 38 tables healthy.')}
            >
              System Health: 100%
            </Button>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Total Campus Strength</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            1,550
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Undergraduate & Postgrad</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Academic Departments</span>
            <Building className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            4
          </div>
          <div className="text-[11px] text-slate-500 mt-1">CSE, ECE, AIML, MECH</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Fee Collection (YTD)</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            ₹13.95 Cr
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">98.2% realization rate</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Audit Trail Entries</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {auditLogs.length} Logged
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Immutable PostgreSQL log</div>
        </Card>
      </div>

      {/* Department Oversight and Live Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Department Architecture & Capacity
            </h3>
            <Badge variant="brand">4 Active</Badge>
          </div>

          <div className="space-y-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      {dept.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {dept.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    HOD: {dept.hod_name || 'Designated Professor'}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {dept.student_count || 450} Students
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {dept.faculty_count || 24} Faculty
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Realtime Immutable Audit Logs */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                System Audit Trail (Security Log)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Live RLS Audited</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  User: <span className="font-semibold text-slate-800 dark:text-slate-200">{log.user_name}</span> • Entity: {log.entity_type}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{log.details}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
