// Simple theme interface without Carbon dependency
interface SimpleTheme {
  colors: Record<string, string>;
}

export const governmentTheme: SimpleTheme = {
  // Nepal Government Brand Colors
  colors: {
    // Primary - Nepal Flag Blue
    primary: '#0066CC',
    primaryHover: '#0052A3',
    primaryActive: '#003D7A',
    
    // Secondary - Nepal Flag Red
    secondary: '#E31837',
    secondaryHover: '#B61429',
    secondaryActive: '#8A0F1E',
    
    // Neutral colors
    background: '#FFFFFF',
    layer01: '#F4F4F4',
    layer02: '#FFFFFF',
    layer03: '#E0E0E0',
    
    // Text colors
    text01: '#161616',
    text02: '#525252',
    text03: '#A8A8A8',
    text04: '#FFFFFF',
    text05: '#6F6F6F',
    
    // Interactive colors
    interactive01: '#0066CC',
    interactive02: '#393939',
    interactive03: '#0066CC',
    interactive04: '#0066CC',
    
    // UI colors
    ui01: '#F4F4F4',
    ui02: '#FFFFFF',
    ui03: '#E0E0E0',
    ui04: '#8D8D8D',
    ui05: '#161616',
    
    // Button colors
    buttonPrimary: '#0066CC',
    buttonSecondary: '#393939',
    buttonTertiary: '#0066CC',
    buttonDanger: '#DA1E28',
    
    // Support colors
    support01: '#DA1E28', // Error
    support02: '#198038', // Success
    support03: '#F1C21B', // Warning
    support04: '#0043CE', // Info
    
    // Focus colors
    focus: '#0066CC',
    focusInset: '#FFFFFF',
    
    // Hover colors
    hoverPrimary: '#0052A3',
    hoverPrimaryText: '#044317',
    hoverSecondary: '#4C4C4C',
    hoverTertiary: '#0052A3',
    hoverUI: '#E5E5E5',
    hoverLightUI: '#E5E5E5',
    hoverSelectedUI: '#CACACA',
    hoverDanger: '#B81921',
    hoverRow: '#E5E5E5',
    
    // Active colors
    activePrimary: '#003D7A',
    activeSecondary: '#6F6F6F',
    activeTertiary: '#003D7A',
    activeUI: '#C6C6C6',
    activeLightUI: '#C6C6C6',
    activeDanger: '#750E13',
    
    // Selected colors
    selectedUI: '#E0E0E0',
    selectedLightUI: '#E0E0E0',
    
    // Highlight color
    highlight: '#D0E2FF',
    
    // Skeleton colors
    skeleton01: '#E5E5E5',
    skeleton02: '#C6C6C6',
    
    // Brand colors
    brand01: '#0066CC',
    brand02: '#393939',
    brand03: '#0066CC',
    
    // Visited link color
    visitedLink: '#8A3FFC',
    
    // Disabled colors
    disabled01: '#F4F4F4',
    disabled02: '#C6C6C6',
    disabled03: '#8D8D8D',
  },
};

export const accessibilityTheme = {
  ...governmentTheme,
  colors: {
    ...governmentTheme.colors,
    // High contrast mode adjustments
    background: '#000000',
    layer01: '#262626',
    layer02: '#393939',
    text01: '#FFFFFF',
    text02: '#C6C6C6',
    interactive01: '#78A9FF',
    focus: '#78A9FF',
  },
};

export const governmentBreakpoints = {
  sm: '320px',   // Mobile
  md: '672px',   // Tablet
  lg: '1056px',  // Desktop
  xl: '1312px',  // Large desktop
  max: '1584px', // Max width
};