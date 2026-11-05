import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  BookOpen,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  Plus,
  HelpCircle,
  FileDown,
} from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { Subject, NoteItem, Assignment, QuestionBankItem } from '../../types';

export const AcademicsPage: React.FC = () => {
  const { user, isFaculty, isHOD, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'subjects' | 'notes' | 'assignments' | 'question_bank'>('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>([]);

  // Modals
  const [isUploadNoteOpen, setIsUploadNoteOpen] = useState(false);
  const [isSubmitAssOpen, setIsSubmitAssOpen] = useState(false);
  const [selectedAss, setSelectedAss] = useState<Assignment | null>(null);

  // Forms
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');

  useEffect(() => {
    dataService.getSubjects().then(setSubjects);
    dataService.getNotes().then(setNotes);
    dataService.getAssignments().then(setAssignments);
    dataService.getQuestionBank().then(setQuestionBank);
  }, []);

  const handleUploadNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle) return;
    const sub = subjects.find((s) => s.id === noteSubject) || subjects[0];
    await dataService.uploadNote({
      subject_id: sub.id,
      subject_name: sub.name,
      faculty_name: user?.full_name || 'Dr. Ramesh Kumar',
      faculty_id: user?.id || 'b0000000-0000-0000-0000-000000000002',
      title: noteTitle,
      description: 'Uploaded directly via UniSphere Faculty Academic portal.',
      file_url: 'https://raw.githubusercontent.com/KKrishnaCharan111/1---Portal/main/public/docs/cloud-mod1.pdf',
      unit_number: 1,
      file_size: '3.8 MB',
    });
    setNotes(await dataService.getNotes());
    setIsUploadNoteOpen(false);
    setNoteTitle('');
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAss) return;
    await dataService.submitAssignment(selectedAss.id);
    setAssignments(await dataService.getAssignments());
    setIsSubmitAssOpen(false);
    alert('Assignment submission uploaded and recorded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Academics
            </h1>
            <Badge variant="brand">Semester 6</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access curriculum syllabus, lecture notes, coursework submissions, and previous question banks
          </p>
        </div>

        {/* Faculty Action */}
        {(isFaculty || isHOD || isAdmin) && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsUploadNoteOpen(true)}
          >
            Upload Course Material
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'subjects', label: 'Subjects & Syllabus', count: subjects.length },
          { id: 'notes', label: 'Lecture Notes', count: notes.length },
          { id: 'assignments', label: 'Coursework & Assignments', count: assignments.length },
          { id: 'question_bank', label: 'Question Bank', count: questionBank.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Subjects */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <Card key={sub.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
                    {sub.code}
                  </span>
                  <Badge variant={sub.type === 'Practical' ? 'success' : 'neutral'}>
                    {sub.type} • {sub.credits} Credits
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {sub.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Instructor: {sub.faculty_name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FileDown className="w-3.5 h-3.5" />}
                  onClick={() => alert(`Downloading official syllabus for ${sub.code} (${sub.name})`)}
                >
                  Syllabus PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Lecture Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="brand" size="sm">
                    Unit {note.unit_number || 1}
                  </Badge>
                  <span className="text-[10px] text-slate-400">{note.file_size || '4 MB'}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{note.subject_name}</p>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  {note.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">By {note.faculty_name}</span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => alert(`Downloading note: ${note.title}`)}
                >
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {assignments.map((ass) => (
            <Card key={ass.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                    {ass.subject_code}
                  </span>
                  <Badge variant={ass.submitted ? 'success' : 'warning'}>
                    {ass.submitted ? 'Submitted' : 'Pending'}
                  </Badge>
                  <span className="text-xs text-slate-400">Total: {ass.total_marks} Marks</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {ass.title}
                </h3>
                <p className="text-xs text-slate-500 max-w-2xl">{ass.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {ass.submitted ? (
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Submitted
                    </span>
                    {ass.submission_marks !== undefined && (
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        Grade: {ass.submission_marks}/{ass.total_marks}
                      </span>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Upload className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedAss(ass);
                      setIsSubmitAssOpen(true);
                    }}
                  >
                    Submit Work
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Question Bank */}
      {activeTab === 'question_bank' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionBank.map((qb) => (
            <Card key={qb.id} className="p-5 flex items-center justify-between">
              <div>
                <Badge variant="brand">{qb.year} • {qb.exam_type}</Badge>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {qb.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{qb.subject_name}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => alert(`Downloading question bank paper: ${qb.title}`)}
              >
                Get PDF
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Note Modal (Faculty) */}
      <Modal
        isOpen={isUploadNoteOpen}
        onClose={() => setIsUploadNoteOpen(false)}
        title="Upload Academic Course Material"
      >
        <form onSubmit={handleUploadNote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Material Title / Unit Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Module 3: Microservices & Docker"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Subject
            </label>
            <select
              value={noteSubject}
              onChange={(e) => setNoteSubject(e.target.value)}
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
              Attach PDF / Resource File
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-brand-500 transition">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs text-slate-500">Click to select PDF or presentation slides</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadNoteOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Upload Material
            </Button>
          </div>
        </form>
      </Modal>

      {/* Submit Assignment Modal (Student) */}
      <Modal
        isOpen={isSubmitAssOpen}
        onClose={() => setIsSubmitAssOpen(false)}
        title={`Submit: ${selectedAss?.title}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">{selectedAss?.description}</p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub Repository or Cloud Drive URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/your-username/assignment-repo"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Or Upload PDF Report / Archive
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-brand-500 transition">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs text-slate-500">Drop PDF / ZIP archive here</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsSubmitAssOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmitAssignment}>
              Confirm Submission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
