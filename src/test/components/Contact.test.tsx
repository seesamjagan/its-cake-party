import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../../pages/Contact';

// Mock react-i18next
const mockT = vi.fn((key: string, options?: any) => {
  const translations: { [key: string]: string } = {
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with us',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.social': 'Follow Us',
    'contact.socialMedia.whatsapp': 'WhatsApp',
    'contact.info.address': options?.address || '123 Bakery Street, Sweet City',
    'contact.info.phone': options?.phone || '+91 95518 62527',
    'contact.info.email': options?.email || 'test@bakebar.com',
    'contact.info.hours': options?.hours || 'Mon-Sun: 8AM-8PM',
    'contact.faq.questions.hours.question': 'What are your operating hours?',
    'contact.faq.questions.hours.answer': 'We\'re open Monday to Sunday, 8:00 AM to 8:00 PM.',
    'contact.faq.questions.custom.question': 'Do you take custom orders?',
    'contact.faq.questions.custom.answer': 'Yes! We love creating custom cakes and treats.',
    'contact.faq.questions.delivery.question': 'Do you offer delivery?',
    'contact.faq.questions.delivery.answer': 'Currently, we offer pickup only.',
    'contact.faq.questions.vegetarian.question': 'Are your products suitable for vegetarians?',
    'contact.faq.questions.vegetarian.answer': 'Most of our products are vegetarian-friendly.',
    'common.loading': 'Loading...'
  };
  return translations[key] || key;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT })
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  MapPin: ({ size, className }: { size?: number; className?: string }) =>
    <div data-testid="map-pin-icon" data-size={size} className={className}>MapPin</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Send: () => <div data-testid="send-icon">Send</div>,
  MessageCircle: () => <div data-testid="message-circle-icon">MessageCircle</div>,
  Facebook: () => <div data-testid="facebook-icon">Facebook</div>,
  Instagram: () => <div data-testid="instagram-icon">Instagram</div>,
  Twitter: () => <div data-testid="twitter-icon">Twitter</div>,
  User: () => <div data-testid="user-icon">User</div>,
  MessageSquare: () => <div data-testid="message-square-icon">MessageSquare</div>
}));

// Mock company config
vi.mock('../../config/company', () => ({
  COMPANY_INFO: {
    name: 'The Bake Bar',
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
      twitter: 'https://twitter.com/the-bake-bar',
      whatsapp: 'https://wa.me/919551862527'
    }
  },
  getEmailUrl: vi.fn((subject?: string, body?: string) =>
    `mailto:test@bakebar.com?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`
  ),
  getPhoneUrl: vi.fn(() => 'tel:+919551862527'),
  getMapsUrl: vi.fn(() => 'https://maps.google.com/maps?q=123%20Bakery%20Street%2C%20Sweet%20City'),
  getWhatsAppUrl: vi.fn((message?: string) =>
    `https://wa.me/919551862527?text=${encodeURIComponent(message || '')}`
  )
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen
});

