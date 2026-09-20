"""
Plain data helpers — meeting ID generation and row-to-dict conversion.
(No ORM classes; database.py + main.py use raw SQL against sqlite3.)
"""
import uuid


def generate_meeting_id() -> str:
    """Generates a Zoom-style meeting ID like 123-456-789."""
    n = uuid.uuid4().int
    digits = str(n)[:9].rjust(9, "5")
    return f"{digits[0:3]}-{digits[3:6]}-{digits[6:9]}"


def meeting_row_to_dict(row, participants=None):
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"],
        "host_name": row["host_name"],
        "type": row["type"],
        "status": row["status"],
        "scheduled_at": row["scheduled_at"],
        "duration_minutes": row["duration_minutes"],
        "invite_link": row["invite_link"],
        "created_at": row["created_at"],
        "participants": participants or [],
    }


def participant_row_to_dict(row):
    return {"id": row["id"], "name": row["name"], "joined_at": row["joined_at"]}
