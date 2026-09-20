"""
Database setup for the Zoom Clone backend.

Uses Python's built-in sqlite3 module directly (no ORM). This is a
deliberate choice: it needs zero compiled dependencies, so it installs
cleanly on any machine (including Windows without a C++ compiler),
which matters for a 1-day assignment deadline.
"""
import sqlite3
from contextlib import contextmanager

DB_PATH = "zoom_clone.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row          # rows behave like dicts
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def get_db():
    """FastAPI dependency-friendly context manager for a DB connection."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    """Creates tables if they don't already exist."""
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS meetings (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL DEFAULT 'Instant Meeting',
            description TEXT,
            host_name TEXT NOT NULL DEFAULT 'Saloni',
            type TEXT NOT NULL DEFAULT 'instant',
            status TEXT NOT NULL DEFAULT 'upcoming',
            scheduled_at TEXT,
            duration_minutes INTEGER NOT NULL DEFAULT 30,
            invite_link TEXT,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id TEXT NOT NULL,
            name TEXT NOT NULL,
            joined_at TEXT NOT NULL,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id) ON DELETE CASCADE
        )
        """
    )
    # Users table for authentication

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()

    _migrate_participants_cascade()


def _migrate_participants_cascade():
    """
    `CREATE TABLE IF NOT EXISTS` above only applies the ON DELETE CASCADE
    clause to a brand-new database — an existing zoom_clone.db created
    before this clause was added keeps its old (cascade-less) schema.
    SQLite can't ALTER a foreign key constraint in place, so if the
    existing participants table doesn't have ON DELETE CASCADE yet, we
    rebuild it (preserving all rows) the standard SQLite way: create the
    new table, copy the data, drop the old one, rename.
    """
    conn = sqlite3.connect(DB_PATH)
    try:
        row = conn.execute(
            "SELECT sql FROM sqlite_master WHERE type='table' AND name='participants'"
        ).fetchone()
        if row is None or "ON DELETE CASCADE" in (row[0] or ""):
            return  # no table yet, or already migrated

        conn.execute("PRAGMA foreign_keys = OFF")
        conn.executescript(
            """
            BEGIN TRANSACTION;

            CREATE TABLE participants_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                meeting_id TEXT NOT NULL,
                name TEXT NOT NULL,
                joined_at TEXT NOT NULL,
                FOREIGN KEY (meeting_id) REFERENCES meetings (id) ON DELETE CASCADE
            );

            INSERT INTO participants_new (id, meeting_id, name, joined_at)
                SELECT id, meeting_id, name, joined_at FROM participants;

            DROP TABLE participants;

            ALTER TABLE participants_new RENAME TO participants;

            COMMIT;
            """
        )
    finally:
        conn.close()
