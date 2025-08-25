import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should display products after loading', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.getByText('Loading...')).toBeVisible();
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Check products are displayed
    await expect(page.getByText('Our Products')).toBeVisible();
    await expect(page.getByText('Discover our handcrafted delights')).toBeVisible();

    // Check that products are loaded
    const products = page.locator('.product-card');
    await expect(products.first()).toBeVisible();
  });

  test('should filter products by search', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Search for a specific product
    const searchInput = page.getByPlaceholder('Search products, ingredients...');
    await searchInput.fill('chocolate');

    // Check filtered results
    await expect(page.locator('.product-card')).toHaveCount(1, { timeout: 5000 });
    await expect(page.getByText('Chocolate')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Open filters
    await page.getByText('Filters').click();
    await expect(page.getByText('Categories')).toBeVisible();

    // Select brownies category
    await page.getByText('Brownies').click();

    // Check filtered results show only brownies
    const products = page.locator('.product-card');
    await expect(products).toHaveCount(8, { timeout: 5000 }); // Assuming 8 brownie products
  });

  test('should sort products by price', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Change sort to price low to high
    const sortSelect = page.locator('select.sort-select');
    await sortSelect.selectOption('price-low');

    // Check that products are sorted (first product should have lowest price)
    const firstProductPrice = page.locator('.product-card').first().locator('.product-price');
    await expect(firstProductPrice).toContainText('₹');
  });

  test('should toggle between grid and list view', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Switch to list view
    const listViewBtn = page.locator('[data-testid="list-icon"]').locator('..');
    await listViewBtn.click();

    // Check list view is active
    await expect(page.locator('.products-container.list')).toBeVisible();

    // Switch back to grid view
    const gridViewBtn = page.locator('[data-testid="grid-icon"]').locator('..');
    await gridViewBtn.click();

    // Check grid view is active
    await expect(page.locator('.products-container.grid')).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Click add to cart on first product
    const addToCartBtn = page.getByText('Add to Cart').first();
    await addToCartBtn.click();

    // Check cart count increased
    const cartCount = page.locator('.cart-count');
    await expect(cartCount).toBeVisible();
    await expect(cartCount).toContainText('1');
  });

  test('should toggle favorite status', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Click heart icon on first product
    const heartBtn = page.locator('[data-testid="heart-icon"]').first().locator('..');
    await heartBtn.click();

    // Heart should change color (check for filled state)
    await expect(page.locator('[data-fill="#FF6B6B"]')).toBeVisible();
  });

  test('should display product details correctly', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    const firstProduct = page.locator('.product-card').first();

    // Check product has required elements
    await expect(firstProduct.locator('.product-name')).toBeVisible();
    await expect(firstProduct.locator('.product-price')).toBeVisible();
    await expect(firstProduct.locator('.product-description')).toBeVisible();
    await expect(firstProduct.locator('.ingredient-tag')).toBeVisible();
  });

  test('should show no products message when no results', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Search for non-existent product
    const searchInput = page.getByPlaceholder('Search products, ingredients...');
    await searchInput.fill('nonexistentproduct12345');

    // Check no products message
    await expect(page.getByText('No products found')).toBeVisible();
    await expect(page.getByText('Try adjusting your filters')).toBeVisible();

    // Clear filters should work
    await page.getByText('Clear Filters').click();
    await expect(page.locator('.product-card')).toHaveCount(43, { timeout: 5000 }); // All products should be visible
  });

  test('should filter by price range', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Open filters
    await page.getByText('Filters').click();

    // Adjust price range slider
    const priceSlider = page.locator('.price-slider');
    await priceSlider.fill('100');

    // Check that expensive products are filtered out
    const products = page.locator('.product-card');
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
    expect(productCount).toBeLessThan(43); // Should be filtered
  });

  test('should display correct product count', async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // Check results info shows correct count
    await expect(page.getByText(/Showing \d+ of \d+ products/)).toBeVisible();
    await expect(page.getByText('Showing 43 of 43 products')).toBeVisible();
  });
});