import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';

// Mock all the page components
vi.mock('../../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../../pages/Products', () => ({
  default: () => <div data-testid="products-page">Products Page</div>
}));

vi.mock('../../pages/Cart', () => ({
  default: () => <div data-testid="cart-page">Cart Page</div>
}));

vi.mock('../../pages/Contact', () => ({
  default: () => <div data-testid="contact-page">Contact Page</div>
}));

// Mock components
vi.mock('../../components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>
}));

vi.mock('../../components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock i18n utils
vi.mock('../../utils/i18n', () => ({}));

describe('App Component', () => {
  beforeEach(() => {
    // Reset URL to root before each test
    window.history.pushState({}, '', '/');
  });

  it('renders the app with navbar and footer', () => {
    render(<App />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders home page by default', () => {
    render(<App />);

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders products page on /products route', () => {
    window.history.pushState({}, '', '/the-bake-bar/products');

    render(<App />);

    expect(screen.getByTestId('products-page')).toBeInTheDocument();
  });

  it('renders cart page on /cart route', () => {
    window.history.pushState({}, '', '/the-bake-bar/cart');

    render(<App />);

    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
  });

  it('renders contact page on /contact route', () => {
    window.history.pushState({}, '', '/the-bake-bar/contact');

    render(<App />);

    expect(screen.getByTestId('contact-page')).toBeInTheDocument();
  });

  it('has proper page structure with providers', () => {
    render(<App />);

    const pageContainer = document.querySelector('.page-container');
    expect(pageContainer).toBeInTheDocument();

    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});