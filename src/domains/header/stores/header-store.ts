import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HeaderUIStore {
  // Current locale
  currentLocale: 'ne' | 'en';
  
  // Locale Actions
  setLocale: (locale: 'ne' | 'en') => void;
}

export const useHeaderStore = create<HeaderUIStore>()(
  persist(
    (set) => ({
      // Current locale
      currentLocale: 'en',
      
      // Locale Actions
      setLocale: (locale: 'ne' | 'en') => {
        set({ currentLocale: locale });
      },
    }),
    {
      name: 'header-ui-store',
      // Only persist locale preference
      partialize: (state) => ({
        currentLocale: state.currentLocale,
      }),
    }
  )
);

// Locale state selectors
export const useHeaderCurrentLocale = () => useHeaderStore((state) => state.currentLocale);

// Locale action selectors
export const useHeaderSetLocale = () => useHeaderStore((state) => state.setLocale);