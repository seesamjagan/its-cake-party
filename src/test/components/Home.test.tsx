import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';

// Mock products.json
vi.mock('../../data/products.json', () => ({
  default: [
    {
      id: 1,
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake',
      price: 500,
      quantity: '1 kg',
      category: 'cakes',
      featured: true
    },
    {
      id: 2,
      name: 'Vanilla Cupcake',
      description: 'Sweet vanilla cupcake',
      price: 50,
      quantity: '1 piece',
      category: 'cupcakes',
      featured: true
    },
    {
      id: 3,
      name: 'Regular Item',
      description: 'Not featured',
      price: 100,
      quantity: '1 piece',
      category: 'other',
      featured: false
    }
  ]
}));

// Mock company config
vi.mock('../../config/company', () => ({
  COMPANY_INFO: {
    name: 'Test Bakery',
    tagline: 'Test Tagline'
  }
}));


// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'home.title': `Welcome to ${options?.companyName || 'Test Bakery'}`,
        'home.subtitle': `${options?.tagline || 'Test Tagline'}`,
        'home.description': 'Fresh baked goods daily',
        'home.cta': 'Shop Now',
        'home.featured': 'Featured Products',
        'home.about': 'About Us',
        'home.aboutText': `About ${options?.companyName || 'Test Bakery'}`,
        'home.stats.customers': 'Happy Customers',
        'home.stats.recipes': 'Unique Recipes',
        'home.stats.rating': 'Star Rating',
        'home.stats.experience': 'Years Experience',
        'nav.contact': 'Contact Us',
        'common.featuredDescription': 'Our most popular items',
        'common.viewAllProducts': 'View All Products'
      };
      return translations[key] || key;
    }
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the hero section with title and subtitle', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText('Welcome to Test Bakery')).toBeInTheDocument();
    expect(screen.getByText('Test Tagline')).toBeInTheDocument();
    expect(screen.getByText('Fresh baked goods daily')).toBeInTheDocument();
  });

  it('renders the hero logo with correct alt text', () => {
    renderWithRouter(<Home />);

    const logo = screen.getByAltText('Test Bakery Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'logo.png');
  });

  it('renders hero action buttons with correct links', () => {
    renderWithRouter(<Home />);

    const shopNowButton = screen.getByText('Shop Now');
    const contactButton = screen.getByText('Contact Us');

    expect(shopNowButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();

    // Check that buttons are within links
    expect(shopNowButton.closest('a')).toHaveAttribute('href', '/products');
    expect(contactButton.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('renders stats section with correct data', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('Happy Customers')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('Unique Recipes')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('Star Rating')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
  });

  it('renders featured products section', async () => {
    renderWithRouter(<Home />);

    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Our most popular items')).toBeInTheDocument();

    // Wait for featured products to load
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
      expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
    });
  });

  it('displays correct product information for featured items', async () => {
    renderWithRouter(<Home />);

    await waitFor(() => {
      // Check first featured product
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
      expect(screen.getByText('Rich chocolate cake')).toBeInTheDocument();
      expect(screen.getByText('₹500')).toBeInTheDocument();
      expect(screen.getByText('1 kg')).toBeInTheDocument();

      // Check second featured product
      expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
      expect(screen.getByText('Sweet vanilla cupcake')).toBeInTheDocument();
      expect(screen.getByText('₹50')).toBeInTheDocument();
      expect(screen.getByText('1 piece')).toBeInTheDocument();
    });
  });

  it('does not display non-featured products', async () => {
    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.queryByText('Regular Item')).not.toBeInTheDocument();
    });
  });

  it('renders "View All Products" button in featured section', async () => {
    renderWithRouter(<Home />);

    await waitFor(() => {
      const viewAllButton = screen.getByText('View All Products');
      expect(viewAllButton).toBeInTheDocument();
      expect(viewAllButton.closest('a')).toHaveAttribute('href', '/products');
    });
  });

  it('renders about section', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('About Test Bakery')).toBeInTheDocument();
    expect(screen.getByText('Crafted with Love')).toBeInTheDocument();
  });

  it('filters products correctly to show only featured ones', async () => {
    renderWithRouter(<Home />);

    await waitFor(() => {
      const productCards = document.querySelectorAll('.product-card');
      expect(productCards).toHaveLength(2); // Only featured products
    });
  });

  it('renders floating decorative elements', () => {
    renderWithRouter(<Home />);

    const floatingElements = document.querySelectorAll('.floating-element');
    expect(floatingElements.length).toBeGreaterThan(0);
  });

  it('renders emoji icons in product cards', async () => {
    renderWithRouter(<Home />);

    await waitFor(() => {
      const emojiIcons = screen.getAllByText('🧁');
      expect(emojiIcons.length).toBeGreaterThan(0);
    });
  });

  it('renders chef emoji in about section', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText('👨‍🍳')).toBeInTheDocument();
  });

  it('renders star emoji decoration', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    renderWithRouter(<Home />);

    const pageContainer = document.querySelector('.page-container');
    expect(pageContainer).toBeInTheDocument();

    const heroSection = document.querySelector('.hero');
    const statsSection = document.querySelector('.stats-section');
    const featuredSection = document.querySelector('.featured-section');

    expect(heroSection).toBeInTheDocument();
    expect(statsSection).toBeInTheDocument();
    expect(featuredSection).toBeInTheDocument();
  });
});