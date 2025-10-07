import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  locale: 'en' | 'ne';
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
  _hasHydrated: boolean;
  
  setLocale: (locale: 'en' | 'ne') => void;
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      immer((set) => ({
        locale: 'ne',
        theme: 'light',
        fontSize: 'medium',
        sidebarOpen: false,
        mobileMenuOpen: false,
        notifications: [],
        _hasHydrated: false,
        
        setLocale: (locale) => set((state) => {
          state.locale = locale;
        }),
        
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),
        
        setFontSize: (size) => set((state) => {
          state.fontSize = size;
        }),
        
        toggleSidebar: () => set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        }),
        
        setSidebarOpen: (open) => set((state) => {
          state.sidebarOpen = open;
        }),
        
        toggleMobileMenu: () => set((state) => {
          state.mobileMenuOpen = !state.mobileMenuOpen;
        }),
        
        setMobileMenuOpen: (open) => set((state) => {
          state.mobileMenuOpen = open;
        }),
        
        addNotification: (notification) => set((state) => {
          const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
          };
          state.notifications.unshift(newNotification);
          
          if (state.notifications.length > 50) {
            state.notifications = state.notifications.slice(0, 50);
          }
        }),
        
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),
        
        clearNotifications: () => set((state) => {
          state.notifications = [];
        }),

        setHasHydrated: (hasHydrated) => set((state) => {
          state._hasHydrated = hasHydrated;
        }),
      })),
      {
        name: 'ui-store',
        partialize: (state) => ({
          locale: state.locale,
          theme: state.theme,
          fontSize: state.fontSize,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.setHasHydrated(true);
          }
        },
      }
    ),
    {
      name: 'ui-store',
    }
  )
);