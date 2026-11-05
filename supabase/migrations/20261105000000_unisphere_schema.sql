-- ==============================================================================
-- UNISPHERE CAMPUS PORTAL - CORE DATABASE SCHEMA
-- Migration: 20261105000000_unisphere_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role enum
CREATE TYPE user_role AS ENUM (
  'student',
  'faculty',
  'parent',
  'hod',
  'admin',
  'principal'
);

-- ==============================================================================
-- 1. DEPARTMENTS & ACADEMIC STRUCTURE
-- ==============================================================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  hod_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 2. USER PROFILES
-- ==============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  phone VARCHAR(20),
  usn VARCHAR(30) UNIQUE, -- For students
  employee_id VARCHAR(30) UNIQUE, -- For faculty/staff
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  semester INT, -- For students (1-8)
  section VARCHAR(10), -- For students (A, B, C)
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Circular reference resolve: departments.hod_id -> profiles.id
ALTER TABLE departments
  ADD CONSTRAINT fk_department_hod
  FOREIGN KEY (hod_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Courses (e.g. B.Tech Computer Science, M.Tech AI)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  degree VARCHAR(50) NOT NULL,
  duration_years INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Semesters
CREATE TABLE semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  number INT NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sections
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  name VARCHAR(10) NOT NULL, -- 'A', 'B', 'C'
  room_number VARCHAR(30),
  capacity INT DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Classrooms
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor INT DEFAULT 1,
  capacity INT DEFAULT 60,
  has_projector BOOLEAN DEFAULT true,
  has_ac BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  credits INT NOT NULL DEFAULT 4,
  semester INT NOT NULL,
  type VARCHAR(30) DEFAULT 'Theory', -- Theory, Practical, Elective
  syllabus_pdf_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Faculty Subject Allocation
CREATE TABLE faculty_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  academic_year VARCHAR(20) NOT NULL,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'enrolled',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id, academic_year)
);

-- Parent-Student Links
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relationship VARCHAR(50) DEFAULT 'Guardian',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Timetable Slots
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  section VARCHAR(10) NOT NULL,
  day_of_week VARCHAR(15) NOT NULL, -- Monday, Tuesday, ...
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. SECURE QR ATTENDANCE
-- ==============================================================================
CREATE TABLE attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section VARCHAR(10) NOT NULL,
  semester INT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  token_salt VARCHAR(64) NOT NULL, -- Used for rotating HMAC verification
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'present', -- present, absent, excused
  verification_method VARCHAR(20) DEFAULT 'qr_scan', -- qr_scan, manual, face
  scanned_at TIMESTAMPTZ DEFAULT now(),
  remarks TEXT,
  UNIQUE(session_id, student_id)
);

-- ==============================================================================
-- 4. ACADEMICS: NOTES, ASSIGNMENTS, QUESTION BANK
-- ==============================================================================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size VARCHAR(30),
  unit_number INT,
  downloads_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  total_marks INT DEFAULT 100,
  attachment_url TEXT,
  section VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status VARCHAR(30) DEFAULT 'submitted', -- submitted, graded, late
  marks_obtained NUMERIC(5,2),
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES profiles(id),
  UNIQUE(assignment_id, student_id)
);

CREATE TABLE question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  year INT NOT NULL,
  exam_type VARCHAR(50) NOT NULL, -- Mid-term, Final Semester, Model Exam
  unit_number INT,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 5. EXAMINATIONS, INTERNAL MARKS, RESULTS & HALL TICKETS
-- ==============================================================================
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150) NOT NULL,
  exam_type VARCHAR(50) NOT NULL, -- Internal Assessment 1, 2, End Semester
  academic_year VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  semester INT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE internal_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL, -- IA-1, IA-2, Assignment, Attendance
  max_marks NUMERIC(5,2) NOT NULL,
  obtained_marks NUMERIC(5,2) NOT NULL,
  entered_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id, test_type)
);

CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  internal_marks NUMERIC(5,2) DEFAULT 0,
  external_marks NUMERIC(5,2) DEFAULT 0,
  total_marks NUMERIC(5,2) GENERATED ALWAYS AS (internal_marks + external_marks) STORED,
  grade VARCHAR(5) NOT NULL, -- O, A+, A, B+, B, C, F
  credits INT NOT NULL DEFAULT 4,
  is_pass BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, exam_id, subject_id)
);

