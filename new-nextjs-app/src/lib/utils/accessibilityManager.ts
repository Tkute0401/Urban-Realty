// Accessibility Management System
import { useEffect, useRef, useState } from 'react';

// Accessibility levels
export enum AccessibilityLevel {
  AA = 'AA',
  AAA = 'AAA',
}

// Accessibility violations
export interface AccessibilityViolation {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  element: HTMLElement;
  fix?: string;
}

// Accessibility manager class
export class AccessibilityManager {
  private static instance: AccessibilityManager;
  private violations: AccessibilityViolation[] = [];
  private observers: MutationObserver[] = [];
  private level: AccessibilityLevel = AccessibilityLevel.AA;

  private constructor() {
    this.initializeAccessibilityChecks();
  }

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  // Initialize accessibility checks
  private initializeAccessibilityChecks(): void {
    if (typeof window === 'undefined') return;

    // Check for missing alt text on images
    this.checkImageAltText();
    
    // Check for proper heading hierarchy
    this.checkHeadingHierarchy();
    
    // Check for proper form labels
    this.checkFormLabels();
    
    // Check for color contrast
    this.checkColorContrast();
    
    // Check for keyboard navigation
    this.checkKeyboardNavigation();
    
    // Check for focus management
    this.checkFocusManagement();
    
    // Set up mutation observer for dynamic content
    this.setupMutationObserver();
  }

  // Check for missing alt text on images
  private checkImageAltText(): void {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        this.addViolation({
          type: 'missing-alt-text',
          severity: 'error',
          message: 'Image missing alt text',
          element: img,
          fix: 'Add alt attribute or aria-label to describe the image',
        });
      }
    });
  }

  // Check for proper heading hierarchy
  private checkHeadingHierarchy(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level > previousLevel + 1) {
        this.addViolation({
          type: 'heading-hierarchy',
          severity: 'warning',
          message: `Heading level ${level} follows heading level ${previousLevel}`,
          element: heading,
          fix: 'Ensure heading levels increase by no more than one',
        });
      }
      
      previousLevel = level;
    });
  }

  // Check for proper form labels
  private checkFormLabels(): void {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const id = input.id;
      const label = document.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        this.addViolation({
          type: 'missing-form-label',
          severity: 'error',
          message: 'Form input missing label',
          element: input,
          fix: 'Add a label element or aria-label attribute',
        });
      }
    });
  }

  // Check for color contrast
  private checkColorContrast(): void {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrast(color, backgroundColor);
        const requiredContrast = this.level === AccessibilityLevel.AA ? 4.5 : 7;
        
        if (contrast < requiredContrast) {
          this.addViolation({
            type: 'color-contrast',
            severity: 'error',
            message: `Color contrast ratio ${contrast.toFixed(2)} is below required ${requiredContrast}`,
            element: element as HTMLElement,
            fix: 'Increase color contrast between text and background',
          });
        }
      }
    });
  }

  // Calculate color contrast ratio
  private calculateContrast(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const luminance1 = this.getLuminance(rgb1);
    const luminance2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Convert hex color to RGB
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Get luminance of RGB color
  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Check for keyboard navigation
  private checkKeyboardNavigation(): void {
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
        this.addViolation({
          type: 'keyboard-navigation',
          severity: 'warning',
          message: 'Element is not keyboard accessible',
          element: element as HTMLElement,
          fix: 'Ensure element is keyboard accessible or add aria-hidden="true"',
        });
      }
    });
  }

  // Check for focus management
  private checkFocusManagement(): void {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) {
      this.addViolation({
        type: 'focus-management',
        severity: 'warning',
        message: 'No focusable elements found on page',
        element: document.body,
        fix: 'Ensure page has focusable elements for keyboard navigation',
      });
    }
  }

  // Set up mutation observer for dynamic content
  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkElement(node as HTMLElement);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observers.push(observer);
  }

  // Check individual element for accessibility issues
  private checkElement(element: HTMLElement): void {
    // Check for missing alt text
    if (element.tagName === 'IMG' && !element.alt && !element.getAttribute('aria-label')) {
      this.addViolation({
        type: 'missing-alt-text',
        severity: 'error',
        message: 'Image missing alt text',
        element,
        fix: 'Add alt attribute or aria-label to describe the image',
      });
    }

    // Check for missing form labels
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
      const id = element.id;
      const label = document.querySelector(`label[for="${id}"]`);
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        this.addViolation({
          type: 'missing-form-label',
          severity: 'error',
          message: 'Form input missing label',
          element,
          fix: 'Add a label element or aria-label attribute',
        });
      }
    }
  }

  // Add accessibility violation
  private addViolation(violation: AccessibilityViolation): void {
    this.violations.push(violation);
    console.warn('Accessibility violation:', violation);
  }

  // Get all violations
  getViolations(): AccessibilityViolation[] {
    return [...this.violations];
  }

  // Get violations by type
  getViolationsByType(type: string): AccessibilityViolation[] {
    return this.violations.filter(violation => violation.type === type);
  }

  // Get violations by severity
  getViolationsBySeverity(severity: 'error' | 'warning' | 'info'): AccessibilityViolation[] {
    return this.violations.filter(violation => violation.severity === severity);
  }

  // Clear violations
  clearViolations(): void {
    this.violations = [];
  }

  // Set accessibility level
  setLevel(level: AccessibilityLevel): void {
    this.level = level;
    this.clearViolations();
    this.initializeAccessibilityChecks();
  }

  // Get accessibility score
  getAccessibilityScore(): number {
    const totalChecks = 100; // Total number of accessibility checks
    const violations = this.violations.length;
    const errors = this.getViolationsBySeverity('error').length;
    const warnings = this.getViolationsBySeverity('warning').length;
    
    // Calculate score based on violations
    const errorPenalty = errors * 10;
    const warningPenalty = warnings * 5;
    const score = Math.max(0, totalChecks - errorPenalty - warningPenalty);
    
    return Math.round(score);
  }

  // Cleanup
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.violations = [];
  }
}

