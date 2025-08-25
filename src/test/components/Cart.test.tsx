import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../../pages/Cart';
import { CartProvider } from '../../context/CartContext';

// Mock company config
vi.mock('../../config/company', () => ({
  COMPANY_INFO: {
    name: 'Test Bakery',
    phone: '+91 9876543210',
    email: 'test@bakery.com'
  },
  getWhatsAppUrl: vi.fn((message) => `https://wa.me/919876543210?text=${encodeURIComponent(message)}`),
  getEmailUrl: vi.fn((subject, body) => `mailto:test@bakery.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'cart.title': 'Shopping Cart',
        'cart.empty': 'Your cart is empty',
        'cart.continueShopping': 'Continue Shopping',
        'cart.checkout': 'Checkout',
        'cart.total': 'Total',
        'contact.form.name': 'Full Name',
        'contact.form.email': 'Email Address',
        'contact.form.phone': 'Phone Number',
        'order.title': 'Complete Your Order',
        'order.customerInfo': 'Customer Information',
        'order.orderSummary': 'Order Summary',
        'order.submitVia': 'Submit your order via',
        'order.whatsapp': 'WhatsApp',
        'order.email': 'Email',
        'order.success': 'Order submitted successfully!',
        'common.loading': 'Loading...'
      };
      return translations[key] || key;
    }
  })
}));

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
});

// Mock window.alert
const mockAlert = vi.fn();
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true
});

const mockCartItems = [
  {
    id: 1,
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake',
    price: 500,
    quantity: '1 kg',
    category: 'cakes',
    featured: true,
    cartQuantity: 2
  },
  {
    id: 2,
    name: 'Vanilla Cupcake',
    description: 'Sweet vanilla cupcake',
    price: 50,
    quantity: '1 piece',
    category: 'cupcakes',
    featured: false,
    cartQuantity: 3
  }
];

// Mock the useCart hook directly
vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn(),
  CartProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const { useCart } = await import('../../context/CartContext');
const mockUseCart = useCart as any;

// Helper to create mock cart context
const createMockCartContext = (items: any[] = []) => ({
  items,
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  getCartTotal: vi.fn(() => {
    return items.reduce((total: number, item: any) => total + (item.price * item.cartQuantity), 0);
  }),
  getCartCount: vi.fn(() => {
    return items.reduce((total: number, item: any) => total + item.cartQuantity, 0);
  })
});

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// Render functions
const renderEmptyCart = () => {
  const mockContext = createMockCartContext([]);
  mockUseCart.mockReturnValue(mockContext);

  return render(
    <TestWrapper>
      <Cart />
    </TestWrapper>
  );
};

const renderWithCart = (initialItems = mockCartItems) => {
  const mockContext = createMockCartContext(initialItems);
  mockUseCart.mockReturnValue(mockContext);

  return render(
    <TestWrapper>
      <Cart />
    </TestWrapper>
  );
};

describe('Cart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWindowOpen.mockClear();
    mockAlert.mockClear();
  });

  describe('Empty Cart State', () => {
    it('renders empty cart message when no items', () => {
      renderEmptyCart();

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText('Add some delicious treats to your cart!')).toBeInTheDocument();
    });

    it('shows continue shopping button in empty cart', () => {
      renderEmptyCart();

      const continueButton = screen.getByText('Continue Shopping');
      expect(continueButton).toBeInTheDocument();
      expect(continueButton.closest('a')).toHaveAttribute('href', '/products');
    });

    it('renders empty cart icon', () => {
      renderEmptyCart();

      expect(screen.getByText('🛒')).toBeInTheDocument();
    });
  });

  describe('Cart with Items', () => {
    it('renders cart title and description', async () => {
      renderWithCart();

      await waitFor(() => {
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
        expect(screen.getByText('Review your order and proceed to checkout')).toBeInTheDocument();
      });
    });

    it('displays cart items with correct information', async () => {
      renderWithCart();

      await waitFor(() => {
        expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
        expect(screen.getByText('Rich chocolate cake')).toBeInTheDocument();
        expect(screen.getByText('₹500 per 1 kg')).toBeInTheDocument();

        expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument();
        expect(screen.getByText('Sweet vanilla cupcake')).toBeInTheDocument();
        expect(screen.getByText('₹50 per 1 piece')).toBeInTheDocument();
      });
    });

    it('shows correct quantities and totals', async () => {
      renderWithCart();

      await waitFor(() => {
        // Check quantity displays
        const quantityDisplays = screen.getAllByText('2');
        expect(quantityDisplays.length).toBeGreaterThan(0);

        const quantityDisplays3 = screen.getAllByText('3');
        expect(quantityDisplays3.length).toBeGreaterThan(0);

        // Check item totals
        expect(screen.getByText('₹1000')).toBeInTheDocument(); // 500 * 2
        expect(screen.getByText('₹150')).toBeInTheDocument();  // 50 * 3
      });
    });

    it('calculates and displays correct cart total', async () => {
      renderWithCart();

      await waitFor(() => {
        expect(screen.getByText('₹1150')).toBeInTheDocument(); // 1000 + 150
      });
    });

    it('renders quantity control buttons', async () => {
      renderWithCart();

      await waitFor(() => {
        const minusButtons = document.querySelectorAll('[data-testid], .quantity-btn').length >= 4;
        const plusButtons = document.querySelectorAll('[data-testid], .quantity-btn').length >= 4;
        expect(minusButtons || plusButtons).toBeTruthy();
      });
    });

    it('renders remove buttons for each item', async () => {
      renderWithCart();

      await waitFor(() => {
        const removeButtons = document.querySelectorAll('.remove-btn');
        expect(removeButtons.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('shows continue shopping and checkout buttons', async () => {
      renderWithCart();

      await waitFor(() => {
        const continueButton = screen.getByText('Continue Shopping');
        const checkoutButton = screen.getByText('Checkout');

        expect(continueButton).toBeInTheDocument();
        expect(checkoutButton).toBeInTheDocument();
        expect(continueButton.closest('a')).toHaveAttribute('href', '/products');
      });
    });
  });

  describe('Order Form', () => {
    it('shows order form when checkout is clicked', async () => {
      renderWithCart();

      await waitFor(() => {
        const checkoutButton = screen.getByText('Checkout');
        fireEvent.click(checkoutButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Complete Your Order')).toBeInTheDocument();
        expect(screen.getByText('Customer Information')).toBeInTheDocument();
      });
    });

    it('renders customer information form fields', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
      });
    });

    it('shows order summary in form', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        expect(screen.getByText('Order Summary')).toBeInTheDocument();
        expect(screen.getByText('Chocolate Cake x 2')).toBeInTheDocument();
        expect(screen.getByText('Vanilla Cupcake x 3')).toBeInTheDocument();
      });
    });

    it('updates form fields when typing', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Full Name');
        const emailInput = screen.getByPlaceholderText('Email Address');
        const phoneInput = screen.getByPlaceholderText('Phone Number');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });

        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('john@example.com');
        expect(phoneInput).toHaveValue('9876543210');
      });
    });

    it('shows WhatsApp and Email submit buttons', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        expect(screen.getByText('Complete Your Order')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Check if the submit buttons exist
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByText(/submit your order via/i)).toBeInTheDocument();
    });

    it('disables submit buttons when required fields are empty', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        const whatsappButton = screen.getByText('WhatsApp').closest('button');
        const emailButton = screen.getByText('Email').closest('button');

        expect(whatsappButton).toBeDisabled();
        expect(emailButton).toBeDisabled();
      });
    });

    it('enables WhatsApp button when name and phone are filled', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Full Name');
        const phoneInput = screen.getByPlaceholderText('Phone Number');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });
      });

      await waitFor(() => {
        const whatsappButton = screen.getByText('WhatsApp').closest('button');
        expect(whatsappButton).not.toBeDisabled();
      });
    });

    it('enables Email button when name and email are filled', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Full Name');
        const emailInput = screen.getByPlaceholderText('Email Address');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      });

      await waitFor(() => {
        const emailButton = screen.getByText('Email').closest('button');
        expect(emailButton).not.toBeDisabled();
      });
    });

    it('shows back to cart button', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        expect(screen.getByText('Back to Cart')).toBeInTheDocument();
      });
    });

    it('returns to cart view when back button is clicked', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Back to Cart'));
      });

      await waitFor(() => {
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
        expect(screen.queryByText('Complete Your Order')).not.toBeInTheDocument();
      });
    });
  });

  describe('Order Submission', () => {
    it('opens WhatsApp when WhatsApp submit is clicked', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Full Name');
        const phoneInput = screen.getByPlaceholderText('Phone Number');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });

        fireEvent.click(screen.getByText('WhatsApp'));
      });

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalled();
        expect(mockWindowOpen).toHaveBeenCalledWith(
          expect.stringContaining('wa.me'),
          '_blank'
        );
      });
    });

    it('opens email client when Email submit is clicked', async () => {
      renderWithCart();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Checkout'));
      });

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Full Name');
        const emailInput = screen.getByPlaceholderText('Email Address');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

        fireEvent.click(screen.getByText('Email'));
      });

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalled();
        expect(mockWindowOpen).toHaveBeenCalledWith(
          expect.stringContaining('mailto:')
        );
      });
    });
  });
});