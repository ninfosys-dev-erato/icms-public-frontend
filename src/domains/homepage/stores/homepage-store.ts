import { create } from 'zustand';
import { HomepageData, HomepageQuery } from '../types/homepage';
import { HomepageService } from '../services/homepage-service';

export interface HomepageStore {
  // State
  data: HomepageData | null;
  isLoading: boolean;
  error: string | null;
  currentLanguage: string;
  
  // Actions
  fetchHomepageData: (query?: HomepageQuery) => Promise<void>;
  setLanguage: (lang: string) => void;
  clearError: () => void;
}

export const useHomepageStore = create<HomepageStore>((set, get) => ({
  // Initial state
  data: null,
  isLoading: false,
  error: null,
  currentLanguage: 'en',

  // Actions
  fetchHomepageData: async (query: HomepageQuery = {}) => {
    const { currentLanguage } = get();
    
    set({ isLoading: true, error: null });
    
    try {
      const data = await HomepageService.getHomepageData({
        ...query,
        lang: query.lang || currentLanguage
      });
      
      set({ data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch homepage data';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setLanguage: (lang: string) => {
    set({ currentLanguage: lang });
    // Refetch data with new language
    get().fetchHomepageData({ lang });
  },

  clearError: () => {
    set({ error: null });
  }
}));
