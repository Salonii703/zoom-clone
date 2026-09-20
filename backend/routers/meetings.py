"""
Meeting routes — create/schedule/list/join/leave/end a meeting.

Split out of main.py so meeting logic and auth logic aren't mixed in
one file; main.py just wires this router (and routers/auth.py) onto
the FastAPI app.
"""
from datetime import datetime

from fastapi import APIRouter, HTTPException

from database import get_db
from models import generate_meeting_id, meeting_row_to_dict, participant_row_to_dict
import schemas

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

FRONTEND_URL = "http://localhost:3000"


def fetch_meeting(conn, meeting_id: str):
    row = conn.execute("SELECT * FROM meetings WHERE id = ?", (meeting_id,)).fetchone()
    if not row:
        return None
    participants = conn.execute(
        "SELECT * FROM participants WHERE meeting_id = ?", (meeting_id,)
    ).fetchall()
    return meeting_row_to_dict(row, [participant_row_to_dict(p) for p in participants])


# ---------- Instant Meeting ----------
@router.post("/instant", response_model=schemas.MeetingResponse)
def create_instant_meeting(payload: schemas.InstantMeetingRequest):
    meeting_id = generate_meeting_id()
    now = datetime.utcnow().isoformat()
    invite_link = f"{FRONTEND_URL}/meeting/{meeting_id}"

    with get_db() as conn:
        conn.execute(
            """INSERT INTO meetings
               (id, title, description, host_name, type, status, scheduled_at,
                duration_minutes, invite_link, created_at)
               VALUES (?, ?, ?, ?, 'instant', 'live', ?, 0, ?, ?)""",
            (
                meeting_id,
                payload.title or "Instant Meeting",
                None,
                payload.host_name or "Saloni",
                now,
                invite_link,
                now,
            ),
        )
        return fetch_meeting(conn, meeting_id)


# ---------- Schedule Meeting ----------
@router.post("/schedule", response_model=schemas.MeetingResponse)
def schedule_meeting(payload: schemas.ScheduleMeetingRequest):
    try:
        scheduled_dt = datetime.strptime(f"{payload.date} {payload.time}", "%Y-%m-%d %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date/time format")

    meeting_id = generate_meeting_id()
    now = datetime.utcnow().isoformat()
    invite_link = f"{FRONTEND_URL}/meeting/{meeting_id}"

    with get_db() as conn:
        conn.execute(
            """INSERT INTO meetings
               (id, title, description, host_name, type, status, scheduled_at,
                duration_minutes, invite_link, created_at)
               VALUES (?, ?, ?, ?, 'scheduled', 'upcoming', ?, ?, ?, ?)""",
            (
                meeting_id,
                payload.title,
                payload.description,
                payload.host_name or "Saloni",
                scheduled_dt.isoformat(),
                payload.duration_minutes,
                invite_link,
                now,
            ),
        )
        return fetch_meeting(conn, meeting_id)


# ---------- Upcoming / Recent lists ----------
@router.get("/upcoming", response_model=list[schemas.MeetingResponse])
def get_upcoming_meetings():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM meetings WHERE status = 'upcoming' ORDER BY scheduled_at ASC"
        ).fetchall()
        return [fetch_meeting(conn, r["id"]) for r in rows]


@router.get("/recent", response_model=list[schemas.MeetingResponse])
def get_recent_meetings():
    with get_db() as conn:
        rows = conn.execute(
            """SELECT * FROM meetings
               WHERE status = 'completed' OR type = 'instant'
               ORDER BY created_at DESC LIMIT 10"""
        ).fetchall()
        return [fetch_meeting(conn, r["id"]) for r in rows]


# ---------- Get single meeting (used to validate before joining) ----------
@router.get("/{meeting_id}", response_model=schemas.MeetingResponse)
def get_meeting(meeting_id: str):
    with get_db() as conn:
        meeting = fetch_meeting(conn, meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        return meeting


# ---------- Join meeting ----------
@router.post("/{meeting_id}/join", response_model=schemas.MeetingResponse)
def join_meeting(meeting_id: str, payload: schemas.JoinMeetingRequest):
    now = datetime.utcnow().isoformat()
    with get_db() as conn:
        meeting = fetch_meeting(conn, meeting_id)
        if not meeting:
            raise HTTPException(
                status_code=404, detail="Meeting not found. Check the ID and try again."
            )

        conn.execute(
            "INSERT INTO participants (meeting_id, name, joined_at) VALUES (?, ?, ?)",
            (meeting_id, payload.name, now),
        )

        if meeting["status"] == "upcoming":
            conn.execute("UPDATE meetings SET status = 'live' WHERE id = ?", (meeting_id,))

        return fetch_meeting(conn, meeting_id)


# ---------- Remove participant (host action) ----------
@router.delete("/{meeting_id}/participants/{participant_id}", response_model=schemas.MeetingResponse)
def remove_participant(meeting_id: str, participant_id: int):
    with get_db() as conn:
        meeting = fetch_meeting(conn, meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")

        conn.execute(
            "DELETE FROM participants WHERE id = ? AND meeting_id = ?",
            (participant_id, meeting_id),
        )

        return fetch_meeting(conn, meeting_id)


# ---------- End meeting (marks it completed, for "recent meetings") ----------
@router.post("/{meeting_id}/end", response_model=schemas.MeetingResponse)
def end_meeting(meeting_id: str):
    with get_db() as conn:
        meeting = fetch_meeting(conn, meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        conn.execute("UPDATE meetings SET status = 'completed' WHERE id = ?", (meeting_id,))
        return fetch_meeting(conn, meeting_id)
