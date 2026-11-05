import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  FileCheck2,
  Calendar,
  Award,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
} from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { generateHallTicketPDF } from '../../lib/utils';
import { ExamItem, InternalMark, ExamResult, HallTicket, Subject } from '../../types';

export const ExaminationsPage: React.FC = () => {
  const { user, isFaculty, isHOD, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'internals' | 'results' | 'hall_ticket'>('schedule');

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [internalMarks, setInternalMarks] = useState<InternalMark[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [hallTickets, setHallTickets] = useState<HallTicket[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Faculty marks entry modal
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [marksSubject, setMarksSubject] = useState('');
  const [marksStudentName, setMarksStudentName] = useState('Aarav Sharma');
  const [marksTestType, setMarksTestType] = useState<'IA-1' | 'IA-2'>('IA-1');
  const [obtainedMarks, setObtainedMarks] = useState('28.5');

  useEffect(() => {
    dataService.getExams().then(setExams);
    dataService.getInternalMarks().then(setInternalMarks);
    dataService.getExamResults().then(setResults);
    dataService.getHallTickets().then(setHallTickets);
    dataService.getSubjects().then(setSubjects);
  }, []);

  const handleDownloadHallTicket = () => {
    generateHallTicketPDF({
      studentName: user?.full_name || 'Aarav Sharma',
      usn: user?.usn || '1US22CS042',
      semester: user?.semester || 6,
      department: user?.department_name || 'Computer Science & Engineering',
      ticketNumber: hallTickets[0]?.ticket_number || 'HT-2026-6-CS042',
      examTitle: 'Semester 6 Mid-Term Assessment 2026',
      subjects: [
        { code: 'CS601', name: 'Cloud Computing & Distributed Systems', date: '24 Mar 2026', session: '09:30 AM - 12:30 PM' },
        { code: 'CS602', name: 'Machine Learning & Neural Networks', date: '26 Mar 2026', session: '09:30 AM - 12:30 PM' },
        { code: 'CS603', name: 'Compiler Design', date: '28 Mar 2026', session: '09:30 AM - 12:30 PM' },
        { code: 'CS604', name: 'Full Stack Web Engineering Lab', date: '31 Mar 2026', session: '02:00 PM - 05:00 PM' },
      ],
    });
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === marksSubject) || subjects[0];
    await dataService.saveInternalMark({
      student_id: 'b0000000-0000-0000-0000-000000000001',
      student_name: marksStudentName,
      student_usn: '1US22CS042',
      subject_id: sub.id,
      subject_name: sub.name,
      subject_code: sub.code,
      test_type: marksTestType,
      max_marks: 30,
      obtained_marks: parseFloat(obtainedMarks),
    });
    setInternalMarks(await dataService.getInternalMarks());
    setIsMarksModalOpen(false);
    alert('Internal marks recorded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Examinations & Marks
            </h1>
            <Badge variant="brand">Autonomous Office</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exam schedules, continuous internal evaluations, grade sheets, and verified hall tickets
          </p>
        </div>

        {(isFaculty || isHOD || isAdmin) && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsMarksModalOpen(true)}
          >
            Enter Internal Marks
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'schedule', label: 'Exam Schedule' },
          { id: 'internals', label: 'Internal Assessment (IA)' },
          { id: 'results', label: 'End-Sem Results & SGPA' },
          { id: 'hall_ticket', label: 'Official Hall Ticket' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {exams.map((ex) => (
            <Card key={ex.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="brand">{ex.academic_year}</Badge>
                  <span className="text-xs text-slate-500">{ex.exam_type}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {ex.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Duration: {ex.start_date} to {ex.end_date} • {ex.department_name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success">Published by COE</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Internals */}
      {activeTab === 'internals' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Continuous Internal Evaluation (CIE) Marks
              </h3>
              <p className="text-xs text-slate-500">Max 30 marks per subject</p>
            </div>
            <Badge variant="success">Avg: 28.2 / 30 (94%)</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Assessment Type</th>
                  <th className="py-2.5 px-3">Max Marks</th>
                  <th className="py-2.5 px-3">Obtained Marks</th>
                  <th className="py-2.5 px-3">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {internalMarks.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {m.subject_code}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {m.subject_name}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {m.test_type}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{m.max_marks}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                      {m.obtained_marks}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant="success">Outstanding</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: End-Sem Results */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Semester 5 SGPA</span>
              <div className="text-2xl font-black text-brand-600 mt-1">9.25 / 10</div>
            </Card>
            <Card className="p-4 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Cumulative CGPA</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">8.85 / 10</div>
            </Card>
            <Card className="p-4 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Classification</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">First Class with Distinction</div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4">
              Published Semester Grade Sheet (Autonomous)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Internal (40)</th>
                    <th className="py-2.5 px-3">End Sem (60)</th>
                    <th className="py-2.5 px-3">Total (100)</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Credits</th>
                    <th className="py-2.5 px-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{r.subject_name}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">{r.subject_code}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{r.internal_marks}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{r.external_marks}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{r.total_marks}</td>
                      <td className="py-3 px-3 font-black text-brand-600 dark:text-brand-400 text-sm">{r.grade}</td>
                      <td className="py-3 px-3 text-slate-500">{r.credits}</td>
                      <td className="py-3 px-3">
                        <Badge variant="success">Pass</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Hall Ticket */}
      {activeTab === 'hall_ticket' && (
        <Card className="p-6 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
            <Award className="w-10 h-10 text-brand-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Official Examination Hall Ticket (Admit Card)
            </h2>
            <p className="text-xs text-slate-500">
              Admit card verified with accounts clearance and attendance requirements
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{user?.full_name || 'Aarav Sharma'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">USN</span>
              <span className="font-mono font-bold text-brand-600">{user?.usn || '1US22CS042'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Hall Ticket Number</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">HT-2026-6-CS042</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Attendance Clearance</span>
              <Badge variant="success">Eligible (&gt; 75%)</Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              icon={<Download className="w-5 h-5" />}
              onClick={handleDownloadHallTicket}
            >
              Download Printable PDF Hall Ticket
            </Button>
          </div>
        </Card>
      )}

      {/* Enter Marks Modal (Faculty) */}
      <Modal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
        title="Enter Internal Assessment Marks"
      >
        <form onSubmit={handleSaveMarks} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject
            </label>
            <select
              value={marksSubject}
              onChange={(e) => setMarksSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Candidate
            </label>
            <input
              type="text"
              value={marksStudentName}
              onChange={(e) => setMarksStudentName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assessment Test
              </label>
              <select
                value={marksTestType}
                onChange={(e) => setMarksTestType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="IA-1">Internal Assessment 1</option>
                <option value="IA-2">Internal Assessment 2</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Obtained Marks (out of 30)
              </label>
              <input
                type="number"
                step="0.5"
                max="30"
                min="0"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsMarksModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save & Credit Marks
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
