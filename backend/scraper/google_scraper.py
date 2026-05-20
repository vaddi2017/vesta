from playwright.sync_api import sync_playwright
from urllib.parse import urljoin

def scrape_jobs(url, company_name):

    jobs = []

    job_words = [
        "engineer", "developer", "analyst", "manager", "architect",
        "scientist", "consultant", "specialist", "designer",
        "administrator", "lead", "director", "intern", "software",
        "data", "ai", "machine learning", "full stack", "backend",
        "frontend", "cloud", "security", "product"
    ]

    invalid_titles = [
        "skip to main",
        "back to careers",
        "careers",
        "security",
        "privacy",
        "home",
        "apply ai",
        "data engine",
        "guide",
        "view open positions",
        "explore opportunities"
    ]

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=True)

        page = browser.new_page()

        page.goto(url, timeout=60000)

        page.wait_for_timeout(8000)

        links = page.locator("a").all()

        for link in links:

            try:

                text = link.inner_text().strip()

                href = link.get_attribute("href")

                if not text or not href:
                    continue

                text_lower = text.lower()

                href_lower = href.lower()

                looks_like_job = (
                    any(word in text_lower for word in job_words)
                    or "job" in href_lower
                    or "opening" in href_lower
                    or "position" in href_lower
                )

                is_invalid = any(
                    bad in text_lower
                    for bad in invalid_titles
                )

                if looks_like_job and len(text) > 3 and not is_invalid:

                    lines = [
                        line.strip()
                        for line in text.split("\n")
                        if line.strip()
                    ]

                    job_title = (
                        lines[0]
                        if len(lines) > 0
                        else text[:200]
                    )

                    location = (
                        lines[1]
                        if len(lines) > 1
                        else "Not specified"
                    )

                    jobs.append({
                        "company_name": company_name,
                        "job_title": job_title[:200],
                        "location": location[:200],
                        "apply_url": urljoin(url, href)
                    })

            except:
                continue

        browser.close()

    unique_jobs = []

    seen = set()

    for job in jobs:

        key = job["job_title"] + job["apply_url"]

        if key not in seen:

            seen.add(key)

            unique_jobs.append(job)

    return unique_jobs[:50]