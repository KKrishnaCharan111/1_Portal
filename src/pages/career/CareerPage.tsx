import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MapPin,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { dataService } from '../../lib/dataService';
import { PlacementOpportunity, InternshipOpportunity } from '../../types';

export const CareerPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'placements' | 'internships' | 'resume'>('placements');
  const [placements, setPlacements] = useState<PlacementOpportunity[]>([]);
  const [internships, setInternships] = useState<InternshipOpportunity[]>([]);

  // Resume Builder State
  const [resumeName, setResumeName] = useState(user?.full_name || 'Aarav Sharma');
  const [resumeEmail, setResumeEmail] = useState(user?.email || 'aarav.sharma@unisphere.edu');
  const [resumePhone, setResumePhone] = useState('+91 98765 43210');
  const [resumeSummary, setResumeSummary] = useState(
    'Passionate Computer Science student with hands-on expertise in Cloud Computing, Distributed Systems, React, Docker, and PyTorch. Ranked in top 5% of department with CGPA 8.85.'
  );
  const [resumeSkills, setResumeSkills] = useState('TypeScript, React, Node.js, Python, PostgreSQL, Docker, Kubernetes, AWS');
  const [resumeProjects, setResumeProjects] = useState('1. UniSphere Campus Portal: Full-stack educational management system.\n2. CIFAR-10 Neural Classifier: Deep CNN with 89% validation accuracy.');

  useEffect(() => {
    dataService.getPlacements().then(setPlacements);
    dataService.getInternships().then(setInternships);
  }, []);

  const handleApplyPlacement = async (id: string, company: string) => {
    await dataService.applyPlacement(id);
    setPlacements(await dataService.getPlacements());
    alert(`Application submitted successfully for ${company} campus drive!`);
  };

  const handleApplyInternship = async (id: string, company: string) => {
    await dataService.applyInternship(id);
    setInternships(await dataService.getInternships());
    alert(`Application submitted successfully for ${company} summer internship!`);
  };

  const handleExportResumePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 27, 75);
    doc.text(resumeName, 105, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${resumeEmail} • ${resumePhone} • Bengaluru, India`, 105, 28, { align: 'center' });

    // Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text('PROFESSIONAL SUMMARY', 14, 42);
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 44, 196, 44);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const splitSummary = doc.splitTextToSize(resumeSummary, 180);
    doc.text(splitSummary, 14, 52);

    // Education
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text('EDUCATION', 14, 76);
    doc.line(14, 78, 196, 78);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('B.Tech in Computer Science & Engineering (2022 - 2026)', 14, 86);
    doc.setFont('helvetica', 'normal');
    doc.text('UniSphere Autonomous Institute of Technology • CGPA: 8.85 / 10.0', 14, 92);

    // Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text('TECHNICAL SKILLS', 14, 106);
    doc.line(14, 108, 196, 108);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(resumeSkills, 14, 116);

    // Projects
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text('FEATURED PROJECTS', 14, 132);
    doc.line(14, 134, 196, 134);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const splitProjects = doc.splitTextToSize(resumeProjects, 180);
    doc.text(splitProjects, 14, 142);

    doc.save(`${resumeName.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Career, Placements & Resume
            </h1>
            <Badge variant="brand">2026 Batch</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Top campus recruitment drives, summer internship opportunities, and real-time PDF resume generator
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportResumePDF}
        >
          Export Resume PDF
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'placements', label: 'Full-Time Placements', count: placements.length },
          { id: 'internships', label: 'Internships & Stipends', count: internships.length },
          { id: 'resume', label: 'Interactive Resume Builder', count: 'PDF' },
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

      {/* Tab 1: Placements */}
      {activeTab === 'placements' && (
        <div className="space-y-4">
          {placements.map((plc) => (
            <Card key={plc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {plc.company_name}
                  </span>
                  <Badge variant="success">CTC: ₹{plc.package_lpa} LPA</Badge>
                  <span className="text-xs text-slate-400">Min CGPA: {plc.eligibility_cgpa}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {plc.role_title}
                </h3>
                <p className="text-xs text-slate-500 max-w-2xl">{plc.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {plc.location}
                  </span>
                  <span>•</span>
                  <span>Drive Date: {plc.drive_date}</span>
                </div>
              </div>

              <div className="shrink-0">
                {plc.has_applied ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApplyPlacement(plc.id, plc.company_name)}
                  >
                    1-Click Apply
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Internships */}
      {activeTab === 'internships' && (
        <div className="space-y-4">
          {internships.map((int) => (
            <Card key={int.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {int.company_name}
                  </span>
                  <Badge variant="brand">Stipend: ₹{int.stipend_monthly.toLocaleString()}/mo</Badge>
                  <span className="text-xs text-slate-400">Duration: {int.duration_months} Months</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {int.role_title}
                </h3>
                <p className="text-xs text-slate-500 max-w-2xl">{int.description}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Location: {int.location} • Application Deadline: {new Date(int.deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="shrink-0">
                {int.has_applied ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApplyInternship(int.id, int.company_name)}
                  >
                    Apply for Internship
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Resume Builder */}
      {activeTab === 'resume' && (
        <Card className="p-6 max-w-3xl mx-auto space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Interactive Resume Builder
            </h3>
            <p className="text-xs text-slate-500">
              Edit your details below and click 'Export Resume PDF' to generate an ATS-friendly single-page PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College Email
              </label>
              <input
                type="email"
                value={resumeEmail}
                onChange={(e) => setResumeEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Professional Summary
            </label>
            <textarea
              rows={3}
              value={resumeSummary}
              onChange={(e) => setResumeSummary(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Technical Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={resumeSkills}
              onChange={(e) => setResumeSkills(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Projects & Achievements
            </label>
            <textarea
              rows={3}
              value={resumeProjects}
              onChange={(e) => setResumeProjects(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              variant="primary"
              size="md"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportResumePDF}
            >
              Export Downloadable PDF Resume
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
