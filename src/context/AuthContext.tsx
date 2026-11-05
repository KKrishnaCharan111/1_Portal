import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_PROFILES } from '../lib/demoData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isDemoMode: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoRole: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isStudent: boolean;
  isFaculty: boolean;
  isParent: boolean;
  isHOD: boolean;
  isAdmin: boolean;
  isPrincipal: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_EMAILS: Record<UserRole, string> = {
  student: 'student@demo.unisphere',
  faculty: 'faculty@demo.unisphere',
  parent: 'parent@demo.unisphere',
  hod: 'hod@demo.unisphere',
  admin: 'admin@demo.unisphere',
  principal: 'principal@demo.unisphere',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('unisphere_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_PROFILES['student@demo.unisphere'];
      }
    }
    return DEMO_PROFILES['student@demo.unisphere'];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isDemoMode = !isSupabaseConfigured() || (user?.email?.includes('@demo.unisphere') ?? true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('unisphere_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('unisphere_current_user');
    }
  }, [user]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase && password && !email.endsWith('@demo.unisphere')) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, departments(name)')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser({
              ...profile,
              department_name: profile.departments?.name,
            });
            setIsLoading(false);
            return { success: true };
          }
        }
      }

      // Check demo credentials
      const targetEmail = email.toLowerCase().trim();
      const demoUser = DEMO_PROFILES[targetEmail];
      if (demoUser) {
        setUser(demoUser);
        setIsLoading(false);
        return { success: true };
      }

      // Fallback for custom student email entered
      const dynamicUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email: targetEmail,
        full_name: targetEmail.split('@')[0].toUpperCase(),
        role: targetEmail.includes('faculty') ? 'faculty' : targetEmail.includes('admin') ? 'admin' : 'student',
        usn: '1US22CS999',
        department_name: 'Computer Science & Engineering',
        semester: 6,
        section: 'A',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setUser(dynamicUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const loginAsDemoRole = (role: UserRole) => {
    const email = ROLE_EMAILS[role];
    if (DEMO_PROFILES[email]) {
      setUser(DEMO_PROFILES[email]);
    }
  };

  const switchRole = (role: UserRole) => {
    loginAsDemoRole(role);
  };

  const logout = () => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
  };

  const role = user?.role || 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isDemoMode,
        isLoading,
        login,
        loginAsDemoRole,
        logout,
        switchRole,
        isStudent: role === 'student',
        isFaculty: role === 'faculty',
        isParent: role === 'parent',
        isHOD: role === 'hod',
        isAdmin: role === 'admin',
        isPrincipal: role === 'principal',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
