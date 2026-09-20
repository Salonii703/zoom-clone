"""
Zoom Clone — FastAPI backend entrypoint.

Run with:  uvicorn main:app --reload --port 8000

Route handlers live in routers/meetings.py and routers/auth.py; this
file just creates the app, wires middleware, and mounts the routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import meetings, auth

init_db()

app = FastAPI(title="Zoom Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "zoom-clone-api"}
