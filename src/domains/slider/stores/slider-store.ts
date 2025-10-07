import { create } from 'zustand';
import { SliderData, SliderState } from '../types/slider';
import { SliderService } from '../services/SliderService';

interface SliderStore extends SliderState {
  // Actions
  fetchSliderData: (locale: 'ne' | 'en') => Promise<void>;
  setLocale: (locale: 'ne' | 'en') => void;
  clearError: () => void;
  reset: () => void;
  
  // Slider control actions
  setCurrentIndex: (index: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  play: () => void;
  pause: () => void;
  setTransitioning: (isTransitioning: boolean) => void;
  
  // Computed getters
  hasData: () => boolean;
  isReady: () => boolean;
  currentSlider: () => any;
  totalSlides: () => number;
}

const initialState: SliderState = {
  data: null,
  isLoading: false,
  error: null,
  locale: 'en',
};

const sliderService = new SliderService();

export const useSliderStore = create<SliderStore>((set, get) => ({
  // State
  ...initialState,

  // Actions
  fetchSliderData: async (locale: 'ne' | 'en') => {
    const currentState = get();
    
    // Don't fetch if already loading for the same locale
    if (currentState.isLoading && currentState.locale === locale) {
      return;
    }

    set({ isLoading: true, error: null, locale });

    try {
      const data = await sliderService.getSliderData(locale);
      
      console.log('SliderStore: Received data from service:', data);
      
      // Validate data before setting
      if (data && data.sliders && data.sliders.length > 0) {
        // Ensure currentIndex is initialized to 0 for the first slider
        const sliderData = {
          ...data,
          currentIndex: 0, // Always start with the first slider
          isPlaying: false,
          isTransitioning: false
        };
        
        console.log('SliderStore: Setting processed data:', sliderData);
        
        set({ 
          data: sliderData, 
          isLoading: false, 
          error: null, 
          locale 
        });
      } else {
        console.log('SliderStore: No valid sliders found in data:', data);
        throw new Error('No valid sliders found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch slider data';
      
      console.error('Slider store error:', error);
      set({ 
        data: null, 
        isLoading: false, 
        error: errorMessage, 
        locale 
      });
    }
  },

  setLocale: (locale: 'ne' | 'en') => {
    const currentState = get();
    
    if (currentState.locale !== locale) {
      set({ locale });
      // Optionally refetch data for new locale
      get().fetchSliderData(locale);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },

  // Slider control actions
  setCurrentIndex: (index: number) => {
    const state = get();
    if (state.data && index >= 0 && index < state.data.sliders.length) {
      set({
        data: state.data ? {
          ...state.data,
          currentIndex: index
        } : null
      });
    }
  },

  nextSlide: () => {
    const state = get();
    if (state.data && state.data.sliders.length > 0) {
      const nextIndex = sliderService.getNextIndex(
        state.data.currentIndex, 
        state.data.sliders.length
      );
      set({
        data: {
          ...state.data,
          currentIndex: nextIndex
        }
      });
    }
  },

  previousSlide: () => {
    const state = get();
    if (state.data && state.data.sliders.length > 0) {
      const prevIndex = sliderService.getPreviousIndex(
        state.data.currentIndex, 
        state.data.sliders.length
      );
      set({
        data: {
          ...state.data,
          currentIndex: prevIndex
        }
      });
    }
  },

  play: () => {
    const state = get();
    if (state.data) {
      set({
        data: {
          ...state.data,
          isPlaying: true
        }
      });
    }
  },

  pause: () => {
    const state = get();
    if (state.data) {
      set({
        data: {
          ...state.data,
          isPlaying: false
        }
      });
    }
  },

  setTransitioning: (isTransitioning: boolean) => {
    const state = get();
    if (state.data) {
      set({
        data: {
          ...state.data,
          isTransitioning
        }
      });
    }
  },

  // Computed getters
  hasData: () => {
    const state = get();
    return Boolean(state.data && state.data.sliders && state.data.sliders.length > 0);
  },

  isReady: () => {
    const state = get();
    return !state.isLoading && state.hasData();
  },

  currentSlider: () => {
    const state = get();
    if (state.data && state.data.sliders.length > 0) {
      return state.data.sliders[state.data.currentIndex];
    }
    return null;
  },

  totalSlides: () => {
    const state = get();
    return state.data?.sliders?.length || 0;
  },
}));

// Simple selectors with stable references
export const useSliderData = () => useSliderStore((state) => state.data);
export const useSliderLoading = () => useSliderStore((state) => state.isLoading);
export const useSliderError = () => useSliderStore((state) => state.error);
export const useSliderLocale = () => useSliderStore((state) => state.locale);

// Individual action selectors to prevent re-renders
export const useSliderFetchData = () => useSliderStore((state) => state.fetchSliderData);
export const useSliderSetLocale = () => useSliderStore((state) => state.setLocale);
export const useSliderClearError = () => useSliderStore((state) => state.clearError);
export const useSliderReset = () => useSliderStore((state) => state.reset);

// Slider control selectors
export const useSliderSetCurrentIndex = () => useSliderStore((state) => state.setCurrentIndex);
export const useSliderNextSlide = () => useSliderStore((state) => state.nextSlide);
export const useSliderPreviousSlide = () => useSliderStore((state) => state.previousSlide);
export const useSliderPlay = () => useSliderStore((state) => state.play);
export const useSliderPause = () => useSliderStore((state) => state.pause);
export const useSliderSetTransitioning = () => useSliderStore((state) => state.setTransitioning);

// Computed selectors
export const useIsSliderReady = () => useSliderStore((state) => state.isReady());
export const useHasSliderData = () => useSliderStore((state) => state.hasData());
export const useCurrentSlider = () => useSliderStore((state) => state.currentSlider());
export const useTotalSlides = () => useSliderStore((state) => state.totalSlides());
