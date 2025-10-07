import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UserEntity, Session } from '@/domains/user-management/types';

interface UserState {
  currentUser: UserEntity | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: UserEntity | null) => void;
  setSession: (session: Session | null) => void;
  updateUser: (updates: Partial<UserEntity>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  
  hasPermission: (resource: string, action: string) => boolean;
  canAccessDepartment: (departmentId: string) => boolean;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set, get) => ({
        currentUser: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        
        setUser: (user) => set((state) => {
          state.currentUser = user;
          state.isAuthenticated = !!user;
          state.error = null;
        }),
        
        setSession: (session) => set((state) => {
          state.session = session;
          state.isAuthenticated = !!session && new Date(session.expiresAt) > new Date();
        }),
        
        updateUser: (updates) => set((state) => {
          if (state.currentUser) {
            Object.assign(state.currentUser, updates);
          }
        }),
        
        setLoading: (loading) => set((state) => {
          state.isLoading = loading;
        }),
        
        setError: (error) => set((state) => {
          state.error = error;
        }),
        
        logout: () => set((state) => {
          state.currentUser = null;
          state.session = null;
          state.isAuthenticated = false;
          state.error = null;
        }),
        
        hasPermission: (resource, action) => {
          const { currentUser } = get();
          if (!currentUser) return false;
          
          return currentUser.permissions.some(permission => 
            permission.resource === resource && 
            permission.action === action as any
          );
        },
        
        canAccessDepartment: (departmentId) => {
          const { currentUser } = get();
          if (!currentUser) return false;
          
          if (currentUser.role.level === 'system_admin') return true;
          if (currentUser.role.level === 'department_admin' && currentUser.department === departmentId) return true;
          
          return currentUser.permissions.some(permission => 
            permission.scope === 'all' || 
            (permission.scope === 'department' && currentUser.department === departmentId)
          );
        },
      })),
      {
        name: 'user-store',
        partialize: (state) => ({
          session: state.session,
        }),
      }
    ),
    {
      name: 'user-store',
    }
  )
);