from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from supabase import create_client
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.get("/")
def home():
    return {
        "message": "Vesta AI Backend Running",
        "scheduler": "Daily scraper active at 10 AM America/Chicago"
    }


def run_scraper_job():

    jobs_added = 0

    try:

        companies_response = supabase.table("companies").select("*").execute()

        companies = companies_response.data

        print(f"Found {len(companies)} companies")

        for company in companies:

            company_name = company["company_name"]
            career_url = company["career_url"]

            print(f"Scraping {company_name}")

            try:

                # DEMO JOB ENTRY
                # Replace later with real scraper logic

                sample_job = {
                    "company_name": company_name,
                    "job_title": "Software Engineer",
                    "location": "Remote",
                    "apply_url": career_url
                }

                try:

                    supabase.table("jobs").insert(sample_job).execute()

                    jobs_added += 1

                    print(f"Inserted job for {company_name}")

                except Exception as insert_error:

                    print("Supabase insert failed:", insert_error)

            except Exception as company_error:

                print(f"Failed scraping {company_name}: {company_error}")

    except Exception as e:

        print("Main scraper failed:", e)

    return jobs_added


@app.get("/scrape-jobs")
def scrape_all_jobs():

    try:

        jobs = run_scraper_job()

        return {
            "status": "success",
            "jobs_found": jobs
        }

    except Exception as e:

        print("Scraper failed:", e)

        return {
            "status": "error",
            "message": str(e)
        }


scheduler = BackgroundScheduler(timezone="America/Chicago")

scheduler.add_job(
    run_scraper_job,
    "cron",
    hour=10,
    minute=0
)

scheduler.start()