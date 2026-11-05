import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  QrCode,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../lib/dataService';
import { AttendanceSession, Assignment, Subject } from '../../types';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    dataService.getActiveAttendanceSessions().then(setSessions);
    dataService.getAssignments().then(setAssignments);
    dataService.getSubjects().then((subs) => {
      // Faculty subjects: Cloud Computing & Web Lab
      setSubjects(subs.filter((s) => s.faculty_name?.includes('Ramesh')));
    });
  }, []);

  const activeSession = sessions.find((s) => s.is_active);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                  Faculty Portal
                </span>
                <Badge variant="success" size="sm">
                  Emp ID: {user?.employee_id || 'FAC-CS-108'}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {user?.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Associate Professor • Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={<QrCode className="w-4 h-4" />}
              onClick={() => navigate('/attendance')}
            >
              Launch QR Attendance
            </Button>
            <Button
              variant="glass"
              size="sm"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => navigate('/academics')}
            >
              Grade Assignments
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            120
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sections 6-A & 6-B</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Live Class Session</span>
            <QrCode className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {activeSession ? 'Active' : 'Standby'}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {activeSession ? `${activeSession.present_count}/60 marked present` : 'No active lecture'}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Pending Submissions</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            18
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Ready for evaluation</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Avg Attendance Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            91.2%
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Across both assigned courses</div>
        </Card>
      </div>

      {/* Allocated Subjects & Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Allocated Courses & Subjects
            </h3>
            <Link to="/academics" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Manage Content →
            </Link>
          </div>

          <div className="space-y-3">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      {sub.code} • {sub.credits} Credits
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{sub.description}</p>
                  </div>
                  <Badge variant="brand">{sub.type}</Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Semester {sub.semester} - Section A</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/attendance')}
                    >
                      Take QR Attendance
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Faculty Tools */}
        <Card className="p-5 sm:p-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">
            Faculty Quick Workflows
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => navigate('/attendance')}
              className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition"
            >
              <QrCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Start QR Attendance Session
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Generates 25-second auto-rotating cryptographic tokens.
              </div>
            </div>

            <div
              onClick={() => navigate('/academics')}
              className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition"
            >
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Upload Lecture Notes & PDFs
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Distribute study materials to all students.
              </div>
            </div>

            <div
              onClick={() => navigate('/examinations')}
              className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer transition"
            >
              <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Enter Internal Assessment Marks
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Direct marks submission with audit logs.
              </div>
            </div>

            <div
              onClick={() => navigate('/support')}
              className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer transition"
            >
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Faculty Leave Application
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Apply for Duty Leave / Casual Leave to HOD.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
