// Service Layer Dependency Injection Container

// New public services (singleton exports)
export * from './PublicContentService'
export * from './NavigationService'
export * from './OfficeService'
export * from './PublicSearchService'
export * from './MediaService'

// Service instances for easy importing
export { publicContentService } from './PublicContentService'
export { navigationService } from './NavigationService'
export { officeService } from './OfficeService'
export { publicSearchService } from './PublicSearchService'
export { mediaService } from './MediaService'

// Export as services object for easy importing
export const services = {
  // Public services
  publicContent: require('./PublicContentService').publicContentService,
  navigation: require('./NavigationService').navigationService,
  office: require('./OfficeService').officeService,
  publicSearch: require('./PublicSearchService').publicSearchService,
  media: require('./MediaService').mediaService,
} as const;

// Type for the services container
export type Services = typeof services;

