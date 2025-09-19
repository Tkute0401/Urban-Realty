import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LazyImage from '@/components/common/LazyImage';

// Mock the performance optimizer
vi.mock('@/lib/utils/performanceOptimizer', () => ({
  optimizeImage: vi.fn((src, width, height, quality) => `${src}?w=${width}&h=${height}&q=${quality}`),
}));

describe('LazyImage Component', () => {
  // Mock IntersectionObserver
  const mockIntersectionObserver = vi.fn();
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve.mockImplementation((element) => {
        // Simulate intersection
        callback([{ isIntersecting: true, target: element }]);
      }),
      disconnect: mockDisconnect,
    }));

    global.IntersectionObserver = mockIntersectionObserver;
  });

  it('renders placeholder initially', () => {
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    );

    // Check if placeholder is visible
    const placeholder = document.querySelector('.animate-pulse');
    expect(placeholder).toBeInTheDocument();
  });

  it('shows actual image when in view and loaded', async () => {
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    );

    // Wait for the image to be observed and loaded
    await waitFor(() => {
      const actualImage = screen.getByAltText('Test image');
      expect(actualImage).toBeInTheDocument();
    });
  });

  it('calls onLoad callback when image loads', async () => {
    const onLoadMock = vi.fn();
    
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
        width={200}
        height={200}
        onLoad={onLoadMock}
      />
    );

    // Simulate image load
    await waitFor(() => {
      const actualImage = screen.getByAltText('Test image');
      actualImage.dispatchEvent(new Event('load'));
    });

    expect(onLoadMock).toHaveBeenCalledTimes(1);
  });

  it('calls onError callback and shows error state when image fails', async () => {
    const onErrorMock = vi.fn();
    
    render(
      <LazyImage
        src="invalid-image.jpg"
        alt="Test image"
        width={200}
        height={200}
        onError={onErrorMock}
      />
    );

    // Simulate image error
    await waitFor(() => {
      const actualImage = screen.getByAltText('Test image');
      actualImage.dispatchEvent(new Event('error'));
    });

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    
    // Check if error state is shown
    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
        className="custom-class"
      />
    );

    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('uses custom quality parameter', async () => {
    const { optimizeImage } = await import('@/lib/utils/performanceOptimizer');
    
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
        width={200}
        height={200}
        quality={90}
      />
    );

    expect(optimizeImage).toHaveBeenCalledWith('test-image.jpg', 200, 200, 90);
  });

  it('sets proper dimensions on container', () => {
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    const container = document.querySelector('.relative.overflow-hidden');
    expect(container).toHaveStyle({ width: '300px', height: '200px' });
  });

  it('shows loading state with animate-pulse', () => {
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
      />
    );

    const loadingElement = document.querySelector('.animate-pulse');
    expect(loadingElement).toBeInTheDocument();
  });

  it('uses custom placeholder when provided', () => {
    const customPlaceholder = 'data:image/svg+xml;base64,custom-placeholder';
    
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
        placeholder={customPlaceholder}
      />
    );

    const placeholderImg = document.querySelector('img[src="' + customPlaceholder + '"]');
    expect(placeholderImg).toBeInTheDocument();
  });

  it('properly sets up IntersectionObserver', () => {
    render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
      />
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );
    expect(mockObserve).toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(
      <LazyImage
        src="test-image.jpg"
        alt="Test image"
      />
    );

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('handles missing src gracefully', async () => {
    const { optimizeImage } = await import('@/lib/utils/performanceOptimizer');
    
    render(
      <LazyImage
        src=""
        alt="Empty image"
      />
    );

    expect(optimizeImage).toHaveBeenCalledWith('', undefined, undefined, 80);
  });
});