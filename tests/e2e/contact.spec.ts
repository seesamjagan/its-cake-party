import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.getByText('Contact Us')).toBeVisible();
    await expect(page.getByText('Get in touch with us')).toBeVisible();

    // Check contact info cards
    await expect(page.getByText('123 Bakery Street, Sweet City')).toBeVisible();
    await expect(page.getByText('+91 95518 62527')).toBeVisible();
    await expect(page.getByText('Jaganvinothini1993@gmail.com')).toBeVisible();
    await expect(page.getByText('Mon-Sun: 8AM-8PM')).toBeVisible();
  });

  test('should display contact form with all fields', async ({ page }) => {
    await expect(page.getByPlaceholder('Your Name')).toBeVisible();
    await expect(page.getByPlaceholder('Email Address')).toBeVisible();
    await expect(page.getByPlaceholder('Phone Number')).toBeVisible();
    await expect(page.getByPlaceholder('Message')).toBeVisible();
  });

  test('should validate required form fields', async ({ page }) => {
    const submitButton = page.getByText('Send Message');
    await submitButton.click();

    // Check HTML5 validation
    const nameInput = page.getByPlaceholder('Your Name');
    const emailInput = page.getByPlaceholder('Email Address');
    const messageInput = page.getByPlaceholder('Message');

    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
    await expect(messageInput).toHaveAttribute('required');
  });

  test('should fill and submit contact form', async ({ page }) => {
    // Fill form fields
    await page.getByPlaceholder('Your Name').fill('John Doe');
    await page.getByPlaceholder('Email Address').fill('john@example.com');
    await page.getByPlaceholder('Phone Number').fill('1234567890');
    await page.getByPlaceholder('Message').fill('This is a test message');

    // Submit form
    await page.getByText('Send Message').click();

    // Check loading state
    await expect(page.getByText('Loading...')).toBeVisible();

    // Wait for success message (mocked with timeout)
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 3000 });
  });

  test('should enable WhatsApp button when required fields filled', async ({ page }) => {
    const whatsappButton = page.getByText('WhatsApp');

    // Initially disabled
    await expect(whatsappButton).toBeDisabled();

    // Fill required fields
    await page.getByPlaceholder('Your Name').fill('John Doe');
    await page.getByPlaceholder('Message').fill('Test message');

    // Should be enabled now
    await expect(whatsappButton).toBeEnabled();
  });

  test('should enable email button when required fields filled', async ({ page }) => {
    const emailButton = page.getByText('Direct Email');

    // Initially disabled
    await expect(emailButton).toBeDisabled();

    // Fill required fields
    await page.getByPlaceholder('Your Name').fill('John Doe');
    await page.getByPlaceholder('Email Address').fill('john@example.com');

    // Should be enabled now
    await expect(emailButton).toBeEnabled();
  });

  test('should display social media links', async ({ page }) => {
    await expect(page.getByText('Follow Us')).toBeVisible();

    // Check social links exist
    await expect(page.getByRole('link', { name: /facebook/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /instagram/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /twitter/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /whatsapp/i })).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
    await expect(page.getByText('Quick answers to common questions about our bakery')).toBeVisible();

    // Check FAQ items
    await expect(page.getByText('What are your operating hours?')).toBeVisible();
    await expect(page.getByText('Do you take custom orders?')).toBeVisible();
    await expect(page.getByText('Do you offer delivery?')).toBeVisible();
    await expect(page.getByText('Are your products suitable for vegetarians?')).toBeVisible();
  });

  test('should display map placeholder', async ({ page }) => {
    await expect(page.getByText('Interactive Map Coming Soon')).toBeVisible();
  });

  test('should handle contact info card clicks', async ({ page }) => {
    // Mock window.open to prevent actual navigation
    await page.addInitScript(() => {
      window.open = () => null;
    });

    // Click on contact cards (they should be clickable)
    const addressCard = page.getByText('123 Bakery Street, Sweet City').locator('..');
    const phoneCard = page.getByText('+91 95518 62527').locator('..');
    const emailCard = page.getByText('Jaganvinothini1993@gmail.com').locator('..');

    // These should be clickable without errors
    await addressCard.click();
    await phoneCard.click();
    await emailCard.click();
  });

  test('should display proper form validation for email field', async ({ page }) => {
    const emailInput = page.getByPlaceholder('Email Address');

    // Fill with invalid email
    await emailInput.fill('invalid-email');
    await page.getByText('Send Message').click();

    // Check HTML5 email validation
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should maintain form state during interaction', async ({ page }) => {
    // Fill some fields
    await page.getByPlaceholder('Your Name').fill('John Doe');
    await page.getByPlaceholder('Email Address').fill('john@example.com');

    // Navigate away and back (simulate user behavior)
    await page.getByRole('link', { name: 'Products' }).click();
    await page.getByRole('link', { name: 'Contact' }).click();

    // Form should be reset (new page load)
    await expect(page.getByPlaceholder('Your Name')).toHaveValue('');
    await expect(page.getByPlaceholder('Email Address')).toHaveValue('');
  });
});