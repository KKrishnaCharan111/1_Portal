import { describe, it, expect } from 'vitest';
import { dataService, demoStore } from '../lib/dataService';

describe('Secure QR Attendance Verification', () => {
  it('loads active attendance sessions for lecture halls', async () => {
    const sessions = await dataService.getActiveAttendanceSessions();
    expect(sessions.length).toBeGreaterThan(0);
    const active = sessions[0];
    expect(active.subject_name).toBeDefined();
    expect(active.token_salt).toBeDefined();
  });

  it('records attendance and prevents duplicates on the same session', async () => {
    const targetSession = demoStore.attendanceSessions[0];
    
    // Attempt duplicate scan for existing student
    const result = await dataService.recordAttendance({
      sessionId: targetSession.id,
      studentId: 'b0000000-0000-0000-0000-000000000001',
      studentName: 'Aarav Sharma',
      studentUsn: '1US22CS042',
      subjectId: targetSession.subject_id,
      subjectName: targetSession.subject_name || 'Cloud Computing',
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('already recorded');
  });

  it('allows new student attendance and records audit trail', async () => {
    const targetSession = demoStore.attendanceSessions[0];
    const newStudentId = `test_student_${Date.now()}`;

    const result = await dataService.recordAttendance({
      sessionId: targetSession.id,
      studentId: newStudentId,
      studentName: 'Test Student',
      studentUsn: '1US22CS099',
      subjectId: targetSession.subject_id,
      subjectName: targetSession.subject_name || 'Cloud Computing',
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('verified');

    // Verify audit log
    const logs = await dataService.getAuditLogs();
    const log = logs.find((l) => l.user_name === 'Test Student');
    expect(log).toBeDefined();
    expect(log?.action).toBe('QR_ATTENDANCE_RECORDED');
  });
});
