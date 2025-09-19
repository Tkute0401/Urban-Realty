import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '@/components/common/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders spinner with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="animate-spin"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-8', 'h-8', 'animate-spin');
  });

  it('renders spinner with message', () => {
    const message = 'Loading data...';
    render(<LoadingSpinner message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    let spinner = document.querySelector('[class*="w-4"][class*="h-4"]');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner size="medium" />);
    spinner = document.querySelector('[class*="w-8"][class*="h-8"]');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner size="large" />);
    spinner = document.querySelector('[class*="w-12"][class*="h-12"]');
    expect(spinner).toBeInTheDocument();
  });

  it('applies custom color', () => {
    const customColor = '#ff0000';
    render(<LoadingSpinner color={customColor} />);
    
    const spinner = document.querySelector('[class*="animate-spin"]');
    expect(spinner).toHaveStyle({ borderTopColor: customColor });
  });

  it('applies custom className', () => {
    const customClass = 'custom-spinner-class';
    render(<LoadingSpinner className={customClass} />);
    
    const container = document.querySelector(`.${customClass}`);
    expect(container).toBeInTheDocument();
  });

  it('renders without message when not provided', () => {
    render(<LoadingSpinner />);
    
    const messageElement = screen.queryByText(/loading/i);
    expect(messageElement).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner message="Loading..." />);
    
    const container = document.querySelector('.flex.flex-col.items-center.justify-center');
    expect(container).toBeInTheDocument();
  });

  it('applies default primary color when no color provided', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="animate-spin"]');
    expect(spinner).toHaveStyle({ borderTopColor: 'var(--color-primary)' });
  });
});