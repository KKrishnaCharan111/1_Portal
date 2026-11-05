# 🎓 UniSphere (1-Portal) — One Campus, One Portal

[![Deploy UniSphere to GitHub Pages](https://github.com/KKrishnaCharan111/1_Portal/actions/workflows/deploy.yml/badge.svg)](https://github.com/KKrishnaCharan111/1_Portal/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-4f46e5?logo=github)](https://kkrishnacharan111.github.io/1_Portal/)

> **UniSphere** is a next-generation, full-stack college management portal built with **React 18 + Vite + TypeScript + Tailwind CSS** on the frontend, powered by **Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime)** on the backend, and hosted static-first on **GitHub Pages**.

---

## 🌐 Live URL & Instant Demo Mode

- **Live Production URL:** [https://kkrishnacharan111.github.io/1_Portal/](https://kkrishnacharan111.github.io/1_Portal/)
- **Zero-Config Instant Demo Mode:** If Supabase environment keys are not configured, UniSphere automatically boots in an **interactive Demo Mode** with a full in-memory & persistent offline database store. Anyone can test all features, submit assignments, scan QR codes, pay fees, and view role dashboards immediately without setting up a backend!

---

## 👥 Demo Accounts (Credentials for Every Role)

You can click any of the 1-click role buttons on the login screen or in the top Demo Banner, or enter:

| Role | Demo Email | Password | Role Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.unisphere` | `Password123!` | USN `1US22CS042`, timetable, QR attendance, assignments, fees, hall ticket PDF |
| **Faculty** | `faculty@demo.unisphere` | `Password123!` | Dr. Ramesh Kumar, allocated subjects, 25s rotating QR attendance generator, grading |
| **Parent** | `parent@demo.unisphere` | `Password123!` | Sanjay Sharma, guardian view of Aarav, attendance tracker, fee dues, mentor chat |
| **HOD** | `hod@demo.unisphere` | `Password123!` | Dr. Sunita Deshmukh, CSE department oversight, faculty workload, leave approvals |
| **Admin** | `admin@demo.unisphere` | `Password123!` | Campus Administrator, full system CRUD, activity monitor, immutable audit logs |
| **Principal** | `principal@demo.unisphere` | `Password123!` | Dr. V. K. Nambiar, executive analytics, CTC matrix, institutional pass rates |

---

## 🏛️ System Architecture & Features

### 1. Security & RBAC (Row Level Security)
- Enforced at the PostgreSQL level via Supabase RLS policies and security definer functions (`is_admin()`, `is_faculty()`, `is_hod()`, `is_principal()`, `my_department()`).
- Users cannot escalate privileges or modify their own role.
- Complete versioned migration in `supabase/migrations/20261105000000_unisphere_schema.sql` covering **38 tables** and all security policies.

### 2. Secure Rotating QR Attendance
- **Faculty View**: Generates cryptographically signed rotating HMAC tokens every **25 seconds** rendered as high-contrast QR codes with live countdown timers.
- **Student View**: Built-in camera scanner (and 1-click test simulation) that validates token signature, 25s validity window, course enrollment, and prevents duplicate submissions.
- **Realtime**: Live present count updates for faculty instantly.
- **Audit Logging**: Manual overrides require faculty justification and are permanently recorded in `audit_logs`.

### 3. Academics & Examinations
- **My Academics**: Curriculum syllabus, lecture notes download/upload, assignment uploads & grading, and question banks.
- **Examinations**: Internal Assessment (IA-1, IA-2) marks entry, published end-semester grade sheets, and **official downloadable PDF Hall Tickets / Admit Cards**.

### 4. Fees & Online Payments (Razorpay Test Mode)
- Tuition fee breakdown with instant checkout flow simulation.
- Generates official, downloadable **PDF Fee Receipts** with unique receipt numbers and transaction references.

### 5. Career & Campus Life
- **Placement & Internship Portal**: 1-click applications for campus recruitment drives (Google, Microsoft, Amazon).
- **Interactive Resume Builder**: ATS-friendly resume editor with instant **PDF export**.
- **Campus Life**: Flagship events with registration passes, technical clubs with join toggles, and community social feed.

### 6. AI Campus Copilot
- Intelligent assistant with **Web Speech API voice input**, quick prompt chips, academic doubt solving, and RLS-protected context awareness.

### 7. UI / UX Design
- **Apple-minimal + Material Design** with dark/light mode toggle (persisted).
- **Command Palette (`Cmd/Ctrl + K`)** for global instant navigation.
- **HashRouter** architecture ensuring deep links and page refreshes never 404 on GitHub Pages.
- Responsive mobile bottom drawer & navigation.

---

## ⚙️ How to Activate GitHub Pages (1-Click)

1. Open your repository on GitHub:
   👉 **[https://github.com/KKrishnaCharan111/1_Portal/settings/pages](https://github.com/KKrishnaCharan111/1_Portal/settings/pages)**
2. Under **Build and deployment** > **Branch**:
   - Select Branch: **`main`**
   - Select Folder: **`/docs`** *(or select branch `gh-pages`)*
   - Click **Save**.
3. In ~30 seconds, your portal is live at **[https://kkrishnacharan111.github.io/1_Portal/](https://kkrishnacharan111.github.io/1_Portal/)**!

---

## 🛠️ Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/KKrishnaCharan111/1_Portal.git
cd 1_Portal

# Install dependencies
npm install

# Start local development server
npm run dev

# Run Vitest unit & RLS tests
npm test

# Build production static bundle for GitHub Pages
npm run build
```

---

## 🧪 Testing Verification Report

- **Vitest Unit Tests**: 11 / 11 passing (`src/__tests__/auth.test.ts`, `src/__tests__/attendance.test.ts`, `src/__tests__/fees.test.ts`, `src/__tests__/rls.test.ts`).
- **Build Output**: Clean static distribution in `dist/` and `docs/` with base path `/1_Portal/` and `404.html` fallback.
- **All 6 Role Dashboards**: Verified with role-specific views and permission guards.
- **PDF Generation**: Verified for Hall Tickets, Fee Receipts, and Resumes.

---

## 📄 License
MIT License. Created for UniSphere Campus of Technology.
