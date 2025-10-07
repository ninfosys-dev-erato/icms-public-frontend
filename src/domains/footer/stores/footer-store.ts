import { create } from 'zustand';
import { FooterData } from '../types/footer';

interface FooterState {
  data: FooterData | null;
  isLoading: boolean;
  error: string | null;
  locale: 'en' | 'ne';
}

interface FooterActions {
  setData: (data: FooterData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLocale: (locale: 'en' | 'ne') => void;
  reset: () => void;
}

interface FooterStore extends FooterState, FooterActions {}

const initialState: FooterState = {
  data: null,
  isLoading: false,
  error: null,
  locale: 'en',
};

export const useFooterStore = create<FooterStore>((set) => ({
  ...initialState,

  setData: (data: FooterData) => set({ data }),
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  
  setError: (error: string | null) => set({ error }),
  
  setLocale: (locale: 'en' | 'ne') => set({ locale }),
  
  reset: () => set(initialState),
}));

// Selector hooks for better performance
export const useFooterData = () => useFooterStore((state) => state.data);
export const useFooterLoading = () => useFooterStore((state) => state.isLoading);
export const useFooterError = () => useFooterStore((state) => state.error);
export const useFooterLocale = () => useFooterStore((state) => state.locale);

export const useFooterActions = () => useFooterStore((state) => ({
  setData: state.setData,
  setLoading: state.setLoading,
  setError: state.setError,
  setLocale: state.setLocale,
  reset: state.reset,
}));
