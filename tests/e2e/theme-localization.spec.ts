import { test, expect } from '@playwright/test';

test.describe('Theme and Localization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Check initial light theme
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // Click theme toggle button
    const themeButton = page.getByRole('button', { name: /toggle theme/i });
    await themeButton.click();

    // Check dark theme is applied
    await expect(html).toHaveClass(/dark/);

    // Toggle back to light theme
    await themeButton.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should persist theme preference across page navigation', async ({ page }) => {
    // Switch to dark theme
    const themeButton = page.getByRole('button', { name: /toggle theme/i });
    await themeButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to products page
    await page.getByRole('link', { name: 'Products' }).click();

    // Theme should persist
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to contact page
    await page.getByRole('link', { name: 'Contact' }).click();

    // Theme should still persist
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should switch languages correctly', async ({ page }) => {
    // Check initial English content
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.getByText('Contact')).toBeVisible();

    // Open language dropdown
    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();

    // Switch to Tamil
    await page.getByText('🇮🇳 தமிழ்').click();

    // Check Tamil content appears
    await expect(page.getByText('முகப்பு')).toBeVisible();
    await expect(page.getByText('தயாரிப்புகள்')).toBeVisible();
    await expect(page.getByText('தொடர்பு')).toBeVisible();
  });

  test('should persist language preference across page navigation', async ({ page }) => {
    // Switch to Tamil
    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();
    await page.getByText('🇮🇳 தமிழ்').click();

    // Check Tamil is applied
    await expect(page.getByText('முகப்பு')).toBeVisible();

    // Navigate to products page
    await page.getByRole('link', { name: 'தயாரிப்புகள்' }).click();

    // Wait for page to load and check Tamil content
    await expect(page.getByText('எங்கள் தயாரிப்புகள்')).toBeVisible({ timeout: 10000 });

    // Navigate to contact page
    await page.getByRole('link', { name: 'தொடர்பு' }).click();

    // Check Tamil content persists
    await expect(page.getByText('எங்களைத் தொடர்பு கொள்ளுங்கள்')).toBeVisible();
  });

  test('should update form placeholders when language changes', async ({ page }) => {
    // Go to contact page
    await page.goto('/contact');

    // Check English placeholders
    await expect(page.getByPlaceholder('Your Name')).toBeVisible();
    await expect(page.getByPlaceholder('Email Address')).toBeVisible();

    // Switch to Tamil
    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();
    await page.getByText('🇮🇳 தமிழ்').click();

    // Check Tamil placeholders
    await expect(page.getByPlaceholder('உங்கள் பெயர்')).toBeVisible();
    await expect(page.getByPlaceholder('மின்னஞ்சல் முகவரி')).toBeVisible();
  });

  test('should update search placeholder when language changes', async ({ page }) => {
    // Go to products page
    await page.goto('/products');

    // Wait for page to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Check English placeholder
    await expect(page.getByPlaceholder('Search products, ingredients...')).toBeVisible();

    // Switch to Tamil
    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();
    await page.getByText('🇮🇳 தமிழ்').click();

    // Check Tamil placeholder
    await expect(page.getByPlaceholder('தயாரிப்புகள், பொருட்களைத் தேடுங்கள்...')).toBeVisible();
  });

  test('should show correct language option as active', async ({ page }) => {
    // Open language dropdown
    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();

    // Check English is initially active
    const englishOption = page.getByText('🇺🇸 English');
    await expect(englishOption).toHaveClass(/active/);

    // Switch to Tamil
    await page.getByText('🇮🇳 தமிழ்').click();

    // Reopen dropdown and check Tamil is active
    await languageButton.click();
    const tamilOption = page.getByText('🇮🇳 தமிழ்');
    await expect(tamilOption).toHaveClass(/active/);
  });

  test('should close language dropdown when clicking outside', async ({ page }) => {
    // Open language dropdown
    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();

    // Check dropdown is visible
    await expect(page.getByText('🇺🇸 English')).toBeVisible();
    await expect(page.getByText('🇮🇳 தமிழ்')).toBeVisible();

    // Click outside (on the page title)
    await page.getByText('Welcome to Its Cake Party').click();

    // Check dropdown is closed
    await expect(page.getByText('🇺🇸 English')).not.toBeVisible();
    await expect(page.getByText('🇮🇳 தமிழ்')).not.toBeVisible();
  });

  test('should maintain theme and language preferences together', async ({ page }) => {
    // Switch to dark theme
    const themeButton = page.getByRole('button', { name: /toggle theme/i });
    await themeButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Switch to Tamil
    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();
    await page.getByText('🇮🇳 தமிழ்').click();
    await expect(page.getByText('முகப்பு')).toBeVisible();

    // Navigate to different pages
    await page.getByRole('link', { name: 'தயாரிப்புகள்' }).click();

    // Both preferences should persist
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByText('எங்கள் தயாரிப்புகள்')).toBeVisible({ timeout: 10000 });

    // Navigate to contact
    await page.getByRole('link', { name: 'தொடர்பு' }).click();

    // Both preferences should still persist
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByText('எங்களைத் தொடர்பு கொள்ளுங்கள்')).toBeVisible();
  });

  test('should handle page refresh with stored preferences', async ({ page }) => {
    // Set dark theme and Tamil language
    const themeButton = page.getByRole('button', { name: /toggle theme/i });
    await themeButton.click();

    const languageButton = page.getByRole('button', { name: /change language/i });
    await languageButton.click();
    await page.getByText('🇮🇳 தமிழ்').click();

    // Wait for changes to apply
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByText('முகப்பு')).toBeVisible();

    // Refresh the page
    await page.reload();

    // Preferences should be restored
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByText('முகப்பு')).toBeVisible();
  });
});