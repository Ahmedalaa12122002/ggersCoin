import psycopg2
import os

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
