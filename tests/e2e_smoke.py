from pathlib import Path
from tempfile import gettempdir

from playwright.sync_api import sync_playwright


APP_URL = "http://127.0.0.1:8765/"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def main() -> None:
    page_errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=CHROME)
        page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=3)
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on("dialog", lambda dialog: dialog.accept())
        page.goto(APP_URL, wait_until="networkidle")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")

        page.locator("#add-entry").click()
        page.locator("#entry-amount").fill("150")
        page.locator("#entry-form button[type=submit]").click()
        assert int(page.locator("#kcal-total").inner_text()) > 0

        page.locator(".entry-edit").first.click()
        page.locator("#entry-amount").fill("120")
        page.locator("#entry-form button[type=submit]").click()

        page.locator(".entry-row .danger").click()
        assert page.locator(".entry-row").count() == 0
        page.locator("#toast-action").click()
        assert page.locator(".entry-row").count() == 1

        entry_count = page.evaluate("JSON.parse(localStorage.getItem('bju-tracker-v1')).entries.length")
        page.locator("#import-data").set_input_files({
            "name": "broken.json",
            "mimeType": "application/json",
            "buffer": b'{"products":[{}],"entries":[],"goals":{}}',
        })
        page.wait_for_timeout(100)
        assert page.evaluate("JSON.parse(localStorage.getItem('bju-tracker-v1')).entries.length") == entry_count

        page.locator("#log-recovery").click()
        page.locator("#recovery-sleep").fill("8")
        page.locator("#recovery-quality").fill("4")
        page.locator("#recovery-readiness").fill("4")
        page.locator("#recovery-form button[type=submit]").click()
        assert "8" in page.locator("#today-sleep").inner_text()

        page.locator("#add-workout").click()
        page.locator("#workout-form button[type=submit]").click()
        assert page.locator("#activity-list .activity-row").count() == 1

        page.locator('[data-view="progress-view"]').click()
        assert page.locator("#progress-metrics .metric-card").count() == 5
        page.screenshot(path=str(Path(gettempdir()) / "bju-ui-smoke.png"), full_page=True)
        browser.close()

    if page_errors:
        raise AssertionError(f"Browser page errors: {page_errors}")
    print("Browser smoke test passed")


if __name__ == "__main__":
    main()