CREATE TABLE hall_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  fee_clearance BOOLEAN DEFAULT true,
  attendance_clearance BOOLEAN DEFAULT true,
  qr_verification_code TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, exam_id)
);

-- ==============================================================================
-- 6. FEES & PAYMENTS
-- ==============================================================================
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  tuition_fee NUMERIC(10,2) NOT NULL,
  library_fee NUMERIC(10,2) DEFAULT 0,
  lab_fee NUMERIC(10,2) DEFAULT 0,
  examination_fee NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  structure_id UUID REFERENCES fee_structures(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Online (Razorpay)',
  transaction_id VARCHAR(100) UNIQUE,
  status VARCHAR(30) DEFAULT 'completed', -- completed, pending, failed
  paid_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES fee_payments(id) ON DELETE CASCADE,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_paid NUMERIC(10,2) NOT NULL,
  issued_date TIMESTAMPTZ DEFAULT now(),
  pdf_url TEXT
);

-- ==============================================================================
-- 7. LIBRARY
-- ==============================================================================
CREATE TABLE library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn VARCHAR(30) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  publisher VARCHAR(150),
  year INT,
  total_copies INT DEFAULT 1,
  available_copies INT DEFAULT 1,
  shelf_location VARCHAR(50),
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE library_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  fine_amount NUMERIC(8,2) DEFAULT 0,
  status VARCHAR(30) DEFAULT 'borrowed' -- borrowed, returned, overdue
);

-- ==============================================================================
-- 8. CAMPUS LIFE: EVENTS, CLUBS, COMMUNITIES, ACHIEVEMENTS
-- ==============================================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'Cultural', -- Technical, Cultural, Sports, Workshop
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  venue VARCHAR(150) NOT NULL,
  banner_url TEXT,
  capacity INT DEFAULT 200,
  organizer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  certificate_url TEXT,
  UNIQUE(event_id, user_id)
);

CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  logo_url TEXT,
  lead_id UUID REFERENCES profiles(id),
  faculty_coordinator_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'Member', -- President, Vice-President, Core, Member
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(club_id, user_id)
);

CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) UNIQUE NOT NULL,
  topic VARCHAR(100) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  is_official BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  media_url TEXT,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- Hackathon, Research Paper, Sports, Certification
  issuer VARCHAR(150) NOT NULL,
  issue_date DATE NOT NULL,
  credential_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 9. MESSAGES & ANNOUNCEMENTS
-- ==============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID, -- For group or section chats
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'General', -- Academic, Exam, Urgent, Event
  target_role user_role, -- NULL means all roles
  target_department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  attachment_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- academic, fee, alert, message
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 10. CAREER: PLACEMENTS, INTERNSHIPS, APPLICATIONS
-- ==============================================================================
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(150) NOT NULL,
  role_title VARCHAR(150) NOT NULL,
  package_lpa NUMERIC(6,2) NOT NULL,
  eligibility_cgpa NUMERIC(4,2) DEFAULT 6.0,
  eligible_branches TEXT[], -- ['CSE', 'ECE', 'MECH']
  deadline TIMESTAMPTZ NOT NULL,
  drive_date DATE NOT NULL,
  location VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(150) NOT NULL,
  role_title VARCHAR(150) NOT NULL,
  stipend_monthly NUMERIC(10,2) DEFAULT 0,
  duration_months INT DEFAULT 3,
  deadline TIMESTAMPTZ NOT NULL,
  location VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'placement' or 'internship'
  listing_id UUID NOT NULL, -- references placements or internships
  status VARCHAR(30) DEFAULT 'applied', -- applied, shortlisted, interviewed, selected, rejected
  applied_at TIMESTAMPTZ DEFAULT now(),
  resume_url TEXT
);

-- ==============================================================================
-- 11. DOCUMENTS, TICKETS, FEEDBACK, LEAVE & AUDIT LOGS
-- ==============================================================================
CREATE TABLE documents_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- Bonafide, Transcript, NOC, Study Certificate
  purpose TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'pending', -- pending, in_progress, approved, rejected
  remarks TEXT,
  approved_by UUID REFERENCES profiles(id),
  generated_document_url TEXT,
  requested_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- IT, Hostel, Library, Fees, Academic
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
  assigned_to UUID REFERENCES profiles(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedback_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  faculty_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  leave_type VARCHAR(50) DEFAULT 'Casual', -- Casual, Sick, Duty, On-Duty
  status VARCHAR(30) DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  details JSONB DEFAULT '{}'::jsonb,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 12. HELPER FUNCTIONS FOR ROW LEVEL SECURITY (RLS)
-- ==============================================================================
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_principal()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'principal'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_hod()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'hod'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_faculty()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'hod')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION my_department()
RETURNS UUID AS $$
  SELECT department_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- 13. ENABLE RLS POLICIES ACROSS ALL TABLES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read basic profiles, admins can update/all
