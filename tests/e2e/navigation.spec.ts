import { test, expect } from '@playwright/test';

test('home page loads with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Regatta Product Development/);
});

test('hero Request a Quote button opens modal', async ({ page }) => {
  await page.goto('/');
  const heroCta = page.locator('section').first().locator('[data-quote-trigger]');
  await heroCta.click();
  await expect(page.locator('#quote-modal')).toBeVisible();
});

test('services overview page loads', async ({ page }) => {
  await page.goto('/services');
  await expect(page.locator('main h1')).toContainText('Services');
});

test('design service detail page loads and accordion works', async ({ page }) => {
  await page.goto('/services/design');
  await expect(page.locator('main h1')).toContainText('Design Services');
  const firstAccordion = page.locator('details').first();
  await firstAccordion.click();
  await expect(firstAccordion).toHaveAttribute('open', '');
});

test('portfolio page loads', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.locator('main h1')).toContainText('Portfolio');
});

test('about page loads', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('main h1')).toContainText('About');
});

test('contact page loads', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('main h1')).toContainText('Contact');
});
