# Datastraw Support CRM

A full-stack customer support ticketing system built as part of the AI + Tech Intern hiring assessment for Datastraw Technologies. It lets a support team create, track, search, filter, and update customer tickets, with notes and priority-based triage.

**Live demo:** [https://web-production-5f778.up.railway.app](https://web-production-5f778.up.railway.app)

---

## Features

- **Create tickets** — capture customer name, email, subject, description, and priority
- **List all tickets** — sortable table view with key details at a glance
- **Search** — across customer name, email, ticket ID, and description (debounced, as-you-type)
- **Filter by status** — Open / In Progress / Closed
- **View & update tickets** — change status/priority and append internal notes, with a full history log

### Stand-out feature: Priority + Status Dashboard

Every ticket has a `priority` field (Low / Medium / High / Urgent), and the home page shows a live dashboard strip with Open/In Progress/Closed counts. This was chosen as the stand-out feature because it:

- Touches all three layers of the stack (database schema, API validation, frontend UI) — showing the change end-to-end rather than in isolation
- Directly addresses the "team handling hundreds of tickets a day" triage scenario mentioned in the assignment's bonus section
- Is easy to explain and visually demonstrate in a short demo

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Backend | **FastAPI** | Fast to build with, automatic OpenAPI docs, native async support |
| ORM | **SQLAlchemy** | Decouples the database schema from the API's request/response shape |
| Validation | **Pydantic** | Type-safe request/response schemas, built into FastAPI |
| Database | **SQLite** | Zero-config, file-based — appropriate for the scope of this assessment |
| Frontend | **HTML + Tailwind CSS (CDN) + vanilla JS** | No build step needed, keeps the stack lean and fast to iterate on |
| Deployment | **Railway.app** | Simple GitHub-connected deploys, well suited to FastAPI apps |

---

## Architecture

```
SQLite  <--SQLAlchemy models-->  FastAPI routes  <--JSON-->  vanilla JS (fetch)  -->  HTML/Tailwind UI
```

- **`app/models.py`** — SQLAlchemy models (`Ticket`, `Note`) define the database shape
- **`app/schemas.py`** — Pydantic schemas define the API's request/response shape, kept intentionally separate from the DB models so either can evolve independently
- **`app/crud.py`** — database query functions (create, list, get, update)
- **`app/routers/tickets.py`** — API endpoints, calling into `crud.py`
- **`static/`** — the frontend: three pages (`index.html`, `create.html`, `ticket.html`) and their JS, calling the API via relative paths so no configuration is needed between local dev and production

### Database Schema

**`tickets`**
| Field | Type | Notes |
|---|---|---|
| `id` | int, PK | auto-increment |
| `ticket_id` | string, unique | e.g. `TKT-001` |
| `customer_name` | string | required |
| `customer_email` | string | required |
| `subject` | string | required |
| `description` | text | required |
| `status` | string | default `Open`; one of Open / In Progress / Closed |
| `priority` | string | default `Medium`; one of Low / Medium / High / Urgent |
| `created_at` | timestamp | server default |
| `updated_at` | timestamp | updates on change |

**`notes`**
| Field | Type | Notes |
|---|---|---|
| `id` | int, PK | auto-increment |
| `ticket_id` | string, FK → `tickets.ticket_id` | |
| `note_text` | text | |
| `created_at` | timestamp | |

Each ticket has a one-to-many relationship with notes (`cascade="all, delete-orphan"`), ordered oldest to newest.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/tickets` | Create a ticket (auto-generates `ticket_id`, defaults `status` to `Open`) |
| `GET` | `/api/tickets` | List tickets; supports `?status=` and `?search=` query params |
| `GET` | `/api/tickets/{ticket_id}` | Fetch a single ticket, including its notes |
| `PUT` | `/api/tickets/{ticket_id}` | Update status/priority, optionally append a note |
| `GET` | `/api/health` | Health check — returns `{"status": "ok"}` |

Errors return `400` for invalid status/priority values and `404` for a ticket that doesn't exist.

---

## Setup & Run Locally

**Requirements:** Python 3.13+, Git

```bash
# Clone the repo
git clone git@github.com:vedantgonbare/datastraw-support-crm.git
cd datastraw-support-crm

# Create and activate a virtual environment
python -m venv venv
source venv/Scripts/activate      # Windows Git Bash
# source venv/bin/activate        # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the app
uvicorn app.main:app --reload
```

The app will be available at **http://127.0.0.1:8000**. SQLite tables are created automatically on startup (`support_crm.db` is git-ignored and generated locally).

To point the app at a different database, copy `.env.example` to `.env` and adjust `DATABASE_URL`.

---

## Known Limitations & What I'd Improve With More Time

- **Ephemeral storage on Railway:** the deployed app uses SQLite, whose data may not persist across container restarts/redeploys on Railway's free tier. This is a spec-compliant tradeoff (SQLite is explicitly listed as expected for this stack), but with more time I'd migrate to a persistent database like Postgres for production use.
- **Timestamp display:** ticket timestamps are currently shown in UTC rather than converted to the viewer's local timezone.
- **Authentication:** there's currently no login/auth layer — any visitor to the deployed URL can create and modify tickets. For a real production support tool, this would need to be added.

---

## Project Structure

```
Support-CRM/
├── app/
│   ├── main.py           # FastAPI app instance, CORS, routes, static mount
│   ├── database.py       # SQLAlchemy engine/session setup
│   ├── models.py         # Ticket and Note models
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── crud.py           # Database query functions
│   └── routers/
│       └── tickets.py    # API endpoints
├── static/               # Frontend (HTML, CSS, JS)
├── requirements.txt
├── Procfile              # Railway start command
└── PROGRESS.md           # Daily build log
```

---

## Author

Vedant Gonbare
[Linkedin](https://www.linkedin.com/in/vedantgonbare/)