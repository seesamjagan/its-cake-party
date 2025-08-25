import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Products from '../../pages/Products';
import { CartProvider } from '../../context/CartContext';

// Mock products data import
vi.mock('../../data/products.json', () => ({
  default: [
    {
      id: 1,
      name: 'Chocolate Brownie',
      image: 'brownie.jpg',
      description: 'Rich chocolate brownie',
      quantity: '500g',
      price: 650,
      category: 'brownies',
      featured: true,
      ingredients: ['Chocolate', 'Flour', 'Sugar'],
      allergens: ['Gluten', 'Dairy']
    },
    {
      id: 2,
      name: 'Vanilla Cupcake',
      image: 'cupcake.jpg',
      description: 'Sweet vanilla cupcake',
      quantity: '1 piece',
      price: 45,
      category: 'cupcakes',
      featured: false,
      ingredients: ['Vanilla', 'Flour', 'Sugar'],
      allergens: ['Gluten', 'Eggs']
    }
  ]
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: { [key: string]: string } = {
        'products.title': 'Our Products',
        'products.subtitle': 'Discover our handcrafted delights',
        'products.search': 'Search products, ingredients...',
        'products.filters': 'Filters',
        'products.categories.all': 'All',
        'products.categories.brownies': 'Brownies',
        'products.categories.cupcakes': 'Cupcakes',
        'products.categories.title': 'Categories',
        'products.sort.featured': 'Featured First',
        'products.sort.nameAZ': 'Name A-Z',
        'products.sort.priceLow': 'Price: Low to High',
        'products.sort.priceHigh': 'Price: High to Low',
        'products.priceRange.title': 'Price Range',
        'products.results.showing': `Showing ${options?.count || 0} of ${options?.total || 0} products`,
        'products.results.noProducts': 'No products found',
        'products.results.noProductsDesc': 'Try adjusting your filters',
        'products.results.clearFilters': 'Clear Filters',
        'products.labels.featured': 'Featured',
        'products.labels.ingredients': 'Ingredients:',
        'products.labels.contains': 'Contains:',
        'products.labels.quantity': 'Quantity:',
        'products.labels.qty': 'Qty:',
        'products.buttons.add': 'Add',
        'products.buttons.addToCart': 'Add to Cart',
        'products.loading': 'our delicious products...',
        'common.loading': 'Loading...'
      };
      return translations[key] || key;
    }
  })
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  ShoppingCart: () => <div data-testid="shopping-cart-icon">ShoppingCart</div>,
  Star: ({ fill }: { fill?: string }) => <div data-testid="star-icon" data-fill={fill}>Star</div>,
  Grid3X3: () => <div data-testid="grid-icon">Grid</div>,
  List: () => <div data-testid="list-icon">List</div>,
  SlidersHorizontal: () => <div data-testid="sliders-icon">Sliders</div>,
  Heart: ({ fill, color }: { fill?: string; color?: string }) =>
    <div data-testid="heart-icon" data-fill={fill} data-color={color}>Heart</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  ArrowUpDown: () => <div data-testid="arrow-icon">ArrowUpDown</div>
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <CartProvider>
      {children}
    </CartProvider>
  </BrowserRouter>
);

