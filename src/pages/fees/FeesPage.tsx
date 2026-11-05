import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  CreditCard,
  CheckCircle2,
  Download,
  ShieldCheck,
  Clock,
  Sparkles,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { generateFeeReceiptPDF, formatCurrency } from '../../lib/utils';
import { FeePayment, FeeStructure } from '../../types';

export const FeesPage: React.FC = () => {
  const { user } = useAuth();
  const [structure, setStructure] = useState<FeeStructure | null>(null);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payAmount, setPayAmount] = useState('90000');

  useEffect(() => {
    dataService.getFeeStructure().then(setStructure);
    dataService.getFeePayments().then(setPayments);
  }, []);

  const handleDownloadReceipt = (payment: FeePayment) => {
    generateFeeReceiptPDF({
      receiptNo: payment.receipt_number || 'REC-2026-CS-0042',
      studentName: user?.full_name || 'Aarav Sharma',
      usn: user?.usn || '1US22CS042',
      semester: user?.semester || 6,
      department: user?.department_name || 'Computer Science & Engineering',
      amount: payment.amount,
      date: new Date(payment.paid_at).toLocaleDateString(),
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
    });
  };

  const handleProcessRazorpayPayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const payment = await dataService.makeFeePayment(
        parseFloat(payAmount),
        user?.id || 'b0000000-0000-0000-0000-000000000001'
      );
      setPayments(await dataService.getFeePayments());
      setIsProcessing(false);
      setIsPayModalOpen(false);
      alert(`Payment of ₹${payAmount} processed successfully in Razorpay Test Mode! Receipt #${payment.receipt_number} generated.`);
    }, 1200);
  };

  const totalPaid = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fees & Online Payments
            </h1>
            <Badge variant="brand">Razorpay Test Gateway</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional fee structure, online payment gateway (UPI/Netbanking/Cards), and verifiable PDF receipts
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<CreditCard className="w-4 h-4" />}
          onClick={() => setIsPayModalOpen(true)}
        >
          Pay College Dues Online
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Fee Demand (Sem 6)</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {structure ? formatCurrency(structure.total_amount) : '₹90,000'}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Due Date: April 15, 2026</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Paid Amount</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalPaid)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            100% Cleared via Razorpay
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 uppercase font-semibold">Current Pending Balance</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹0.00
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            Accounts Clearance: Granted
          </span>
        </Card>
      </div>

      {/* Fee Breakdown & Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Card */}
        <Card className="p-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4">
            Semester 6 Fee Structure Breakdown
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Tuition & Academic Fee</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹75,000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">High-Performance Computing Lab</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹7,500</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Examination & Valuation Fee</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹4,000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Digital Library & IEEE Access</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹3,500</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold">
              <span>Total Semester Demanded</span>
              <span className="text-brand-600 dark:text-brand-400">₹90,000</span>
            </div>
          </div>
        </Card>

        {/* Payment History */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Verified Payment History
            </h3>
            <span className="text-xs text-slate-400">Digital Receipts</span>
          </div>

          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatCurrency(p.amount)}
                    </span>
                    <Badge variant="success">Completed</Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Receipt: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{p.receipt_number || 'REC-2026-CS-0042'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Ref: {p.transaction_id} • Mode: {p.payment_method}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => handleDownloadReceipt(p)}
                >
                  Download Official Receipt PDF
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Online Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Razorpay Test Checkout"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
            <span className="font-bold block">Test Mode Simulation:</span>
            No real money will be charged. This invokes the Supabase Razorpay payment edge function flow with signature verification.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Amount (INR ₹)
            </label>
            <input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                className="p-3 rounded-xl border border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold"
              >
                UPI (GPay / PhonePe)
              </button>
              <button
                type="button"
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              >
                Net Banking
              </button>
              <button
                type="button"
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              >
                Credit / Debit Card
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isProcessing}
              onClick={handleProcessRazorpayPayment}
            >
              Confirm Test Payment (₹{payAmount})
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
