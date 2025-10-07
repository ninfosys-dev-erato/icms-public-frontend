import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UserPreferencesState {
  // Language and localization
  locale: 'ne' | 'en'
  preferredLocale: 'ne' | 'en'
  
  // Calendar preferences
  calendarFormat: 'BS' | 'AD' | 'both'
  numeralFormat: 'devanagari' | 'latin' | 'auto'
  
  // Display preferences
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  fontFamily: 'default' | 'noto-sans-devanagari' | 'ibm-plex-sans'
  highContrast: boolean
  
  // Content preferences
  contentLanguage: 'ne' | 'en' | 'both'
  showTranslations: boolean
  preferredContentTypes: string[]
  
  // Layout preferences
  compactMode: boolean
  showSidebar: boolean
  sidebarPosition: 'left' | 'right'
  
  // Search preferences
  searchResultsPerPage: 10 | 20 | 50 | 100
  searchSortBy: 'relevance' | 'date' | 'title'
  saveSearchHistory: boolean
  
  // Accessibility preferences
  reducedMotion: boolean
  screenReaderMode: boolean
  keyboardNavigation: boolean
  
  // Notification preferences
  showNotifications: boolean
  notificationPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  
  // Actions
  setLocale: (locale: 'ne' | 'en') => void
  setPreferredLocale: (locale: 'ne' | 'en') => void
  
  setCalendarFormat: (format: 'BS' | 'AD' | 'both') => void
  setNumeralFormat: (format: 'devanagari' | 'latin' | 'auto') => void
  
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void
  setFontFamily: (family: 'default' | 'noto-sans-devanagari' | 'ibm-plex-sans') => void
  setHighContrast: (enabled: boolean) => void
  
  setContentLanguage: (language: 'ne' | 'en' | 'both') => void
  setShowTranslations: (show: boolean) => void
  setPreferredContentTypes: (types: string[]) => void
  
  setCompactMode: (enabled: boolean) => void
  setShowSidebar: (show: boolean) => void
  setSidebarPosition: (position: 'left' | 'right') => void
  
  setSearchResultsPerPage: (count: 10 | 20 | 50 | 100) => void
  setSearchSortBy: (sortBy: 'relevance' | 'date' | 'title') => void
  setSaveSearchHistory: (save: boolean) => void
  
  setReducedMotion: (enabled: boolean) => void
  setScreenReaderMode: (enabled: boolean) => void
  setKeyboardNavigation: (enabled: boolean) => void
  
  setShowNotifications: (show: boolean) => void
  setNotificationPosition: (position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => void
  
  // Helper methods
  resetToDefaults: () => void
  exportPreferences: () => string
  importPreferences: (preferences: string) => void
  getCurrentDateFormat: () => 'BS' | 'AD'
  getCurrentNumeralType: () => 'devanagari' | 'latin'
  getEffectiveTheme: () => 'light' | 'dark'
}

const defaultPreferences: Omit<UserPreferencesState, keyof UserPreferencesState> & Partial<UserPreferencesState> = {
  locale: 'ne',
  preferredLocale: 'ne',
  
  calendarFormat: 'both',
  numeralFormat: 'auto',
  
  theme: 'auto',
  fontSize: 'medium',
  fontFamily: 'default',
  highContrast: false,
  
  contentLanguage: 'both',
  showTranslations: true,
  preferredContentTypes: ['news', 'announcement', 'article'],
  
  compactMode: false,
  showSidebar: true,
  sidebarPosition: 'left',
  
  searchResultsPerPage: 20,
  searchSortBy: 'relevance',
  saveSearchHistory: true,
  
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: false,
  
  showNotifications: true,
  notificationPosition: 'top-right',
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        ...defaultPreferences,
        
        // Language actions
        setLocale: (locale) => set((state) => {
          state.locale = locale
        }),
        
        setPreferredLocale: (locale) => set((state) => {
          state.preferredLocale = locale
        }),
        
        // Calendar actions
        setCalendarFormat: (format) => set((state) => {
          state.calendarFormat = format
        }),
        
        setNumeralFormat: (format) => set((state) => {
          state.numeralFormat = format
        }),
        
        // Theme actions
        setTheme: (theme) => set((state) => {
          state.theme = theme
        }),
        
        setFontSize: (size) => set((state) => {
          state.fontSize = size
        }),
        
        setFontFamily: (family) => set((state) => {
          state.fontFamily = family
        }),
        
        setHighContrast: (enabled) => set((state) => {
          state.highContrast = enabled
        }),
        
        // Content actions
        setContentLanguage: (language) => set((state) => {
          state.contentLanguage = language
        }),
        
        setShowTranslations: (show) => set((state) => {
          state.showTranslations = show
        }),
        
        setPreferredContentTypes: (types) => set((state) => {
          state.preferredContentTypes = types
        }),
        
        // Layout actions
        setCompactMode: (enabled) => set((state) => {
          state.compactMode = enabled
        }),
        
        setShowSidebar: (show) => set((state) => {
          state.showSidebar = show
        }),
        
        setSidebarPosition: (position) => set((state) => {
          state.sidebarPosition = position
        }),
        
        // Search actions
        setSearchResultsPerPage: (count) => set((state) => {
          state.searchResultsPerPage = count
        }),
        
        setSearchSortBy: (sortBy) => set((state) => {
          state.searchSortBy = sortBy
        }),
        
        setSaveSearchHistory: (save) => set((state) => {
          state.saveSearchHistory = save
        }),
        
        // Accessibility actions
        setReducedMotion: (enabled) => set((state) => {
          state.reducedMotion = enabled
        }),
        
        setScreenReaderMode: (enabled) => set((state) => {
          state.screenReaderMode = enabled
        }),
        
        setKeyboardNavigation: (enabled) => set((state) => {
          state.keyboardNavigation = enabled
        }),
        
        // Notification actions
        setShowNotifications: (show) => set((state) => {
          state.showNotifications = show
        }),
        
        setNotificationPosition: (position) => set((state) => {
          state.notificationPosition = position
        }),
        
        // Helper methods
        resetToDefaults: () => set((state) => {
          Object.assign(state, defaultPreferences)
        }),
        
        exportPreferences: () => {
          const state = get()
          return JSON.stringify({
            locale: state.locale,
            preferredLocale: state.preferredLocale,
            calendarFormat: state.calendarFormat,
            numeralFormat: state.numeralFormat,
            theme: state.theme,
            fontSize: state.fontSize,
            fontFamily: state.fontFamily,
            highContrast: state.highContrast,
            contentLanguage: state.contentLanguage,
            showTranslations: state.showTranslations,
            preferredContentTypes: state.preferredContentTypes,
            compactMode: state.compactMode,
            showSidebar: state.showSidebar,
            sidebarPosition: state.sidebarPosition,
            searchResultsPerPage: state.searchResultsPerPage,
            searchSortBy: state.searchSortBy,
            saveSearchHistory: state.saveSearchHistory,
            reducedMotion: state.reducedMotion,
            screenReaderMode: state.screenReaderMode,
            keyboardNavigation: state.keyboardNavigation,
            showNotifications: state.showNotifications,
            notificationPosition: state.notificationPosition,
          })
        },
        
        importPreferences: (preferences) => set((state) => {
          try {
            const parsed = JSON.parse(preferences)
            Object.assign(state, parsed)
          } catch (error) {
            console.error('Failed to import preferences:', error)
          }
        }),
        
        getCurrentDateFormat: () => {
          const { calendarFormat } = get()
          if (calendarFormat === 'both') {
            // Default to BS for Nepal
            return 'BS'
          }
          return calendarFormat
        },
        
        getCurrentNumeralType: () => {
          const { numeralFormat, locale } = get()
          if (numeralFormat === 'auto') {
            return locale === 'ne' ? 'devanagari' : 'latin'
          }
          return numeralFormat
        },
        
        getEffectiveTheme: () => {
          const { theme } = get()
          if (theme === 'auto') {
            // Check system preference
            if (typeof window !== 'undefined' && window.matchMedia) {
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            }
            return 'light'
          }
          return theme
        },
      })),
      {
        name: 'user-preferences-store',
        // Persist all preferences
      }
    ),
    {
      name: 'user-preferences-store',
    }
  )
)

