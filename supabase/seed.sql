-- ==============================================================================
-- UNISPHERE CAMPUS PORTAL - DEMO DATA SEED SCRIPT
-- Seed File: supabase/seed.sql
-- All demo users have password: "Password123!" in Supabase Auth
-- ==============================================================================

-- 1. CLEANUP PREVIOUS SEED DATA IF RUNNING LOCALLY
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE leave_requests CASCADE;
TRUNCATE TABLE feedback_surveys CASCADE;
TRUNCATE TABLE tickets CASCADE;
TRUNCATE TABLE documents_requests CASCADE;
TRUNCATE TABLE applications CASCADE;
TRUNCATE TABLE internships CASCADE;
TRUNCATE TABLE placements CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE announcements CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE achievements CASCADE;
TRUNCATE TABLE posts CASCADE;
TRUNCATE TABLE communities CASCADE;
TRUNCATE TABLE club_members CASCADE;
TRUNCATE TABLE clubs CASCADE;
TRUNCATE TABLE event_registrations CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE library_loans CASCADE;
TRUNCATE TABLE library_books CASCADE;
TRUNCATE TABLE receipts CASCADE;
TRUNCATE TABLE fee_payments CASCADE;
TRUNCATE TABLE fee_structures CASCADE;
TRUNCATE TABLE hall_tickets CASCADE;
TRUNCATE TABLE exam_results CASCADE;
TRUNCATE TABLE internal_marks CASCADE;
TRUNCATE TABLE exams CASCADE;
TRUNCATE TABLE question_bank CASCADE;
TRUNCATE TABLE submissions CASCADE;
TRUNCATE TABLE assignments CASCADE;
TRUNCATE TABLE notes CASCADE;
TRUNCATE TABLE attendance_records CASCADE;
TRUNCATE TABLE attendance_sessions CASCADE;
TRUNCATE TABLE timetable_slots CASCADE;
TRUNCATE TABLE parent_student_links CASCADE;
TRUNCATE TABLE enrollments CASCADE;
TRUNCATE TABLE faculty_subjects CASCADE;
TRUNCATE TABLE subjects CASCADE;
TRUNCATE TABLE classrooms CASCADE;
TRUNCATE TABLE sections CASCADE;
TRUNCATE TABLE semesters CASCADE;
TRUNCATE TABLE courses CASCADE;
TRUNCATE TABLE departments CASCADE;

-- 2. INSERT DEPARTMENTS
INSERT INTO departments (id, code, name, description) VALUES
('a0000000-0000-0000-0000-000000000001', 'CSE', 'Computer Science & Engineering', 'Department of Computer Science and Emerging Technologies'),
('a0000000-0000-0000-0000-000000000002', 'ECE', 'Electronics & Communication Engineering', 'Department of Electronics, Embedded Systems and VLSI'),
('a0000000-0000-0000-0000-000000000003', 'MECH', 'Mechanical Engineering', 'Department of Mechanical and Automation Engineering'),
('a0000000-0000-0000-0000-000000000004', 'AIML', 'Artificial Intelligence & Machine Learning', 'Specialized department for Data Science and Deep Learning');

