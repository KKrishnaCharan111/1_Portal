import {
  UserProfile,
  Department,
  Subject,
  TimetableSlot,
  AttendanceRecord,
  AttendanceSession,
  Assignment,
  NoteItem,
  QuestionBankItem,
  InternalMark,
  ExamItem,
  ExamResult,
  HallTicket,
  FeePayment,
  LibraryBook,
  LibraryLoan,
  CampusEvent,
  Club,
  CommunityPost,
  Message,
  Announcement,
  NotificationItem,
  PlacementOpportunity,
  InternshipOpportunity,
  DocumentRequest,
  HelpTicket,
  LeaveRequest,
  AuditLogItem,
} from '../types';
import {
  DEMO_PROFILES,
  INITIAL_DEPARTMENTS,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTES,
  INITIAL_QUESTION_BANK,
  INITIAL_INTERNAL_MARKS,
  INITIAL_EXAMS,
  INITIAL_EXAM_RESULTS,
  INITIAL_HALL_TICKETS,
  INITIAL_FEE_STRUCTURE,
  INITIAL_FEE_PAYMENTS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_LIBRARY_LOANS,
  INITIAL_EVENTS,
  INITIAL_CLUBS,
  INITIAL_POSTS,
  INITIAL_MESSAGES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLACEMENTS,
  INITIAL_INTERNSHIPS,
  INITIAL_DOCUMENTS,
  INITIAL_TICKETS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_AUDIT_LOGS,
} from './demoData';
import { supabase, isSupabaseConfigured } from './supabase';

// Persistent Local Demo Store
class DemoStorage {
  private mem = new Map<string, any>();

