# Project Structure Documentation

## New Domain-Driven Architecture

This project has been restructured to follow a **domain-driven design** approach, which provides better separation of concerns, improved maintainability, and enhanced scalability.

## New Structure Overview

```
src/
├── domains/                    # Domain-specific modules
│   ├── auth/                  # Authentication domain
│   │   ├── components/        # UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── repositories/      # Data access layer
│   │   ├── services/         # Business logic
│   │   ├── stores/           # State management
│   │   ├── styles/           # Domain-specific CSS
│   │   └── types/            # TypeScript interfaces
│   ├── content-management/    # Content and notices
│   ├── documents/            # Document management
│   ├── hr/                   # Human resources
│   ├── media/                # Media and file management
│   ├── office-description/   # Office information
│   ├── office-settings/      # Office configuration
│   ├── service-delivery/     # Service management
│   ├── sliders/              # Slider components
│   ├── user-management/      # User administration
│   └── users/                # User-related features
├── shared/                    # Shared components and utilities
│   ├── components/           # Common UI components
│   ├── hooks/                # Shared React hooks
│   ├── styles/               # Global styles
│   └── utils/                # Utility functions
├── lib/                       # Core libraries and configurations
├── stores/                    # Global state management
└── services/                  # Global services
```

## Key Benefits of New Structure

### 1. **Better Separation of Concerns**
- Each domain is self-contained with its own components, services, and types
- Clear boundaries between different business areas
- Easier to understand what belongs where

### 2. **Improved Maintainability**
- Related code is grouped together
- Changes to one domain don't affect others
- Easier to find and modify specific functionality

### 3. **Enhanced Scalability**
- New domains can follow the same pattern
- Consistent structure across all domains
- Easier to onboard new developers

### 4. **Cleaner Dependencies**
- Clear import paths
- Reduced circular dependencies
- Better tree-shaking potential

## Migration Status

### ✅ Completed
- [x] Created new domain structure
- [x] Moved content-management components and services
- [x] Moved media-related files
- [x] Moved office-description files
- [x] Moved service-delivery files
- [x] Moved shared components (Header, Navigation, etc.)
- [x] Created index files for clean exports
- [x] Set up locales folder structure

### 🔄 In Progress
- [ ] Moving remaining domain files
- [ ] Updating import statements
- [ ] Testing functionality

### 📋 Next Steps
- [ ] Move remaining components to appropriate domains
- [ ] Update all import statements throughout the codebase
- [ ] Remove old folder structures
- [ ] Verify all functionality works correctly
- [ ] Update documentation and README files

## Import Examples

### Before (Old Structure)
```typescript
import { NoticeCard } from '@/src/ui/components/notices/NoticeCard';
import { NoticeService } from '@/src/services/NoticeService';
```

### After (New Structure)
```typescript
import { NoticeCard, NoticeService } from '@/src/domains/content-management';
```

## Domain Responsibilities

### `content-management`
- Notices and announcements
- Content creation and editing
- Search functionality
- Content filtering and categorization

### `media`
- File uploads and management
- Image and document handling
- Media library organization

### `office-description`
- Office information display
- Directory listings
- Contact information

### `service-delivery`
- Service management
- Service categories
- Service availability

### `shared`
- Navigation components
- Header and footer
- Common UI elements
- Language switching

## Notes

- **No tests included**: Testing structure will be added later
- **Gradual migration**: Old and new structures coexist during transition
- **Backward compatibility**: Import paths will be updated systematically
- **Documentation**: Each domain should have its own README explaining its purpose

## Getting Started

1. **Explore the new structure** in `src/domains/`
2. **Use the new import paths** for new development
3. **Follow the domain pattern** when adding new features
4. **Update existing imports** gradually to avoid breaking changes
