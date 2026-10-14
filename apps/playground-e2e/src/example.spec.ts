import { test, expect } from '@playwright/test';

test('affiche le playground Alt Sense', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Alt Sense',
  );
});
