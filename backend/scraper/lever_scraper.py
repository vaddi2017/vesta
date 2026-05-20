from playwright.sync_api import sync_playwright
from urllib.parse import urljoin

def scrape_lever_jobs(url, company_name):

    jobs = []

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=True)

        page = browser.new_page()

        page.goto(url, timeout=60000)

        page.wait_for_timeout(5000)

        links = page.locator("a").all()

        for link in links:

            try:

                text = link.inner_text().strip()

                href = link.get_attribute("href")

                if not text or not href:
                    continue

                if "/jobs/" not in href and "/lever.co/" not in href:
                    continue

                if len(text) < 4:
                    continue

                jobs.append({
                    "company_name": company_name,
                    "job_title": text[:200],
                    "location": "Not specified",
                    "apply_url": urljoin(url, href)
                })

            except:
                continue

        browser.close()

    unique_jobs = []

    seen = set()

    for job in jobs:

        key = job["job_title"]

        if key not in seen:
            seen.add(key)
            unique_jobs.append(job)

    return unique_jobs[:50]