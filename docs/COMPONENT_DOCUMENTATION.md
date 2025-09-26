# Squarefooot Component Documentation

## Overview

This document provides comprehensive documentation for all React components in the Squarefooot client application. Components are organized by category and include usage examples, props, and styling information.

## Component Architecture

The application follows a modular component architecture with clear separation of concerns:

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── feature/         # Feature-specific components
├── pages/               # Page components
├── hooks/               # Custom hooks
└── utils/               # Utility functions
```

## Base UI Components

### Button

A versatile button component with multiple variants and sizes.

```jsx
import { Button } from '@/components/ui/Button';

// Basic usage
<Button variant="primary" size="medium">
  Click me
</Button>

// With loading state
<Button loading={isLoading} disabled={isDisabled}>
  Submit
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `loading`: boolean
- `disabled`: boolean
- `onClick`: function
- `children`: ReactNode

### Input

Form input component with validation and error states.

```jsx
import { Input } from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>
```

**Props:**
- `label`: string
- `type`: string
- `value`: string
- `onChange`: function
- `error`: string
- `required`: boolean
- `placeholder`: string
- `disabled`: boolean

### Modal

Modal dialog component for overlays and confirmations.

```jsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to delete this property?</p>
  <div className="flex gap-2 mt-4">
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
  </div>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `children`: ReactNode
- `size`: 'small' | 'medium' | 'large'

## Form Components

### RHFTextField

React Hook Form integrated text field component.

```jsx
import { RHFTextField } from '@/components/forms/RHFTextField';
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField
        name="firstName"
        control={control}
        label="First Name"
        required
      />
    </form>
  );
};
```

**Props:**
- `name`: string (field name)
- `control`: Control object from react-hook-form
- `label`: string
- `required`: boolean
- `type`: string
- `placeholder`: string

### PropertyForm

Complete property creation/editing form.

```jsx
import { PropertyForm } from '@/components/forms/PropertyForm';

<PropertyForm
  initialData={property}
  onSubmit={handleSubmit}
  loading={isSubmitting}
/>
```

**Props:**
- `initialData`: Property object (optional)
- `onSubmit`: function
- `loading`: boolean
- `mode`: 'create' | 'edit'

## Layout Components

### Header

Main navigation header with user menu and search.

```jsx
import { Header } from '@/components/layout/Header';

<Header
  user={currentUser}
  onLogin={() => setShowLogin(true)}
  onLogout={handleLogout}
/>
```

**Props:**
- `user`: User object (optional)
- `onLogin`: function
- `onLogout`: function

### Footer

Application footer with links and contact information.

```jsx
import { Footer } from '@/components/layout/Footer';

<Footer />
```

### Breadcrumbs

Navigation breadcrumbs for page hierarchy.

```jsx
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

<Breadcrumbs />
```

## Feature Components

### PropertyCard

Property listing card component.

```jsx
import { PropertyCard } from '@/components/feature/PropertyCard';

<PropertyCard
  property={property}
  onFavorite={handleFavorite}
  onContact={handleContact}
/>
```

**Props:**
- `property`: Property object
- `onFavorite`: function
- `onContact`: function
- `showActions`: boolean

### PropertyFilters

Advanced property search filters.

```jsx
import { PropertyFilters } from '@/components/feature/PropertyFilters';

<PropertyFilters
  filters={filters}
  onFiltersChange={setFilters}
  onSearch={handleSearch}
/>
```

**Props:**
- `filters`: Filter object
- `onFiltersChange`: function
- `onSearch`: function

### PropertyMap

Interactive map component for property locations.

```jsx
import { PropertyMap } from '@/components/feature/PropertyMap';

<PropertyMap
  properties={properties}
  center={mapCenter}
  zoom={mapZoom}
  onPropertyClick={handlePropertyClick}
/>
```

**Props:**
- `properties`: Array of Property objects
- `center`: { lat: number, lng: number }
- `zoom`: number
- `onPropertyClick`: function

## Page Components

### Home

Main landing page with hero section and featured properties.

```jsx
import { Home } from '@/pages/Home';

<Home />
```

### Properties

Property listing page with filters and search.

```jsx
import { Properties } from '@/pages/Properties';

<Properties />
```

### PropertyDetails

Detailed property view page.

```jsx
import { PropertyDetails } from '@/pages/PropertyDetails';

<PropertyDetails propertyId={propertyId} />
```

### Login/Register

Authentication pages.

```jsx
import { Login } from '@/pages/Auth/Login';
import { Register } from '@/pages/Auth/Register';

<Login onSuccess={handleLoginSuccess} />
<Register onSuccess={handleRegisterSuccess} />
```

## Custom Hooks

### useApi

API interaction hook with React Query integration.

```jsx
import { useApi } from '@/hooks/useApi';

const { data, loading, error, refetch } = useApi({
  endpoint: '/properties',
  params: { city: 'Mumbai' }
});
```

### useAuth

Authentication state management hook.

```jsx
import { useAuth } from '@/hooks/useAuth';

const { user, login, logout, loading } = useAuth();
```

### usePropertyFilters

Property filtering logic hook.

```jsx
import { usePropertyFilters } from '@/hooks/usePropertyFilters';

const { filters, setFilters, filteredProperties } = usePropertyFilters(properties);
```

## Styling Guidelines

### CSS Modules

Components use CSS modules for scoped styling:

```jsx
// PropertyCard.jsx
import styles from './PropertyCard.module.css';

<div className={styles.card}>
  <img className={styles.image} src={property.image} alt={property.title} />
  <div className={styles.content}>
    <h3 className={styles.title}>{property.title}</h3>
  </div>
</div>
```

### Tailwind CSS

Utility classes for rapid styling:

```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Property Title</h2>
  <span className="text-lg font-bold text-blue-600">₹75,00,000</span>
</div>
```

### Theme System

Components support theming through CSS custom properties:

```css
:root {
  --color-primary: #3B82F6;
  --color-secondary: #64748B;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

## Component Testing

### Unit Tests

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { PropertyCard } from '@/components/feature/PropertyCard';

test('displays property information correctly', async () => {
  const mockProperty = {
    id: '1',
    title: 'Beautiful Apartment',
    price: 7500000,
    location: { city: 'Mumbai' }
  };

  render(<PropertyCard property={mockProperty} />);
  
  await waitFor(() => {
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('₹75,00,000')).toBeInTheDocument();
    expect(screen.getByText('Mumbai')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting

Components are lazy-loaded for better performance:

```jsx
import { lazy, Suspense } from 'react';

const PropertyDetails = lazy(() => import('@/pages/PropertyDetails'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertyDetails />
    </Suspense>
  );
}
```

### Memoization

Use React.memo for expensive components:

```jsx
import { memo } from 'react';

const PropertyCard = memo(({ property, onFavorite }) => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
});
```

## Accessibility

### ARIA Labels

```jsx
<button
  aria-label="Add to favorites"
  onClick={handleFavorite}
>
  <HeartIcon />
</button>
```

### Keyboard Navigation

```jsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Clickable content
</div>
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Define clear prop types and interfaces
3. **Error Boundaries**: Wrap components in error boundaries
4. **Loading States**: Always handle loading and error states
5. **Accessibility**: Include proper ARIA labels and keyboard navigation
6. **Performance**: Use memoization and code splitting appropriately
7. **Testing**: Write comprehensive tests for all components
8. **Documentation**: Document props, usage, and examples

## Storybook

Components are documented in Storybook for design system management:

```bash
npm run storybook
```

Visit `http://localhost:6006` to view the component library.