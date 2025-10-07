import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { HeaderData, HeaderConfigResponse } from '../types/header';
import { HeaderService } from '../services/HeaderService';

interface HeaderState {
  data: HeaderData | null;
  config: HeaderConfigResponse | null;
  isLoading: boolean;
  error: string | null;
  currentLocale: string;
  lastFetchTime: number;
  isFetching: boolean;
}

interface HeaderActions {
  fetchHeaderData: (locale: string) => Promise<void>;
  fetchActiveConfig: () => Promise<void>;
  setLocale: (locale: string) => void;
  clearError: () => void;
  reset: () => void;
}

interface HeaderStore extends HeaderState, HeaderActions {}

const initialState: HeaderState = {
  data: null,
  config: null,
  isLoading: false,
  error: null,
  currentLocale: 'en',
  lastFetchTime: 0,
  isFetching: false,
};

export const useHeaderStore = create<HeaderStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchHeaderData: async (locale: string) => {
        const state = get();
        const now = Date.now();
        
        // Prevent rapid successive calls (debounce)
        if (state.isFetching || (now - state.lastFetchTime < 1000)) {
          return;
        }
        
        try {
          set({ isLoading: true, error: null, isFetching: true, lastFetchTime: now });
          
          // Create service instance once and reuse
          if (!state.data || state.currentLocale !== locale) {
            const headerService = new HeaderService();
            const data = await headerService.getHeaderData(locale);
            set({ 
              data, 
              isLoading: false, 
              currentLocale: locale,
              error: null,
              isFetching: false
            });
          } else {
            set({ isLoading: false, isFetching: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch header data', 
            isLoading: false,
            isFetching: false
          });
        }
      },

      fetchActiveConfig: async () => {
        try {
          set({ isLoading: true, error: null });
          const headerService = new HeaderService();
          const config = await headerService.getActiveHeaderConfig();
          set({ 
            config, 
            isLoading: false, 
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch header config', 
            isLoading: false 
          });
        }
      },

      setLocale: (locale: string) => {
        set({ currentLocale: locale });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'header-store',
    }
  )
);