  private get<T>(key: string, fallback: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(`unisphere_${key}`);
        if (item) return JSON.parse(item);
      }
    } catch {
      // fall through
    }
    return this.mem.has(key) ? this.mem.get(key) : fallback;
  }

  private set<T>(key: string, value: T): void {
    this.mem.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`unisphere_${key}`, JSON.stringify(value));
      }
    } catch {
      // ignore in test / headless mode
    }
  }

  get attendanceSessions(): AttendanceSession[] {
    return this.get('attendance_sessions', INITIAL_ATTENDANCE_SESSIONS);
  }
  set attendanceSessions(val: AttendanceSession[]) {
    this.set('attendance_sessions', val);
  }

  get attendanceRecords(): AttendanceRecord[] {
    return this.get('attendance_records', INITIAL_ATTENDANCE_RECORDS);
  }
  set attendanceRecords(val: AttendanceRecord[]) {
    this.set('attendance_records', val);
  }

  get assignments(): Assignment[] {
    return this.get('assignments', INITIAL_ASSIGNMENTS);
  }
  set assignments(val: Assignment[]) {
    this.set('assignments', val);
  }

  get notes(): NoteItem[] {
    return this.get('notes', INITIAL_NOTES);
  }
  set notes(val: NoteItem[]) {
    this.set('notes', val);
  }

  get feePayments(): FeePayment[] {
    return this.get('fee_payments', INITIAL_FEE_PAYMENTS);
  }
  set feePayments(val: FeePayment[]) {
    this.set('fee_payments', val);
  }

  get libraryBooks(): LibraryBook[] {
    return this.get('library_books', INITIAL_LIBRARY_BOOKS);
  }
  set libraryBooks(val: LibraryBook[]) {
    this.set('library_books', val);
  }

  get libraryLoans(): LibraryLoan[] {
    return this.get('library_loans', INITIAL_LIBRARY_LOANS);
  }
  set libraryLoans(val: LibraryLoan[]) {
    this.set('library_loans', val);
  }

  get events(): CampusEvent[] {
    return this.get('events', INITIAL_EVENTS);
  }
  set events(val: CampusEvent[]) {
    this.set('events', val);
  }

  get clubs(): Club[] {
    return this.get('clubs', INITIAL_CLUBS);
  }
  set clubs(val: Club[]) {
    this.set('clubs', val);
  }

  get posts(): CommunityPost[] {
    return this.get('posts', INITIAL_POSTS);
  }
  set posts(val: CommunityPost[]) {
    this.set('posts', val);
  }

  get messages(): Message[] {
    return this.get('messages', INITIAL_MESSAGES);
  }
  set messages(val: Message[]) {
    this.set('messages', val);
  }

  get announcements(): Announcement[] {
    return this.get('announcements', INITIAL_ANNOUNCEMENTS);
  }
  set announcements(val: Announcement[]) {
    this.set('announcements', val);
  }

  get notifications(): NotificationItem[] {
    return this.get('notifications', INITIAL_NOTIFICATIONS);
  }
  set notifications(val: NotificationItem[]) {
    this.set('notifications', val);
  }

  get placements(): PlacementOpportunity[] {
    return this.get('placements', INITIAL_PLACEMENTS);
  }
  set placements(val: PlacementOpportunity[]) {
    this.set('placements', val);
  }

  get internships(): InternshipOpportunity[] {
    return this.get('internships', INITIAL_INTERNSHIPS);
  }
  set internships(val: InternshipOpportunity[]) {
    this.set('internships', val);
  }

  get documents(): DocumentRequest[] {
    return this.get('documents', INITIAL_DOCUMENTS);
  }
  set documents(val: DocumentRequest[]) {
    this.set('documents', val);
  }

  get tickets(): HelpTicket[] {
    return this.get('tickets', INITIAL_TICKETS);
  }
  set tickets(val: HelpTicket[]) {
    this.set('tickets', val);
  }

  get leaveRequests(): LeaveRequest[] {
    return this.get('leave_requests', INITIAL_LEAVE_REQUESTS);
  }
  set leaveRequests(val: LeaveRequest[]) {
    this.set('leave_requests', val);
  }

  get internalMarks(): InternalMark[] {
    return this.get('internal_marks', INITIAL_INTERNAL_MARKS);
  }
  set internalMarks(val: InternalMark[]) {
    this.set('internal_marks', val);
  }

  get auditLogs(): AuditLogItem[] {
    return this.get('audit_logs', INITIAL_AUDIT_LOGS);
  }
  set auditLogs(val: AuditLogItem[]) {
    this.set('audit_logs', val);
  }

  resetDemo(): void {
    const keys = [
      'attendance_sessions',
      'attendance_records',
      'assignments',
      'notes',
      'fee_payments',
      'library_books',
      'library_loans',
      'events',
      'clubs',
      'posts',
      'messages',
      'announcements',
      'notifications',
      'placements',
      'internships',
      'documents',
      'tickets',
      'leave_requests',
      'internal_marks',
      'audit_logs',
    ];
    keys.forEach((k) => localStorage.removeItem(`unisphere_${k}`));
  }
}

export const demoStore = new DemoStorage();

