# Nepal Government Portal - Development Guide

## Project Overview

This is a comprehensive government website built with NextJS 15+, Carbon UI, and modern enterprise patterns. The application follows domain-driven design principles and provides a scalable foundation for government services.

## Architecture

### Domain-Driven Design

The application is organized around four main bounded contexts:

1. **Content Management** (`src/domains/content-management/`)
   - News articles, documents, and services
   - Publication workflows and content lifecycle management

2. **User Management** (`src/domains/user-management/`)
   - Authentication, authorization, and user profiles
   - Role-based access control (RBAC)

3. **Service Delivery** (`src/domains/service-delivery/`)
   - Online service applications and tracking
   - Payment processing and document management

4. **Communication** (`src/domains/communication/`)
   - Contact management and complaint systems
   - Multi-channel communication workflows

### Technology Stack

- **Framework**: NextJS 15+ with App Router
- **UI Library**: Carbon Design System
- **State Management**: Zustand with persistence
- **Internationalization**: next-intl (English/Nepali)
- **Data Fetching**: SWR for client-side, native fetch for server-side
- **Validation**: Zod schemas
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Docker, GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (for production deployment)

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_URL=redis://localhost:6379
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
```

## Adding New Features

### 1. Creating a New Domain

When adding a new business domain:

1. Create domain directory: `src/domains/your-domain/`
2. Define types: `types.ts`
3. Create aggregates and value objects
4. Implement domain services

Example structure:
```
src/domains/your-domain/
├── types.ts          # Domain types and interfaces
├── entities/         # Domain entities
├── services/         # Domain services
└── validators/       # Validation schemas
```

### 2. Adding Repository Patterns

For data access:

1. Extend `BaseRepository<T>` class
2. Define entity schema with Zod
3. Implement domain-specific methods
4. Export repository instance

```typescript
import { BaseRepository } from '@/repositories/base-repository';

export class YourRepository extends BaseRepository<YourEntity> {
  protected entitySchema = YourEntitySchema;
  protected endpoint = '/your-endpoint';
  
  async customMethod(): Promise<YourEntity[]> {
    return this.findMany({ customFilter: true });
  }
}

export const yourRepository = new YourRepository();
```

### 3. Creating Services

Business logic services:

1. Create service class in `src/services/`
2. Inject repositories as dependencies
3. Implement SWR hooks for client-side data fetching
4. Handle error states and loading

```typescript
export class YourService {
  async getYourData(): Promise<YourEntity[]> {
    return yourRepository.findMany();
  }
}

export function useYourData() {
  return useSWR('your-data', () => yourService.getYourData());
}
```

### 4. Adding UI Components

Following Carbon UI patterns:

1. Create components in appropriate feature directories
2. Use Carbon components as base
3. Implement accessibility features
4. Support internationalization

```typescript
export function YourComponent() {
  const t = useTranslations('your-namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      {/* Your component JSX */}
    </div>
  );
}
```

### 5. State Management

Using Zustand stores:

1. Create store in `src/stores/`
2. Use immer middleware for immutable updates
3. Implement persistence for user preferences
4. Add devtools for debugging

```typescript
interface YourState {
  data: YourEntity[];
  setData: (data: YourEntity[]) => void;
}

export const useYourStore = create<YourState>()(
  devtools(
    persist(
      immer((set) => ({
        data: [],
        setData: (data) => set((state) => {
          state.data = data;
        }),
      })),
      { name: 'your-store' }
    )
  )
);
```

## Internationalization

### Adding New Translations

1. Add keys to `src/i18n/messages/en.json`
2. Add Nepali translations to `src/i18n/messages/ne.json`
3. Use `useTranslations` hook in components

### Translation Guidelines

- Use nested objects for organization
- Follow consistent naming conventions
- Include context for translators
- Support pluralization for Nepali

## Testing Strategy

### Unit Tests

- Test business logic in isolation
- Mock external dependencies
- Focus on edge cases and error handling

### Integration Tests

- Test API endpoints and data flow
- Verify repository and service integration
- Test authentication and authorization

### E2E Tests

- Test critical user journeys
- Verify accessibility compliance
- Test across different browsers

## Security Considerations

### Content Security Policy

- Strict CSP headers configured in middleware
- XSS protection and frame options
- Secure cookie configuration

### Authentication

- JWT token management with refresh
- Role-based access control
- Session timeout handling

### Data Protection

- Input validation with Zod schemas
- SQL injection prevention
- File upload security

## Performance Optimization

### Incremental Static Regeneration

- On-demand revalidation for content updates
- Background regeneration for performance
- Cache invalidation strategies

### Code Splitting

- Automatic route-based splitting
- Dynamic imports for large components
- Tree shaking for minimal bundles

### Image Optimization

- Next.js Image component usage
- WebP/AVIF format support
- Responsive image sizing

## Deployment

### Docker Deployment

```bash
docker build -t nepal-gov-portal .
docker run -p 3000:3000 nepal-gov-portal
```

### Production Environment

- Use Docker Compose for orchestration
- Configure reverse proxy with Nginx
- Set up SSL certificates
- Enable monitoring and logging

## Monitoring and Analytics

### Application Performance

- Core Web Vitals tracking
- Error monitoring with Sentry
- Custom performance metrics

### User Analytics

- Privacy-compliant tracking
- Government service usage metrics
- User journey analysis

## Contributing

### Code Standards

- Use TypeScript for type safety
- Follow ESLint configuration
- Write comprehensive tests
- Document public APIs

### Git Workflow

- Feature branches for new development
- Pull request reviews required
- Automated CI/CD pipeline
- Semantic versioning

## Troubleshooting

### Common Issues

1. **Build Failures**: Check TypeScript errors and ESLint warnings
2. **Runtime Errors**: Verify environment variables and API connections
3. **Performance Issues**: Check bundle size and rendering patterns
4. **Accessibility**: Run automated tests and manual verification

### Support

For technical support and questions:
- Review existing documentation
- Check GitHub issues
- Contact development team