-- 3. INSERT DEMO PROFILES (Corresponding to demo accounts)
-- Note: In production Supabase, corresponding auth.users records are created via Auth API
INSERT INTO profiles (id, email, full_name, role, avatar_url, phone, usn, employee_id, department_id, semester, section, gender, blood_group, address) VALUES
('b0000000-0000-0000-0000-000000000001', 'student@demo.unisphere', 'Aarav Sharma', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', '+91 98765 43210', '1US22CS042', NULL, 'a0000000-0000-0000-0000-000000000001', 6, 'A', 'Male', 'O+', 'Hostel Block B, Room 304'),
('b0000000-0000-0000-0000-000000000002', 'faculty@demo.unisphere', 'Dr. Ramesh Kumar', 'faculty', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', '+91 98765 43211', NULL, 'FAC-CS-108', 'a0000000-0000-0000-0000-000000000001', NULL, NULL, 'Male', 'A+', 'Staff Quarters Q-12'),
('b0000000-0000-0000-0000-000000000003', 'parent@demo.unisphere', 'Sanjay Sharma', 'parent', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', '+91 98765 43212', NULL, NULL, NULL, NULL, NULL, 'Male', 'B+', '42 Indiranagar, Bangalore'),
('b0000000-0000-0000-0000-000000000004', 'hod@demo.unisphere', 'Dr. Sunita Deshmukh', 'hod', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', '+91 98765 43213', NULL, 'HOD-CS-001', 'a0000000-0000-0000-0000-000000000001', NULL, NULL, 'Female', 'O-', 'Professors Enclave P-4'),
('b0000000-0000-0000-0000-000000000005', 'admin@demo.unisphere', 'Campus Administrator', 'admin', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', '+91 98765 43214', NULL, 'ADM-001', NULL, NULL, NULL, 'Male', 'AB+', 'Administrative Block Room 101'),
('b0000000-0000-0000-0000-000000000006', 'principal@demo.unisphere', 'Dr. V. K. Nambiar', 'principal', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', '+91 98765 43215', NULL, 'PRIN-001', NULL, NULL, NULL, 'Male', 'O+', 'Directors Residence, North Campus');

-- Set HOD in department
UPDATE departments SET hod_id = 'b0000000-0000-0000-0000-000000000004' WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- Link Parent to Student
INSERT INTO parent_student_links (parent_id, student_id, relationship) VALUES
('b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Father');

-- 4. INSERT COURSES & SUBJECTS
INSERT INTO courses (id, code, name, department_id, degree, duration_years) VALUES
('c0000000-0000-0000-0000-000000000001', 'BTECH-CSE', 'B.Tech Computer Science and Engineering', 'a0000000-0000-0000-0000-000000000001', 'B.Tech', 4);

INSERT INTO subjects (id, code, name, department_id, credits, semester, type, description) VALUES
('s0000000-0000-0000-0000-000000000001', 'CS601', 'Cloud Computing & Distributed Systems', 'a0000000-0000-0000-0000-000000000001', 4, 6, 'Theory', 'Microservices, AWS/GCP architecture, Docker, Kubernetes'),
('s0000000-0000-0000-0000-000000000002', 'CS602', 'Machine Learning & Neural Networks', 'a0000000-0000-0000-0000-000000000001', 4, 6, 'Theory', 'Supervised/Unsupervised learning, Deep Learning, PyTorch'),
('s0000000-0000-0000-0000-000000000003', 'CS603', 'Compiler Design', 'a0000000-0000-0000-0000-000000000001', 4, 6, 'Theory', 'Lexical analysis, parsing, semantic analysis, code generation'),
('s0000000-0000-0000-0000-000000000004', 'CS604', 'Full Stack Web Engineering Lab', 'a0000000-0000-0000-0000-000000000001', 2, 6, 'Practical', 'Modern React, Next.js, Node.js, GraphQL & Postgres');

-- Faculty allocation
INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year) VALUES
('b0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000001', '2025-2026'),
('b0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000004', '2025-2026');

-- Enroll Student
INSERT INTO enrollments (student_id, subject_id, semester, academic_year) VALUES
('b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 6, '2025-2026'),
('b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000002', 6, '2025-2026'),
('b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000003', 6, '2025-2026'),
('b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000004', 6, '2025-2026');

-- 5. CLASSROOMS
INSERT INTO classrooms (id, code, building, floor, capacity, has_projector, has_ac) VALUES
('d0000000-0000-0000-0000-000000000001', 'LH-301', 'Turing Academic Block', 3, 70, true, true),
('d0000000-0000-0000-0000-000000000002', 'CS-LAB-4', 'Grace Hopper Lab Complex', 2, 45, true, true);

-- 6. TIMETABLE
INSERT INTO timetable_slots (department_id, semester, section, day_of_week, start_time, end_time, subject_id, faculty_id, classroom_id) VALUES
('a0000000-0000-0000-0000-000000000001', 6, 'A', 'Monday', '09:00:00', '10:00:00', 's0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000001', 6, 'A', 'Monday', '10:15:00', '11:15:00', 's0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000001', 6, 'A', 'Monday', '11:30:00', '12:30:00', 's0000000-0000-0000-0000-000000000003', NULL, 'd0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000001', 6, 'A', 'Tuesday', '09:00:00', '11:00:00', 's0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000001', 6, 'A', 'Wednesday', '09:00:00', '10:00:00', 's0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001');

-- 7. ATTENDANCE SESSION & RECORDS
INSERT INTO attendance_sessions (id, subject_id, faculty_id, section, semester, date, token_salt, is_active) VALUES
('e0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'A', 6, CURRENT_DATE, 'salt_928374', true);

INSERT INTO attendance_records (session_id, student_id, subject_id, status, verification_method) VALUES
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'present', 'qr_scan');

-- 8. ASSIGNMENTS & NOTES
INSERT INTO assignments (id, subject_id, faculty_id, title, description, due_date, total_marks, section) VALUES
('f0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Kubernetes Cluster Deployment and Ingress Setup', 'Create a 3-node Minikube or cloud cluster with Helm chart deployment and Ingress controller.', now() + interval '5 days', 100, 'A'),
('f0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'CNN for Image Classification on CIFAR-10', 'Train a ResNet or custom CNN achieving over 85% validation accuracy with TensorBoard logs.', now() + interval '12 days', 50, 'A');

INSERT INTO notes (subject_id, faculty_id, title, description, file_url, unit_number) VALUES
('s0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Module 1: Cloud Service Models (IaaS, PaaS, SaaS)', 'Comprehensive guide on virtualization, hypervisors, and multi-tenant architectures.', 'https://unisphere-portal.pages.dev/docs/cloud-mod1.pdf', 1),
('s0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Module 2: Backpropagation & Optimization Algorithms', 'Gradient descent variants: Adam, RMSProp, and AdaGrad mathematics.', 'https://unisphere-portal.pages.dev/docs/ml-mod2.pdf', 2);

-- 9. EXAMS, INTERNAL MARKS & RESULTS
INSERT INTO exams (id, title, exam_type, academic_year, start_date, end_date, department_id, semester, is_published) VALUES
('ex000000-0000-0000-0000-000000000001', 'Semester 6 Mid-Term Examinations', 'Mid-term', '2025-2026', CURRENT_DATE + interval '15 days', CURRENT_DATE + interval '22 days', 'a0000000-0000-0000-0000-000000000001', 6, true);

INSERT INTO internal_marks (student_id, subject_id, test_type, max_marks, obtained_marks, entered_by) VALUES
('b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'IA-1', 30, 28.5, 'b0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000002', 'IA-1', 30, 27.0, 'b0000000-0000-0000-0000-000000000004');

INSERT INTO exam_results (student_id, exam_id, subject_id, semester, internal_marks, external_marks, grade, credits, is_pass) VALUES
('b0000000-0000-0000-0000-000000000001', 'ex000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 5, 29, 65, 'A+', 4, true),
('b0000000-0000-0000-0000-000000000001', 'ex000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000002', 5, 28, 62, 'A', 4, true);

INSERT INTO hall_tickets (student_id, exam_id, ticket_number, is_approved, fee_clearance, attendance_clearance, qr_verification_code) VALUES
('b0000000-0000-0000-0000-000000000001', 'ex000000-0000-0000-0000-000000000001', 'HT-2026-6-CS042', true, true, true, 'HT_VERIFY_AARAV_1US22CS042_EX01');

-- 10. FEES & PAYMENTS
INSERT INTO fee_structures (id, department_id, semester, academic_year, tuition_fee, library_fee, lab_fee, examination_fee, total_amount, due_date) VALUES
('fee00000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 6, '2025-2026', 75000.00, 3500.00, 7500.00, 4000.00, 90000.00, CURRENT_DATE + interval '30 days');

INSERT INTO fee_payments (id, student_id, structure_id, amount, payment_method, transaction_id, status) VALUES
('pay00000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'fee00000-0000-0000-0000-000000000001', 90000.00, 'Online (Razorpay Test Mode)', 'pay_rzp_demo_9823419', 'completed');

INSERT INTO receipts (payment_id, receipt_number, student_id, amount_paid) VALUES
('pay00000-0000-0000-0000-000000000001', 'REC-2026-CS-0042', 'b0000000-0000-0000-0000-000000000001', 90000.00);

-- 11. LIBRARY
INSERT INTO library_books (isbn, title, author, category, publisher, year, total_copies, available_copies, shelf_location) VALUES
('978-0134685991', 'Effective Java (3rd Edition)', 'Joshua Bloch', 'Computer Science', 'Addison-Wesley', 2018, 5, 4, 'CS-Row-4-Shelf-B'),
('978-0262033848', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen', 'Algorithms', 'MIT Press', 2022, 10, 8, 'CS-Row-1-Shelf-A'),
('978-0131103627', 'The C Programming Language', 'Brian W. Kernighan, Dennis M. Ritchie', 'Programming', 'Prentice Hall', 1988, 6, 2, 'CS-Row-2-Shelf-C');

INSERT INTO library_loans (book_id, user_id, due_date, status) VALUES
((SELECT id FROM library_books WHERE isbn = '978-0134685991'), 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE + interval '14 days', 'borrowed');

-- 12. CAMPUS LIFE: EVENTS, CLUBS, ANNOUNCEMENTS
INSERT INTO events (id, title, description, category, start_time, end_time, venue, capacity) VALUES
('ev000000-0000-0000-0000-000000000001', 'UniSphere HackFest 2026', 'Annual 36-hour national level flagship hackathon with $10,000 prize pool.', 'Technical', now() + interval '8 days', now() + interval '10 days', 'Main Auditorium & Innovation Labs', 300),
('ev000000-0000-0000-0000-000000000002', 'TechSprint: AI Robotics Summit', 'Industry keynote speakers and live humanoid robot demos from leading researchers.', 'Workshop', now() + interval '18 days', now() + interval '19 days', 'Seminar Hall 2', 150);

INSERT INTO event_registrations (event_id, user_id, attended) VALUES
('ev000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', true);

INSERT INTO clubs (id, name, category, description, lead_id) VALUES
('cl000000-0000-0000-0000-000000000001', 'Google Developer Student Club (GDSC)', 'Technology', 'Community group for students interested in Google developer technologies and open source.', 'b0000000-0000-0000-0000-000000000001'),
('cl000000-0000-0000-0000-000000000002', 'AeroSphere Robotics Club', 'Engineering', 'Designing autonomous drones, rovers, and participating in international competitions.', 'b0000000-0000-0000-0000-000000000001');

INSERT INTO announcements (author_id, title, content, category, is_pinned) VALUES
('b0000000-0000-0000-0000-000000000005', 'UniSphere Portal v2.0 Live Launch', 'Welcome to UniSphere! All students, faculty, and staff can now access digital ID, QR attendance, and AI campus assistant.', 'General', true),
('b0000000-0000-0000-0000-000000000004', 'Semester 6 Project Review Schedule', 'All project teams must submit interim synopsis reports to the departmental coordinator by Friday.', 'Academic', false);

INSERT INTO notifications (user_id, title, message, type) VALUES
('b0000000-0000-0000-0000-000000000001', 'Assignment Posted: Kubernetes Cluster', 'Dr. Ramesh Kumar assigned a new coursework due in 5 days.', 'academic'),
('b0000000-0000-0000-0000-000000000001', 'Fee Receipt Generated', 'Payment of ₹90,000 for Semester 6 verified. Receipt #REC-2026-CS-0042 available.', 'fee');

-- 13. PLACEMENTS & INTERNSHIPS
INSERT INTO placements (company_name, role_title, package_lpa, eligibility_cgpa, eligible_branches, deadline, drive_date, location, description) VALUES
('Google India', 'Associate Cloud Engineer', 24.50, 8.0, ARRAY['CSE', 'ECE', 'AIML'], now() + interval '20 days', CURRENT_DATE + interval '25 days', 'Bengaluru / Hyderabad', 'Design, build, and deploy highly scalable microservices on Google Cloud Platform.'),
('Microsoft', 'Software Development Engineer I', 22.00, 7.5, ARRAY['CSE', 'ECE', 'AIML'], now() + interval '15 days', CURRENT_DATE + interval '22 days', 'Bengaluru', 'Core backend systems, Azure distributed storage, and developer tools.');

INSERT INTO internships (company_name, role_title, stipend_monthly, duration_months, deadline, location, description) VALUES
('Atlassian', 'Software Engineering Intern', 85000.00, 6, now() + interval '10 days', 'Bengaluru / Remote', 'Full-stack development on Jira and Confluence cloud architectures.'),
('Zerodha', 'Backend Systems Intern (Go/Python)', 60000.00, 3, now() + interval '14 days', 'Bengaluru', 'Low latency trading systems, web sockets, and financial data pipelines.');