CREATE POLICY "Profiles readable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins full access to profiles"
  ON profiles FOR ALL TO authenticated
  USING (is_admin());

-- Departments & Courses: Read by all, modified by admin
CREATE POLICY "Departments read by all" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Departments managed by admin" ON departments FOR ALL TO authenticated USING (is_admin());

CREATE POLICY "Courses read by all" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Courses managed by admin" ON courses FOR ALL TO authenticated USING (is_admin());

-- Subjects: Read by all, managed by admin or hod
CREATE POLICY "Subjects read by all" ON subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Subjects managed by admin or hod" ON subjects FOR ALL TO authenticated
  USING (is_admin() OR (is_hod() AND department_id = my_department()));

-- Attendance Sessions: Faculty & admin can manage, students can read for their subjects
CREATE POLICY "Attendance sessions read" ON attendance_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Attendance sessions managed by faculty" ON attendance_sessions FOR ALL TO authenticated
  USING (is_faculty() OR is_admin());

-- Attendance Records:
-- Students see only their own attendance
-- Faculty see attendance for sessions they taught
-- Parents see attendance for linked students
-- Admin/Principal/HOD see relevant scope
CREATE POLICY "Attendance read access" ON attendance_records FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR is_admin()
    OR is_principal()
    OR (is_hod() AND EXISTS (SELECT 1 FROM profiles WHERE id = attendance_records.student_id AND department_id = my_department()))
    OR (EXISTS (SELECT 1 FROM parent_student_links WHERE parent_id = auth.uid() AND student_id = attendance_records.student_id))
    OR (EXISTS (SELECT 1 FROM attendance_sessions WHERE id = attendance_records.session_id AND faculty_id = auth.uid()))
  );

CREATE POLICY "Attendance record insert" ON attendance_records FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid() -- QR scan submission
    OR is_faculty()
    OR is_admin()
  );

CREATE POLICY "Attendance record update by faculty/admin" ON attendance_records FOR UPDATE TO authenticated
  USING (is_faculty() OR is_admin());

-- Audit logs: Read by admin/principal, insert allowed by authenticated actions
CREATE POLICY "Audit logs read by admin/principal" ON audit_logs FOR SELECT TO authenticated
  USING (is_admin() OR is_principal());

CREATE POLICY "Audit logs insert" ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- Fee Payments:
-- Students can see their own
-- Parents see linked students' payments
-- Admin and Principal can see all
CREATE POLICY "Fee payments read" ON fee_payments FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR is_admin()
    OR is_principal()
    OR EXISTS (SELECT 1 FROM parent_student_links WHERE parent_id = auth.uid() AND student_id = fee_payments.student_id)
  );

CREATE POLICY "Fee payments insert" ON fee_payments FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() OR is_admin());

-- Messages: Users can see messages sent by them or to them
CREATE POLICY "Messages read access" ON messages FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR group_id IS NOT NULL);

CREATE POLICY "Messages send access" ON messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Announcements: Everyone reads, faculty/hod/admin can create
CREATE POLICY "Announcements read" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Announcements create" ON announcements FOR INSERT TO authenticated
  WITH CHECK (is_faculty() OR is_hod() OR is_admin() OR is_principal());

-- Notifications: Users only see their own notifications
CREATE POLICY "Notifications own read" ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Notifications own update" ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Document Requests: Student sees own, admin/hod can view and approve
CREATE POLICY "Doc requests view" ON documents_requests FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR is_admin() OR is_hod());
CREATE POLICY "Doc requests create" ON documents_requests FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Doc requests update" ON documents_requests FOR UPDATE TO authenticated
  USING (is_admin() OR is_hod());

-- Performance Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_department ON profiles(department_id);
CREATE INDEX idx_attendance_records_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_records_session ON attendance_records(session_id);
CREATE INDEX idx_attendance_sessions_date ON attendance_sessions(date);
CREATE INDEX idx_internal_marks_student ON internal_marks(student_id);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_messages_participants ON messages(sender_id, recipient_id);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
