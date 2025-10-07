# Homepage Domain

This directory contains the complete homepage implementation for the Nepal Government Portal, following Carbon UI design principles and the established domain architecture pattern.

## Architecture

The homepage follows the established domain-driven architecture pattern used throughout the application:

```
src/domains/homepage/
├── components/          # React components
├── services/           # Business logic and API calls
├── stores/             # State management (Zustand)
├── types/              # TypeScript type definitions
├── data/               # Fallback/dummy data
├── styles/             # Domain-specific CSS
└── index.ts            # Public API exports
```

## Components

### Core Components

- **HomepageContainer**: Main orchestrator component that manages the overall layout
- **HomepageHeader**: Header with navigation, search, and language switching
- **HomepageHero**: Hero section with GIOMS statistics and call-to-action
- **HomepageServices**: Services grid displaying government digital services
- **HomepageHighlights**: Important announcements and notices
- **HomepageNews**: Latest news with download links
- **HomepageContact**: Contact information sidebar for key personnel
- **HomepageFooter**: Footer with office details and important links

### Component Features

- **Carbon UI Adherence**: All components use Carbon Design System components
- **Responsive Design**: Mobile-first approach with Carbon's responsive grid
- **Accessibility**: Proper ARIA labels, skip links, and keyboard navigation
- **Internationalization**: Full English/Nepali language support
- **Loading States**: Skeleton placeholders during data fetching

## Services

### HomepageService

The `HomepageService` class handles all API interactions:

- **getHomepageData()**: Fetches complete homepage data
- **getNavigationData()**: Fetches navigation menu data
- **getOfficeSettings()**: Fetches office configuration
- **getImportantLinks()**: Fetches footer links
- **getHighlights()**: Fetches highlights/announcements
- **getNews()**: Fetches news items
- **getServices()**: Fetches services data
- **getContactInfo()**: Fetches contact information

### API Integration

- **Fallback Strategy**: Uses dummy data when backend is unavailable
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Language Support**: Fetches data in the appropriate language
- **Caching**: Integrates with React Query for efficient data management

## State Management

### useHomepageStore

Zustand store for homepage state:

```typescript
interface HomepageStore {
  data: HomepageData | null;
  isLoading: boolean;
  error: string | null;
  currentLanguage: string;
  
  fetchHomepageData: (query?: HomepageQuery) => Promise<void>;
  setLanguage: (lang: string) => void;
  clearError: () => void;
}
```

## Styling

### CSS Architecture

- **Domain-Scoped**: All styles are scoped to the homepage domain
- **Carbon Variables**: Uses Carbon Design System CSS variables
- **Responsive**: Mobile-first responsive design with breakpoints
- **Accessibility**: High contrast and focus styles
- **Performance**: Optimized animations with reduced motion support

### Key CSS Classes

- `.homepage`: Root container
- `.homepage-header`: Header styling
- `.homepage-hero`: Hero section styling
- `.homepage-services`: Services grid styling
- `.homepage-content`: Content sections styling
- `.homepage-footer`: Footer styling

## Data Structure

### HomepageData Interface

```typescript
interface HomepageData {
  header: HeaderData;           // Navigation and branding
  hero: HeroData;              // Main hero section
  services: ServiceData[];      // Government services
  highlights: HighlightData[];  // Important announcements
  news: NewsData[];            // Latest news
  contact: ContactData;        // Contact information
  footer: FooterData;          // Footer content
}
```

### Translatable Content

All text content supports both English and Nepali:

```typescript
interface TranslatableEntity {
  en: string;  // English text
  ne: string;  // Nepali text (नेपाली पाठ)
}
```

## Usage

### Basic Implementation

```tsx
import { HomepageContainer } from '@/domains/homepage';

export default function HomePage() {
  return <HomepageContainer />;
}
```

### Custom Implementation

```tsx
import { useHomepageStore, HomepageHeader, HomepageHero } from '@/domains/homepage';

export default function CustomHomePage() {
  const { data, isLoading } = useHomepageStore();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <HomepageHeader data={data.header} />
      <HomepageHero data={data.hero} />
      {/* Custom content */}
    </div>
  );
}
```

## API Integration

### Backend Endpoints

The homepage integrates with these backend endpoints:

- `GET /api/homepage` - Complete homepage data
- `GET /api/menus/location/HEADER` - Navigation data
- `GET /api/office-settings` - Office configuration
- `GET /api/important-links/footer` - Footer links
- `GET /api/content/featured` - Highlights and news
- `GET /api/content` - Content items
- `GET /api/hr/employees/contact` - Contact information

### Response Format

All API responses follow the standard format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}
```

## Internationalization

### Language Support

- **English (en)**: Primary language
- **Nepali (ne)**: Native language support with proper fonts

### Language Switching

- URL-based routing (`/en/`, `/ne/`)
- Dynamic content loading
- Font family switching for Nepali text

## Responsive Design

### Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

### Grid System

Uses Carbon's responsive grid system:

```tsx
<Grid fullWidth>
  <Column lg={8} md={8} sm={4}>
    {/* Content */}
  </Column>
</Grid>
```

## Accessibility

### Features

- **Skip Links**: Skip to main content
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

## Performance

### Optimizations

- **Lazy Loading**: Components load on demand
- **Skeleton States**: Loading placeholders
- **Error Boundaries**: Graceful error handling
- **Memoization**: Prevents unnecessary re-renders
- **Code Splitting**: Domain-based code splitting

## Testing

### Component Testing

Each component should be tested for:

- **Rendering**: Proper display of content
- **Interactions**: User interactions and state changes
- **Accessibility**: ARIA compliance and keyboard navigation
- **Responsiveness**: Different screen sizes
- **Internationalization**: Language switching

### Integration Testing

Test the complete homepage flow:

- Data fetching and loading states
- Language switching
- Error handling
- Responsive behavior

## Future Enhancements

### Planned Features

- **Real-time Updates**: Live data updates
- **Advanced Search**: Full-text search functionality
- **Personalization**: User-specific content
- **Analytics**: User behavior tracking
- **Performance Monitoring**: Core Web Vitals tracking

### Backend Integration

- **Content Management**: Admin panel for content updates
- **Dynamic Navigation**: Configurable navigation structure
- **Media Management**: Image and document management
- **User Authentication**: Protected content areas

## Troubleshooting

### Common Issues

1. **Data Not Loading**: Check API endpoints and fallback data
2. **Language Not Switching**: Verify locale routing configuration
3. **Styling Issues**: Check Carbon CSS import and custom CSS
4. **Performance Issues**: Monitor bundle size and loading times

### Debug Mode

Enable debug logging in the store:

```typescript
const { data, isLoading, error } = useHomepageStore();
console.log('Homepage State:', { data, isLoading, error });
```

## Contributing

When contributing to the homepage:

1. Follow the established component patterns
2. Use Carbon UI components consistently
3. Maintain responsive design principles
4. Add proper TypeScript types
5. Include accessibility features
6. Test across different screen sizes
7. Update this documentation

## License

This homepage implementation follows the same license as the main application.
