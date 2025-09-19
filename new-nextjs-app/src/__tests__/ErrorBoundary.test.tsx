import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useRouter } from 'next/navigation';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary');
  }
  return <div>No error</div>;
};

// Mock component to test error boundary behavior
const TestComponent = ({ hasError = false }: { hasError?: boolean }) => (
  <ErrorBoundary>
    <ThrowError shouldThrow={hasError} />
  </ErrorBoundary>
);

describe('ErrorBoundary Component', () => {
  const mockPush = vi.fn();
  const mockReload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
    
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        reload: mockReload,
      },
    });
  });

  it('renders children when there is no error', () => {
    renderWithTheme(<TestComponent />);
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('catches error and displays error fallback UI', () => {
    // Suppress console.error for this test to avoid noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithTheme(<TestComponent hasError={true} />);
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('displays error details in development mode', () => {
    // Mock NODE_ENV as development
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithTheme(<TestComponent hasError={true} />);
    
    expect(screen.getByText('Error Details (Development Only):')).toBeInTheDocument();
    expect(screen.getByText(/Test error for ErrorBoundary/)).toBeInTheDocument();
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });

  it('does not display error details in production mode', () => {
    // Mock NODE_ENV as production
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithTheme(<TestComponent hasError={true} />);
    
    expect(screen.queryByText('Error Details (Development Only):')).not.toBeInTheDocument();
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });

  it('handles refresh button click', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithTheme(<TestComponent hasError={true} />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh page/i });
    fireEvent.click(refreshButton);
    
    expect(mockReload).toHaveBeenCalledTimes(1);
    
    consoleSpy.mockRestore();
  });

  it('handles go home button click', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithTheme(<TestComponent hasError={true} />);
    
    const homeButton = screen.getByRole('button', { name: /go home/i });
    fireEvent.click(homeButton);
    
    expect(mockPush).toHaveBeenCalledWith('/');
    
    consoleSpy.mockRestore();
  });

  it('displays helpful information and instructions', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithTheme(<TestComponent hasError={true} />);
    
    expect(screen.getByText('What you can do:')).toBeInTheDocument();
    expect(screen.getByText('• Try refreshing the page')).toBeInTheDocument();
    expect(screen.getByText('• Go back to the home page')).toBeInTheDocument();
    expect(screen.getByText('• Contact support if the problem persists')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('displays error ID with timestamp', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithTheme(<TestComponent hasError={true} />);
    
    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});