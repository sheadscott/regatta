import { test, expect } from '@playwright/test';

test.describe('Quote Modal', () => {
  test('opens when Request a Quote is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    await expect(page.locator('#quote-modal')).toBeVisible();
  });

  test('form has correct Netlify attributes', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    await expect(page.locator('#quote-modal form[name="quote"]')).toHaveAttribute('data-netlify', 'true');
  });

  test('closes when close button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    await page.click('[data-modal-close]');
    await expect(page.locator('#quote-modal')).not.toBeVisible();
  });

  test('closes when backdrop is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    // Click top-left corner of dialog (backdrop area)
    await page.locator('#quote-modal').click({ position: { x: 1, y: 1 } });
    await expect(page.locator('#quote-modal')).not.toBeVisible();
  });
});
