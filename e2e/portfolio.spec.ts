import { test, expect } from '@playwright/test';

test.describe('Portfolio Website Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage correctly', async ({ page }) => {
    await expect(page.getByText('Nikesh Duwal')).toBeVisible();
    await expect(page.getByText('Full Stack Developer')).toBeVisible();
    await expect(page.getByText('Passionate about creating innovative web solutions')).toBeVisible();

    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[routerLink="/about"]')).toBeVisible();
    await expect(page.locator('a[routerLink="/projects"]')).toBeVisible();
    await expect(page.locator('a[routerLink="/contact"]')).toBeVisible();
  });

  test('should navigate to all public pages', async ({ page }) => {
    await page.locator('a[routerLink="/about"]').click();
    await expect(page).toHaveURL(/\/about/);
    await page.goBack();

    await page.locator('a[routerLink="/projects"]').click();
    await expect(page).toHaveURL(/\/projects/);
    await page.goBack();

    await page.locator('a[routerLink="/contact"]').click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should display login button when not authenticated', async ({ page }) => {
    await expect(page.locator('.login-btn')).toBeVisible();
    await expect(page.locator('.shopping-list-btn')).not.toBeVisible();
    await expect(page.locator('.logout-btn')).not.toBeVisible();
  });

  test('should handle mobile menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('.navbar-links')).not.toHaveClass(/mobile-open/);

    await page.locator('.mobile-menu-toggle').click();
    await expect(page.locator('.navbar-links')).toHaveClass(/mobile-open/);

    await page.locator('.mobile-menu-toggle').click();
    await expect(page.locator('.navbar-links')).not.toHaveClass(/mobile-open/);
  });

  test('should close mobile menu on Escape key', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.locator('.mobile-menu-toggle').click();
    await expect(page.locator('.navbar-links')).toHaveClass(/mobile-open/);

    await page.keyboard.press('Escape');
    await expect(page.locator('.navbar-links')).not.toHaveClass(/mobile-open/);
  });
});

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact form with all fields', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeDisabled();

    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="subject"]').fill('Test Subject');
    await page.locator('textarea[name="message"]').fill('This is a test message');

    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should validate email format', async ({ page }) => {
    await page.locator('input[name="email"]').fill('invalid-email');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');

    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="subject"]').fill('Test Subject');
    await page.locator('textarea[name="message"]').fill('This is a test message');

    await page.locator('button[type="submit"]').click();

    // The browser should prevent submission due to invalid email
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.login-btn').click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should protect shopping list route when not authenticated', async ({ page }) => {
    await page.goto('/shopping-list');
    await expect(page).not.toHaveURL(/\/shopping-list/);
  });

  test('should display login form with email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toHaveText('Login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('.login-button')).toBeVisible();
  });

  test('should show error message on failed login attempt', async ({ page }) => {
    await page.goto('/login');

    await page.locator('#email').fill('invalid@example.com');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('.login-button').click();

    await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
  ];

  for (const viewport of viewports) {
    test(`should display correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      await expect(page.locator('nav')).toBeVisible();
      await expect(page.getByText('Nikesh Duwal')).toBeVisible();

      if (viewport.width < 768) {
        await expect(page.locator('.mobile-menu-toggle')).toBeVisible();
      } else {
        await expect(page.locator('.navbar-links')).toBeVisible();
      }
    });
  }
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();
    await expect(page.locator('.mobile-menu-toggle[aria-expanded]')).toBeVisible();
    await expect(page.locator('[role="menuitem"]').first()).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    const aboutLink = page.locator('a[routerLink="/about"]');
    await aboutLink.focus();
    await expect(aboutLink).toBeFocused();

    await aboutLink.press('Enter');
    await expect(page).toHaveURL(/\/about/);
  });

  test('should have proper heading structure', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2').first()).toBeVisible();
  });
});
