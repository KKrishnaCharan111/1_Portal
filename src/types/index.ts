export type UserRole = 'student' | 'faculty' | 'parent' | 'hod' | 'admin' | 'principal';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  usn?: string; // e.g. 1US22CS042
  employee_id?: string;
  department_id?: string;
  department_name?: string;
  semester?: number;
  section?: string;
  gender?: string;
  blood_group?: string;
  address?: string;
  cgpa?: number;
  is_active: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  hod_id?: string;
  hod_name?: string;
  student_count?: number;
  faculty_count?: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department_id: string;
  department_code?: string;
  credits: number;
  semester: number;
  type: 'Theory' | 'Practical' | 'Elective';
  syllabus_pdf_url?: string;
  description?: string;
  faculty_name?: string;
}

export interface TimetableSlot {
  id: string;
  department_id: string;
  semester: number;
  section: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  start_time: string;
  end_time: string;
  subject_id: string;
  subject_name?: string;
  subject_code?: string;
  faculty_id?: string;
  faculty_name?: string;
  classroom_code?: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  student_name?: string;
  student_usn?: string;
  subject_id: string;
  subject_name?: string;
  status: 'present' | 'absent' | 'excused';
  verification_method: 'qr_scan' | 'manual' | 'face';
  scanned_at: string;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  subject_id: string;
  subject_name?: string;
  faculty_id: string;
  faculty_name?: string;
  section: string;
  semester: number;
  date: string;
  start_time: string;
  token_salt: string;
  is_active: boolean;
  present_count?: number;
  total_students?: number;
}

export interface Assignment {
  id: string;
  subject_id: string;
  subject_name?: string;
  subject_code?: string;
  faculty_id: string;
  faculty_name?: string;
  title: string;
  description: string;
  due_date: string;
  total_marks: number;
  section?: string;
  attachment_url?: string;
  submitted?: boolean;
  submission_marks?: number;
  status?: 'pending' | 'submitted' | 'graded';
}

export interface NoteItem {
  id: string;
  subject_id: string;
  subject_name?: string;
  faculty_id: string;
  faculty_name?: string;
  title: string;
  description?: string;
  file_url: string;
  unit_number?: number;
  file_size?: string;
  created_at: string;
}

export interface QuestionBankItem {
  id: string;
  subject_id: string;
  subject_name?: string;
  year: number;
  exam_type: string;
  unit_number?: number;
  title: string;
  file_url: string;
}

export interface InternalMark {
  id: string;
  student_id: string;
  student_name?: string;
  student_usn?: string;
  subject_id: string;
  subject_name?: string;
  subject_code?: string;
  test_type: 'IA-1' | 'IA-2' | 'Assignment' | 'Quiz';
  max_marks: number;
  obtained_marks: number;
}

export interface ExamItem {
  id: string;
  title: string;
  exam_type: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  semester: number;
  department_name?: string;
  is_published: boolean;
}

export interface ExamResult {
  id: string;
  student_id: string;
  exam_id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  semester: number;
  internal_marks: number;
  external_marks: number;
  total_marks: number;
  grade: string;
  credits: number;
  is_pass: boolean;
}

export interface HallTicket {
  id: string;
  student_id: string;
  student_name: string;
  student_usn: string;
  exam_id: string;
  exam_title: string;
  ticket_number: string;
  is_approved: boolean;
  fee_clearance: boolean;
  attendance_clearance: boolean;
  qr_verification_code: string;
  issued_at: string;
}

export interface FeeStructure {
  id: string;
  department_id: string;
  semester: number;
  academic_year: string;
  tuition_fee: number;
  library_fee: number;
  lab_fee: number;
  examination_fee: number;
  total_amount: number;
  due_date: string;
}

export interface FeePayment {
  id: string;
  student_id: string;
  structure_id?: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: 'completed' | 'pending' | 'failed';
  paid_at: string;
  receipt_number?: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  year?: number;
  total_copies: number;
  available_copies: number;
  shelf_location?: string;
}

export interface LibraryLoan {
  id: string;
  book_id: string;
  book_title?: string;
  book_author?: string;
  user_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  fine_amount: number;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop';
  start_time: string;
  end_time: string;
  venue: string;
  banner_url?: string;
  capacity: number;
  registered?: boolean;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  lead_name?: string;
  member_count?: number;
  is_member?: boolean;
}

export interface CommunityPost {
  id: string;
  community_name: string;
  author_name: string;
  author_role: string;
  author_avatar?: string;
  title: string;
  content: string;
  likes_count: number;
  created_at: string;
  liked?: boolean;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_id?: string;
  group_name?: string;
  content: string;
  created_at: string;
  is_mine?: boolean;
}

export interface Announcement {
  id: string;
  author_name: string;
  author_role: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Exam' | 'Urgent';
  is_pinned: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'academic' | 'fee' | 'alert' | 'message';
  is_read: boolean;
  created_at: string;
  link?: string;
}

export interface PlacementOpportunity {
  id: string;
  company_name: string;
  role_title: string;
  package_lpa: number;
  eligibility_cgpa: number;
  eligible_branches: string[];
  deadline: string;
  drive_date: string;
  location: string;
  description: string;
  has_applied?: boolean;
}

export interface InternshipOpportunity {
  id: string;
  company_name: string;
  role_title: string;
  stipend_monthly: number;
  duration_months: number;
  deadline: string;
  location: string;
  description: string;
  has_applied?: boolean;
}

export interface DocumentRequest {
  id: string;
  student_id: string;
  student_name?: string;
  student_usn?: string;
  document_type: string;
  purpose: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  remarks?: string;
  requested_at: string;
  updated_at: string;
}

export interface HelpTicket {
  id: string;
  user_id: string;
  user_name?: string;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

export interface AchievementItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  issuer: string;
  issue_date: string;
  verified: boolean;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  action: string;
  entity_type: string;
  details: string;
  created_at: string;
}
