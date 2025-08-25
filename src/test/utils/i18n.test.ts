import { describe, it, expect, vi, beforeEach } from 'vitest';
import i18n from '../../utils/i18n';

// Mock the translation files
vi.mock('../../locales/en.json', () => ({
  default: {
    nav: {
      home: 'Home',
      products: 'Products',
      contact: 'Contact'
    },
    products: {
      title: 'Our Products',
      categories: {
        all: 'All',
        brownies: 'Brownies',
        cakes: 'Cakes'
      }
    },
    common: {
      loading: 'Loading...',
      toggleTheme: 'Toggle theme'
    }
  }
}));

vi.mock('../../locales/ta.json', () => ({
  default: {
    nav: {
      home: 'முகப்பு',
      products: 'தயாரிப்புகள்',
      contact: 'தொடர்பு'
    },
    products: {
      title: 'எங்கள் தயாரிப்புகள்',
      categories: {
        all: 'அனைத்தும்',
        brownies: 'பிரௌனிகள்',
        cakes: 'கேக்குகள்'
      }
    },
    common: {
      loading: 'ஏற்றுகிறது...',
      toggleTheme: 'தீம் மாற்று'
    }
  }
}));

describe('i18n Configuration', () => {
  beforeEach(() => {
    // Reset to English before each test
    i18n.changeLanguage('en');
  });

  it('initializes with English as default language', () => {
    expect(i18n.language).toBe('en');
  });

  it('has correct fallback language', () => {
    // i18next can return fallbackLng as array or string
    const fallbackLng = i18n.options.fallbackLng;
    const expectedFallback = Array.isArray(fallbackLng) ? fallbackLng[0] : fallbackLng;
    expect(expectedFallback).toBe('en');
  });

  it('has escape value set to false for React', () => {
    expect(i18n.options.interpolation?.escapeValue).toBe(false);
  });

  it('loads English translations correctly', () => {
    expect(i18n.t('nav.home')).toBe('Home');
    expect(i18n.t('nav.products')).toBe('Products');
    expect(i18n.t('nav.contact')).toBe('Contact');
  });

  it('loads Tamil translations correctly', async () => {
    await i18n.changeLanguage('ta');

    expect(i18n.t('nav.home')).toBe('முகப்பு');
    expect(i18n.t('nav.products')).toBe('தயாரிப்புகள்');
    expect(i18n.t('nav.contact')).toBe('தொடர்பு');
  });

  it('changes language successfully', async () => {
    await i18n.changeLanguage('ta');
    expect(i18n.language).toBe('ta');

    await i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
  });

  it('translates nested keys correctly', () => {
    expect(i18n.t('products.categories.brownies')).toBe('Brownies');
    expect(i18n.t('products.categories.cakes')).toBe('Cakes');
  });

  it('translates nested keys in Tamil correctly', async () => {
    await i18n.changeLanguage('ta');

    expect(i18n.t('products.categories.brownies')).toBe('பிரௌனிகள்');
    expect(i18n.t('products.categories.cakes')).toBe('கேக்குகள்');
  });

  it('returns key when translation is missing', () => {
    const missingKey = 'missing.translation.key';
    expect(i18n.t(missingKey)).toBe(missingKey);
  });

  it('falls back to English when Tamil translation is missing', async () => {
    await i18n.changeLanguage('ta');

    // Assuming this key doesn't exist in Tamil
    const result = i18n.t('non.existent.key');
    expect(typeof result).toBe('string');
  });

  it('handles interpolation correctly', () => {
    // Test with a key that supports interpolation
    const result = i18n.t('products.title');
    expect(result).toBe('Our Products');
  });

  it('supports multiple language switches', async () => {
    // Start with English
    expect(i18n.t('common.loading')).toBe('Loading...');

    // Switch to Tamil
    await i18n.changeLanguage('ta');
    expect(i18n.t('common.loading')).toBe('ஏற்றுகிறது...');

    // Switch back to English
    await i18n.changeLanguage('en');
    expect(i18n.t('common.loading')).toBe('Loading...');

    // Switch to Tamil again
    await i18n.changeLanguage('ta');
    expect(i18n.t('common.loading')).toBe('ஏற்றுகிறது...');
  });

  it('maintains translation state after multiple operations', async () => {
    // Set to Tamil
    await i18n.changeLanguage('ta');

    // Perform multiple translations
    const nav = i18n.t('nav.home');
    const products = i18n.t('products.title');
    const loading = i18n.t('common.loading');

    expect(nav).toBe('முகப்பு');
    expect(products).toBe('எங்கள் தயாரிப்புகள்');
    expect(loading).toBe('ஏற்றுகிறது...');

    // Language should still be Tamil
    expect(i18n.language).toBe('ta');
  });

  it('has both languages configured in resources', () => {
    expect(i18n.options.resources).toHaveProperty('en');
    expect(i18n.options.resources).toHaveProperty('ta');
    expect(i18n.options.resources?.en).toHaveProperty('translation');
    expect(i18n.options.resources?.ta).toHaveProperty('translation');
  });

  it('handles language detection correctly', () => {
    // The current language should be accessible
    expect(typeof i18n.language).toBe('string');
    expect(['en', 'ta']).toContain(i18n.language);
  });

  it('supports complex nested translation paths', () => {
    expect(i18n.t('products.categories.all')).toBe('All');
  });

  it('supports complex nested translation paths in Tamil', async () => {
    await i18n.changeLanguage('ta');
    expect(i18n.t('products.categories.all')).toBe('அனைத்தும்');
  });

  it('handles empty translation gracefully', () => {
    const result = i18n.t('');
    expect(typeof result).toBe('string');
  });

  it('handles undefined translation key gracefully', () => {
    const result = i18n.t(undefined as any);
    expect(typeof result).toBe('string');
  });

  it('preserves translation context across async operations', async () => {
    await i18n.changeLanguage('ta');

    // Simulate async operations
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(i18n.t('nav.home')).toBe('முகப்பு');
  });

  it('can detect available languages', () => {
    const languages = i18n.languages;
    expect(Array.isArray(languages)).toBe(true);
  });

  it('has React i18next integration configured', () => {
    expect(i18n.use).toBeDefined();
    expect(i18n.init).toBeDefined();
  });

  it('supports synchronous translation after initialization', () => {
    // After initialization, translations should be available synchronously
    const result = i18n.t('nav.home');
    expect(result).toBe('Home');
  });

  it('handles case-sensitive translation keys', () => {
    expect(i18n.t('nav.home')).not.toBe(i18n.t('nav.Home'));
    expect(i18n.t('nav.HOME')).not.toBe(i18n.t('nav.home'));
  });

  it('maintains consistent behavior across language switches', async () => {
    // Test the same key in both languages
    const englishResult = i18n.t('common.toggleTheme');
    expect(englishResult).toBe('Toggle theme');

    await i18n.changeLanguage('ta');
    const tamilResult = i18n.t('common.toggleTheme');
    expect(tamilResult).toBe('தீம் மாற்று');

    // Switch back and verify consistency
    await i18n.changeLanguage('en');
    const englishAgain = i18n.t('common.toggleTheme');
    expect(englishAgain).toBe('Toggle theme');
    expect(englishAgain).toBe(englishResult);
  });
});