import psycopg2
import os
from datetime import date

DATABASE_URL = os.environ.get("DATABASE_URL")

conn = None
cur = None

def init_db():
    global conn, cur
    if not DATABASE_URL:
        print("DATABASE_URL not found")
        return

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id BIGINT PRIMARY KEY,
        username TEXT,
        points BIGINT DEFAULT 0,
        last_daily DATE,
        daily_streak INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()

def add_user(user_id, username):
    cur.execute("""
        INSERT INTO users (user_id, username)
        VALUES (%s, %s)
        ON CONFLICT (user_id) DO NOTHING
    """, (user_id, username))
    conn.commit()

def get_user(user_id):
    cur.execute("SELECT points, last_daily, daily_streak FROM users WHERE user_id=%s", (user_id,))
    return cur.fetchone()

def update_daily(user_id, points, streak):
    today = date.today()
    cur.execute("""
        UPDATE users
        SET points = points + %s,
            last_daily = %s,
            daily_streak = %s
        WHERE user_id = %s
    """, (points, today, streak, user_id))
    conn.commit()
