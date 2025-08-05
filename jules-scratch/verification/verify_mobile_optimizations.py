#!/usr/bin/env python
from playwright.sync_api import Page, expect, Error

def test_mobile_optimizations(page: Page):
    """
    This test verifies that the mobile optimizations have been applied correctly.
    """
    try:
        print("Starting verification script...")
        # 1. Go to the homepage.
        page.goto("http://localhost:3000")
        print("Page loaded.")

        # 2. Wait for the loading screen to disappear.
        expect(page.locator("text=Loading 3D Environment...")).to_be_hidden(timeout=20000)
        print("Loading screen hidden.")

        # 3. Set the viewport to a mobile size.
        page.set_viewport_size({"width": 375, "height": 667})
        print("Viewport set to mobile.")

        # Give it a moment to resize
        page.wait_for_timeout(1000)

        # 4. Take a screenshot of the mobile view.
        try:
            screenshot_path = "jules-scratch/verification/mobile_view.png"
            page.screenshot(path=screenshot_path)
            print(f"Mobile screenshot taken and saved to {screenshot_path}")
        except Error as e:
            print(f"Failed to take mobile screenshot: {e}")
            raise

    except Error as e:
        print(f"Playwright script failed: {e}")
        # Re-raise the exception to ensure the test fails
        raise

    print("Verification script finished successfully.")
