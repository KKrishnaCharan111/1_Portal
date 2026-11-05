import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  GraduationCap,
  TrendingUp,
  FileCheck2,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  FileText,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../lib/dataService';
import { LeaveRequest, DocumentRequest } from '../../types';

export const HODDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [docRequests, setDocRequests] = useState<DocumentRequest[]>([]);

  useEffect(() => {
    dataService.getLeaveRequests().then(setLeaves);
    dataService.getDocuments().then(setDocRequests);
  }, []);

  const handleApproveLeave = (id: string) => {
    dataService.updateLeaveStatus(id, 'approved');
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l))
    );
  };

  const handleApproveDoc = (id: string) => {
    dataService.updateDocumentStatus(id, 'approved', 'Approved by HOD Computer Science');
    setDocRequests((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'approved' } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-brand-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
                  Head of Department (HOD)
                </span>
                <Badge variant="brand" size="sm">
                  CSE Department
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {user?.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Department of Computer Science & Engineering • 540 Students • 28 Faculty Members
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => navigate('/timetable')}
            >
              Allocate Subject Workload
            </Button>
            <Button
              variant="glass"
              size="sm"
              icon={<FileCheck2 className="w-4 h-4" />}
              onClick={() => navigate('/examinations')}
            >
              Audit IA Marks
            </Button>
          </div>
        </div>
      </div>

      {/* Department KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Student Strength</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            540
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Across 8 Semesters</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Faculty Members</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            28
          </div>
          <div className="text-[11px] text-slate-500 mt-1">100% Workload Allocated</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Dept Avg Attendance</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            89.6%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Above target (85%)</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            94.2%
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Avg CTC: ₹14.8 LPA</div>
        </Card>
      </div>

      {/* Approvals: Faculty Leave Requests & Student Document Endorsements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Leave Approvals */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Pending Faculty Leave Approvals
            </h3>
            <Badge variant="warning">{leaves.filter((l) => l.status === 'pending').length} pending</Badge>
          </div>

          <div className="space-y-3">
            {leaves.map((l) => (
              <div
                key={l.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {l.user_name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {l.leave_type} • {l.start_date} to {l.end_date}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                      Reason: "{l.reason}"
                    </p>
                  </div>
                  <Badge variant={l.status === 'approved' ? 'success' : 'warning'}>
                    {l.status}
                  </Badge>
                </div>

                {l.status === 'pending' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => handleApproveLeave(l.id)}
                    >
                      Endorse & Approve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Student Document Verification */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Student Document Clearance
            </h3>
            <Link to="/documents" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View All Requests →
            </Link>
          </div>

          <div className="space-y-3">
            {docRequests.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {doc.student_name} ({doc.student_usn})
                    </div>
                    <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                      {doc.document_type}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Purpose: {doc.purpose}
                    </p>
                  </div>
                  <Badge variant={doc.status === 'approved' ? 'success' : 'warning'}>
                    {doc.status}
                  </Badge>
                </div>

                {doc.status !== 'approved' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => handleApproveDoc(doc.id)}
                    >
                      Authorize Certificate
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
