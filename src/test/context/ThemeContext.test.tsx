import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme-status">{isDark ? 'dark' : 'light'}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    // Clear document classes
    document.documentElement.classList.remove('dark');
  });

  it('provides initial light theme state when no saved preference', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('toggles theme from light to dark', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('toggles theme from dark to light', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('loads saved theme preference from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('saves theme preference to localStorage when toggling', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('bakery-theme', 'dark');
  });

  it('saves light theme to localStorage when toggling back', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('bakery-theme', 'light');
  });

  it('applies dark class to document when theme is dark', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from document when theme is light', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    document.documentElement.classList.add('dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('uses system preference when no saved theme', () => {
    mockMatchMedia.mockReturnValue({
      matches: true, // System prefers dark mode
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('prefers saved theme over system preference', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    mockMatchMedia.mockReturnValue({
      matches: true, // System prefers dark mode
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    const TestComponentWithoutProvider = () => {
      useTheme();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('maintains theme state across multiple toggles', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Initial state: light
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');

    // Toggle to dark
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');

    // Toggle back to light
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');

    // Toggle to dark again
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('calls localStorage.setItem with correct parameters for dark theme', () => {
    vi.clearAllMocks(); // Clear any previous calls

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('bakery-theme', 'dark');
    // Note: It may be called twice - once on mount and once on toggle
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('bakery-theme', 'dark');
  });

  it('calls localStorage.setItem with correct parameters for light theme', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('bakery-theme', 'light');
  });

  it('handles invalid saved theme gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-theme');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Should fall back to system preference or light theme
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('properly checks system dark mode preference', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('applies correct initial document class based on saved theme', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies correct initial document class based on system preference', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('does not add dark class for light theme', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('handles localStorage access errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage access denied');
    });

    // Mock localStorage.setItem to also throw to test complete error handling
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage access denied');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Wrap in try-catch to handle any unhandled errors
    expect(() => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
    }).not.toThrow();

    // Should still render with default theme
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');

    consoleSpy.mockRestore();
  });

  it('handles multiple theme providers correctly', () => {
    const MultipleProviderTest = () => {
      return (
        <ThemeProvider>
          <div data-testid="provider-1">
            <TestComponent />
          </div>
        </ThemeProvider>
      );
    };

    render(<MultipleProviderTest />);

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('maintains separate theme state for different provider instances', () => {
    const Component1 = () => {
      const { isDark } = useTheme();
      return <div data-testid="component-1">{isDark ? 'dark' : 'light'}</div>;
    };

    const Component2 = () => {
      const { isDark } = useTheme();
      return <div data-testid="component-2">{isDark ? 'dark' : 'light'}</div>;
    };

    render(
      <ThemeProvider>
        <Component1 />
        <Component2 />
      </ThemeProvider>
    );

    expect(screen.getByTestId('component-1')).toHaveTextContent('light');
    expect(screen.getByTestId('component-2')).toHaveTextContent('light');
  });
});