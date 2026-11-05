import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Calendar,
  CheckCircle2,
  Clock,
  QrCode,
  FileText,
  AlertCircle,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  GraduationCap,
  Download,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../lib/dataService';
import { TimetableSlot, Assignment, CampusEvent, FeePayment } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);

  useEffect(() => {
    dataService.getTimetable().then((slots) => {
      // Filter for Monday slots as today's demo timetable
      setTimetable(slots.filter((s) => s.day_of_week === 'Monday'));
    });
    dataService.getAssignments().then(setAssignments);
    dataService.getEvents().then(setEvents);
  }, []);

  const pendingAssignments = assignments.filter((a) => !a.submitted);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner with Digital ID Card Quick Trigger */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-brand-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-300">
                  UniSphere Student Portal
                </span>
                <Badge variant="brand" size="sm">
                  Sem {user?.semester || 6} - Sec {user?.section || 'A'}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Welcome back, {user?.full_name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                USN: <span className="font-mono text-white font-semibold">{user?.usn || '1US22CS042'}</span> • {user?.department_name || 'Computer Science & Engineering'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="glass"
              size="sm"
              icon={<Award className="w-4 h-4 text-amber-400" />}
              onClick={() => setIsIdCardOpen(true)}
            >
              Digital ID Card
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<QrCode className="w-4 h-4" />}
              onClick={() => navigate('/attendance')}
            >
              Scan Attendance
            </Button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Overall Attendance
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              88.4%
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Above 75% required threshold</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88.4%' }} />
          </div>
        </Card>

        {/* CGPA Card */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Current CGPA
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              8.85 / 10
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium">
              <span>Top 5% in Department</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-500 h-full rounded-full" style={{ width: '88.5%' }} />
          </div>
        </Card>

        {/* Pending Assignments */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Assignments Due
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {pendingAssignments.length} Pending
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <span>Next due in 5 days</span>
            </div>
          </div>
          <div className="mt-3 text-right">
            <Link to="/academics" className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View All →
            </Link>
          </div>
        </Card>

        {/* Fee Status Card */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Sem 6 Tuition Fee
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ₹0 Dues
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Paid in full (Receipt verified)</span>
            </div>
          </div>
          <div className="mt-3 text-right">
            <Link to="/fees" className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Download Receipt →
            </Link>
          </div>
        </Card>
      </div>

      {/* Main Grid: Today's Timetable + Assignments & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timetable (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Today's Schedule (Monday)
                  </h3>
                  <p className="text-xs text-slate-500">Live timetable with classroom locations</p>
                </div>
              </div>
              <Link to="/timetable" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Full Week →
              </Link>
            </div>

            <div className="space-y-3">
              {timetable.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/50 flex flex-col items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                      <span className="text-[10px] font-bold">P{idx + 1}</span>
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {slot.subject_name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">{slot.subject_code}</span>
                        <span>•</span>
                        <span>{slot.classroom_code}</span>
                        <span>•</span>
                        <span>{slot.faculty_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/academics"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition group flex flex-col justify-between"
            >
              <div className="p-2.5 w-fit rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Study Notes</div>
                <div className="text-[10px] text-slate-400">PDFs & syllabus</div>
              </div>
            </Link>

            <Link
              to="/examinations"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition group flex flex-col justify-between"
            >
              <div className="p-2.5 w-fit rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Hall Ticket</div>
                <div className="text-[10px] text-slate-400">Admit card PDF</div>
              </div>
            </Link>

            <Link
              to="/career"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition group flex flex-col justify-between"
            >
              <div className="p-2.5 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Placements</div>
                <div className="text-[10px] text-slate-400">Google, MS drives</div>
              </div>
            </Link>

            <Link
              to="/ai-assistant"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition group flex flex-col justify-between"
            >
              <div className="p-2.5 w-fit rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Assistant</div>
                <div className="text-[10px] text-slate-400">Academic doubt solver</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Pending Coursework & Campus Events */}
        <div className="space-y-6">
          {/* Pending Coursework */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Pending Assignments
              </h3>
              <Badge variant="warning">{pendingAssignments.length} pending</Badge>
            </div>

            <div className="space-y-3">
              {pendingAssignments.map((ass) => (
                <div
                  key={ass.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {ass.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {ass.subject_name}
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {ass.total_marks} Marks
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      Due in 5 days
                    </span>
                    <Link
                      to="/academics"
                      className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Upload Submission →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Campus Events */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Flagship Campus Events
              </h3>
              <Link to="/campus" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {events.slice(0, 2).map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/40 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" size="sm">
                      {ev.category}
                    </Badge>
                    {ev.registered && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Registered
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {ev.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{ev.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Digital Student ID Card Modal */}
      <Modal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        title="Official Digital Student ID Card"
        maxWidth="md"
      >
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-brand-900 to-slate-900 p-6 text-white shadow-2xl border border-indigo-700/50 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-brand-300">
                  UniSphere Campus
                </div>
                <div className="text-[10px] text-slate-300">Autonomous Institute of Technology</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-brand-200">
              VALID 2022-2026
            </span>
          </div>

          {/* Student Photo and Info */}
          <div className="mt-6 flex gap-5 items-center">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.full_name}
              className="w-24 h-28 rounded-2xl object-cover ring-4 ring-brand-400/30 shadow-lg shrink-0"
            />
            <div className="space-y-1">
              <div className="text-lg font-black tracking-tight">{user?.full_name}</div>
              <div className="text-xs font-mono font-bold text-amber-300">
                USN: {user?.usn || '1US22CS042'}
              </div>
              <div className="text-xs text-slate-300">{user?.department_name}</div>
              <div className="text-[11px] text-slate-400">
                Semester {user?.semester || 6} • Section {user?.section || 'A'} • Blood Group: {user?.blood_group || 'O+'}
              </div>
            </div>
          </div>

          {/* QR Verification Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-[10px] text-slate-400 leading-tight">
              Official Digital Credential<br />
              Authorized by Registrar & Principal
            </div>
            <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-900" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print / Save PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
};