// Mock alert
const mockAlert = vi.fn();
Object.defineProperty(window, 'alert', {
  writable: true,
  value: mockAlert
});

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders contact page header', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Get in touch with us')).toBeInTheDocument();
  });

  it('renders contact information cards', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    const addresses = screen.getAllByText('123 Bakery Street, Sweet City');
    expect(addresses).toHaveLength(2); // One in contact info, one in map
    expect(screen.getByText('+91 95518 62527')).toBeInTheDocument();
    expect(screen.getByText('test@bakebar.com')).toBeInTheDocument();
    expect(screen.getByText('Mon-Sun: 8AM-8PM')).toBeInTheDocument();
  });

  it('renders contact icons', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getAllByTestId('map-pin-icon')).toHaveLength(2); // One in contact info, one in map
    expect(screen.getAllByTestId('phone-icon')).toHaveLength(2); // One in contact info, one in form
    expect(screen.getAllByTestId('mail-icon')).toHaveLength(3); // One in contact info, one in form, one in Direct Email button
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('renders contact form with all fields', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
  });

  it('renders form icons', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('phone-icon')).toHaveLength(2); // One in contact info, one in form
    expect(screen.getAllByTestId('mail-icon')).toHaveLength(3); // One in contact info, one in form, one in Direct Email button
    expect(screen.getByTestId('message-square-icon')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    const nameInput = screen.getByPlaceholderText('Your Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const messageInput = screen.getByPlaceholderText('Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(messageInput, { target: { value: 'Hello world' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('1234567890');
    expect(messageInput).toHaveValue('Hello world');
  });

  it('submits form successfully', async () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Your Name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'Test message' }
    });

    const submitButton = screen.getByText('Send Message');
    fireEvent.click(submitButton);

    // Button should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for form submission to complete
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Message sent successfully!');
    }, { timeout: 3000 });

    // Form should be reset
    expect(screen.getByPlaceholderText('Your Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Email Address')).toHaveValue('');
    expect(screen.getByPlaceholderText('Message')).toHaveValue('');
  });

  it('handles WhatsApp submission', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    // Fill out required fields
    fireEvent.change(screen.getByPlaceholderText('Your Name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'Test message' }
    });

    const whatsappButtons = screen.getAllByText('WhatsApp');
    const formWhatsappButton = whatsappButtons[1]; // Form button, not social link
    fireEvent.click(formWhatsappButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('wa.me'),
      '_blank'
    );
  });

  it('handles direct email submission', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    // Fill out required fields
    fireEvent.change(screen.getByPlaceholderText('Your Name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'Test message' }
    });

    const emailButton = screen.getByText('Direct Email');
    fireEvent.click(emailButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('mailto:')
    );
  });

  it('disables WhatsApp button when required fields are empty', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    const whatsappButtons = screen.getAllByText('WhatsApp');
    const formWhatsappButton = whatsappButtons[1]; // Form button, not social link
    expect(formWhatsappButton).toBeDisabled();

    // Fill name but not message
    fireEvent.change(screen.getByPlaceholderText('Your Name'), {
      target: { value: 'John Doe' }
    });
    expect(formWhatsappButton).toBeDisabled();

    // Fill message as well
    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'Test message' }
    });
    expect(formWhatsappButton).not.toBeDisabled();
  });

  it('disables email button when required fields are empty', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    const emailButton = screen.getByText('Direct Email');
    expect(emailButton).toBeDisabled();

    // Fill name and email but not name
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'john@example.com' }
    });
    expect(emailButton).toBeDisabled();

    // Fill name as well
    fireEvent.change(screen.getByPlaceholderText('Your Name'), {
      target: { value: 'John Doe' }
    });
    expect(emailButton).not.toBeDisabled();
  });

  it('renders social media links', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByText('Follow Us')).toBeInTheDocument();

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    const twitterLink = screen.getByRole('link', { name: /twitter/i });
    const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });

    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/the-bake-bar');
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/the-bake-bar');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/the-bake-bar');
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/919551862527');
  });

  it('renders social media icons', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('message-circle-icon')).toHaveLength(2); // Social + form icons
  });

  it('renders map placeholder', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByText('Interactive Map Coming Soon')).toBeInTheDocument();
    const addresses = screen.getAllByText('123 Bakery Street, Sweet City');
    expect(addresses).toHaveLength(2); // One in contact info, one in map
  });

  it('renders FAQ section', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('Quick answers to common questions about our bakery')).toBeInTheDocument();
  });

  it('renders all FAQ items', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByText('What are your operating hours?')).toBeInTheDocument();
    expect(screen.getByText('Do you take custom orders?')).toBeInTheDocument();
    expect(screen.getByText('Do you offer delivery?')).toBeInTheDocument();
    expect(screen.getByText('Are your products suitable for vegetarians?')).toBeInTheDocument();

    expect(screen.getByText(/We\'re open Monday to Sunday/)).toBeInTheDocument();
    expect(screen.getByText(/Yes! We love creating custom cakes/)).toBeInTheDocument();
    expect(screen.getByText(/Currently, we offer pickup only/)).toBeInTheDocument();
    expect(screen.getByText(/Most of our products are vegetarian-friendly/)).toBeInTheDocument();
  });

  it('handles contact info card clicks', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    // Click on address card (should open maps)
    const addressTexts = screen.getAllByText('123 Bakery Street, Sweet City');
    const addressCard = addressTexts[0].closest('.info-card');
    if (addressCard) fireEvent.click(addressCard);

    // Click on phone card (should open phone)
    const phoneTexts = screen.getAllByText('+91 95518 62527');
    const phoneCard = phoneTexts[0].closest('.info-card');
    if (phoneCard) fireEvent.click(phoneCard);

    // Click on email card (should open email)
    const emailTexts = screen.getAllByText('test@bakebar.com');
    const emailCard = emailTexts[0].closest('.info-card');
    if (emailCard) fireEvent.click(emailCard);

    expect(mockWindowOpen).toHaveBeenCalledTimes(3);
  });

  it('has proper form validation', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    const nameInput = screen.getByPlaceholderText('Your Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const messageInput = screen.getByPlaceholderText('Message');

    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(messageInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('renders form title', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByText('Send us a message')).toBeInTheDocument();
  });

  it('renders send button with icon', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    expect(screen.getByText('Send Message')).toBeInTheDocument();
    expect(screen.getByTestId('send-icon')).toBeInTheDocument();
  });
});