# Development Progress — Datastraw Support CRM

## Day 1 — Backend
- Set up project structure, venv, FastAPI + SQLAlchemy + Pydantic
- Built `Ticket` and `Note` models with a FK relationship
- Added `priority` field as a stand-out feature (Low/Medium/High/Urgent)
- Built all 4 required API endpoints (create, list w/ search+filter, get, update)
- Tested every endpoint in Postman — all working
- Pushed initial backend to GitHub

## Day 2 — Frontend
- Built home page: ticket table, status dashboard, search bar, status filter
- Built create ticket form with validation
- Built ticket detail page: view info, update status/priority, add notes
- Wired all pages to the tested API
- Full browser test: create → search → filter → update → notes — all working
- Pushed frontend to GitHub

## Day 3 — Deployment & Submission (planned)
- Deploy to Railway.app
- Write README.md
- Record demo video
- Send submission email