import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to different pages', async ({ page }) => {
    // Check home page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Welcome to The Bake Bar')).toBeVisible();

    // Navigate to products
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL('/products');
    await expect(page.getByText('Our Products')).toBeVisible();

    // Navigate to contact
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByText('Contact Us')).toBeVisible();

    // Navigate back to home via logo
    await page.getByRole('link', { name: 'The Bake Bar Logo' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should work with mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.getByText('Contact')).toBeVisible();

    // Navigate via mobile menu
    await page.getByRole('link', { name: 'Products' }).nth(1).click(); // Second instance is in mobile menu
    await expect(page).toHaveURL('/products');

    // Check mobile menu is closed
    await expect(page.getByRole('button', { name: /close/i })).not.toBeVisible();
  });

  test('should highlight active navigation link', async ({ page }) => {
    // Check home is active initially
    const homeLink = page.getByRole('link', { name: 'Home' }).first();
    await expect(homeLink).toHaveClass(/active/);

    // Navigate to products and check active state
    await page.getByRole('link', { name: 'Products' }).click();
    const productsLink = page.getByRole('link', { name: 'Products' }).first();
    await expect(productsLink).toHaveClass(/active/);
  });

  test('should display company branding', async ({ page }) => {
    await expect(page.getByText('The Bake Bar')).toBeVisible();
    await expect(page.getByText('Homemade Bakery')).toBeVisible();
    await expect(page.getByAltText('The Bake Bar Logo')).toBeVisible();
  });
});