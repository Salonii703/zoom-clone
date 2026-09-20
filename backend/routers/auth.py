"""
Auth routes — signup/login. Split out of main.py so auth logic and
meeting logic aren't mixed in one file.
"""
import hashlib
from datetime import datetime

from fastapi import APIRouter, HTTPException

from database import get_db
import schemas

router = APIRouter(prefix="/api/auth", tags=["auth"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# ---------- Signup ----------
@router.post("/signup", response_model=schemas.UserResponse)
def signup(payload: schemas.SignupRequest):
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")

    if not payload.email.strip():
        raise HTTPException(status_code=400, detail="Email is required")

    if not payload.password:
        raise HTTPException(status_code=400, detail="Password is required")

    if len(payload.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    email = payload.email.strip().lower()
    password_hash = hash_password(payload.password)
    now = datetime.utcnow().isoformat()

    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="An account with this email already exists"
            )

        cursor = conn.execute(
            """
            INSERT INTO users
            (name, email, password, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (
                payload.name.strip(),
                email,
                password_hash,
                now,
            ),
        )

        user_id = cursor.lastrowid

        return {
            "id": user_id,
            "name": payload.name.strip(),
            "email": email,
            "created_at": now,
        }


# ---------- Login ----------
@router.post("/login", response_model=schemas.UserResponse)
def login(payload: schemas.LoginRequest):
    email = payload.email.strip().lower()

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    if not payload.password:
        raise HTTPException(status_code=400, detail="Password is required")

    password_hash = hash_password(payload.password)

    with get_db() as conn:
        user = conn.execute(
            """
            SELECT id, name, email, created_at
            FROM users
            WHERE email = ? AND password = ?
            """,
            (email, password_hash),
        ).fetchone()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"],
        }
