import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Contact from '../../pages/Contact';
import { CartProvider } from '../../context/CartContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Create a test i18n instance
const createTestI18n = () => {
  const testI18n = i18n.createInstance();

  testI18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: {
          nav: {
            home: 'Home',
            products: 'Products',
            contact: 'Contact'
          },
          contact: {
            title: 'Contact Us',
            subtitle: 'Get in touch with us',
            form: {
              name: 'Your Name',
              email: 'Email Address',
              phone: 'Phone Number',
              message: 'Message',
              send: 'Send Message'
            },
            social: 'Follow Us'
          },
          common: {
            loading: 'Loading...',
            toggleTheme: 'Toggle theme',
            changeLanguage: 'Change language'
          },
          home: {
            aboutText: '{{companyName}} is a family-owned bakery dedicated to creating delicious treats.'
          }
        }
      },
      ta: {
        translation: {
          nav: {
            home: 'முகப்பு',
            products: 'தயாரிப்புகள்',
            contact: 'தொடர்பு'
          },
          contact: {
            title: 'எங்களைத் தொடர்பு கொள்ளுங்கள்',
            subtitle: 'எங்களுடன் தொடர்பில் இருங்கள்',
            form: {
              name: 'உங்கள் பெயர்',
              email: 'மின்னஞ்சல் முகவரி',
              phone: 'தொலைபேசி எண்',
              message: 'செய்தி',
              send: 'செய்தியை அனுப்பவும்'
            },
            social: 'எங்களைப் பின்தொடரவும்'
          },
          common: {
            loading: 'ஏற்றுகிறது...',
            toggleTheme: 'தீம் மாற்று',
            changeLanguage: 'மொழியை மாற்று'
          },
          home: {
            aboutText: '{{companyName}} ஒரு குடும்ப நிறுவனம் ஆகும்.'
          }
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

  return testI18n;
};

// Mock other dependencies
vi.mock('../../config/company', () => ({
  COMPANY_INFO: {
    name: 'The Bake Bar',
    tagline: 'Homemade Bakery',
    contact: {
      address: { full: '123 Bakery Street' },
      phone: '+91 95518 62527',
      email: 'test@bakebar.com',
      hours: 'Mon-Sun: 8AM-8PM'
    },
    social: {
      facebook: 'https://facebook.com/test',
      instagram: 'https://instagram.com/test',
      twitter: 'https://twitter.com/test',
      whatsapp: 'https://wa.me/test'
    }
  },
  getEmailUrl: vi.fn(),
  getPhoneUrl: vi.fn(),
  getMapsUrl: vi.fn(),
  getWhatsAppUrl: vi.fn()
}));

vi.mock('../../assets/images/logo.png', () => ({
  default: 'test-logo.png'
}));

// Mock icons
vi.mock('lucide-react', () => ({
  ShoppingCart: () => <div>ShoppingCart</div>,
  Menu: () => <div>Menu</div>,
  X: () => <div>X</div>,
  Sun: () => <div>Sun</div>,
  Moon: () => <div>Moon</div>,
  Globe: () => <div>Globe</div>,
  Home: () => <div>Home</div>,
  Package: () => <div>Package</div>,
  Phone: () => <div>Phone</div>,
  Mail: () => <div>Mail</div>,
  MapPin: () => <div>MapPin</div>,
  Clock: () => <div>Clock</div>,
  Facebook: () => <div>Facebook</div>,
  Instagram: () => <div>Instagram</div>,
  Twitter: () => <div>Twitter</div>,
  Heart: () => <div>Heart</div>,
  Send: () => <div>Send</div>,
  MessageCircle: () => <div>MessageCircle</div>,
  User: () => <div>User</div>,
  MessageSquare: () => <div>MessageSquare</div>
}));

const TestWrapper: React.FC<{ children: React.ReactNode; i18nInstance: any }> = ({ children, i18nInstance }) => (
  <I18nextProvider i18n={i18nInstance}>
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  </I18nextProvider>
);

describe('Localization Integration Tests', () => {
  let testI18n: any;

  beforeEach(() => {
    testI18n = createTestI18n();
  });

  describe('Navbar Localization', () => {
    it('displays navigation links in English', () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Navbar />
        </TestWrapper>
      );

      // Use more specific selectors to avoid multiple matches
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getAllByText('Home')).toHaveLength(2); // Logo + nav link
    });

    it('displays navigation links in Tamil after language change', async () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Navbar />
        </TestWrapper>
      );

      await testI18n.changeLanguage('ta');

      await waitFor(() => {
        expect(screen.getByText('முகப்பு')).toBeInTheDocument();
        expect(screen.getByText('தயாரிப்புகள்')).toBeInTheDocument();
        expect(screen.getByText('தொடர்பு')).toBeInTheDocument();
      });
    });

    it('switches language when language dropdown option is clicked', async () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Navbar />
        </TestWrapper>
      );

      // Open language dropdown
      const languageButton = screen.getByLabelText('Change language');
      fireEvent.click(languageButton);

      await waitFor(() => {
        const tamilOption = screen.getByText('🇮🇳 தமிழ்');
        fireEvent.click(tamilOption);
      });

      await waitFor(() => {
        expect(screen.getByText('முகப்பு')).toBeInTheDocument();
      });
    });
  });

  describe('Footer Localization', () => {
    it('displays contact section title in English', () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Footer />
        </TestWrapper>
      );

      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('displays contact section title in Tamil', async () => {
      testI18n.changeLanguage('ta');

      render(
        <TestWrapper i18nInstance={testI18n}>
          <Footer />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('தொடர்பு')).toBeInTheDocument();
      });
    });

    it('renders company description with interpolation', () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Footer />
        </TestWrapper>
      );

      expect(screen.getByText(/The Bake Bar is a family-owned bakery/)).toBeInTheDocument();
    });
  });

  describe('Contact Page Localization', () => {
    it('displays contact form labels in English', () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Contact />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
    });

    it('displays contact form labels in Tamil', async () => {
      testI18n.changeLanguage('ta');

      render(
        <TestWrapper i18nInstance={testI18n}>
          <Contact />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('உங்கள் பெயர்')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('மின்னஞ்சல் முகவரி')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('தொலைபேசி எண்')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('செய்தி')).toBeInTheDocument();
      });
    });

    it('displays submit button text in correct language', async () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Contact />
        </TestWrapper>
      );

      expect(screen.getByText('Send Message')).toBeInTheDocument();

      await testI18n.changeLanguage('ta');

      await waitFor(() => {
        expect(screen.getByText('செய்தியை அனுப்பவும்')).toBeInTheDocument();
      });
    });
  });

  describe('Dynamic Language Switching', () => {
    it('updates all components when language changes', async () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <div>
            <Navbar />
            <Contact />
          </div>
        </TestWrapper>
      );

      // Initially in English
      expect(screen.getAllByText('Home')).toHaveLength(2); // Logo + nav link
      expect(screen.getByText('Contact Us')).toBeInTheDocument();

      // Switch to Tamil
      await testI18n.changeLanguage('ta');

      await waitFor(() => {
        expect(screen.getByText('முகப்பு')).toBeInTheDocument();
        expect(screen.getByText('எங்களைத் தொடர்பு கொள்ளுங்கள்')).toBeInTheDocument();
      });
    });

    it('maintains component functionality after language change', async () => {
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Navbar />
        </TestWrapper>
      );

      // Switch language
      await testI18n.changeLanguage('ta');

      await waitFor(() => {
        expect(screen.getByText('முகப்பு')).toBeInTheDocument();
      });

      // Test that dropdown still works
      const languageButton = screen.getByLabelText('மொழியை மாற்று');
      fireEvent.click(languageButton);

      await waitFor(() => {
        expect(screen.getByText('🇺🇸 English')).toBeInTheDocument();
      });
    });
  });

  describe('Interpolation and Complex Translations', () => {
    it('handles interpolation in translations', async () => {
      // Test interpolation through Footer component which uses the translation
      render(
        <TestWrapper i18nInstance={testI18n}>
          <Footer />
        </TestWrapper>
      );

      expect(screen.getByText(/The Bake Bar is a family-owned bakery/)).toBeInTheDocument();
    });

    it('handles missing translation keys gracefully', async () => {
      // Create a proper test component
      const TestMissing: React.FC = () => {
        const { t } = testI18n;
        return <div data-testid="missing">{t('non.existent.key')}</div>;
      };

      render(
        <TestWrapper i18nInstance={testI18n}>
          <TestMissing />
        </TestWrapper>
      );

      const element = screen.getByTestId('missing');
      expect(element.textContent).toBe('non.existent.key');
    });
  });
});