import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    span: 'span',
    nav: 'nav',
    footer: 'footer',
    header: 'header',
    aside: 'aside',
    main: 'main',
    a: 'a',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    ul: 'ul',
    li: 'li',
    img: 'img',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ element }: { element: React.ReactNode }) => element,
  Link: ({ children, to, ...props }: any) =>
    React.createElement('a', { href: to, ...props }, children),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock console methods for cleaner test output
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
}