"""
Seeds the database with sample data so the dashboard isn't empty on first run.

Run with:  python seed.py
"""
from datetime import datetime, timedelta

from database import get_connection, init_db
from models import generate_meeting_id

init_db()
conn = get_connection()

count = conn.execute("SELECT COUNT(*) as c FROM meetings").fetchone()["c"]

if count == 0:
    now = datetime.utcnow()

    def insert_meeting(title, description, mtype, status, scheduled_at, duration):
        mid = generate_meeting_id()
        invite_link = f"http://localhost:3000/meeting/{mid}"
        conn.execute(
            """INSERT INTO meetings
               (id, title, description, host_name, type, status, scheduled_at,
                duration_minutes, invite_link, created_at)
               VALUES (?, ?, ?, 'Saloni', ?, ?, ?, ?, ?, ?)""",
            (mid, title, description, mtype, status, scheduled_at.isoformat(),
             duration, invite_link, now.isoformat()),
        )
        return mid

    insert_meeting(
        "Sprint Planning", "Weekly sprint planning with the team",
        "scheduled", "upcoming", now + timedelta(days=1, hours=2), 45,
    )
    insert_meeting(
        "Client Demo — Algorithm Angels", "Demo of the distributed systems module",
        "scheduled", "upcoming", now + timedelta(days=2, hours=5), 30,
    )
    completed_id = insert_meeting(
        "Design Review", "Reviewed the new dashboard UI",
        "instant", "completed", now - timedelta(days=1), 25,
    )
    insert_meeting(
        "1:1 Standup", None,
        "instant", "completed", now - timedelta(days=3), 15,
    )

    conn.execute(
        "INSERT INTO participants (meeting_id, name, joined_at) VALUES (?, ?, ?)",
        (completed_id, "Riya", now.isoformat()),
    )
    conn.execute(
        "INSERT INTO participants (meeting_id, name, joined_at) VALUES (?, ?, ?)",
        (completed_id, "Aman", now.isoformat()),
    )

    conn.commit()
    print("Seeded database with sample meetings.")
else:
    print("Database already has data — skipping seed.")

conn.close()
