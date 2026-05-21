from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from scraper.google_scraper import scrape_jobs
from scraper.lever_scraper import scrape_lever_jobs
from scraper.greenhouse_scraper import scrape_greenhouse_jobs
from scraper.workday_scraper import scrape_workday_jobs

from services.company_service import get_companies
from services.supabase_client import supabase
from services.ats_detector import detect_ats

from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from zoneinfo import ZoneInfo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def run_scraper_job():

    companies = get_companies()

    total_jobs = []

    for company in companies:

        ats_type = detect_ats(company["career_url"])

        company_jobs = []

        if ats_type == "greenhouse":

            company_jobs = scrape_greenhouse_jobs(
                company["career_url"],
                company["company_name"]
            )

        elif ats_type == "lever":

            company_jobs = scrape_lever_jobs(
                company["career_url"],
                company["company_name"]
            )

        elif ats_type == "workday":

            company_jobs = scrape_workday_jobs(
                company["career_url"],
                company["company_name"]
            )

        else:

            company_jobs = scrape_jobs(
                company["career_url"],
                company["company_name"]
            )

        for job in company_jobs:

            existing = supabase.table("jobs") \
                .select("*") \
                .eq("company_name", job["company_name"]) \
                .eq("job_title", job["job_title"]) \
                .eq("apply_url", job["apply_url"]) \
                .execute()

            if existing.data:
                continue

            supabase.table("jobs").insert({
                "company_name": job["company_name"],
                "job_title": job["job_title"],
                "location": job["location"],
                "apply_url": job["apply_url"],
                "posted_date": str(datetime.now()),
                "expires_at": str(datetime.now() + timedelta(hours=24))
            }).execute()

            total_jobs.append(job)

    return total_jobs


scheduler = BackgroundScheduler(
    timezone=ZoneInfo("America/Chicago")
)

scheduler.add_job(
    run_scraper_job,
    "cron",
    hour=10,
    minute=0,
    id="daily_vesta_scraper",
    replace_existing=True
)

scheduler.start()


@app.get("/")
def home():

    return {
        "message": "Vesta AI Backend Running",
        "scheduler": "Daily scraper active at 10 AM America/Chicago"
    }


@app.get("/scrape-jobs")
def scrape_all_jobs():

    jobs = run_scraper_job()

    return {
        "status": "success",
        "jobs_found": len(jobs),
        "jobs": jobs
    }