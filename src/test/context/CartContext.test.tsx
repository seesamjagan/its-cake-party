import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartProvider, useCart } from '../../context/CartContext';
import { Product } from '../../types';

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

// Test component that uses the cart context
const TestComponent: React.FC = () => {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const testProduct: Product = {
    id: 1,
    name: 'Test Brownie',
    image: 'test.jpg',
    description: 'A delicious test brownie',
    quantity: '500g',
    price: 100,
    category: 'brownies',
    featured: true,
    ingredients: ['Chocolate', 'Flour'],
    allergens: ['Gluten'],
  };

  const testProduct2: Product = {
    id: 2,
    name: 'Test Cupcake',
    image: 'cupcake.jpg',
    description: 'A sweet test cupcake',
    quantity: '1 piece',
    price: 50,
    category: 'cupcakes',
    featured: false,
    ingredients: ['Vanilla', 'Flour'],
    allergens: ['Gluten', 'Eggs'],
  };

  return (
    <div>
      <div data-testid="cart-count">{getCartItemsCount()}</div>
      <div data-testid="cart-total">₹{getCartTotal()}</div>
      <div data-testid="cart-items">
        {items.map((item) => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            {item.name} - Quantity: {item.cartQuantity} - Price: ₹{item.price}
          </div>
        ))}
      </div>
      <button onClick={() => addToCart(testProduct)} data-testid="add-product-1">
        Add Product 1
      </button>
      <button onClick={() => addToCart(testProduct2)} data-testid="add-product-2">
        Add Product 2
      </button>
      <button onClick={() => removeFromCart(1)} data-testid="remove-product-1">
        Remove Product 1
      </button>
      <button onClick={() => updateQuantity(1, 3)} data-testid="update-quantity-1">
        Update Quantity 1 to 3
      </button>
      <button onClick={() => updateQuantity(1, 0)} data-testid="set-quantity-0">
        Set Quantity to 0
      </button>
      <button onClick={clearCart} data-testid="clear-cart">
        Clear Cart
      </button>
    </div>
  );
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('provides initial empty cart state', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹0');
    expect(screen.getByTestId('cart-items')).toBeEmptyDOMElement();
  });

  it('adds a product to the cart', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹100');
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Brownie - Quantity: 1 - Price: ₹100');
  });

  it('increases quantity when adding the same product', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('add-product-1'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹200');
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Brownie - Quantity: 2 - Price: ₹100');
  });

  it('adds multiple different products', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('add-product-2'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹150');
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });

  it('removes a product from the cart', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('add-product-2'));
    fireEvent.click(screen.getByTestId('remove-product-1'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹50');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });

  it('updates product quantity', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('update-quantity-1'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹300');
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Brownie - Quantity: 3 - Price: ₹100');
  });

  it('removes product when quantity is set to 0', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('set-quantity-0'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹0');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
  });

  it('clears all products from cart', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('add-product-2'));
    fireEvent.click(screen.getByTestId('clear-cart'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹0');
    expect(screen.getByTestId('cart-items')).toBeEmptyDOMElement();
  });

  it('calculates correct total with multiple products and quantities', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('add-product-1')); // 2x Product 1 = ₹200
    fireEvent.click(screen.getByTestId('add-product-2')); // 1x Product 2 = ₹50
    // Total should be ₹250

    expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹250');
  });

  it('saves cart to localStorage when items change', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'bakery-cart',
      expect.stringContaining('Test Brownie')
    );
  });

  it('loads cart from localStorage on mount', () => {
    const savedCart = JSON.stringify([
      {
        id: 1,
        name: 'Saved Brownie',
        image: 'saved.jpg',
        description: 'A saved brownie',
        quantity: '500g',
        price: 150,
        category: 'brownies',
        featured: true,
        ingredients: ['Chocolate'],
        allergens: ['Gluten'],
        cartQuantity: 2,
      },
    ]);

    mockLocalStorage.getItem.mockReturnValue(savedCart);

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹300');
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Saved Brownie');
  });

  it('handles corrupted localStorage data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('prevents negative quantities', () => {
    const TestNegativeQuantity = () => {
      const { updateQuantity, items, getCartItemsCount } = useCart();

      return (
        <div>
          <div data-testid="cart-count">{getCartItemsCount()}</div>
          <button onClick={() => updateQuantity(1, -5)} data-testid="negative-quantity">
            Set Negative
          </button>
          <div data-testid="cart-items">
            {items.map(item => (
              <div key={item.id} data-testid={`item-${item.id}`}>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
        <TestNegativeQuantity />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    let cartCountElements = screen.getAllByTestId('cart-count');
    expect(cartCountElements[0]).toHaveTextContent('1');

    // Try to update to negative quantity
    fireEvent.click(screen.getByTestId('negative-quantity'));

    cartCountElements = screen.getAllByTestId('cart-count');
    expect(cartCountElements[0]).toHaveTextContent('0');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
  });

  it('throws error when useCart is used outside CartProvider', () => {
    const TestComponentWithoutProvider = () => {
      useCart();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useCart must be used within a CartProvider');
  });

  it('handles updating quantity for non-existent product', () => {
    const TestNonExistentUpdate = () => {
      const { updateQuantity, getCartItemsCount } = useCart();

      return (
        <div>
          <div data-testid="cart-count-2">{getCartItemsCount()}</div>
          <button onClick={() => updateQuantity(999, 5)} data-testid="update-nonexistent">
            Update Non-existent
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
        <TestNonExistentUpdate />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('update-nonexistent'));

    expect(screen.getByTestId('cart-count-2')).toHaveTextContent('0');
  });

  it('handles removing non-existent product', () => {
    const TestNonExistentRemove = () => {
      const { removeFromCart, getCartItemsCount, items } = useCart();

      return (
        <div>
          <div data-testid="cart-count-3">{getCartItemsCount()}</div>
          <button onClick={() => removeFromCart(999)} data-testid="remove-nonexistent">
            Remove Non-existent
          </button>
          <div data-testid="items-3">
            {items.map(item => (
              <div key={item.id} data-testid={`item-3-${item.id}`}>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
        <TestNonExistentRemove />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-product-1'));
    expect(screen.getByTestId('cart-count-3')).toHaveTextContent('1');

    fireEvent.click(screen.getByTestId('remove-nonexistent'));

    expect(screen.getByTestId('cart-count-3')).toHaveTextContent('1');
    expect(screen.getByTestId('item-3-1')).toBeInTheDocument();
  });

  it('maintains cart state across multiple operations', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Add products
    fireEvent.click(screen.getByTestId('add-product-1'));
    fireEvent.click(screen.getByTestId('add-product-2'));
    fireEvent.click(screen.getByTestId('add-product-1')); // Add product 1 again

    // Update quantity
    fireEvent.click(screen.getByTestId('update-quantity-1'));

    // Remove one product
    fireEvent.click(screen.getByTestId('remove-product-1'));

    // Final state: only product 2 should remain
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹50');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });
});