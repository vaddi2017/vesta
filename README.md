This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Senior System Architecture Explanation

```text
                         ┌──────────────────────────┐
                         │        End Users          │
                         │  Job Seekers / Admins     │
                         └─────────────┬────────────┘
                                       │
                                       ▼
                         ┌──────────────────────────┐
                         │     Next.js Frontend      │
                         │  Vercel Hosted UI Layer   │
                         │                          │
                         │  Home / Jobs / Saved     │
                         │  Admin Dashboard         │
                         └─────────────┬────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
       ┌──────────────────────────┐         ┌──────────────────────────┐
       │   Supabase Auth / DB      │         │     FastAPI Backend       │
       │   PostgreSQL Database     │◄────────│   Railway Hosted API      │
       │                          │         │                          │
       │ companies                │         │ Scraper Orchestration     │
       │ jobs                     │         │ Scheduler / Health APIs   │
       │ saved_jobs               │         └─────────────┬────────────┘
       └──────────────────────────┘                       │
                                                          ▼
                                      ┌──────────────────────────────┐
                                      │      Job Scraping Engine      │
                                      │                              │
                                      │ Greenhouse / Lever / Workday │
                                      │ Google Jobs / Generic Sites  │
                                      └─────────────┬────────────────┘
                                                    │
                                                    ▼
                                      ┌──────────────────────────────┐
                                      │  External Career Platforms    │
                                      │  Company Career Pages / ATS   │
                                      └──────────────────────────────┘
```



Vesta AI is designed as a cloud-based job aggregation and tracking platform. The system is divided into four major layers: presentation layer, backend orchestration layer, data layer, and external integration layer.

The presentation layer is a Next.js frontend hosted on Vercel. It provides the user interface for job seekers and admins. Job seekers can browse jobs, search by technology, save jobs, and access application links. Admins can add company career page URLs that need to be monitored.

The data layer is powered by Supabase PostgreSQL. It stores companies, scraped jobs, and saved jobs. Supabase acts as the central source of truth for the application.

The backend orchestration layer is built with FastAPI and hosted on Railway. This backend is responsible for scraper execution, scheduling, health checks, and communication with Supabase. A scheduled job runs every day at 10 AM America/Chicago to fetch the latest openings.

The scraping engine reads company career URLs from the companies table, identifies the career platform or ATS type, extracts job data, normalizes it, removes duplicates, and writes clean records into the jobs table.

The frontend then reads the latest job records from Supabase and displays them in the Jobs page. Saved jobs are stored separately in the saved_jobs table.



```text
Admin Input
   ↓
Company URLs stored in Supabase
   ↓
FastAPI Scheduler triggers scraper
   ↓
Scraper fetches jobs from ATS platforms
   ↓
Job data is normalized and deduplicated
   ↓
Clean records are written to Supabase
   ↓
Next.js frontend renders searchable job feed
   ↓
Users view, search, save, and apply
```

## Architecture Components

| Layer              | Component           | Responsibility                                                                      |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------- |
| Presentation Layer | Next.js Frontend    | User interface, job search, saved jobs, admin dashboard                             |
| Hosting Layer      | Vercel              | Frontend deployment and CDN delivery                                                |
| Backend Layer      | FastAPI             | APIs, scheduler, scraper orchestration, health checks                               |
| Hosting Layer      | Railway             | Backend deployment and runtime                                                      |
| Data Layer         | Supabase PostgreSQL | Stores companies, jobs, and saved jobs                                              |
| Automation Layer   | APScheduler         | Runs daily scraping workflow                                                        |
| Integration Layer  | Scrapers            | Collect jobs from Greenhouse, Lever, Workday, Google Jobs, and generic career pages |
| External Systems   | ATS / Career Pages  | Source systems for job openings                                                     |


## System Architecture

Vesta AI is built using a modern cloud-native architecture with a clear separation between the frontend, backend, database, and external job-source integrations.

The frontend is developed using Next.js and deployed on Vercel. It provides the primary user experience for job seekers and admins, including job search, saved jobs, and company management through the admin dashboard.

The backend is developed using FastAPI and deployed on Railway. It acts as the orchestration layer for scheduled scraping, job normalization, deduplication, and health monitoring. A scheduled scraper runs daily at 10 AM America/Chicago using APScheduler.

Supabase PostgreSQL is used as the central data layer. It stores company career URLs, scraped job postings, and user-saved jobs. The frontend reads job data directly from Supabase, while the backend writes fresh job data into Supabase after every scraping cycle.

The scraping engine integrates with multiple job-source platforms including Greenhouse, Lever, Workday, Google Jobs, and generic company career pages. It extracts jobs, cleans the data, removes duplicates, and stores structured records in the jobs table.

### Architecture Flow

Admin adds company URL
→ Supabase stores company record
→ FastAPI scheduler triggers scraper
→ Scraper reads company URLs
→ External ATS/career pages are scanned
→ Jobs are extracted, normalized, and deduplicated
→ Clean job records are written to Supabase
→ Next.js frontend renders searchable job feed
→ Users search, save, and apply to jobs

### High-Level Diagram

User/Admin
→ Next.js Frontend on Vercel
→ Supabase PostgreSQL

FastAPI Backend on Railway
→ APScheduler
→ Job Scraping Engine
→ External ATS Platforms
→ Supabase PostgreSQL
→ Next.js Frontend
```


Vesta AI is a cloud-native job aggregation platform where a Next.js frontend reads from Supabase, a FastAPI backend runs scheduled scraping workflows on Railway, and a scraper engine collects, normalizes, deduplicates, and stores jobs from multiple ATS platforms into a centralized PostgreSQL database.

