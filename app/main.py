from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import tickets
from fastapi.staticfiles import StaticFiles

# Creates tables on startup if they don't already exist.
# Safe to call every time — it won't touch existing tables/data.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Datastraw Support CRM",
    description="Customer support ticketing API",
    version="1.0.0",
)

# Allows your frontend (even if served from a different origin during
# local dev) to call this API without CORS errors.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}

app.mount("/", StaticFiles(directory="static", html=True), name="static")