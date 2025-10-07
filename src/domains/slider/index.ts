// Slider Components
export { SliderContainer } from './components/SliderContainer';
export { SliderItem } from './components/SliderItem';
export { SliderNavigation } from './components/SliderNavigation';
export { SliderIndicators } from './components/SliderIndicators';
export { EmployeeCard } from './components/EmployeeCard';

// Slider Hooks
export { useSlider, useSliderControl, useSliderAutoPlay, useSliderAnalytics } from './hooks/useSlider';
export { useEmployees, useEmployeeSearch } from './hooks/useEmployees';

// Slider Services
export { SliderService } from './services/SliderService';
export { EmployeeService } from './services/EmployeeService';

// Slider Repositories
export { SliderRepository } from './repositories/SliderRepository';
export { EmployeeRepository } from './repositories/EmployeeRepository';

// Slider Types
export type * from './types/slider';
export type * from './types/employee';

// Slider Stores
export * from './stores/slider-store';
