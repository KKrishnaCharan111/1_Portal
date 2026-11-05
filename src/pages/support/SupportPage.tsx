import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Shield,
} from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { HelpTicket } from '../../types';

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [category, setCategory] = useState('Campus IT / Wi-Fi');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  useEffect(() => {
    dataService.getTickets().then(setTickets);
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    await dataService.createTicket({
      user_id: user?.id || 'b0000000-0000-0000-0000-000000000001',
      user_name: user?.full_name || 'Aarav Sharma',
      category,
      subject,
      description,
      priority,
    });
    setTickets(await dataService.getTickets());
    setIsTicketModalOpen(false);
    setSubject('');
    setDescription('');
    alert('Support ticket submitted successfully! Ticket ID assigned.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Helpdesk & Campus Support
            </h1>
            <Badge variant="brand">24/7 Academic & IT Desk</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit IT issues, hostel maintenance requests, academic doubts, and track resolution timelines
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsTicketModalOpen(true)}
        >
          Create Support Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((tkt) => (
          <Card key={tkt.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    tkt.status === 'resolved'
                      ? 'success'
                      : tkt.status === 'in_progress'
                      ? 'brand'
                      : 'warning'
                  }
                >
                  {tkt.status.toUpperCase()}
                </Badge>
                <Badge variant="neutral">{tkt.category}</Badge>
                <span className="text-xs text-slate-400">Priority: {tkt.priority}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {tkt.subject}
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl">{tkt.description}</p>
              <div className="text-[11px] text-slate-400 pt-1">
                Submitted by {tkt.user_name} on {new Date(tkt.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="shrink-0 text-right">
              {tkt.status === 'resolved' ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Resolved
                </span>
              ) : (
                <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Assigned to IT Engineer
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Create New Helpdesk Ticket"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Campus IT / Wi-Fi">Campus IT / Wi-Fi Connectivity</option>
              <option value="Academic Inquiry">Academic / Examination Inquiry</option>
              <option value="Hostel Maintenance">Hostel & Accommodation</option>
              <option value="Accounts & Fees">Accounts & Fee Receipts</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wi-Fi Access Point unreachable in Block B"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the issue in detail, including location, room number, or error messages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsTicketModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
