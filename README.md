# Nepal Government Portal

A modern, Carbon-first, Next.js application for Nepal government offices built with a layered architecture approach.

## 🏛️ Project Overview

A production-ready, WCAG 2.1 AA compliant government portal featuring strict layered architecture, comprehensive internationalization (Nepali/English), dual calendar support (BS/AD), and enterprise-grade security. Built for Nepal's government offices with Carbon Design System and advanced search capabilities.

## ✨ Key Features

### 🌐 Multilingual Support
- **English/Nepali** language switching with URL-based routing
- **Nepal Sambat** calendar integration alongside Gregorian dates
- **Unicode Devanagari** script rendering with proper font support
- **Cultural localization** with government terminology maintenance

### 🎨 Modern UI/UX
- **Carbon Design System** with government branding
- **Responsive design** for all device types
- **Accessibility compliant** (WCAG 2.1 AA)
- **High contrast mode** and font scaling options

### 📰 Content Management
- **News and announcements** with priority-based display
- **Document management** with version control and approval workflows
- **Service catalog** with online application capabilities
- **Media gallery** with photo and video organization

### 🔐 Security & Performance
- **Enterprise-grade security** with CSP headers and XSS protection
- **Role-based access control** (RBAC) for administrative functions
- **Incremental Static Regeneration** for optimal performance
- **CDN integration** for global content delivery

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Docker (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nepal-government-portal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # NextJS App Router pages
│   ├── components/             # Reusable UI components
│   ├── domains/               # Domain-driven design modules
│   │   ├── content-management/
│   │   ├── user-management/
│   │   ├── service-delivery/
│   │   └── communication/
│   ├── stores/                # Zustand state management
│   ├── repositories/          # Data access layer
│   ├── services/              # Business logic services
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── config/                # Configuration files
│   └── i18n/                  # Internationalization
├── docs/                      # Documentation
├── .github/                   # GitHub Actions workflows
└── public/                    # Static assets
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests with Playwright
```

### Adding New Features

1. **Create Domain Module**: Add new business domain in `src/domains/`
2. **Define Types**: Create TypeScript interfaces for entities
3. **Implement Repository**: Extend `BaseRepository` for data access
4. **Create Service**: Implement business logic with SWR hooks
5. **Build Components**: Create UI components with Carbon Design System
6. **Add Tests**: Write unit, integration, and E2E tests

See [Development Guide](./docs/DEVELOPMENT.md) for detailed instructions.

## 🏗️ Architecture

### Domain-Driven Design
The application is organized around four main business domains:

- **Content Management**: News, documents, and services
- **User Management**: Authentication and authorization
- **Service Delivery**: Online applications and tracking
- **Communication**: Contacts and complaints

### Technology Stack

- **Framework**: NextJS 15+ with App Router
- **UI Library**: Carbon Design System
- **State Management**: Zustand with persistence
- **Internationalization**: next-intl
- **Data Fetching**: SWR for client-side, native fetch for server-side
- **Validation**: Zod schemas
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Docker, GitHub Actions

See [Architecture Documentation](./docs/ARCHITECTURE.md) for detailed system design.

## 🌍 Internationalization

The application supports English and Nepali languages with:

- URL-based locale routing (`/en/` prefix for English)
- Complete UI translation including form validation messages
- Nepal Sambat calendar support alongside Gregorian dates
- Proper Devanagari script rendering
- Cultural number formatting (Western/Devanagari numerals)

## ♿ Accessibility

Compliant with WCAG 2.1 AA standards:

- **Keyboard Navigation**: Full keyboard access
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 ratio compliance
- **Font Scaling**: Adjustable text size (A-, A, A+)
- **High Contrast Mode**: Alternative color scheme
- **Skip Links**: Direct navigation to main content

## 🔒 Security

Enterprise-grade security measures:

- **Content Security Policy** (CSP) headers
- **XSS and CSRF protection**
- **Secure authentication** with JWT and refresh tokens
- **Role-based access control** (RBAC)
- **Input validation** with Zod schemas
- **File upload security** with type and size validation

## 📊 Performance

Optimized for speed and scalability:

- **Incremental Static Regeneration** for content updates
- **Automatic code splitting** by routes and components
- **Image optimization** with WebP/AVIF support
- **CDN integration** for global content delivery
- **Redis caching** for session and temporary data

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t nepal-gov-portal .

# Run with Docker Compose
docker-compose up -d
```

### Production Environment

The application is designed for cloud deployment with:

- **Container orchestration** (Kubernetes/Docker Swarm)
- **Load balancing** for high availability
- **Auto-scaling** based on traffic
- **Monitoring and logging** integration

## 🧪 Testing

Comprehensive testing strategy:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

- **Unit Tests**: Business logic and utility functions
- **Integration Tests**: API endpoints and data flow
- **E2E Tests**: Critical user journeys and accessibility

## 📈 Monitoring

Application monitoring includes:

- **Performance Metrics**: Response times, Core Web Vitals
- **Error Tracking**: Runtime errors and exceptions
- **Usage Analytics**: Page views and user interactions
- **Business Metrics**: Service applications and downloads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

Please read our [Development Guide](./docs/DEVELOPMENT.md) for coding standards and best practices.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support and questions:
- 📖 Review the [Documentation](./docs/)
- 🐛 Report issues on [GitHub Issues](https://github.com/your-repo/issues)
- 📧 Contact the development team

## 🎯 Roadmap

- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] AI-powered chatbot integration
- [ ] Microservices architecture migration
- [ ] Real-time notifications system

---

Built with ❤️ for the Government of Nepal