// Data Service API
export const dataService = {
  // Profiles
  async getProfile(email: string): Promise<UserProfile> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, departments(name)')
        .eq('email', email)
        .single();
      if (!error && data) {
        return {
          ...data,
          department_name: data.departments?.name,
        };
      }
    }
    return DEMO_PROFILES[email] || DEMO_PROFILES['student@demo.unisphere'];
  },

  // Attendance
  async getAttendanceRecords(studentId?: string): Promise<AttendanceRecord[]> {
    if (isSupabaseConfigured() && supabase && studentId) {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*, subjects(name)')
        .eq('student_id', studentId);
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          subject_name: d.subjects?.name,
        }));
      }
    }
    return demoStore.attendanceRecords;
  },

  async getActiveAttendanceSessions(): Promise<AttendanceSession[]> {
    return demoStore.attendanceSessions;
  },

  async startAttendanceSession(params: {
    subjectId: string;
    subjectName: string;
    facultyId: string;
    facultyName: string;
    section: string;
    semester: number;
  }): Promise<AttendanceSession> {
    const newSession: AttendanceSession = {
      id: `session_${Date.now()}`,
      subject_id: params.subjectId,
      subject_name: params.subjectName,
      faculty_id: params.facultyId,
      faculty_name: params.facultyName,
      section: params.section,
      semester: params.semester,
      date: new Date().toISOString().split('T')[0],
      start_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      token_salt: `SALT_${Date.now().toString(36)}`,
      is_active: true,
      present_count: 0,
      total_students: 60,
    };
    const current = demoStore.attendanceSessions;
    demoStore.attendanceSessions = [newSession, ...current];

    // Log to audit
    this.addAuditLog(params.facultyName, 'STARTED_QR_ATTENDANCE_SESSION', 'attendance_sessions', `Session for ${params.subjectName}`);
    return newSession;
  },

  async endAttendanceSession(sessionId: string): Promise<void> {
    const sessions = demoStore.attendanceSessions.map((s) =>
      s.id === sessionId ? { ...s, is_active: false } : s
    );
    demoStore.attendanceSessions = sessions;
  },

  async recordAttendance(params: {
    sessionId: string;
    studentId: string;
    studentName: string;
    studentUsn: string;
    subjectId: string;
    subjectName: string;
    method?: 'qr_scan' | 'manual';
  }): Promise<{ success: boolean; message: string }> {
    const records = demoStore.attendanceRecords;
    const exists = records.some(
      (r) => r.session_id === params.sessionId && r.student_id === params.studentId
    );

    if (exists) {
      return { success: false, message: 'Attendance already recorded for this lecture!' };
    }

    const newRecord: AttendanceRecord = {
      id: `rec_${Date.now()}`,
      session_id: params.sessionId,
      student_id: params.studentId,
      student_name: params.studentName,
      student_usn: params.studentUsn,
      subject_id: params.subjectId,
      subject_name: params.subjectName,
      status: 'present',
      verification_method: params.method || 'qr_scan',
      scanned_at: new Date().toISOString(),
      remarks: 'Verified via dynamic QR code',
    };

    demoStore.attendanceRecords = [newRecord, ...records];

    // Update session count
    const sessions = demoStore.attendanceSessions.map((s) =>
      s.id === params.sessionId ? { ...s, present_count: (s.present_count || 0) + 1 } : s
    );
    demoStore.attendanceSessions = sessions;

    this.addAuditLog(params.studentName, 'QR_ATTENDANCE_RECORDED', 'attendance_records', `Marked present in ${params.subjectName}`);
    return { success: true, message: `Attendance verified & marked present for ${params.subjectName}!` };
  },

  // Timetable & Academics
  async getTimetable(): Promise<TimetableSlot[]> {
    return INITIAL_TIMETABLE;
  },

  async getSubjects(): Promise<Subject[]> {
    return INITIAL_SUBJECTS;
  },

  async getDepartments(): Promise<Department[]> {
    return INITIAL_DEPARTMENTS;
  },

  async getNotes(): Promise<NoteItem[]> {
    return demoStore.notes;
  },

  async uploadNote(note: Omit<NoteItem, 'id' | 'created_at'>): Promise<NoteItem> {
    const newNote: NoteItem = {
      ...note,
      id: `n_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    demoStore.notes = [newNote, ...demoStore.notes];
    return newNote;
  },

  async getQuestionBank(): Promise<QuestionBankItem[]> {
    return INITIAL_QUESTION_BANK;
  },

  async getAssignments(): Promise<Assignment[]> {
    return demoStore.assignments;
  },

  async submitAssignment(assignmentId: string): Promise<void> {
    const list = demoStore.assignments.map((a) =>
      a.id === assignmentId ? { ...a, submitted: true, status: 'submitted' as const } : a
    );
    demoStore.assignments = list;
  },

  async createAssignment(assignment: Omit<Assignment, 'id' | 'submitted' | 'status'>): Promise<Assignment> {
    const newAss: Assignment = {
      ...assignment,
      id: `ass_${Date.now()}`,
      submitted: false,
      status: 'pending',
    };
    demoStore.assignments = [newAss, ...demoStore.assignments];
    return newAss;
  },

  // Examinations & Marks
  async getExams(): Promise<ExamItem[]> {
    return INITIAL_EXAMS;
  },

  async getInternalMarks(): Promise<InternalMark[]> {
    return demoStore.internalMarks;
  },

  async saveInternalMark(mark: Omit<InternalMark, 'id'>): Promise<void> {
    const list = demoStore.internalMarks;
    const idx = list.findIndex(
      (m) => m.student_id === mark.student_id && m.subject_id === mark.subject_id && m.test_type === mark.test_type
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], obtained_marks: mark.obtained_marks, max_marks: mark.max_marks };
    } else {
      list.push({ ...mark, id: `ia_${Date.now()}` });
    }
    demoStore.internalMarks = [...list];
  },

  async getExamResults(): Promise<ExamResult[]> {
    return INITIAL_EXAM_RESULTS;
  },

  async getHallTickets(): Promise<HallTicket[]> {
    return INITIAL_HALL_TICKETS;
  },

  // Fees & Payments
  async getFeeStructure(): Promise<typeof INITIAL_FEE_STRUCTURE> {
    return INITIAL_FEE_STRUCTURE;
  },

  async getFeePayments(): Promise<FeePayment[]> {
    return demoStore.feePayments;
  },

  async makeFeePayment(amount: number, studentId: string): Promise<FeePayment> {
    const receiptNo = `REC-${new Date().getFullYear()}-CS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: FeePayment = {
      id: `pay_${Date.now()}`,
      student_id: studentId,
      amount,
      payment_method: 'Razorpay UPI (Test Mode)',
      transaction_id: `txn_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: 'completed',
      paid_at: new Date().toISOString(),
      receipt_number: receiptNo,
    };
    demoStore.feePayments = [newPayment, ...demoStore.feePayments];

    // Notification
    this.addNotification({
      title: 'Fee Payment Verified',
      message: `Your payment of ₹${amount.toLocaleString()} was successful. Receipt: ${receiptNo}`,
      type: 'fee',
      link: '#/fees',
    });

    return newPayment;
  },

  // Library
  async getLibraryBooks(): Promise<LibraryBook[]> {
    return demoStore.libraryBooks;
  },

  async getLibraryLoans(): Promise<LibraryLoan[]> {
    return demoStore.libraryLoans;
  },

  async borrowBook(book: LibraryBook, userId: string): Promise<void> {
    if (book.available_copies <= 0) return;
    const books = demoStore.libraryBooks.map((b) =>
      b.id === book.id ? { ...b, available_copies: b.available_copies - 1 } : b
    );
    demoStore.libraryBooks = books;

    const newLoan: LibraryLoan = {
      id: `loan_${Date.now()}`,
      book_id: book.id,
      book_title: book.title,
      book_author: book.author,
      user_id: userId,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      fine_amount: 0,
      status: 'borrowed',
    };
    demoStore.libraryLoans = [newLoan, ...demoStore.libraryLoans];
  },

  async returnBook(loanId: string, bookId: string): Promise<void> {
    const loans = demoStore.libraryLoans.map((l) =>
      l.id === loanId ? { ...l, status: 'returned' as const, return_date: new Date().toISOString().split('T')[0] } : l
    );
    demoStore.libraryLoans = loans;

    const books = demoStore.libraryBooks.map((b) =>
      b.id === bookId ? { ...b, available_copies: b.available_copies + 1 } : b
    );
    demoStore.libraryBooks = books;
  },

  // Campus Life
  async getEvents(): Promise<CampusEvent[]> {
    return demoStore.events;
  },

  async registerEvent(eventId: string): Promise<void> {
    const events = demoStore.events.map((e) =>
      e.id === eventId ? { ...e, registered: true } : e
    );
    demoStore.events = events;
  },

  async getClubs(): Promise<Club[]> {
    return demoStore.clubs;
  },

  async toggleJoinClub(clubId: string): Promise<void> {
    const clubs = demoStore.clubs.map((c) =>
      c.id === clubId
        ? {
            ...c,
            is_member: !c.is_member,
            member_count: c.is_member ? (c.member_count || 1) - 1 : (c.member_count || 0) + 1,
          }
        : c
    );
    demoStore.clubs = clubs;
  },

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return demoStore.posts;
  },

  async createCommunityPost(post: Omit<CommunityPost, 'id' | 'likes_count' | 'created_at' | 'liked'>): Promise<CommunityPost> {
    const newPost: CommunityPost = {
      ...post,
      id: `post_${Date.now()}`,
      likes_count: 0,
      created_at: new Date().toISOString(),
      liked: false,
    };
    demoStore.posts = [newPost, ...demoStore.posts];
    return newPost;
  },

  async toggleLikePost(postId: string): Promise<void> {
    const posts = demoStore.posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            liked: !p.liked,
            likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1,
          }
        : p
    );
    demoStore.posts = posts;
  },

  // Messages
  async getMessages(): Promise<Message[]> {
    return demoStore.messages;
  },

  async sendMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const newMsg: Message = {
      ...msg,
      id: `msg_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    demoStore.messages = [...demoStore.messages, newMsg];
    return newMsg;
  },

  // Announcements & Notifications
  async getAnnouncements(): Promise<Announcement[]> {
    return demoStore.announcements;
  },

  async createAnnouncement(anc: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> {
    const newAnc: Announcement = {
      ...anc,
      id: `anc_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    demoStore.announcements = [newAnc, ...demoStore.announcements];
    return newAnc;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    return demoStore.notifications;
  },

  async markNotificationRead(id: string): Promise<void> {
    const notifs = demoStore.notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    demoStore.notifications = notifs;
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'is_read' | 'created_at'>): void {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    demoStore.notifications = [newNotif, ...demoStore.notifications];
  },

  // Career
  async getPlacements(): Promise<PlacementOpportunity[]> {
    return demoStore.placements;
  },

  async applyPlacement(id: string): Promise<void> {
    const list = demoStore.placements.map((p) =>
      p.id === id ? { ...p, has_applied: true } : p
    );
    demoStore.placements = list;
  },

  async getInternships(): Promise<InternshipOpportunity[]> {
    return demoStore.internships;
  },

  async applyInternship(id: string): Promise<void> {
    const list = demoStore.internships.map((i) =>
      i.id === id ? { ...i, has_applied: true } : i
    );
    demoStore.internships = list;
  },

  // Documents
  async getDocuments(): Promise<DocumentRequest[]> {
    return demoStore.documents;
  },

  async requestDocument(type: string, purpose: string, studentName: string, studentUsn: string): Promise<DocumentRequest> {
    const newDoc: DocumentRequest = {
      id: `doc_${Date.now()}`,
      student_id: 'b0000000-0000-0000-0000-000000000001',
      student_name: studentName,
      student_usn: studentUsn,
      document_type: type,
      purpose,
      status: 'pending',
      requested_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoStore.documents = [newDoc, ...demoStore.documents];
    return newDoc;
  },

  async updateDocumentStatus(id: string, status: DocumentRequest['status'], remarks?: string): Promise<void> {
    const docs = demoStore.documents.map((d) =>
      d.id === id ? { ...d, status, remarks: remarks || d.remarks, updated_at: new Date().toISOString() } : d
    );
    demoStore.documents = docs;
  },

  // Help & Support
  async getTickets(): Promise<HelpTicket[]> {
    return demoStore.tickets;
  },

  async createTicket(t: Omit<HelpTicket, 'id' | 'created_at' | 'status'>): Promise<HelpTicket> {
    const newTicket: HelpTicket = {
      ...t,
      id: `tkt_${Date.now()}`,
      status: 'open',
      created_at: new Date().toISOString(),
    };
    demoStore.tickets = [newTicket, ...demoStore.tickets];
    return newTicket;
  },

  // Leave Requests
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return demoStore.leaveRequests;
  },

  async createLeaveRequest(req: Omit<LeaveRequest, 'id' | 'created_at' | 'status'>): Promise<LeaveRequest> {
    const newReq: LeaveRequest = {
      ...req,
      id: `leave_${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    demoStore.leaveRequests = [newReq, ...demoStore.leaveRequests];
    return newReq;
  },

  async updateLeaveStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const reqs = demoStore.leaveRequests.map((l) =>
      l.id === id ? { ...l, status } : l
    );
    demoStore.leaveRequests = reqs;
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogItem[]> {
    return demoStore.auditLogs;
  },

  addAuditLog(userName: string, action: string, entityType: string, details: string): void {
    const log: AuditLogItem = {
      id: `aud_${Date.now()}`,
      user_name: userName,
      action,
      entity_type: entityType,
      details,
      created_at: new Date().toISOString(),
    };
    demoStore.auditLogs = [log, ...demoStore.auditLogs];
  },
};
