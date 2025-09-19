import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from '@/components/ui/Button';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, whileHover, whileTap, transition, ...props }) => <div {...props}>{children}</div>),
  },
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  it('renders button with children', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles different variants', () => {
    renderWithTheme(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithTheme(<Button loading>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    renderWithTheme(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with different sizes', () => {
    renderWithTheme(<Button size="large">Large Button</Button>);
    expect(screen.getByRole('button', { name: 'Large Button' })).toBeInTheDocument();
  });

  it('renders fullWidth', () => {
    renderWithTheme(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button', { name: 'Full Width' })).toBeInTheDocument();
  });

  it('renders with start and end icons', () => {
    const startIcon = <span data-testid="start-icon">→</span>;
    const endIcon = <span data-testid="end-icon">←</span>;
    
    renderWithTheme(
      <Button startIcon={startIcon} endIcon={endIcon}>
        With Icons
      </Button>
    );
    
    expect(screen.getByRole('button', { name: /With Icons/ })).toBeInTheDocument();
  });
});