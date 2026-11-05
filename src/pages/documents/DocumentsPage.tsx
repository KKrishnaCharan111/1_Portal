import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { DocumentRequest } from '../../types';

export const DocumentsPage: React.FC = () => {
  const { user, isHOD, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [docType, setDocType] = useState('Bonafide Certificate');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    dataService.getDocuments().then(setDocuments);
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose) return;
    await dataService.requestDocument(
      docType,
      purpose,
      user?.full_name || 'Aarav Sharma',
      user?.usn || '1US22CS042'
    );
    setDocuments(await dataService.getDocuments());
    setIsRequestModalOpen(false);
    setPurpose('');
    alert(`Your request for ${docType} has been submitted to the academic office!`);
  };

  const handleApprove = async (id: string) => {
    await dataService.updateDocumentStatus(id, 'approved', 'Digitally signed and sealed by Registrar.');
    setDocuments(await dataService.getDocuments());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Official Document Requests
            </h1>
            <Badge variant="brand">Registrar Services</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Request verified Bonafide certificates, official transcripts, and No Objection Certificates (NOC)
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsRequestModalOpen(true)}
        >
          Request New Certificate
        </Button>
      </div>

      {/* Document Pipeline Grid */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    doc.status === 'approved'
                      ? 'success'
                      : doc.status === 'in_progress'
                      ? 'brand'
                      : 'warning'
                  }
                >
                  {doc.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  Ref: {doc.id}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {doc.document_type}
              </h3>
              <p className="text-xs text-slate-500">
                Purpose: {doc.purpose}
              </p>
              {doc.remarks && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  Remark: {doc.remarks}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {doc.status === 'approved' ? (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => alert(`Downloading signed digital ${doc.document_type} for ${doc.student_name}`)}
                >
                  Download Signed PDF
                </Button>
              ) : (isHOD || isAdmin) ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(doc.id)}
                >
                  Authorize Certificate
                </Button>
              ) : (
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-amber-500 animate-spin" /> In Registrar Review
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Apply for Academic Certificate"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Type
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Bonafide Certificate">Bonafide Certificate</option>
              <option value="Official Academic Transcript">Official Academic Transcript (Sem 1-5)</option>
              <option value="No Objection Certificate (NOC)">No Objection Certificate (NOC for Internships)</option>
              <option value="Medium of Instruction Certificate">Medium of Instruction (English)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose / Reason
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Visa application for international exchange / Bank education loan subsidy"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
