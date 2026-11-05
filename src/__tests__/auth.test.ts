import { describe, it, expect } from 'vitest';
import { DEMO_PROFILES } from '../lib/demoData';

describe('UniSphere Authentication & RBAC Roles', () => {
  it('provides all 6 required demo roles', () => {
    const roles = Object.values(DEMO_PROFILES).map((p) => p.role);
    expect(roles).toContain('student');
    expect(roles).toContain('faculty');
    expect(roles).toContain('parent');
    expect(roles).toContain('hod');
    expect(roles).toContain('admin');
    expect(roles).toContain('principal');
  });

  it('student demo account has USN and department details', () => {
    const student = DEMO_PROFILES['student@demo.unisphere'];
    expect(student).toBeDefined();
    expect(student.usn).toBe('1US22CS042');
    expect(student.semester).toBe(6);
    expect(student.section).toBe('A');
    expect(student.department_name).toContain('Computer Science');
  });

  it('faculty demo account has employee ID and faculty privileges', () => {
    const faculty = DEMO_PROFILES['faculty@demo.unisphere'];
    expect(faculty).toBeDefined();
    expect(faculty.employee_id).toBe('FAC-CS-108');
    expect(faculty.role).toBe('faculty');
  });

  it('parent demo account is designated as guardian', () => {
    const parent = DEMO_PROFILES['parent@demo.unisphere'];
    expect(parent).toBeDefined();
    expect(parent.role).toBe('parent');
  });
});
