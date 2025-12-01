import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("Home page shows login screen", async ({ page }) => {
    await page.goto("/");

    // Check main branding & title
    await expect(page.getByText("Student Wellness")).toBeVisible();
    await expect(page.getByText("Mental Health Monitoring System")).toBeVisible();
    await expect(page.getByRole("heading", { name: "User Login" })).toBeVisible();

    // Check account & password inputs and login button
    await expect(page.getByLabel("Account")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});


