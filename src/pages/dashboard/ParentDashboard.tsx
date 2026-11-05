import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  CreditCard,
  MessageSquare,
  Calendar,
  FileText,
  Phone,
  Mail,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../lib/dataService';
import { DEMO_PROFILES } from '../../lib/demoData';
import { InternalMark, FeePayment } from '../../types';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const student = DEMO_PROFILES['student@demo.unisphere'];
  const [internalMarks, setInternalMarks] = useState<InternalMark[]>([]);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);

  useEffect(() => {
    dataService.getInternalMarks().then(setInternalMarks);
    dataService.getFeePayments().then(setFeePayments);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  Parent / Guardian Portal
                </span>
                <Badge variant="warning" size="sm">
                  Father of {student.full_name}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {user?.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Monitoring Ward: <span className="text-white font-bold">{student.full_name}</span> (USN: {student.usn})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="glass"
              size="sm"
              icon={<MessageSquare className="w-4 h-4 text-brand-400" />}
              onClick={() => navigate('/messages')}
            >
              Message Faculty Coordinator
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<CreditCard className="w-4 h-4" />}
              onClick={() => navigate('/fees')}
            >
              View Fee Dues
            </Button>
          </div>
        </div>
      </div>

      {/* Linked Student Overview Card */}
      <Card className="p-5 sm:p-6 bg-gradient-to-r from-brand-50/50 to-indigo-50/20 dark:from-brand-950/20 dark:to-indigo-950/20 border-brand-200/50 dark:border-brand-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar_url}
              alt={student.full_name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {student.full_name}
                </h3>
                <Badge variant="brand" size="sm">USN: {student.usn}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {student.department_name} • Semester {student.semester} - Section {student.section}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-500 text-[11px] block">Overall Attendance</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
                88.4%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-right">
              <span className="text-slate-500 text-[11px] block">Cumulative CGPA</span>
              <span className="font-extrabold text-brand-600 dark:text-brand-400 text-lg">
                8.85 / 10
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance & Academics Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Ward Attendance Tracking
            </h3>
            <Badge variant="success">All Subjects &gt; 85%</Badge>
          </div>

          <div className="space-y-3">
            {[
              { subject: 'Cloud Computing & Distributed Systems', percent: 92, code: 'CS601' },
              { subject: 'Machine Learning & Neural Networks', percent: 86, code: 'CS602' },
              { subject: 'Compiler Design', percent: 88, code: 'CS603' },
              { subject: 'Full Stack Web Engineering Lab', percent: 95, code: 'CS604' },
            ].map((item) => (
              <div key={item.code} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.subject}</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{item.percent}%</span>
                </div>
                <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Academic Marks Record */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Internal Assessment Performance
            </h3>
            <Link to="/examinations" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Exam Results →
            </Link>
          </div>

          <div className="space-y-3">
            {internalMarks.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {m.subject_name}
                  </div>
                  <div className="text-[11px] text-slate-500">{m.test_type} Examination</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {m.obtained_marks} / {m.max_marks}
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-semibold">Distinction</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Faculty Advisor Contact */}
      <Card className="p-5 sm:p-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">
          Assigned Faculty Mentor & Department Contact
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              alt="Dr. Ramesh Kumar"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Dr. Ramesh Kumar (Academic Mentor)
              </div>
              <div className="text-[11px] text-slate-500">
                Associate Professor • CSE Department
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => navigate('/messages')}
            >
              Send Message
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Calendar className="w-3.5 h-3.5" />}
              onClick={() => alert('Parent-Teacher meeting request scheduled for Friday 3:00 PM.')}
            >
              Request Meeting
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
