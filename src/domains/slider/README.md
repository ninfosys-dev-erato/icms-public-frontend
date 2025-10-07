# Slider Domain with Employee Integration

This domain provides a comprehensive slider component with integrated employee information cards.

## Features

- **Image Slider**: Main slider with auto-play, navigation, and indicators
- **Employee Cards**: Sidebar displaying key officers (Executive Director and Information Officer)
- **Internationalization**: Support for English (en) and Nepali (ne) languages
- **Responsive Design**: Mobile-friendly layout with adaptive components
- **API Integration**: Fetches employee photos from the backend API

## Components

### SliderContainer
Main component that combines the image slider with employee cards.

```tsx
import { SliderContainer } from '@/domains/slider';

<SliderContainer 
  locale="en"
  height="600px"
  autoPlay={true}
  showNavigation={true}
  showIndicators={true}
  showTitle={true}
/>
```

### EmployeeCard
Individual employee information card component.

```tsx
import { EmployeeCard } from '@/domains/slider';

<EmployeeCard
  employee={employeeData}
  locale="en"
  className="custom-class"
/>
```

## API Endpoints

The employee functionality integrates with the following API endpoints:

- `GET /employees/photos` - Get all employee photos
- `GET /employees/photos/search` - Search employee photos
- `GET /employees/photos/statistics` - Get photo statistics
- `GET /employees/department/:departmentId/photos` - Get photos by department
- `GET /employees/position/:position/photos` - Get photos by position
- `GET /employees/:id/photo` - Get specific employee photo

## Data Flow

1. **SliderContainer** initializes both slider and employee data
2. **useEmployees** hook fetches key officers from the API
3. **EmployeeService** handles business logic and API communication
4. **EmployeeRepository** manages HTTP requests to the backend
5. **EmployeeCard** renders individual employee information

## Employee Data Structure

```typescript
interface Employee {
  id: string;
  fullName: Record<string, string>; // Localized name (ne, en)
  position: Record<string, string>; // Localized position (ne, en)
  department: Record<string, string>; // Localized department (ne, en)
  email?: string;
  phone?: string;
  mobile?: string;
  extension?: string;
  photo?: EmployeePhoto;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}
```

## Styling

The component uses CSS modules with the following key classes:

- `.sliderLayoutContainer` - Main container with flexbox layout
- `.sliderLeftSection` - Left side containing the image slider
- `.sliderRightSection` - Right side containing employee cards
- `.employeeCard` - Individual employee card styling
- `.employeeCardAvatar` - Employee photo/avatar styling
- `.employeeCardInfo` - Employee information text styling

## Responsive Behavior

- **Desktop**: Side-by-side layout with slider on left, employee cards on right
- **Tablet**: Stacked layout with slider above employee cards
- **Mobile**: Optimized spacing and typography for small screens

## Error Handling

- **Loading States**: Skeleton placeholders while data is being fetched
- **Error States**: User-friendly error messages with retry options
- **Empty States**: Graceful handling when no employee data is available
- **Fallback Images**: Placeholder avatars when employee photos fail to load

## Usage Example

```tsx
import { SliderContainer } from '@/domains/slider';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Welcome to CSIO Dadeldhura</h1>
      
      <div className="mb-8">
        <h2>परिचय (Introduction)</h2>
        <SliderContainer 
          locale="en"
          height="600px"
          autoPlay={true}
          showNavigation={true}
          showIndicators={true}
          showTitle={true}
        />
      </div>
    </div>
  );
}
```

## Configuration

The component automatically fetches key officers (Executive Director and Information Officer) based on:

1. Position-based search (executive_director, information_officer)
2. Fallback to alternative position names
3. Priority-based sorting for active employees
4. Department-based filtering if needed

## Dependencies

- Next.js Image component for optimized image loading
- CSS Modules for scoped styling
- React hooks for state management
- TypeScript for type safety
- Public API client for HTTP requests
