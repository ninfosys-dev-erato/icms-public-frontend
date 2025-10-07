// Components
export { HomepageContainer } from './components/HomepageContainer';
export { HeroSection } from './components/HeroSection';
export { ServicesSection } from './components/ServicesSection';
export { NewsSection } from './components/NewsSection';
export { ContactSection } from './components/ContactSection';

// Legacy Components (keeping for backward compatibility)
export { HomepageHero } from './components/HomepageHero';
export { HomepageServices } from './components/HomepageServices';
export { HomepageHighlights } from './components/HomepageHighlights';
export { HomepageNews } from './components/HomepageNews';
export { HomepageContact } from './components/HomepageContact';
export { HomepageFooter } from './components/HomepageFooter';

// Services
export { HomepageService } from './services/homepage-service';

// Stores
export { useHomepageStore } from './stores/homepage-store';

// Types
export type {
  HomepageData,
  HeaderData,
  NavigationItem,
  SocialMediaData,
  HeroData,
  HeroStatistic,
  ServiceData,
  HighlightData,
  NewsData,
  ContactData,
  ContactPerson,
  FooterData,
  OfficeHours,
  ImportantLink,
  HomepageApiResponse,
  HomepageQuery,
  FallbackData
} from './types/homepage';

// Data
export { fallbackHomepageData } from './data/fallback-data';