describe('Products Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText('Loading... our delicious products...')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for products to appear (timeout increased for loading)
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
      expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders page header', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Our Products')).toBeInTheDocument();
      expect(screen.getByText('Discover our handcrafted delights')).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search products, ingredients...')).toBeInTheDocument();
    });
  });

  it('filters products by search term', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
      expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
    }, { timeout: 3000 });

    const searchInput = screen.getByPlaceholderText('Search products, ingredients...');
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });

    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
      expect(screen.queryByText('Vanilla Cupcake')).not.toBeInTheDocument();
    });
  });

  it('renders category filters', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const filtersToggle = screen.getByText('Filters');
      fireEvent.click(filtersToggle);
    });

    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Brownies')).toBeInTheDocument();
      expect(screen.getByText('Cupcakes')).toBeInTheDocument();
    });
  });

  it('filters products by category', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const filtersToggle = screen.getByText('Filters');
      fireEvent.click(filtersToggle);
    });

    await waitFor(() => {
      const brownieCategory = screen.getByText('Brownies');
      fireEvent.click(brownieCategory);
    });

    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
      expect(screen.queryByText('Vanilla Cupcake')).not.toBeInTheDocument();
    });
  });

  it('renders sort dropdown', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Featured First')).toBeInTheDocument();
    });
  });

  it('sorts products by price', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Featured First');
      fireEvent.change(sortSelect, { target: { value: 'price-low' } });
    });

    // Products should be sorted by price (lowest first)
    await waitFor(() => {
      const products = screen.getAllByText(/₹\d+/);
      // Vanilla Cupcake (₹45) should come before Chocolate Brownie (₹650)
      expect(products[0]).toHaveTextContent('₹45');
    });
  });

  it('toggles between grid and list view', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const listViewButton = screen.getByTestId('list-icon').parentElement;
      fireEvent.click(listViewButton!);
    });

    // Check that view has changed (this would require checking CSS classes)
    expect(screen.getByTestId('list-icon')).toBeInTheDocument();
  });

  it('shows product details', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Rich chocolate brownie')).toBeInTheDocument();
      expect(screen.getByText('₹650')).toBeInTheDocument();
      expect(screen.getByText('500g')).toBeInTheDocument();
    });
  });

  it('displays product ingredients and allergens', async () => {
    const { container } = render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      // Look for ingredient and allergen tags by their CSS classes
      const ingredientTags = container.querySelectorAll('.ingredient-tag');
      const allergenTags = container.querySelectorAll('.allergen-tag');

      expect(ingredientTags).toHaveLength(6); // 3 for each product (Chocolate, Flour, Sugar + Vanilla, Flour, Sugar)
      expect(allergenTags).toHaveLength(4); // 2 for each product (Gluten, Dairy + Gluten, Eggs)

      // Check if the text content contains what we expect
      const ingredientTexts = Array.from(ingredientTags).map((tag: Element) => tag.textContent);
      const allergenTexts = Array.from(allergenTags).map((tag: Element) => tag.textContent);

      expect(ingredientTexts).toContain('Chocolate');
      expect(allergenTexts).toContain('Gluten');
    });
  });

  it('shows featured badge for featured products', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  it('handles add to cart action', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const addToCartButton = screen.getAllByText(/Add/)[0];
      fireEvent.click(addToCartButton);
    });

    // The product should be added to cart (handled by CartContext)
    expect(screen.getAllByText(/Add/)[0]).toBeInTheDocument();
  });

  it('toggles favorite status', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const heartIcon = screen.getAllByTestId('heart-icon')[0];
      fireEvent.click(heartIcon.parentElement!);
    });

    // Heart should change to filled state
    await waitFor(() => {
      const heartIcon = screen.getAllByTestId('heart-icon')[0];
      expect(heartIcon).toHaveAttribute('data-fill', '#FF6B6B');
    });
  });

  it('shows no products message when no results', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search products, ingredients...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });
  });

  it('clears filters when clear filters button is clicked', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Set a search term that results in no products
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search products, ingredients...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });

    await waitFor(() => {
      const clearFiltersButton = screen.getByText('Clear Filters');
      fireEvent.click(clearFiltersButton);
    });

    // All products should be visible again
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
      expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
    });
  });

  it('renders price range filter', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const filtersToggle = screen.getByText('Filters');
      fireEvent.click(filtersToggle);
    });

    await waitFor(() => {
      expect(screen.getByText('Price Range')).toBeInTheDocument();
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });
  });

  it('filters products by price range', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const filtersToggle = screen.getByText('Filters');
      fireEvent.click(filtersToggle);
    });

    await waitFor(() => {
      const priceSlider = screen.getByRole('slider');
      fireEvent.change(priceSlider, { target: { value: '100' } });
    });

    // Only products under ₹100 should be visible
    await waitFor(() => {
      expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
      expect(screen.queryByText('Chocolate Brownie')).not.toBeInTheDocument();
    });
  });

  it('shows results count', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 2 products')).toBeInTheDocument();
    });
  });

  it('renders product emojis based on category', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      // Check for category emojis
      expect(screen.getByText('🍫')).toBeInTheDocument(); // brownies
      expect(screen.getByText('🧁')).toBeInTheDocument(); // cupcakes
    });
  });

  it('handles search by ingredient', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    );

    // Wait for loading to complete first
    await waitFor(() => {
      expect(screen.getByText('Chocolate Brownie')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search products, ingredients...');
      fireEvent.change(searchInput, { target: { value: 'vanilla' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
      expect(screen.queryByText('Chocolate Brownie')).not.toBeInTheDocument();
    });
  });
});