// Create singleton instance
export const accessibilityManager = AccessibilityManager.getInstance();

// React hook for accessibility
export const useAccessibility = () => {
  const [violations, setViolations] = useState<AccessibilityViolation[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const updateViolations = () => {
      setViolations(accessibilityManager.getViolations());
      setScore(accessibilityManager.getAccessibilityScore());
    };

    // Initial check
    updateViolations();

    // Set up periodic checks
    const interval = setInterval(updateViolations, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkAccessibility = () => {
    accessibilityManager.clearViolations();
    accessibilityManager.initializeAccessibilityChecks();
    setViolations(accessibilityManager.getViolations());
    setScore(accessibilityManager.getAccessibilityScore());
  };

  const clearViolations = () => {
    accessibilityManager.clearViolations();
    setViolations([]);
    setScore(100);
  };

  return {
    violations,
    score,
    checkAccessibility,
    clearViolations,
  };
};

// Accessibility utilities
export const focusElement = (element: HTMLElement): void => {
  element.focus();
};

export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  firstFocusableElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const skipToContent = (targetId: string = 'main-content'): void => {
  const target = document.getElementById(targetId);
  if (target) {
    target.focus();
    target.scrollIntoView();
  }
};

// Accessibility component
export const AccessibilityChecker: React.FC = () => {
  const { violations, score, checkAccessibility, clearViolations } = useAccessibility();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">Accessibility</h3>
        <div className="flex space-x-2">
          <button
            onClick={checkAccessibility}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Check
          </button>
          <button
            onClick={clearViolations}
            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Score:</span>
          <span className={`text-sm font-semibold ${
            score >= 90 ? 'text-green-600' : 
            score >= 70 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {score}/100
          </span>
        </div>
      </div>
      
      {violations.length > 0 && (
        <div className="max-h-32 overflow-y-auto">
          <div className="text-xs text-gray-600 mb-1">Violations:</div>
          {violations.slice(0, 5).map((violation, index) => (
            <div key={index} className="text-xs mb-1">
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                violation.severity === 'error' ? 'bg-red-500' :
                violation.severity === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              {violation.type}
            </div>
          ))}
          {violations.length > 5 && (
            <div className="text-xs text-gray-500">
              +{violations.length - 5} more...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default accessibilityManager;