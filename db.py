import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "database.db")

def get_db():
    return sqlite3.connect(DB_NAME)

def init_db():
    db = get_db()
    cursor = db.cursor()

    # ===== users (قديم – بدون لمس) =====
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT,
        language TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ===== user_settings (جديد) =====
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        vibration INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'dark',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    db.commit()
    db.close()

# =============================
# Settings Helpers
# =============================
def get_user_settings(user_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "SELECT vibration, theme FROM user_settings WHERE user_id = ?",
        (user_id,)
    )
    row = cursor.fetchone()

    if not row:
        cursor.execute(
            "INSERT INTO user_settings (user_id) VALUES (?)",
            (user_id,)
        )
        db.commit()
        vibration, theme = 1, "dark"
    else:
        vibration, theme = row

    db.close()
    return {
        "vibration": bool(vibration),
        "theme": theme
    }

def update_user_settings(user_id: int, vibration: bool, theme: str):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    INSERT INTO user_settings (user_id, vibration, theme)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
        vibration = excluded.vibration,
        theme = excluded.theme,
        updated_at = CURRENT_TIMESTAMP
    """, (user_id, int(vibration), theme))

    db.commit()
    db.close()
