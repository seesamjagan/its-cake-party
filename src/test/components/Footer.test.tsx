import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../components/Footer';

// Mock react-i18next
const mockT = vi.fn((key: string, options?: any) => {
  const translations: { [key: string]: string } = {
    'contact.title': 'Contact Us',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.contact': 'Contact',
    'home.aboutText': `${options?.companyName || 'The Bake Bar'} is a family-owned bakery dedicated to creating the most delicious homemade treats.`
  };
  return translations[key] || key;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT })
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Facebook: () => <div data-testid="facebook-icon">Facebook</div>,
  Instagram: () => <div data-testid="instagram-icon">Instagram</div>,
  Twitter: () => <div data-testid="twitter-icon">Twitter</div>,
  Heart: ({ className }: { className?: string }) => (
    <div data-testid="heart-icon" className={className}>Heart</div>
  )
}));

// Mock company config
vi.mock('../../config/company', () => ({
  COMPANY_INFO: {
    name: 'The Bake Bar',
    tagline: 'Homemade Bakery',
    contact: {
      address: {
        full: '123 Bakery Street, Sweet City'
      },
      phone: '+91 95518 62527',
      email: 'test@bakebar.com',
      hours: 'Mon-Sun: 8AM-8PM'
    },
    social: {
      facebook: 'https://facebook.com/the-bake-bar',
      instagram: 'https://instagram.com/the-bake-bar',
      twitter: 'https://twitter.com/the-bake-bar'
    }
  }
}));

// Mock logo image
vi.mock('../../assets/images/logo.png', () => ({
  default: 'test-logo.png'
}));


const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders footer with company branding', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('The Bake Bar')).toBeInTheDocument();
    expect(screen.getByText('Homemade Bakery')).toBeInTheDocument();
    expect(screen.getByAltText('The Bake Bar Logo')).toBeInTheDocument();
  });

  it('renders company description', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText(/family-owned bakery/)).toBeInTheDocument();
  });

  it('renders all contact information', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('123 Bakery Street, Sweet City')).toBeInTheDocument();
    expect(screen.getByText('+91 95518 62527')).toBeInTheDocument();
    expect(screen.getByText('test@bakebar.com')).toBeInTheDocument();
    expect(screen.getByText('Mon-Sun: 8AM-8PM')).toBeInTheDocument();
  });

  it('renders all contact icons', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('renders social media links with correct hrefs', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    const facebookLink = screen.getByLabelText('Facebook');
    const instagramLink = screen.getByLabelText('Instagram');
    const twitterLink = screen.getByLabelText('Twitter');

    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/the-bake-bar');
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/the-bake-bar');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/the-bake-bar');
  });

  it('renders social media icons', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('Quick Links')).toBeInTheDocument();

    // Check for navigation links
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    const contactLink = screen.getByRole('link', { name: 'Contact' });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/products');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('renders special offers section', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('Special Offers')).toBeInTheDocument();
    expect(screen.getByText(/Subscribe to our newsletter/)).toBeInTheDocument();
  });

  it('renders contact section title', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders footer bottom section with heart and copyright', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText(/Made with/)).toBeInTheDocument();
    expect(screen.getByText(/by The Bake Bar Team/)).toBeInTheDocument();
    expect(screen.getByText(/© 2024 The Bake Bar/)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('has proper structure with footer semantic element', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders all contact items with proper structure', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    const contactLists = screen.getAllByRole('list');
    expect(contactLists).toHaveLength(2); // contact list + footer links list

    // Check that all contact items are present
    const contactItems = screen.getAllByRole('listitem');
    expect(contactItems).toHaveLength(7); // 4 contact items + 3 footer links
  });

  it('has proper accessibility attributes for social links', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    const facebookLink = screen.getByLabelText('Facebook');
    const instagramLink = screen.getByLabelText('Instagram');
    const twitterLink = screen.getByLabelText('Twitter');

    expect(facebookLink).toHaveAttribute('aria-label', 'Facebook');
    expect(instagramLink).toHaveAttribute('aria-label', 'Instagram');
    expect(twitterLink).toHaveAttribute('aria-label', 'Twitter');
  });

  it('renders footer sections in correct order', () => {
    const { container } = render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    const footerSections = container.querySelectorAll('.footer-section');
    expect(footerSections).toHaveLength(3); // Brand, Contact, Quick Links sections
  });

  it('renders logo image with correct alt text', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    const logoImage = screen.getByAltText('The Bake Bar Logo');
    expect(logoImage).toHaveAttribute('src', 'test-logo.png');
  });

  it('renders heart icon with correct class', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    const heartIcon = screen.getByTestId('heart-icon');
    expect(heartIcon).toHaveClass('heart');
  });

  it('renders footer grid structure', () => {
    const { container } = render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(container.querySelector('.footer-grid')).toBeInTheDocument();
    expect(container.querySelector('.footer-content')).toBeInTheDocument();
    expect(container.querySelector('.footer-bottom')).toBeInTheDocument();
  });
});