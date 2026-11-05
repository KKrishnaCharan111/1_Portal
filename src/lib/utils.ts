import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jsPDF } from 'jspdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate Printable PDF Hall Ticket
export function generateHallTicketPDF(data: {
  studentName: string;
  usn: string;
  semester: number;
  department: string;
  ticketNumber: string;
  examTitle: string;
  subjects: { code: string; name: string; date: string; session: string }[];
}) {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(30, 27, 75); // Dark Indigo
  doc.rect(0, 0, 210, 36, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('UNISPHERE CAMPUS OF TECHNOLOGY', 105, 16, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL EXAMINATION ADMIT CARD / HALL TICKET', 105, 26, { align: 'center' });

  // Student Info Box
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 45, 182, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.text(`Candidate Name: ${data.studentName}`, 20, 55);
  doc.text(`USN: ${data.usn}`, 120, 55);

  doc.text(`Department: ${data.department}`, 20, 65);
  doc.text(`Semester: ${data.semester}`, 120, 65);

  doc.text(`Hall Ticket No: ${data.ticketNumber}`, 20, 75);
  doc.text(`Examination: ${data.examTitle}`, 120, 75);

  // Table Header
  let y = 100;
  doc.setFillColor(79, 70, 229);
  doc.rect(14, y, 182, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Sub Code', 18, y + 6);
  doc.text('Subject Title', 50, y + 6);
  doc.text('Exam Date', 130, y + 6);
  doc.text('Session', 170, y + 6);

  // Table Rows
  y += 9;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  data.subjects.forEach((sub, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 9, 'F');
    }
    doc.text(sub.code, 18, y + 6);
    doc.text(sub.name, 50, y + 6);
    doc.text(sub.date, 130, y + 6);
    doc.text(sub.session, 170, y + 6);
    y += 9;
  });

  // Instructions & Signatures
  y = 175;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Important Instructions:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('1. Candidates must carry this admit card along with their official UniSphere Digital/Physical Student ID.', 14, y + 7);
  doc.text('2. Mobile phones, smartwatches, and programmable calculators are strictly prohibited in the exam hall.', 14, y + 13);
  doc.text('3. Candidates should report to the examination center at least 20 minutes prior to session commencement.', 14, y + 19);

  // Signatures
  y = 235;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, y, 70, y);
  doc.line(140, y, 190, y);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Candidate Signature', 28, y + 6);
  doc.text('Controller of Examinations', 142, y + 6);

  // Download
  doc.save(`HallTicket_${data.usn}_${data.ticketNumber}.pdf`);
}

// Generate Printable Fee Receipt PDF
export function generateFeeReceiptPDF(data: {
  receiptNo: string;
  studentName: string;
  usn: string;
  semester: number;
  department: string;
  amount: number;
  date: string;
  paymentMethod: string;
  transactionId: string;
}) {
  const doc = new jsPDF();

  doc.setFillColor(16, 185, 129); // Emerald Green
  doc.rect(0, 0, 210, 36, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('UNISPHERE CAMPUS - FEE RECEIPT', 105, 17, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ACCOUNTS & FINANCE DEPARTMENT', 105, 27, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 45, 182, 90, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt Number: ${data.receiptNo}`, 22, 58);
  doc.text(`Date of Issue: ${data.date}`, 120, 58);

  doc.text(`Student Name: ${data.studentName}`, 22, 70);
  doc.text(`USN / ID: ${data.usn}`, 120, 70);

  doc.text(`Department: ${data.department}`, 22, 82);
  doc.text(`Semester: Semester ${data.semester}`, 120, 82);

  doc.text(`Payment Mode: ${data.paymentMethod}`, 22, 94);
  doc.text(`Transaction Ref: ${data.transactionId}`, 120, 94);

  doc.setFillColor(236, 253, 245);
  doc.roundedRect(22, 105, 166, 22, 2, 2, 'FD');
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(13);
  doc.text(`TOTAL AMOUNT PAID: ₹${data.amount.toLocaleString('en-IN')}`, 30, 119);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('* This is a computer-generated digital receipt and does not require physical signature.', 105, 155, { align: 'center' });

  doc.save(`Receipt_${data.receiptNo}.pdf`);
}
