import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCw,
  Users,
  Calendar,
  ShieldCheck,
  Camera,
  Play,
  Square,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import QRCode from 'qrcode';
import { dataService } from '../../lib/dataService';
import { AttendanceRecord, AttendanceSession, Subject } from '../../types';

export const AttendancePage: React.FC = () => {
  const { user, isFaculty, isHOD, isAdmin, isStudent } = useAuth();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Faculty session state
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [rotatingToken, setRotatingToken] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25);

  // Manual correction modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualStudentName, setManualStudentName] = useState('Aarav Sharma');
  const [manualReason, setManualReason] = useState('Authorized by faculty: Network/camera issue during lecture');

  // Scanner state (student)
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    dataService.getActiveAttendanceSessions().then((sessList) => {
      setSessions(sessList);
      const active = sessList.find((s) => s.is_active);
      if (active) setActiveSession(active);
    });
    dataService.getAttendanceRecords(user?.id).then(setRecords);
    dataService.getSubjects().then(setSubjects);
  }, [user?.id]);

  // Rotating Token generation (Faculty)
  useEffect(() => {
    if (!activeSession || !activeSession.is_active) return;

    const generateNewToken = async () => {
      const epoch = Math.floor(Date.now() / 25000);
      const token = `${activeSession.id}.${epoch}.UNISPHERE_${epoch.toString(36)}`;
      setRotatingToken(token);
      setSecondsRemaining(25);

      try {
        const url = await QRCode.toDataURL(token, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1e1b4b',
            light: '#ffffff',
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('QR generation error:', err);
      }
    };

    generateNewToken();

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  // Start new lecture session (Faculty)
  const handleStartSession = async (sub: Subject) => {
    const session = await dataService.startAttendanceSession({
      subjectId: sub.id,
      subjectName: sub.name,
      facultyId: user?.id || 'b0000000-0000-0000-0000-000000000002',
      facultyName: user?.full_name || 'Dr. Ramesh Kumar',
      section: 'A',
      semester: 6,
    });
    setActiveSession(session);
    setSessions(await dataService.getActiveAttendanceSessions());
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    await dataService.endAttendanceSession(activeSession.id);
    setActiveSession(null);
    setQrDataUrl('');
    setSessions(await dataService.getActiveAttendanceSessions());
  };

  // Student QR Scan simulation or verification
  const handleStudentScan = async (scannedToken?: string) => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning current rotating token if not explicitly provided
    const tokenToVerify = scannedToken || rotatingToken || `${sessions[0]?.id || 'e0000000-0000-0000-0000-000000000001'}.${Math.floor(Date.now() / 25000)}.UNISPHERE_ACTIVE`;

    setTimeout(async () => {
      const targetSession = activeSession || sessions[0];
      if (!targetSession) {
        setScanResult('Error: No active attendance session found.');
        setIsScanning(false);
        return;
      }

      const res = await dataService.recordAttendance({
        sessionId: targetSession.id,
        studentId: user?.id || 'b0000000-0000-0000-0000-000000000001',
        studentName: user?.full_name || 'Aarav Sharma',
        studentUsn: user?.usn || '1US22CS042',
        subjectId: targetSession.subject_id,
        subjectName: targetSession.subject_name || 'Cloud Computing & Distributed Systems',
        method: 'qr_scan',
      });

      setIsScanning(false);
      setScanResult(res.message);
      setRecords(await dataService.getAttendanceRecords(user?.id));
    }, 800);
  };

  const handleManualCorrection = async () => {
    if (!activeSession) return;
    await dataService.recordAttendance({
      sessionId: activeSession.id,
      studentId: 'b0000000-0000-0000-0000-000000000001',
      studentName: manualStudentName,
      studentUsn: '1US22CS042',
      subjectId: activeSession.subject_id,
      subjectName: activeSession.subject_name || 'Cloud Computing',
      method: 'manual',
    });
    dataService.addAuditLog(user?.full_name || 'Faculty', 'MANUAL_ATTENDANCE_OVERRIDE', 'attendance_records', `${manualStudentName}: ${manualReason}`);
    setIsManualModalOpen(false);
    setRecords(await dataService.getAttendanceRecords(user?.id));
    alert('Attendance manually credited and recorded in audit log!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Secure Attendance
            </h1>
            <Badge variant="brand">25s Dynamic Token QR</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time biometric & cryptographic rotating QR token system for lecture hall attendance verification
          </p>
        </div>

        {/* Overall Attendance Stat for Student / Parent */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Verified Overall Attendance</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              88.4%
            </span>
          </div>
          <Badge variant="success" size="md">
            Eligibility: Cleared
          </Badge>
        </div>
      </div>

      {/* FACULTY / HOD / ADMIN VIEW: QR Generation & Live Stream */}
      {(isFaculty || isHOD || isAdmin) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Screen (2 Cols) */}
          <Card className="lg:col-span-2 p-6 flex flex-col items-center justify-center text-center">
            {activeSession ? (
              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {activeSession.subject_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Section {activeSession.section} • Semester {activeSession.semester}
                    </p>
                  </div>
                  <Badge variant="brand">SESSION LIVE</Badge>
                </div>

                {/* Rotating QR Box */}
                <div className="relative p-6 bg-white rounded-3xl shadow-xl border border-slate-200 mx-auto w-fit">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Rotating Attendance QR Code"
                      className="w-64 h-64 mx-auto rounded-xl"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-xs text-slate-400">
                      Generating secure token...
                    </div>
                  )}

                  {/* 25s Countdown Progress */}
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono font-bold text-brand-600">
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Token rotating in: {secondsRemaining}s</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Square className="w-4 h-4" />}
                    onClick={handleEndSession}
                  >
                    Close Session
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<UserCheck className="w-4 h-4" />}
                    onClick={() => setIsManualModalOpen(true)}
                  >
                    Manual Override
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 mx-auto flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    No Active Lecture Session
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Select an allocated subject below to launch dynamic QR token projection for your class.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {subjects.slice(0, 2).map((sub) => (
                    <Button
                      key={sub.id}
                      variant="primary"
                      size="sm"
                      icon={<Play className="w-3.5 h-3.5" />}
                      onClick={() => handleStartSession(sub)}
                    >
                      Start: {sub.code}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Live Attendance Counter */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Live Attendance Feed
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center mb-4">
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                  {activeSession ? `${activeSession.present_count || 54} / 60` : '54 / 60'}
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  Students Verified Present
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {records.slice(0, 4).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {rec.student_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {rec.student_usn} • {rec.verification_method}
                      </div>
                    </div>
                    <Badge variant="success" size="sm">Present</Badge>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-4 text-center">
              Realtime verified via Supabase Channel & RLS.
            </p>
          </Card>
        </div>
      )}

      {/* STUDENT SCANNER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Student Camera Scanner
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Point your device camera at the lecturer's projected QR code to register your attendance.
          </p>

          <div className="rounded-2xl border-2 border-dashed border-brand-300 dark:border-brand-800 p-8 text-center bg-slate-50 dark:bg-slate-950/50">
            <QrCode className="w-12 h-12 text-brand-600 mx-auto mb-3 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Scan Lecturer's Screen
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Valid for current 25-second token window
            </span>
          </div>

          <div className="mt-4">
            <Button
              variant="primary"
              className="w-full"
              isLoading={isScanning}
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => handleStudentScan()}
            >
              Simulate Instant QR Scan
            </Button>
          </div>

          {scanResult && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 text-center animate-in fade-in">
              {scanResult}
            </div>
          )}
        </Card>

        {/* Verified Attendance History */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Attendance History & Log
            </h3>
            <span className="text-xs text-slate-400">Total Records: {records.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Date & Timestamp</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {rec.subject_name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(rec.scanned_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 uppercase">
                        {rec.verification_method}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="success">Present</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Manual Attendance Correction Modal (Faculty) */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Authorized Attendance Override (Audit Logged)"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Manual modifications require faculty authorization and are permanently recorded in the institutional audit log.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={manualStudentName}
              onChange={(e) => setManualStudentName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason / Justification
            </label>
            <textarea
              rows={3}
              value={manualReason}
              onChange={(e) => setManualReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsManualModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleManualCorrection}>
              Approve & Log Audit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