// Selector hooks for optimized re-renders
export const useLocalePreferences = () => useUserPreferencesStore((state) => ({
  locale: state.locale,
  preferredLocale: state.preferredLocale,
  setLocale: state.setLocale,
  setPreferredLocale: state.setPreferredLocale,
}))

export const useCalendarPreferences = () => useUserPreferencesStore((state) => ({
  calendarFormat: state.calendarFormat,
  numeralFormat: state.numeralFormat,
  setCalendarFormat: state.setCalendarFormat,
  setNumeralFormat: state.setNumeralFormat,
  getCurrentDateFormat: state.getCurrentDateFormat,
  getCurrentNumeralType: state.getCurrentNumeralType,
}))

export const useThemePreferences = () => useUserPreferencesStore((state) => ({
  theme: state.theme,
  fontSize: state.fontSize,
  fontFamily: state.fontFamily,
  highContrast: state.highContrast,
  setTheme: state.setTheme,
  setFontSize: state.setFontSize,
  setFontFamily: state.setFontFamily,
  setHighContrast: state.setHighContrast,
  getEffectiveTheme: state.getEffectiveTheme,
}))

export const useContentPreferences = () => useUserPreferencesStore((state) => ({
  contentLanguage: state.contentLanguage,
  showTranslations: state.showTranslations,
  preferredContentTypes: state.preferredContentTypes,
  setContentLanguage: state.setContentLanguage,
  setShowTranslations: state.setShowTranslations,
  setPreferredContentTypes: state.setPreferredContentTypes,
}))

export const useAccessibilityPreferences = () => useUserPreferencesStore((state) => ({
  reducedMotion: state.reducedMotion,
  screenReaderMode: state.screenReaderMode,
  keyboardNavigation: state.keyboardNavigation,
  setReducedMotion: state.setReducedMotion,
  setScreenReaderMode: state.setScreenReaderMode,
  setKeyboardNavigation: state.setKeyboardNavigation,
}))